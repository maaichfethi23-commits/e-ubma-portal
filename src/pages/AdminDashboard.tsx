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
      .from("documents")
      .select("*, users!inner(first_name, major)")
      .eq("status", "pending");
    
    if (error) toast.error("Error fetching documents");
    else setPendingDocs(data || []);
    setLoading(false);
  };

  const handleValidate = async (docId: string) => {
    const { error } = await supabase
      .from("documents")
      .update({ status: "validated", validated_by: localStorage.getItem("user_id") })
      .eq("id", docId);

    if (error) toast.error("Validation failed");
    else {
      toast.success("Document validated and moved to Professor queue");
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
        <header className="mb-10">
          <h2 className="text-3xl font-bold">Document Validation Queue</h2>
          <p className="mt-2 text-slate-500">Review and verify student certificate requests according to faculty regulations.</p>
        </header>

        <div className="grid gap-6">
          {loading ? (
            <div className="py-20 text-center text-slate-400">Loading pending requests...</div>
          ) : pendingDocs.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white py-20 text-center">
              <p className="text-slate-400 font-medium">No pending documents to review. Great job!</p>
            </div>
          ) : (
            pendingDocs.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md">
                <div className="flex items-center gap-5">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" /></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{doc.name}</h3>
                    <p className="text-sm text-slate-500">Submitted by: <span className="font-semibold text-slate-700">{doc.users?.first_name}</span> ({doc.users?.major})</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold transition hover:bg-slate-50">View Content</button>
                  <button 
                    onClick={() => handleValidate(doc.id)}
                    className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
                  >
                    Validate & Approve
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
