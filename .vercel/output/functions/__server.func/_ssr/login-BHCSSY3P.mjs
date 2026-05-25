import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-DZhUyplX.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
function LoginPage() {
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  async function login() {
    if (loading) return;
    if (!email.trim() || !password) {
      alert("Digite e-mail e senha.");
      return;
    }
    setLoading(true);
    const {
      data,
      error
    } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });
    setLoading(false);
    console.log("LOGIN DATA:", data);
    console.log("LOGIN ERROR:", error);
    if (error) {
      alert(error.message);
      return;
    }
    window.location.assign("/admin");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-background px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md rounded-3xl border bg-card p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm uppercase tracking-[0.3em] text-gold", children: "Área administrativa" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 text-4xl font-display text-navy", children: "Login" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", placeholder: "E-mail", value: email, disabled: loading, onChange: (e) => setEmail(e.target.value), className: "w-full border rounded-xl px-4 py-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", placeholder: "Senha", value: password, disabled: loading, onChange: (e) => setPassword(e.target.value), onKeyDown: (e) => {
        if (e.key === "Enter") login();
      }, className: "w-full border rounded-xl px-4 py-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: login, disabled: loading, className: "w-full rounded-xl bg-navy text-white py-3 disabled:opacity-50", children: loading ? "Entrando..." : "Entrar" })
    ] })
  ] }) });
}
export {
  LoginPage as component
};
