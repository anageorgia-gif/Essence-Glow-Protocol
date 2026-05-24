import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { z } from "zod";
import { TOTAL_FORMULAS } from "@/lib/pricing";

// Public reservation endpoint. Eligibility (is_free) is DERIVED server-side
// from the validated items_count — the client cannot claim a free ecobag.
const Schema = z.object({
  items_count: z.number().int().min(1).max(20),
});

const TOTAL_UNITS = 60;
const RATE_LIMIT_WINDOW_SECONDS = 60;
const RATE_LIMIT_MAX = 10;
const ROUTE_KEY = "ecobag-reserve";

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

export const Route = createFileRoute("/api/public/ecobag-reserve")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const ip = getClientIp(request);
        const allowed = await checkRateLimit(ip);
        if (!allowed) {
          return jsonResponse({ error: "Too many requests" }, 429);
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

        const itemsCount = parsed.data.items_count;
        // Derive is_free server-side — DO NOT trust client.
        const isFree = itemsCount >= TOTAL_FORMULAS;

        const { count: currentCount } = await supabaseAdmin
          .from("ecobag_reservations")
          .select("*", { count: "exact", head: true });

        const reserved = currentCount ?? 0;
        if (reserved >= TOTAL_UNITS) {
          return jsonResponse({ reserved, total: TOTAL_UNITS, soldOut: true });
        }

        const { error } = await supabaseAdmin.from("ecobag_reservations").insert({
          items_count: itemsCount,
          is_free: isFree,
        });

        if (error) {
          return jsonResponse({ error: "Insert failed" }, 500);
        }

        return jsonResponse({ reserved: reserved + 1, total: TOTAL_UNITS });
      },
    },
  },
});
