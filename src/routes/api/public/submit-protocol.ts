import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { z } from "zod";
import { computeCheckout, FORMULA_PRICES } from "@/lib/pricing";

// ============================================================================
// /api/public/submit-protocol
// Full server-side checkout: validates cart, recomputes total + ecobag,
// uploads PDF to storage, persists in `pedidos`, sends PDF via Evolution API
// to the central WhatsApp number. The frontend cannot override pricing,
// eligibility, or recipient.
// ============================================================================

const FormulaPayloadSchema = z.object({
  id: z.string().min(1).max(64),
  composition: z.array(z.string().min(1).max(500)).max(50),
  posology: z.string().min(1).max(2000),
});

const Schema = z.object({
  order_id: z.string().uuid().optional(),
  patient_name: z.string().trim().min(2).max(200),
  patient_cpf: z.string().trim().min(6).max(32),
  patient_phone: z.string().trim().min(6).max(32),
  patient_email: z.string().trim().email().max(254).optional().nullable(),
  // Cart: only ids + metadata for PDF. Prices/eligibility are computed server-side.
  formulas: z.array(FormulaPayloadSchema).min(1).max(20),
  wants_ecobag: z.boolean().optional().default(false),
  payment_method: z.string().max(64).optional().nullable(),
  pdf_base64: z.string().min(1).max(12_000_000),
  pdf_filename: z.string().min(1).max(200),
});

const RATE_LIMIT_WINDOW_SECONDS = 60;
const RATE_LIMIT_MAX = 5;
const ROUTE_KEY = "submit-protocol";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function getClientIp(request: Request): string {
  const h = request.headers;
  return (
    h.get("cf-connecting-ip") ||
    h.get("x-real-ip") ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

async function checkRateLimit(ip: string): Promise<boolean> {
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_SECONDS * 1000).toISOString();
  const { count } = await supabaseAdmin
    .from("rate_limits")
    .select("*", { count: "exact", head: true })
    .eq("ip", ip)
    .eq("route", ROUTE_KEY)
    .gte("created_at", since);
  if ((count ?? 0) >= RATE_LIMIT_MAX) return false;
  await supabaseAdmin.from("rate_limits").insert({ ip, route: ROUTE_KEY });
  return true;
}

async function sendViaEvolution(opts: {
  pdfBase64: string;
  filename: string;
  caption: string;
}): Promise<{ ok: boolean; error?: string }> {
  const baseUrl = process.env.EVOLUTION_API_URL;
  const apiKey = process.env.EVOLUTION_API_KEY;
  const instance = process.env.EVOLUTION_INSTANCE;
  const number = process.env.CENTRAL_WHATSAPP_NUMBER;

  if (!baseUrl || !apiKey || !instance || !number) {
    return { ok: false, error: "Evolution API not configured" };
  }

  const url = `${baseUrl.replace(/\/+$/, "")}/message/sendMedia/${encodeURIComponent(instance)}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
      },
      body: JSON.stringify({
        number,
        mediatype: "document",
        mimetype: "application/pdf",
        media: opts.pdfBase64,
        fileName: opts.filename,
        caption: opts.caption,
      }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { ok: false, error: `Evolution ${res.status}: ${text.slice(0, 300)}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Evolution fetch failed" };
  }
}

export const Route = createFileRoute("/api/public/submit-protocol")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const ip = getClientIp(request);

        // --- Rate limit (ad-hoc, per IP) ---
        const allowed = await checkRateLimit(ip);
        if (!allowed) {
          return jsonResponse(
            { error: "Muitas tentativas. Aguarde alguns instantes e tente novamente." },
            429,
          );
        }

        // --- Parse + validate input ---
        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return jsonResponse({ error: "Invalid JSON" }, 400);
        }

        const parsed = Schema.safeParse(payload);
        if (!parsed.success) {
          return jsonResponse({ error: "Invalid input" }, 400);
        }
        const data = parsed.data;

        // --- Recompute totals + ecobag eligibility from server-known prices ---
        const computed = computeCheckout({
          formulaIds: data.formulas.map((f) => f.id),
          wantsEcobag: data.wants_ecobag,
        });

        if (computed.validIds.length === 0) {
          return jsonResponse({ error: "Nenhuma fórmula válida no pedido." }, 400);
        }

        // Merge composition/posology from payload (kept for PDF + record),
        // but only for ids the server recognises.
        const formulasRecord = computed.validIds.map((id) => {
          const fromClient = data.formulas.find((f) => f.id === id);
          return {
            id,
            name: FORMULA_PRICES[id].name,
            price: FORMULA_PRICES[id].price,
            composition: fromClient?.composition ?? [],
            posology: fromClient?.posology ?? "",
          };
        });

        if (data.order_id) {
          const { data: existingPedido } = await supabaseAdmin
            .from("pedidos")
            .select("id, whatsapp_sent")
            .eq("order_id", data.order_id)
            .maybeSingle();

          if (existingPedido) {
            return jsonResponse({
              ok: true,
              order_id: existingPedido.id,
              subtotal: computed.subtotal,
              total: computed.total,
              ecobag: computed.ecobag,
              whatsapp_sent: existingPedido.whatsapp_sent,
              duplicate: true,
            });
          }
        }

        // --- Decode PDF ---
        let pdfBytes: Uint8Array;
        let cleanBase64: string;
        try {
          cleanBase64 = data.pdf_base64.includes(",")
            ? data.pdf_base64.split(",").pop()!
            : data.pdf_base64;
          const bin = atob(cleanBase64);
          pdfBytes = new Uint8Array(bin.length);
          for (let i = 0; i < bin.length; i++) pdfBytes[i] = bin.charCodeAt(i);
        } catch {
          return jsonResponse({ error: "Invalid PDF payload" }, 400);
        }

        // --- Upload PDF to private storage bucket ---
        const safeFilename = data.pdf_filename
          .replace(/[^a-zA-Z0-9._-]/g, "_")
          .slice(0, 120);
        const storagePath = `${Date.now()}-${crypto.randomUUID()}-${safeFilename}`;

        const { error: uploadError } = await supabaseAdmin.storage
          .from("protocols")
          .upload(storagePath, pdfBytes, {
            contentType: "application/pdf",
            upsert: false,
          });

        const pdfPath = uploadError ? null : storagePath;
        if (uploadError) console.error("PDF upload failed", uploadError);

        // --- Send PDF via WhatsApp (Evolution API) to central number ---
        const caption =
          `Novo pedido - Protocolo Seca Tudo\n` +
          `Paciente: ${data.patient_name}\n` +
          `CPF: ${data.patient_cpf}\n` +
          `WhatsApp: ${data.patient_phone}\n` +
          `Itens: ${computed.itemsCount}\n` +
          `Subtotal: R$ ${computed.subtotal.toFixed(2)}\n` +
          (computed.ecobag.included
            ? `Ecobag: ${computed.ecobag.free ? "GRATIS (protocolo completo)" : `R$ ${computed.ecobag.price.toFixed(2)} (50% OFF)`}\n`
            : "") +
          `Total: R$ ${computed.total.toFixed(2)}`;

        const whatsapp = await sendViaEvolution({
          pdfBase64: cleanBase64,
          filename: safeFilename,
          caption,
        });

        // --- Persist order in `pedidos` ---
        const { data: inserted, error: insertError } = await supabaseAdmin
          .from("pedidos")
          .insert({
            order_id: data.order_id ?? null,
            patient_name: data.patient_name,
            patient_cpf: data.patient_cpf,
            patient_phone: data.patient_phone,
            patient_email: data.patient_email ?? null,
            formulas: formulasRecord,
            formula_ids: computed.validIds,
            subtotal: computed.subtotal,
            ecobag_included: computed.ecobag.included,
            ecobag_free: computed.ecobag.free,
            ecobag_price: computed.ecobag.price,
            total: computed.total,
            pdf_path: pdfPath,
            whatsapp_sent: whatsapp.ok,
            whatsapp_error: whatsapp.ok ? null : whatsapp.error ?? null,
            client_ip: ip,
          })
          .select("id")
          .single();

        if (insertError) {
          console.error("Failed to insert pedido", insertError);
          return jsonResponse({ error: "Failed to save order" }, 500);
        }

        // --- Mirror ecobag reservation server-side (no client input) ---
        if (computed.ecobag.included) {
          await supabaseAdmin
            .from("ecobag_reservations")
            .insert({
              items_count: computed.itemsCount,
              total_amount: computed.total,
              is_free: computed.ecobag.free,
            })
            .then(({ error }) => {
              if (error) console.error("ecobag reservation failed", error);
            });
        }

        return jsonResponse({
          ok: true,
          order_id: inserted.id,
          subtotal: computed.subtotal,
          total: computed.total,
          ecobag: computed.ecobag,
          whatsapp_sent: whatsapp.ok,
        });
      },
    },
  },
});
