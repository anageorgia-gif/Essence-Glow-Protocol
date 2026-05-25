import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type AdminAccess = {
  userId: string;
  canOrders: boolean;
  isMaster: boolean;
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function verifyAdminRequest(
  request: Request,
  requireOrdersPermission = true,
): Promise<{ ok: true; access: AdminAccess } | { ok: false; response: Response }> {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    return {
      ok: false,
      response: jsonResponse({ error: "Supabase not configured" }, 500),
    };
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { ok: false, response: jsonResponse({ error: "Unauthorized" }, 401) };
  }

  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) {
    return { ok: false, response: jsonResponse({ error: "Unauthorized" }, 401) };
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    global: {
      headers: { Authorization: `Bearer ${token}` },
    },
    auth: {
      storage: undefined,
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  const userId = userData.user?.id;
  if (userError || !userId) {
    return { ok: false, response: jsonResponse({ error: "Unauthorized" }, 401) };
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles" as never)
    .select("role, can_orders")
    .eq("id", userId)
    .maybeSingle();

  if (profileError) {
    console.error("Failed to load admin profile", profileError);
    return { ok: false, response: jsonResponse({ error: "Forbidden" }, 403) };
  }

  const role = (profile as { role?: string | null } | null)?.role ?? null;
  const canOrders = (profile as { can_orders?: boolean | null } | null)?.can_orders === true;
  const isMaster = role === "admin_master";

  if (requireOrdersPermission && !isMaster && !canOrders) {
    return { ok: false, response: jsonResponse({ error: "Forbidden" }, 403) };
  }

  return {
    ok: true,
    access: { userId, canOrders, isMaster },
  };
}

export { jsonResponse };
