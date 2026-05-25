import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function login() {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    alert(error.message);
    return;
  }

  window.location.href = "/admin";
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-5">
      <div className="w-full max-w-md rounded-3xl border bg-card p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-gold">
          Área administrativa
        </p>

        <h1 className="mt-3 text-4xl font-display text-navy">Login</h1>

        <div className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-xl px-4 py-3"
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") login();
            }}
            className="w-full border rounded-xl px-4 py-3"
          />

          <button
  type="button"
  onClick={login}
  className="w-full rounded-xl bg-navy text-white py-3"
>
  Entrar
</button>
        </div>
      </div>
    </div>
  );
}
