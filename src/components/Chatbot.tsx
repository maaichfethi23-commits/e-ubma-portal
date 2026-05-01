import { useEffect, useRef, useState } from "react";

type Msg = { role: "bot" | "user"; html: string };

export function Chatbot({ onIntentDetected }: { onIntentDetected?: (intent: any) => void }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "bot", html: "Hi, I'm <strong>GNU Assistant</strong>. How can I help you today?" },
  ]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  const send = async (text: string) => {
    const t = text.trim();
    if (!t) return;
    setMsgs((m) => [...m, { role: "user", html: t }]);
    setInput("");
    setTyping(true);
    
    try {
        const response = await fetch("http://localhost:8001/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                message: t, 
                context: {
                    user_name: localStorage.getItem("user_name"),
                    user_role: localStorage.getItem("user_role") || "guest"
                }
            })
        });
        const data = await response.json();
        setMsgs((m) => [...m, { role: "bot", html: data.reply || "I'm sorry, I couldn't process that." }]);
        
        if (data.intent_data && onIntentDetected) {
            onIntentDetected(data.intent_data);
        }
    } catch (err) {
        setMsgs((m) => [...m, { role: "bot", html: "Connection error with GNU AI Core." }]);
    } finally {
        setTyping(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button onClick={() => setOpen((o) => !o)} className={`grid h-14 w-14 place-items-center rounded-full bg-ink text-white shadow-lg transition-transform ${open ? "rotate-45" : "hover:scale-110"}`}>
          {open ? "×" : "💬"}
        </button>
      </div>

      <div className={`fixed bottom-24 right-6 z-40 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-3xl border border-surface-3 bg-white shadow-2xl transition-all ${open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`}>
        <div className="flex items-center gap-2 bg-ink p-4 text-white">
          <div className="font-display font-bold">GNU Assistant</div>
        </div>
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${m.role === "user" ? "bg-ink text-white" : "bg-white border border-surface-3 text-ink"}`} dangerouslySetInnerHTML={{ __html: m.html }} />
            </div>
          ))}
          {typing && <div className="text-xs text-ink-3 italic">Typing...</div>}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="p-4 border-t border-surface-3">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="How can I help?" className="w-full rounded-xl border border-surface-3 p-2 text-sm outline-none focus:border-ink" />
        </form>
      </div>
    </>
  );
}
