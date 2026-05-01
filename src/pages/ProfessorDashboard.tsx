import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Chatbot } from "../components/Chatbot";

export default function ProfessorDashboard() {
  const [validatedDocs, setValidatedDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("user_role");
    if (role !== 'professor') {
      navigate("/login");
      return;
    }
    fetchValidated();
  }, []);

  const fetchValidated = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("documents")
      .select("*, users!inner(first_name, major)")
      .eq("status", "validated");
    
    if (error) toast.error("Error fetching documents");
    else setValidatedDocs(data || []);
    setLoading(false);
  };

  const handleIssueBadge = async (doc: any) => {
    // 1. Update doc status
    const { error: docError } = await supabase
      .from("documents")
      .update({ status: "issued", issued_by: localStorage.getItem("user_id") })
      .eq("id", doc.id);

    if (docError) {
      toast.error("Failed to update status");
      return;
    }

    // 2. Insert new badge for the student
    const { error: badgeError } = await supabase
      .from("badges")
      .insert({
        name: `Credential: ${doc.name}`,
        issuer: "Badji Mokhtar University",
        year: new Date().getFullYear().toString(),
        type: "Official",
        color: "from-emerald-600 to-teal-400",
        icon: "🎓",
        status: "valid"
      });

    if (badgeError) toast.error("Failed to issue badge record");
    else {
      toast.success("Credential & Badge issued successfully!");
      fetchValidated();
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50/30 font-sans text-slate-900">
      <nav className="border-b bg-white px-8 py-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xl">P</div>
            <h1 className="text-xl font-bold tracking-tight">GNU Professor Hub</h1>
          </div>
          <button onClick={() => { localStorage.clear(); navigate("/login"); }} className="text-sm font-medium text-slate-500 hover:text-emerald-600">Logout</button>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-8 py-10">
        <header className="mb-10">
          <h2 className="text-3xl font-bold text-emerald-950">Issue Digital Credentials</h2>
          <p className="mt-2 text-slate-600 font-medium">Approved requests waiting for academic certification and Open Badge issuance.</p>
        </header>

        <div className="grid gap-6">
          {loading ? (
            <div className="py-20 text-center text-slate-400">Loading validated requests...</div>
          ) : validatedDocs.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-emerald-100 bg-white py-20 text-center">
              <p className="text-slate-400 font-medium">All academic requests are processed. Well done, Professor!</p>
            </div>
          ) : (
            validatedDocs.map((doc) => (
              <div key={doc.id} className="group flex items-center justify-between rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm transition hover:shadow-lg hover:border-emerald-200">
                <div className="flex items-center gap-5">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path d="M12 14v7" /></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-emerald-900">{doc.name}</h3>
                    <p className="text-sm text-slate-500">Student: <span className="font-semibold text-emerald-700">{doc.users?.first_name}</span> · {doc.users?.major}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 uppercase">Admin Validated</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleIssueBadge(doc)}
                    className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-100 transition hover:bg-emerald-700 hover:scale-105 active:scale-95"
                  >
                    Issue Open Badge 🎓
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
      <Chatbot />
    </div>
  );
}
