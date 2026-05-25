import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { b as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, c as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
import { o as objectType, s as stringType, b as booleanType, a as arrayType, n as numberType } from "../_libs/zod.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const appCss = "/assets/styles-DUrJc0uZ.css";
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$7 = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { title: "Protocolo Seca Tudo | Farmácia Evidence" },
      {
        name: "description",
        content: "Monte seu Protocolo Seca Tudo com fórmulas manipuladas da Farmácia Evidence em parceria com Larah Nóbrega."
      },
      { name: "author", content: "Farmácia Evidence" },
      { property: "og:title", content: "Protocolo Seca Tudo | Farmácia Evidence" },
      {
        property: "og:description",
        content: "Monte seu Protocolo Seca Tudo com fórmulas manipuladas da Farmácia Evidence em parceria com Larah Nóbrega."
      },
      { name: "twitter:site", content: "@farmaciaevidence" },
      { name: "twitter:title", content: "Protocolo Seca Tudo | Farmácia Evidence" },
      {
        name: "twitter:description",
        content: "Monte seu Protocolo Seca Tudo com fórmulas manipuladas da Farmácia Evidence em parceria com Larah Nóbrega."
      },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f54c0ff4-a8cb-4b39-b37a-312c76ed18d8/id-preview-8cb4e032--2ce51b5a-89e8-4d9c-99e3-1742dbc1afe6.lovable.app-1778893105732.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f54c0ff4-a8cb-4b39-b37a-312c76ed18d8/id-preview-8cb4e032--2ce51b5a-89e8-4d9c-99e3-1742dbc1afe6.lovable.app-1778893105732.png" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$7.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) });
}
const $$splitComponentImporter$2 = () => import("./login-BHCSSY3P.mjs");
const Route$6 = createFileRoute("/login")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./admin-uBaI8bZr.mjs");
const Route$5 = createFileRoute("/admin")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./index-cvslJOy3.mjs");
const Route$4 = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Seca Tudo — Edição Pré-Copa & Pré-Férias | Larah Nóbrega x Evidence"
    }, {
      name: "description",
      content: "Protocolo manipulado estratégico para mais leveza, disposição e bem-estar. Por Larah Nóbrega em parceria com a Farmácia Evidence."
    }, {
      name: "viewport",
      content: "width=device-width, initial-scale=1, viewport-fit=cover"
    }],
    links: [{
      rel: "preconnect",
      href: "https://fonts.googleapis.com"
    }, {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous"
    }, {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Poppins:wght@300;400;500;600;700&family=Allura&display=swap"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
function createSupabaseAdminClient() {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    const missing = [
      ...!SUPABASE_URL ? ["SUPABASE_URL"] : [],
      ...!SUPABASE_SERVICE_ROLE_KEY ? ["SUPABASE_SERVICE_ROLE_KEY"] : []
    ];
    const message = `Missing Supabase environment variable(s): ${missing.join(", ")}. Connect Supabase in Lovable Cloud.`;
    console.error(`[Supabase] ${message}`);
    throw new Error(message);
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      storage: void 0,
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
let _supabaseAdmin;
const supabaseAdmin = new Proxy({}, {
  get(_, prop, receiver) {
    if (!_supabaseAdmin) _supabaseAdmin = createSupabaseAdminClient();
    return Reflect.get(_supabaseAdmin, prop, receiver);
  }
});
const FORMULA_PRICES = {
  "termogenico": { name: "Termogênico Seca Tudo", price: 121 },
  "boca-fechada": { name: "Boca Fechada", price: 143 },
  "basico": { name: "Básico Bem Feito", price: 188 },
  "sono": { name: "Sono da Beleza", price: 135 },
  "cabelo": { name: "Cabelo, Pele e Unha", price: 245 },
  "lipedema-manha": { name: "Lipedema Manhã", price: 135 },
  "lipedema-noite": { name: "Lipedema Noite", price: 304 }
};
const ECOBAG_PRICE = 70;
const TOTAL_FORMULAS = Object.keys(FORMULA_PRICES).length;
function computeCheckout(input) {
  const unique = Array.from(new Set(input.formulaIds));
  const validIds = unique.filter((id) => id in FORMULA_PRICES);
  const invalidIds = unique.filter((id) => !(id in FORMULA_PRICES));
  const lineItems = validIds.map((id) => ({
    id,
    name: FORMULA_PRICES[id].name,
    price: FORMULA_PRICES[id].price
  }));
  const subtotal = lineItems.reduce((s, li) => s + li.price, 0);
  const itemsCount = lineItems.length;
  const isComplete = itemsCount >= TOTAL_FORMULAS;
  const eligibleHalfOff = !isComplete && itemsCount >= 4;
  const free = isComplete;
  const included = free || eligibleHalfOff && input.wantsEcobag === true;
  const ecobagPrice = free ? 0 : included ? ECOBAG_PRICE * 0.5 : 0;
  return {
    validIds,
    invalidIds,
    itemsCount,
    isComplete,
    subtotal,
    ecobag: { eligibleHalfOff, free, included, price: ecobagPrice },
    total: subtotal + ecobagPrice,
    lineItems
  };
}
const FormulaPayloadSchema = objectType({
  id: stringType().min(1).max(64),
  composition: arrayType(stringType().min(1).max(500)).max(50),
  posology: stringType().min(1).max(2e3)
});
const Schema$2 = objectType({
  patient_name: stringType().trim().min(2).max(200),
  patient_cpf: stringType().trim().min(6).max(32),
  patient_phone: stringType().trim().min(6).max(32),
  patient_email: stringType().trim().email().max(254).optional().nullable(),
  // Cart: only ids + metadata for PDF. Prices/eligibility are computed server-side.
  formulas: arrayType(FormulaPayloadSchema).min(1).max(20),
  wants_ecobag: booleanType().optional().default(false),
  payment_method: stringType().max(64).optional().nullable(),
  pdf_base64: stringType().min(1).max(12e6),
  pdf_filename: stringType().min(1).max(200)
});
const RATE_LIMIT_WINDOW_SECONDS$1 = 60;
const RATE_LIMIT_MAX$1 = 5;
const ROUTE_KEY$1 = "submit-protocol";
function jsonResponse$2(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
function getClientIp$1(request) {
  const h = request.headers;
  return h.get("cf-connecting-ip") || h.get("x-real-ip") || h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}
async function checkRateLimit$1(ip) {
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_SECONDS$1 * 1e3).toISOString();
  const { count } = await supabaseAdmin.from("rate_limits").select("*", { count: "exact", head: true }).eq("ip", ip).eq("route", ROUTE_KEY$1).gte("created_at", since);
  if ((count ?? 0) >= RATE_LIMIT_MAX$1) return false;
  await supabaseAdmin.from("rate_limits").insert({ ip, route: ROUTE_KEY$1 });
  return true;
}
async function sendViaEvolution(opts) {
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
        apikey: apiKey
      },
      body: JSON.stringify({
        number,
        mediatype: "document",
        mimetype: "application/pdf",
        media: opts.pdfBase64,
        fileName: opts.filename,
        caption: opts.caption
      })
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
const Route$3 = createFileRoute("/api/public/submit-protocol")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const ip = getClientIp$1(request);
        const allowed = await checkRateLimit$1(ip);
        if (!allowed) {
          return jsonResponse$2(
            { error: "Muitas tentativas. Aguarde alguns instantes e tente novamente." },
            429
          );
        }
        let payload;
        try {
          payload = await request.json();
        } catch {
          return jsonResponse$2({ error: "Invalid JSON" }, 400);
        }
        const parsed = Schema$2.safeParse(payload);
        if (!parsed.success) {
          return jsonResponse$2({ error: "Invalid input" }, 400);
        }
        const data = parsed.data;
        const computed = computeCheckout({
          formulaIds: data.formulas.map((f) => f.id),
          wantsEcobag: data.wants_ecobag
        });
        if (computed.validIds.length === 0) {
          return jsonResponse$2({ error: "Nenhuma fórmula válida no pedido." }, 400);
        }
        const formulasRecord = computed.validIds.map((id) => {
          const fromClient = data.formulas.find((f) => f.id === id);
          return {
            id,
            name: FORMULA_PRICES[id].name,
            price: FORMULA_PRICES[id].price,
            composition: fromClient?.composition ?? [],
            posology: fromClient?.posology ?? ""
          };
        });
        let pdfBytes;
        let cleanBase64;
        try {
          cleanBase64 = data.pdf_base64.includes(",") ? data.pdf_base64.split(",").pop() : data.pdf_base64;
          const bin = atob(cleanBase64);
          pdfBytes = new Uint8Array(bin.length);
          for (let i = 0; i < bin.length; i++) pdfBytes[i] = bin.charCodeAt(i);
        } catch {
          return jsonResponse$2({ error: "Invalid PDF payload" }, 400);
        }
        const safeFilename = data.pdf_filename.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
        const storagePath = `${Date.now()}-${crypto.randomUUID()}-${safeFilename}`;
        const { error: uploadError } = await supabaseAdmin.storage.from("protocols").upload(storagePath, pdfBytes, {
          contentType: "application/pdf",
          upsert: false
        });
        const pdfPath = uploadError ? null : storagePath;
        if (uploadError) console.error("PDF upload failed", uploadError);
        const caption = `Novo pedido - Protocolo Seca Tudo
Paciente: ${data.patient_name}
CPF: ${data.patient_cpf}
WhatsApp: ${data.patient_phone}
Itens: ${computed.itemsCount}
Subtotal: R$ ${computed.subtotal.toFixed(2)}
` + (computed.ecobag.included ? `Ecobag: ${computed.ecobag.free ? "GRATIS (protocolo completo)" : `R$ ${computed.ecobag.price.toFixed(2)} (50% OFF)`}
` : "") + `Total: R$ ${computed.total.toFixed(2)}`;
        const whatsapp = await sendViaEvolution({
          pdfBase64: cleanBase64,
          filename: safeFilename,
          caption
        });
        const { data: inserted, error: insertError } = await supabaseAdmin.from("pedidos").insert({
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
          client_ip: ip
        }).select("id").single();
        if (insertError) {
          console.error("Failed to insert pedido", insertError);
          return jsonResponse$2({ error: "Failed to save order" }, 500);
        }
        if (computed.ecobag.included) {
          await supabaseAdmin.from("ecobag_reservations").insert({
            items_count: computed.itemsCount,
            total_amount: computed.total,
            is_free: computed.ecobag.free
          }).then(({ error }) => {
            if (error) console.error("ecobag reservation failed", error);
          });
        }
        return jsonResponse$2({
          ok: true,
          order_id: inserted.id,
          subtotal: computed.subtotal,
          total: computed.total,
          ecobag: computed.ecobag,
          whatsapp_sent: whatsapp.ok
        });
      }
    }
  }
});
const Schema$1 = objectType({
  items_count: numberType().int().min(1).max(20)
});
const TOTAL_UNITS = 60;
const RATE_LIMIT_WINDOW_SECONDS = 60;
const RATE_LIMIT_MAX = 10;
const ROUTE_KEY = "ecobag-reserve";
function jsonResponse$1(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
function getClientIp(request) {
  const h = request.headers;
  return h.get("cf-connecting-ip") || h.get("x-real-ip") || h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}
async function checkRateLimit(ip) {
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_SECONDS * 1e3).toISOString();
  const { count } = await supabaseAdmin.from("rate_limits").select("*", { count: "exact", head: true }).eq("ip", ip).eq("route", ROUTE_KEY).gte("created_at", since);
  if ((count ?? 0) >= RATE_LIMIT_MAX) return false;
  await supabaseAdmin.from("rate_limits").insert({ ip, route: ROUTE_KEY });
  return true;
}
const Route$2 = createFileRoute("/api/public/ecobag-reserve")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const ip = getClientIp(request);
        const allowed = await checkRateLimit(ip);
        if (!allowed) {
          return jsonResponse$1({ error: "Too many requests" }, 429);
        }
        let payload;
        try {
          payload = await request.json();
        } catch {
          return jsonResponse$1({ error: "Invalid JSON" }, 400);
        }
        const parsed = Schema$1.safeParse(payload);
        if (!parsed.success) {
          return jsonResponse$1({ error: "Invalid input" }, 400);
        }
        const itemsCount = parsed.data.items_count;
        const isFree = itemsCount >= TOTAL_FORMULAS;
        const { count: currentCount } = await supabaseAdmin.from("ecobag_reservations").select("*", { count: "exact", head: true });
        const reserved = currentCount ?? 0;
        if (reserved >= TOTAL_UNITS) {
          return jsonResponse$1({ reserved, total: TOTAL_UNITS, soldOut: true });
        }
        const { error } = await supabaseAdmin.from("ecobag_reservations").insert({
          items_count: itemsCount,
          is_free: isFree
        });
        if (error) {
          return jsonResponse$1({ error: "Insert failed" }, 500);
        }
        return jsonResponse$1({ reserved: reserved + 1, total: TOTAL_UNITS });
      }
    }
  }
});
function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
async function verifyAdminRequest(request, requireOrdersPermission = true) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    return {
      ok: false,
      response: jsonResponse({ error: "Supabase not configured" }, 500)
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
      headers: { Authorization: `Bearer ${token}` }
    },
    auth: {
      storage: void 0,
      persistSession: false,
      autoRefreshToken: false
    }
  });
  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  const userId = userData.user?.id;
  if (userError || !userId) {
    return { ok: false, response: jsonResponse({ error: "Unauthorized" }, 401) };
  }
  const { data: profile, error: profileError } = await supabaseAdmin.from("profiles").select("role, can_orders").eq("id", userId).maybeSingle();
  if (profileError) {
    console.error("Failed to load admin profile", profileError);
    return { ok: false, response: jsonResponse({ error: "Forbidden" }, 403) };
  }
  const role = profile?.role ?? null;
  const canOrders = profile?.can_orders === true;
  const isMaster = role === "admin_master";
  if (requireOrdersPermission && !isMaster && !canOrders) {
    return { ok: false, response: jsonResponse({ error: "Forbidden" }, 403) };
  }
  return {
    ok: true,
    access: { userId, canOrders, isMaster }
  };
}
const PRESCRIPTION_BUCKET$1 = "protocols";
const SIGNED_URL_TTL_SECONDS = 3600;
const Route$1 = createFileRoute("/api/admin/orders/prescription-url")({
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
        const { data: order, error: orderError } = await supabaseAdmin.from("orders").select("id, prescription_pdf_path, prescription_pdf_filename").eq("id", orderId).maybeSingle();
        if (orderError) {
          console.error("Failed to load order", orderError);
          return jsonResponse({ error: "Failed to load order" }, 500);
        }
        const row = order;
        if (!row?.prescription_pdf_path) {
          return jsonResponse({ error: "Prescription PDF not found" }, 404);
        }
        const { data: signed, error: signedError } = await supabaseAdmin.storage.from(PRESCRIPTION_BUCKET$1).createSignedUrl(row.prescription_pdf_path, SIGNED_URL_TTL_SECONDS);
        if (signedError || !signed?.signedUrl) {
          console.error("Failed to create signed URL", signedError);
          return jsonResponse({ error: "Failed to create download URL" }, 500);
        }
        return jsonResponse({
          ok: true,
          url: signed.signedUrl,
          filename: row.prescription_pdf_filename ?? "prescricao.pdf"
        });
      }
    }
  }
});
const PRESCRIPTION_BUCKET = "protocols";
const Schema = objectType({
  order_id: stringType().uuid(),
  pdf_base64: stringType().min(1).max(12e6),
  pdf_filename: stringType().min(1).max(200)
});
function missingColumnMessage(error) {
  const message = error?.message ?? "";
  if (error?.code === "42703" || message.includes("prescription_pdf_path") || message.includes("prescription_pdf_filename")) {
    return "As colunas de prescrição ainda não existem na tabela orders. Execute a migration do Supabase.";
  }
  return null;
}
const Route = createFileRoute("/api/admin/orders/prescription")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const auth = await verifyAdminRequest(request);
          if (!auth.ok) return auth.response;
          let payload;
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
          const { data: order, error: orderError } = await supabaseAdmin.from("orders").select("id, prescription_pdf_path").eq("id", data.order_id).maybeSingle();
          if (orderError) {
            console.error("Failed to load order", orderError);
            const columnHint = missingColumnMessage(orderError);
            return jsonResponse(
              { error: columnHint ?? "Failed to load order" },
              500
            );
          }
          if (!order) {
            return jsonResponse({ error: "Order not found" }, 404);
          }
          const existingPath = order.prescription_pdf_path;
          if (existingPath) {
            return jsonResponse({
              ok: true,
              prescription_pdf_path: existingPath,
              prescription_pdf_filename: data.pdf_filename,
              already_exists: true
            });
          }
          let pdfBytes;
          try {
            const cleanBase64 = data.pdf_base64.includes(",") ? data.pdf_base64.split(",").pop() : data.pdf_base64;
            const bin = atob(cleanBase64);
            pdfBytes = new Uint8Array(bin.length);
            for (let i = 0; i < bin.length; i++) pdfBytes[i] = bin.charCodeAt(i);
          } catch {
            return jsonResponse({ error: "Invalid PDF payload" }, 400);
          }
          const safeFilename = data.pdf_filename.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
          const storagePath = `prescriptions/${data.order_id}/${Date.now()}-${safeFilename}`;
          const { error: uploadError } = await supabaseAdmin.storage.from(PRESCRIPTION_BUCKET).upload(storagePath, pdfBytes, {
            contentType: "application/pdf",
            upsert: false
          });
          if (uploadError) {
            console.error("Prescription PDF upload failed", uploadError);
            return jsonResponse(
              {
                error: "Falha ao enviar o PDF para o Storage. Verifique o bucket 'protocols' e a chave service role."
              },
              500
            );
          }
          const { error: updateError } = await supabaseAdmin.from("orders").update({
            prescription_pdf_path: storagePath,
            prescription_pdf_filename: safeFilename
          }).eq("id", data.order_id);
          if (updateError) {
            console.error("Failed to update order with prescription PDF", updateError);
            const columnHint = missingColumnMessage(updateError);
            return jsonResponse(
              {
                error: columnHint ?? "Falha ao salvar os metadados da prescrição no pedido."
              },
              500
            );
          }
          return jsonResponse({
            ok: true,
            prescription_pdf_path: storagePath,
            prescription_pdf_filename: safeFilename
          });
        } catch (error) {
          console.error("Prescription upload route failed", error);
          const message = error instanceof Error ? error.message : "Internal server error";
          if (message.includes("SUPABASE_SERVICE_ROLE_KEY")) {
            return jsonResponse(
              {
                error: "SUPABASE_SERVICE_ROLE_KEY não configurada no servidor. Conecte o Supabase no ambiente de deploy."
              },
              500
            );
          }
          return jsonResponse({ error: message }, 500);
        }
      }
    }
  }
});
const LoginRoute = Route$6.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$7
});
const AdminRoute = Route$5.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$7
});
const IndexRoute = Route$4.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$7
});
const ApiPublicSubmitProtocolRoute = Route$3.update({
  id: "/api/public/submit-protocol",
  path: "/api/public/submit-protocol",
  getParentRoute: () => Route$7
});
const ApiPublicEcobagReserveRoute = Route$2.update({
  id: "/api/public/ecobag-reserve",
  path: "/api/public/ecobag-reserve",
  getParentRoute: () => Route$7
});
const ApiAdminOrdersPrescriptionUrlRoute = Route$1.update({
  id: "/api/admin/orders/prescription-url",
  path: "/api/admin/orders/prescription-url",
  getParentRoute: () => Route$7
});
const ApiAdminOrdersPrescriptionRoute = Route.update({
  id: "/api/admin/orders/prescription",
  path: "/api/admin/orders/prescription",
  getParentRoute: () => Route$7
});
const rootRouteChildren = {
  IndexRoute,
  AdminRoute,
  LoginRoute,
  ApiPublicEcobagReserveRoute,
  ApiPublicSubmitProtocolRoute,
  ApiAdminOrdersPrescriptionRoute,
  ApiAdminOrdersPrescriptionUrlRoute
};
const routeTree = Route$7._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router;
};
export {
  getRouter
};
