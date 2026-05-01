import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Chatbot } from "../components/Chatbot";

export default function AdminDashboard() {
  const [pendingDocs, setPendingDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("user_role");
    if (role !== 'admin') {
      navigate("/login");
      return;
    }
    fetchPending();
  }, []);

  const fetchPending = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("requests")
      .select("*, profiles!inner(first_name, major)")
      .eq("status", "pending");
    
    if (error) toast.error("Error fetching requests");
    else setPendingDocs(data || []);
    setLoading(false);
  };

  const handleValidate = async (requestId: string) => {
    const { error } = await supabase
      .from("requests")
      .update({ status: "validated", validated_by: localStorage.getItem("user_id") })
      .eq("id", requestId);

    if (error) toast.error("Validation failed");
    else {
      toast.success("Request validated and moved to academic queue");
      fetchPending();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <nav className="border-b bg-white px-8 py-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">A</div>
            <h1 className="text-xl font-bold tracking-tight">GNU Admin Portal</h1>
          </div>
          <button onClick={() => { localStorage.clear(); navigate("/login"); }} className="text-sm font-medium text-slate-500 hover:text-indigo-600">Logout</button>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-8 py-10">
        <h2 className="text-3xl font-bold mb-6">Validation Queue</h2>
        <div className="grid gap-6">
          {loading ? (
            <div className="py-20 text-center">Loading...</div>
          ) : pendingDocs.map((req) => (
            <div key={req.id} className="flex items-center justify-between rounded-2xl border bg-white p-6 shadow-sm">
              <div>
                <h3 className="font-bold text-lg">{req.form_type}</h3>
                <p className="text-sm text-slate-500">Student: {req.profiles?.first_name} ({req.profiles?.major})</p>
              </div>
              <button 
                onClick={() => handleValidate(req.id)}
                className="rounded-xl bg-indigo-600 px-6 py-2 text-sm font-bold text-white transition hover:bg-indigo-700"
              >
                Approve Request
              </button>
            </div>
          ))}
        </div>
      </main>
      <Chatbot />
    </div>
  );
}
