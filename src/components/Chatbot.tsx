import { useEffect, useRef, useState } from "react";

type Msg = { role: "bot" | "user"; html: string };

const RESPONSES: Record<string, string> = {
  "How to extract my school certificate?":
    "To get your <strong>school certificate</strong>:<br/><br/>1. Go to <em>E-services → Request School Certificate</em>.<br/>2. Pick the academic year and language.<br/>3. Submit — the registrar signs it digitally (PAdES).<br/>4. Download from <em>My Documents</em> with an embedded QR code for verification.<br/><br/>Average processing time: under 5 minutes ⚡",
  "Verify my Open Badge":
    "Each <strong>Open Badge</strong> is cryptographically issued and verifiable. Go to <em>Open Badges → Select badge → Verify</em>, or share its public URL. Anyone can confirm authenticity, issuer, and earning criteria via the OpenBadges 3.0 standard.",
  "What is PAdES signature?":
    "<strong>PAdES</strong> (PDF Advanced Electronic Signature) is an EU-standard digital signature embedded in PDFs. It guarantees:<br/><br/>• <strong>Authenticity</strong><br/>• <strong>Integrity</strong><br/>• <strong>Long-term validity</strong><br/><br/>All GNU documents are PAdES-LTV signed.",
  "Check Digital Vault QR code?":
    "Every document in your <strong>Digital Vault</strong> carries a unique QR code. Scan it with any phone — it opens a public verification page showing the issuer, date, and signature status in real time.",
};

type ChatbotProps = { defaultOpen?: boolean; inline?: boolean; onIntentDetected?: (intent: any) => void };

export function Chatbot({ defaultOpen = false, inline = false, onIntentDetected }: ChatbotProps = {}) {
  const [open, setOpen] = useState(defaultOpen || inline);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "bot", html: "Hi Amine, I'm <strong>GNU Assistant</strong>, your AI guide for documents, badges and e-services. How can I help today?" },
  ]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const SUGGESTIONS = Object.keys(RESPONSES);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 250);
  }, [open]);

  const send = async (text: string) => {
    const t = text.trim();
    if (!t) return;
    setMsgs((m) => [...m, { role: "user", html: t }]);
    setInput("");
    setShowSuggestions(false);
    setTyping(true);
    
    try {
        const response = await fetch("http://localhost:8001/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                message: t, 
                lang: "fr",
                context: {
                    user_name: localStorage.getItem("user_name"),
                    user_role: localStorage.getItem("user_role") || "guest"
                }
            })
        });
        const data = await response.json();
        setMsgs((m) => [...m, { role: "bot", html: data.reply || data.error || "I'm sorry, I couldn't process that." }]);
        
        if (data.intent_detected && onIntentDetected) {
            onIntentDetected(data.intent_detected);
        }
    } catch (err) {
        setMsgs((m) => [...m, { role: "bot", html: "Backend connection error. Please make sure the server is running." }]);
    } finally {
        setTyping(false);
    }
  };

  return (
    <>
      {!inline && (
        <div className="group fixed bottom-6 right-6 z-50 flex items-center gap-3">
          <span className="pointer-events-none whitespace-nowrap rounded-full border border-surface-3 bg-white px-3 py-1.5 font-display text-xs font-semibold text-ink shadow-md opacity-0 translate-x-3 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-ink align-middle" />
            AI Chat Bot Assistant
          </span>
          <button onClick={() => setOpen((o) => !o)} className={`grid h-14 w-14 place-items-center rounded-full bg-ink text-white shadow-lg transition-all duration-300 ${open ? "rotate-45" : "hover:scale-110"}`}>
            {open ? "×" : "💬"}
          </button>
        </div>
      )}

      <div className={inline ? "relative flex h-[500px] w-full flex-col overflow-hidden rounded-3xl border border-surface-3 bg-white" : `fixed bottom-24 right-6 z-40 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-3xl border border-surface-3 bg-white shadow-2xl transition-all duration-300 ${open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`}>
        <div className="flex items-center gap-2 bg-ink p-4 text-white">
          <div className="font-display font-bold">GNU Assistant</div>
        </div>
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${m.role === "user" ? "bg-ink text-white" : "bg-white border border-surface-3 text-ink"}`} dangerouslySetInnerHTML={{ __html: m.html }} />
            </div>
          ))}
          {typing && <div className="text-xs text-ink-3">Typing...</div>}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="p-4 border-t border-surface-3">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." className="w-full rounded-xl border border-surface-3 p-2 text-sm outline-none focus:border-ink" />
        </form>
      </div>
    </>
  );
}
