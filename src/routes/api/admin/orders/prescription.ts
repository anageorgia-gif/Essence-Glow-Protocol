import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { jsonResponse, verifyAdminRequest } from "@/lib/verify-admin-request";

const PRESCRIPTION_BUCKET = "protocols";

const Schema = z.object({
  order_id: z.string().uuid(),
  pdf_base64: z.string().min(1).max(12_000_000),
  pdf_filename: z.string().min(1).max(200),
});

export const Route = createFileRoute("/api/admin/orders/prescription")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const auth = await verifyAdminRequest(request);
        if (!auth.ok) return auth.response;

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

        const { data: order, error: orderError } = await supabaseAdmin
          .from("orders" as never)
          .select("id, prescription_pdf_path")
          .eq("id", data.order_id)
          .maybeSingle();

        if (orderError) {
          console.error("Failed to load order", orderError);
          return jsonResponse({ error: "Failed to load order" }, 500);
        }

        if (!order) {
          return jsonResponse({ error: "Order not found" }, 404);
        }

        const existingPath = (order as { prescription_pdf_path?: string | null })
          .prescription_pdf_path;
        if (existingPath) {
          return jsonResponse({
            ok: true,
            prescription_pdf_path: existingPath,
            prescription_pdf_filename: data.pdf_filename,
            already_exists: true,
          });
        }

        let pdfBytes: Uint8Array;
        try {
          const cleanBase64 = data.pdf_base64.includes(",")
            ? data.pdf_base64.split(",").pop()!
            : data.pdf_base64;
          const bin = atob(cleanBase64);
          pdfBytes = new Uint8Array(bin.length);
          for (let i = 0; i < bin.length; i++) pdfBytes[i] = bin.charCodeAt(i);
        } catch {
          return jsonResponse({ error: "Invalid PDF payload" }, 400);
        }

        const safeFilename = data.pdf_filename
          .replace(/[^a-zA-Z0-9._-]/g, "_")
          .slice(0, 120);
        const storagePath = `prescriptions/${data.order_id}/${Date.now()}-${safeFilename}`;

        const { error: uploadError } = await supabaseAdmin.storage
          .from(PRESCRIPTION_BUCKET)
          .upload(storagePath, pdfBytes, {
            contentType: "application/pdf",
            upsert: false,
          });

        if (uploadError) {
          console.error("Prescription PDF upload failed", uploadError);
          return jsonResponse({ error: "Failed to upload PDF" }, 500);
        }

        const { error: updateError } = await supabaseAdmin
          .from("orders" as never)
          .update({
            prescription_pdf_path: storagePath,
            prescription_pdf_filename: safeFilename,
          } as never)
          .eq("id", data.order_id);

        if (updateError) {
          console.error("Failed to update order with prescription PDF", updateError);
          return jsonResponse({ error: "Failed to save prescription metadata" }, 500);
        }

        return jsonResponse({
          ok: true,
          prescription_pdf_path: storagePath,
          prescription_pdf_filename: safeFilename,
        });
      },
    },
  },
});
