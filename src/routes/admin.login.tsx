import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { login } from "@/lib/server-functions";

export const Route = createFileRoute("/admin/login")({
  component: LoginPage,
});

function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login({ data: { password } });
      router.navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--surface)] px-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm card p-8 bg-white"
        aria-labelledby="login-title"
      >
        <h1 id="login-title" className="text-[24px] text-center">
          Admin
        </h1>
        <p className="mt-2 text-center text-[14px] text-[var(--text-secondary)]">
          Enter the admin password to continue.
        </p>
        <label htmlFor="password" className="block mt-6 text-[13px] font-medium text-[var(--brand)]">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoFocus
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full border border-[var(--border)] rounded-md px-3 py-3 text-[15px] focus:outline-none focus:border-[var(--accent)]"
        />
        {error && (
          <div className="mt-3 text-[13px] text-[#b91c1c]" role="alert">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={submitting || !password}
          className="btn-primary w-full mt-6 disabled:opacity-50"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
