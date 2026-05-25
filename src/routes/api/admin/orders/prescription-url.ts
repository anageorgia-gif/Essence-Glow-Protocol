import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { jsonResponse, verifyAdminRequest } from "@/lib/verify-admin-request";

const PRESCRIPTION_BUCKET = "protocols";
const SIGNED_URL_TTL_SECONDS = 3600;

export const Route = createFileRoute("/api/admin/orders/prescription-url")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const auth = await verifyAdminRequest(request);
        if (!auth.ok) return auth.response;

        const url = new URL(request.url);
        const orderId = url.searchParams.get("order_id")?.trim();

        if (!orderId) {
          return jsonResponse({ error: "order_id is required" }, 400);
        }

        const { data: order, error: orderError } = await supabaseAdmin
          .from("orders" as never)
          .select("id, prescription_pdf_path, prescription_pdf_filename")
          .eq("id", orderId)
          .maybeSingle();

        if (orderError) {
          console.error("Failed to load order", orderError);
          return jsonResponse({ error: "Failed to load order" }, 500);
        }

        const row = order as {
          id?: string;
          prescription_pdf_path?: string | null;
          prescription_pdf_filename?: string | null;
        } | null;

        if (!row?.prescription_pdf_path) {
          return jsonResponse({ error: "Prescription PDF not found" }, 404);
        }

        const { data: signed, error: signedError } = await supabaseAdmin.storage
          .from(PRESCRIPTION_BUCKET)
          .createSignedUrl(row.prescription_pdf_path, SIGNED_URL_TTL_SECONDS);

        if (signedError || !signed?.signedUrl) {
          console.error("Failed to create signed URL", signedError);
          return jsonResponse({ error: "Failed to create download URL" }, 500);
        }

        return jsonResponse({
          ok: true,
          url: signed.signedUrl,
          filename: row.prescription_pdf_filename ?? "prescricao.pdf",
        });
      },
    },
  },
});
