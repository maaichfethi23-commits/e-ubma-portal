import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Chatbot } from "@/components/Chatbot";
import ubmaLogo from "@/assets/ubma-logo.png";


const EN = "Welcome to the University Space of Badji Mokhtar Annaba";
const AR = "مرحبا بك في فضاء جامعة باجي مختار عنابة";

function useTypewriter(text: string, speed = 45, startDelay = 0) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setOut("");
    setDone(false);
    let i = 0;
    const start = window.setTimeout(() => {
      const id = window.setInterval(() => {
        i += 1;
        setOut(text.slice(0, i));
        if (i >= text.length) {
          window.clearInterval(id);
          setDone(true);
        }
      }, speed);
    }, startDelay);
    return () => window.clearTimeout(start);
  }, [text, speed, startDelay]);
  return { out, done };
}

function Welcome() {
  const en = useTypewriter(EN, 18, 400);
  const ar = useTypewriter(AR, 32, 400 + EN.length * 18 + 200);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated ambient gradient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 20% 10%, color-mix(in oklab, var(--ink) 14%, transparent), transparent 60%), radial-gradient(50% 40% at 85% 90%, color-mix(in oklab, var(--gold) 22%, transparent), transparent 60%), radial-gradient(40% 35% at 80% 20%, color-mix(in oklab, var(--ink) 10%, transparent), transparent 60%)",
          backgroundSize: "200% 200%",
          animation: "gradientShift 18s ease-in-out infinite",
        }}
      />
      {/* Soft grain dots */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(var(--ink) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
        {/* Animated logo */}
        <div className="relative mb-10 grid place-items-center">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 rounded-full pulse-ring"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--ink) 18%, transparent), transparent 70%)",
            }}
          />
          <div
            aria-hidden
            className="absolute -inset-6 -z-10 rounded-full spin-slow"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0 60%, color-mix(in oklab, var(--gold) 55%, transparent) 75%, transparent 90% 100%)",
              maskImage:
                "radial-gradient(circle, transparent 58%, black 60%, black 70%, transparent 72%)",
              WebkitMaskImage:
                "radial-gradient(circle, transparent 58%, black 60%, black 70%, transparent 72%)",
            }}
          />
          <img
            src={ubmaLogo}
            alt="Université Badji Mokhtar Annaba logo"
            className="h-32 w-32 rounded-full bg-white object-contain p-3 shadow-[0_18px_50px_-10px_color-mix(in_oklab,var(--ink)_35%,transparent)] float md:h-40 md:w-40"
            style={{ animation: "fadeUp 1s cubic-bezier(.2,.8,.2,1) both, float 5s ease-in-out 1s infinite" }}
          />
        </div>

        <p className="fade-up mb-3 text-xs font-semibold uppercase tracking-[0.4em] text-ink-3 delay-200">
          UBMA · Guichet Numérique Universitaire
        </p>

        {/* Typewriter EN */}
        <h1
          dir="ltr"
          lang="en"
          className="font-display text-balance text-3xl font-bold leading-tight text-ink md:text-5xl lg:text-6xl"
        >
          <span>{en.out}</span>
          <span
            aria-hidden
            className={`ml-1 inline-block h-[0.9em] w-[3px] -translate-y-[0.05em] bg-ink align-middle ${
              en.done ? "opacity-0" : "opacity-100"
            }`}
            style={{ animation: "blink 1s steps(2) infinite" }}
          />
        </h1>

        {/* Typewriter AR */}
        <h2
          dir="rtl"
          lang="ar"
          className="mt-6 font-display text-balance text-2xl font-bold leading-tight text-ink-2 md:text-4xl lg:text-5xl"
          style={{ fontFamily: "'Noto Naskh Arabic', 'Amiri', serif" }}
        >
          <span
            aria-hidden
            className={`ml-1 inline-block h-[0.9em] w-[3px] -translate-y-[0.05em] bg-ink-2 align-middle ${
              ar.done ? "opacity-0" : "opacity-100"
            }`}
            style={{ animation: "blink 1s steps(2) infinite" }}
          />
          <span>{ar.out}</span>
        </h2>

        <p
          className="mx-auto mt-8 max-w-2xl text-balance text-sm text-ink-3 md:text-base fade-up delay-500"
        >
          Your secure, single sign-on portal for academic documents, verifiable Open
          Badges and a Digital Vault — signed with PAdES and verifiable by anyone, anywhere.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 fade-up delay-600">
          <Link
            to="/login"
            className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_color-mix(in_oklab,var(--ink)_55%,transparent)] transition hover:scale-[1.03] hover:opacity-95"
          >
            Enter your space
            <span
              aria-hidden
              className="inline-block transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
          <a
            href="https://www.univ-annaba.dz"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-surface-3 bg-white/70 px-6 py-3 text-sm font-semibold text-ink backdrop-blur transition hover:border-ink"
          >
            About UBMA
          </a>
        </div>

        {/* Animated dots */}
        <div className="mt-12 flex items-center gap-2 text-xs text-ink-3 fade-up delay-700">
          <span className="dot-anim flex gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-ink-3" />
            <span className="h-1.5 w-1.5 rounded-full bg-ink-3" />
            <span className="h-1.5 w-1.5 rounded-full bg-ink-3" />
          </span>
          Loading your experience
        </div>
      </main>

      {/* Floating chatbot bubble */}
      <Chatbot />
    </div>
  );
}

export default Welcome;
