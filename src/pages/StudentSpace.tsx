import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { toast } from "sonner";
import axios from "axios";
import { Chatbot } from "@/components/Chatbot";
import ubmaLogo from "@/assets/ubma-logo.png";
import avatarStudent from "@/assets/avatar-student.png";

const BACKEND_URL = "http://localhost:8001";

export default function StudentSpace() {
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const userName = localStorage.getItem("user_name") || "Student";
  const userMajor = localStorage.getItem("user_major") || "Informatics";
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("documents").select("*").eq("owner_id", userId).order("created_at", { ascending: false });
    if (error) toast.error("Error fetching documents");
    else setDocs(data || []);
    setLoading(false);
  };

  const handleRequest = async (type: string) => {
    const { error } = await supabase.from("requests").insert({
      user_id: userId,
      form_type: type,
      status: "pending"
    });
    if (error) toast.error("Request failed");
    else toast.success(`${type} request submitted!`);
  };

  const handleDownload = async (storagePath: string, filename: string) => {
    try {
      const { data, error } = await supabase.storage.from("vault").download(storagePath);
      if (error) throw error;
      
      const url = window.URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
    } catch (err) {
      toast.error("Download failed");
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <nav className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-surface-3 bg-white/80 px-8 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <img src={ubmaLogo} alt="UBMA" className="h-12 w-12 object-contain" />
          <span className="font-display font-bold text-ink">GNU Student Space</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/profile" className="h-10 w-10 overflow-hidden rounded-full border-2 border-ink">
            <img src={avatarStudent} alt="Profile" />
          </Link>
          <button onClick={() => { localStorage.clear(); window.location.href = "/login"; }} className="text-sm font-semibold text-ink-3 hover:text-ink">Logout</button>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-8 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-ink">Welcome, {userName}</h1>
          <p className="text-ink-3">{userMajor} · Academic Year 2024-2025</p>
        </header>

        <section className="mb-12 grid gap-6 md:grid-cols-3">
          {["School Certificate", "Academic Transcript", "Enrollment Proof"].map((type) => (
            <button key={type} onClick={() => handleRequest(type)} className="flex flex-col gap-2 rounded-2xl border border-surface-3 bg-white p-6 text-left transition hover:border-ink hover:shadow-lg">
              <span className="text-2xl">📋</span>
              <span className="font-bold text-ink">{type}</span>
              <span className="text-xs text-ink-3">Click to request official signed PDF</span>
            </button>
          ))}
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Digital Vault</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {loading ? (
              <div className="py-10 text-center col-span-full text-ink-3">Loading vault items...</div>
            ) : docs.length === 0 ? (
              <div className="py-10 text-center col-span-full border-2 border-dashed border-surface-3 rounded-2xl text-ink-3">Your vault is empty. Request documents above.</div>
            ) : docs.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between rounded-xl border border-surface-3 bg-white p-4">
                <div className="flex items-center gap-3">
                  <span className="text-xl">📄</span>
                  <div>
                    <div className="font-semibold text-sm text-ink">{doc.filename}</div>
                    <div className="text-[10px] text-ink-3">PAdES-LTV Signed</div>
                  </div>
                </div>
                <button onClick={() => handleDownload(doc.storage_path, doc.filename)} className="rounded-lg bg-ink px-4 py-1.5 text-xs font-bold text-white">Download</button>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Chatbot />
    </div>
  );
}
