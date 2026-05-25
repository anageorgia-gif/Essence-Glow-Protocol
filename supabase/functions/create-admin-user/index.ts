import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type RequestBody = {
  email?: string;
  password?: string;
  role?: "vendedor" | "admin_master";
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método não permitido." }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: "Variáveis da função não configuradas." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const authHeader = req.headers.get("Authorization") ?? "";

  const userClient = createClient(supabaseUrl, anonKey, {
    global: {
      headers: {
        Authorization: authHeader,
      },
    },
  });

  const serviceClient = createClient(supabaseUrl, serviceRoleKey);

  const {
    data: { user },
    error: userError,
  } = await userClient.auth.getUser();

  if (userError || !user) {
    return new Response(JSON.stringify({ error: "Usuário não autenticado." }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { data: requesterProfile, error: requesterError } = await serviceClient
    .from("profiles")
    .select("role, can_users")
    .eq("id", user.id)
    .maybeSingle();

  if (requesterError) {
    return new Response(JSON.stringify({ error: requesterError.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const isAllowed = requesterProfile?.role === "admin_master" || requesterProfile?.can_users === true;

  if (!isAllowed) {
    return new Response(JSON.stringify({ error: "Sem permissão para criar usuários." }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const body = (await req.json()) as RequestBody;
  const email = body.email?.trim().toLowerCase();
  const password = body.password?.trim();
  const role = body.role === "admin_master" ? "admin_master" : "vendedor";

  if (!email || !password) {
    return new Response(JSON.stringify({ error: "E-mail e senha são obrigatórios." }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (password.length < 6) {
    return new Response(JSON.stringify({ error: "A senha precisa ter pelo menos 6 caracteres." }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { data: createdUser, error: createError } = await serviceClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError || !createdUser.user) {
    return new Response(JSON.stringify({ error: createError?.message ?? "Erro ao criar usuário." }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const isMaster = role === "admin_master";

  const { error: profileError } = await serviceClient.from("profiles").upsert({
    id: createdUser.user.id,
    email,
    role,
    can_products: true,
    can_orders: true,
    can_reports: isMaster,
    can_faqs: isMaster,
    can_users: isMaster,
  });

  if (profileError) {
    return new Response(JSON.stringify({ error: profileError.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({
      ok: true,
      user_id: createdUser.user.id,
      email,
      role,
    }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
});
