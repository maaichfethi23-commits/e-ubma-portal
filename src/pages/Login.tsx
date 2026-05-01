import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import ubmaLogo from "@/assets/ubma-logo.png";


import { supabase } from "../supabaseClient";

function LoginPage() {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        console.log("Attempting login for:", studentId);
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', studentId)
            .eq('password', password)
            .single();

        if (error || !data) {
            toast.error("Invalid credentials or user not found");
        } else {
            localStorage.setItem("user_id", data.id);
            localStorage.setItem("user_name", data.first_name);
            localStorage.setItem("user_major", data.major);
            localStorage.setItem("user_role", data.role || 'student');
            
            toast.success(`Welcome back ${data.first_name} (${data.role})`);
            
            // Redirect based on role
            if (data.role === 'admin') navigate("/admin-dashboard");
            else if (data.role === 'professor') navigate("/professor-dashboard");
            else navigate("/student-space");
        }
    } catch (err) {
        console.error("Unexpected Error:", err);
        toast.error("Connection error with Supabase");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Ambient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 15% 10%, color-mix(in oklab, var(--ink) 14%, transparent), transparent 60%), radial-gradient(50% 40% at 85% 90%, color-mix(in oklab, var(--gold) 22%, transparent), transparent 60%)",
          backgroundSize: "200% 200%",
          animation: "gradientShift 18s ease-in-out infinite",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(var(--ink) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <main className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-12">
        <div className="grid w-full gap-10 md:grid-cols-2 md:items-center">
          {/* Brand panel */}
          <div className="hidden flex-col items-start gap-6 md:flex fade-up">
            <img
              src={ubmaLogo}
              alt="UBMA logo"
              className="h-20 w-20 rounded-full bg-white object-contain p-2 shadow-[0_18px_50px_-10px_color-mix(in_oklab,var(--ink)_35%,transparent)] float"
            />
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.4em] text-ink-3">
                UBMA · GNU
              </p>
              <h1 className="font-display text-4xl font-bold leading-tight text-ink lg:text-5xl">
                Log in to your university space
              </h1>
              <p className="mt-4 max-w-md text-sm text-ink-3">
                Access your documents, Open Badges, and Digital Vault — securely
                signed and verifiable anywhere.
              </p>
            </div>
            <ul className="space-y-2 text-sm text-ink-2">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-ink" /> PAdES-LTV
                signed documents
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-ink" /> OpenBadges
                3.0 credentials
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-ink" /> QR-verifiable
                vault
              </li>
            </ul>
          </div>

          {/* Form card */}
          <div className="fade-up delay-200">
            <div className="rounded-3xl border border-surface-3 bg-white/85 p-7 shadow-[0_18px_60px_-18px_color-mix(in_oklab,var(--ink)_30%,transparent)] backdrop-blur-md md:p-9">
              <div className="mb-6 flex items-center gap-3 md:hidden">
                <img
                  src={ubmaLogo}
                  alt="UBMA logo"
                  className="h-10 w-10 rounded-full bg-white object-contain p-1"
                />
                <span className="font-display text-lg font-bold text-ink">
                  UBMA Student Space
                </span>
              </div>

              <h2 className="font-display text-2xl font-bold text-ink">Welcome back</h2>
              <p className="mt-1 text-sm text-ink-3">
                Enter your credentials to continue.
              </p>

              <form onSubmit={submit} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="studentId" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-2">
                    Enter your ID
                  </label>
                  <input
                    id="studentId"
                    type="text"
                    autoComplete="username"
                    required
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g. 202312345678"
                    className="w-full rounded-xl border-[1.5px] border-surface-3 bg-surface-2 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-ink focus:bg-white"
                  />
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wide text-ink-2">
                      Password
                    </label>
                    <button type="button" className="text-xs font-medium text-ink-3 hover:text-ink">
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type={show ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border-[1.5px] border-surface-3 bg-surface-2 px-4 py-3 pr-20 text-sm text-ink outline-none transition-colors focus:border-ink focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShow((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-semibold text-ink-3 hover:text-ink"
                    >
                      {show ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-surface-3 accent-[var(--ink)]"
                  />
                  Remember me on this device
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_color-mix(in_oklab,var(--ink)_55%,transparent)] transition hover:opacity-95 disabled:opacity-70"
                >
                  {loading ? (
                    <span className="dot-anim flex gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    </span>
                  ) : (
                    <>
                      Log in
                      <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">→</span>
                    </>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-xs text-ink-3">
                Don't have an account?{" "}
                <button type="button" className="font-semibold text-ink hover:underline">
                  Contact the registrar
                </button>
              </p>
            </div>

            <div className="mt-4 text-center text-xs">
              <Link to="/" className="text-ink-3 hover:text-ink">← Back to home</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
