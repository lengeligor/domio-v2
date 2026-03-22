"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { registerSchema, type RegisterInput } from "@/lib/validators";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterInput>({
    full_name: "",
    email: "",
    password: "",
    role: "seeker",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    setErrors({});

    const result = registerSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.full_name,
          role: form.role,
        },
      },
    });

    if (error) {
      setServerError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-green-subtle text-green flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20,6 9,17 4,12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-text mb-2">Registrácia úspešná!</h1>
          <p className="text-text-muted mb-6">
            Skontrolujte si email a potvrďte registráciu kliknutím na odkaz.
          </p>
          <Link href="/prihlasenie">
            <Button>Prihlásiť sa</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text">Registrácia</h1>
          <p className="text-text-muted mt-2">
            Vytvorte si účet na Domio
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-border p-8 shadow-sm">
          {/* Google OAuth */}
          <button
            onClick={handleGoogleSignUp}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-border rounded-xl text-sm font-medium text-text hover:bg-bg-subtle transition-colors cursor-pointer mb-6"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Registrovať sa cez Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-text-faint">alebo</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {serverError && (
              <div className="p-3 rounded-xl bg-red-subtle text-red text-sm">
                {serverError}
              </div>
            )}

            <Input
              id="full_name"
              label="Meno a priezvisko"
              placeholder="Ján Novák"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              error={errors.full_name}
              autoComplete="name"
            />

            <Input
              id="email"
              type="email"
              label="Email"
              placeholder="vas@email.sk"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email}
              autoComplete="email"
            />

            <Input
              id="password"
              type="password"
              label="Heslo"
              placeholder="Minimálne 6 znakov"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={errors.password}
              autoComplete="new-password"
            />

            {/* Role selection */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Typ účtu
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "seeker" as const, label: "Hľadám nehnuteľnosť", icon: "🏠" },
                  { value: "agent" as const, label: "Som makléř", icon: "💼" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setForm({ ...form, role: option.value })}
                    className={`p-3 rounded-xl border text-center text-sm font-medium transition-all cursor-pointer ${
                      form.role === option.value
                        ? "border-brand bg-brand-subtle text-brand"
                        : "border-border text-text-secondary hover:border-brand-muted"
                    }`}
                  >
                    <span className="text-lg block mb-1">{option.icon}</span>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              Vytvoriť účet
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-text-muted">
            Už máte účet?{" "}
            <Link href="/prihlasenie" className="text-brand font-medium hover:underline">
              Prihláste sa
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
