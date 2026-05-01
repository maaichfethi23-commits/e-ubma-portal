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
      .from("requests")
      .select("*, profiles!inner(first_name, major)")
      .eq("status", "validated");
    
    if (error) toast.error("Error fetching documents");
    else setValidatedDocs(data || []);
    setLoading(false);
  };

  const handleIssueBadge = async (req: any) => {
    const { error: reqError } = await supabase
      .from("requests")
      .update({ status: "issued", issued_by: localStorage.getItem("user_id") })
      .eq("id", req.id);

    if (reqError) {
      toast.error("Failed to update status");
      return;
    }

    toast.success("Credential & Badge issued successfully!");
    fetchValidated();
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
        <h2 className="text-3xl font-bold text-emerald-950 mb-6">Issue Credentials</h2>
        <div className="grid gap-6">
          {loading ? (
            <div className="py-20 text-center">Loading...</div>
          ) : validatedDocs.map((req) => (
            <div key={req.id} className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
              <div>
                <h3 className="font-bold text-lg text-emerald-900">{req.form_type}</h3>
                <p className="text-sm text-slate-500">Student: {req.profiles?.first_name} · {req.profiles?.major}</p>
              </div>
              <button 
                onClick={() => handleIssueBadge(req)}
                className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                Issue Digital Badge 🎓
              </button>
            </div>
          ))}
        </div>
      </main>
      <Chatbot />
    </div>
  );
}
