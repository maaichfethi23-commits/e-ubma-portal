import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { toast } from "sonner";
import ubmaLogo from "@/assets/ubma-logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 1. Authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // 2. Fetch user profile and role
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, first_name, major")
        .eq("id", authData.user.id)
        .single();

      if (profileError) throw profileError;

      // 3. Store in LocalStorage for UI persistence
      localStorage.setItem("user_id", authData.user.id);
      localStorage.setItem("user_role", profile.role);
      localStorage.setItem("user_name", profile.first_name);
      localStorage.setItem("user_major", profile.major || "N/A");

      toast.success(`Welcome back, ${profile.first_name}!`);

      // 4. Role-based redirection
      if (profile.role === "admin") navigate("/admin");
      else if (profile.role === "professor") navigate("/professor");
      else navigate("/student");

    } catch (error: any) {
      toast.error(error.message || "Invalid login credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-6">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-surface-3 bg-white p-10 shadow-xl">
        <div className="flex flex-col items-center gap-4">
          <img src={ubmaLogo} alt="UBMA" className="h-20 w-20 object-contain" />
          <h1 className="text-2xl font-bold tracking-tight text-ink">Sign in to GNU</h1>
          <p className="text-sm text-ink-3">Enter your academic credentials</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-ink">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-surface-3 p-3 outline-none focus:border-ink" 
              placeholder="name@univ-annaba.dz"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-ink">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-surface-3 p-3 outline-none focus:border-ink" 
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full rounded-xl bg-ink py-3.5 font-bold text-white shadow-lg transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
