import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { z } from "zod";

const OrderItemSchema = z.object({
  product_id: z.string().min(1).max(64),
  product_name: z.string().min(1).max(200),
  quantity: z.number().int().min(1).max(99).default(1),
  price: z.number().nonnegative(),
  unit_price: z.number().nonnegative(),
  total_price: z.number().nonnegative(),
});

const Schema = z.object({
  idempotency_key: z.string().uuid(),
  customer_name: z.string().trim().min(2).max(200),
  customer_cpf: z.string().trim().min(6).max(32),
  customer_phone: z.string().trim().min(6).max(32),
  customer_email: z.string().trim().email().max(254).optional().nullable(),
  payment_method: z.string().trim().min(1).max(64),
  region: z.string().trim().min(1).max(64),
  subtotal: z.number().nonnegative(),
  discount: z.number().nonnegative(),
  total: z.number().nonnegative(),
  items: z.array(OrderItemSchema).min(1).max(20),
});

const RATE_LIMIT_WINDOW_SECONDS = 60;
const RATE_LIMIT_MAX = 10;
const ROUTE_KEY = "create-order";

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

export const Route = createFileRoute("/api/public/create-order")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const ip = getClientIp(request);

        const allowed = await checkRateLimit(ip);
        if (!allowed) {
          return jsonResponse(
            { error: "Muitas tentativas. Aguarde alguns instantes e tente novamente." },
            429,
          );
        }

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

        const { data: orderId, error } = await supabaseAdmin.rpc("create_order_idempotent", {
          p_idempotency_key: data.idempotency_key,
          p_customer_name: data.customer_name,
          p_customer_cpf: data.customer_cpf,
          p_customer_phone: data.customer_phone,
          p_customer_email: data.customer_email ?? "",
          p_payment_method: data.payment_method,
          p_region: data.region,
          p_subtotal: data.subtotal,
          p_discount: data.discount,
          p_total: data.total,
          p_items: data.items,
        });

        if (error) {
          console.error("create_order_idempotent failed", error);
          return jsonResponse({ error: "Failed to save order" }, 500);
        }

        return jsonResponse({ ok: true, order_id: orderId });
      },
    },
  },
});
