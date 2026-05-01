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
    <div className="relative min-h-screen overflow-hidden bg-surface">
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="relative mb-10 grid place-items-center">
          <img
            src={ubmaLogo}
            alt="UBMA"
            className="h-32 w-32 rounded-full bg-white object-contain p-3 shadow-xl md:h-40 md:w-40"
          />
        </div>

        <p className="fade-up mb-3 text-xs font-semibold uppercase tracking-[0.4em] text-ink-3">
          UBMA · Guichet Numérique Universitaire
        </p>

        <h1 className="font-display text-balance text-3xl font-bold text-ink md:text-5xl lg:text-6xl">
          {en.out}
        </h1>

        <h2 dir="rtl" className="mt-6 font-display text-balance text-2xl font-bold text-ink-2 md:text-4xl lg:text-5xl">
          {ar.out}
        </h2>

        <p className="mx-auto mt-8 max-w-2xl text-sm text-ink-3 md:text-base">
          Secure portal for academic documents, Open Badges and Digital Vault — verifiable by anyone, anywhere.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 text-sm font-bold text-white shadow-lg transition hover:scale-105"
          >
            Enter Space →
          </Link>
          <a
            href="https://www.univ-annaba.dz"
            className="rounded-full border border-surface-3 bg-white px-8 py-4 text-sm font-semibold text-ink transition hover:border-ink"
          >
            About UBMA
          </a>
        </div>
      </main>
      <Chatbot />
    </div>
  );
}

export default Welcome;
