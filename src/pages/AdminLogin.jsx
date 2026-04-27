import React, { useState, useEffect } from "react";
import { openApi } from "../utils/api";
import { useNavigate, Link } from "react-router-dom";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    adminKey: "", // Extra security layer for admin
  });
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 10000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ✅ 1. Backend API hit karna
      const response = await openApi.post("/accounts/admin-login/", formData);

      // ✅ 2. Response se data nikalna (is_admin backend se aa raha hai)
      const { token, is_admin, full_name, email } = response.data;

      // ✅ 3. Logic: Check if the user is actually an admin
      if (is_admin !== true) {
        setError("Unauthorized access. Admin privileges required.");
        setLoading(false);
        return;
      }

      // ✅ 4. Token aur user details save karna
      if (token) {
        localStorage.setItem("admin_token", token);
        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("userDetails", JSON.stringify({ 
          full_name, 
          email, 
          is_admin 
        }));
        
        navigate("/admin-dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Unauthorized access. Admin credentials required.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full font-sans text-slate-800 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      
      {/* BACKGROUND BLOBS */}
      <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-600 opacity-10 blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600 opacity-10 blur-[100px] pointer-events-none" />

      {/* CONTENT CARD */}
      <div className="relative z-10 w-full max-w-lg">
        
        {/* Brand Logo */}
        <div className="flex justify-center mb-6">
           <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-xl">
              <div className="text-blue-400">
                 <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h1 className="text-lg font-bold tracking-tight text-white">Admin Control</h1>
           </div>
        </div>

        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 w-full"></div>

          <div className="p-10">
            <div className="flex justify-center mb-4">
              <div className="flex items-center gap-2 px-4 py-1.5 bg-white/50 backdrop-blur-md rounded-full border border-white/50 shadow-sm">
                <div className="text-[#6C92F4]">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <h1 className="text-lg font-bold tracking-tight text-slate-800">NotesSnipt</h1>
              </div>
            </div>
            
            <p className="text-center text-slate-400 text-xs mb-8">Authorization required to access system management.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              
               {error && (
                <div className="bg-red-500/10 text-red-400 px-4 py-3 rounded-xl text-xs border border-red-500/20 flex items-center gap-2 animate-shake">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                  {error}
                </div>
              )}

              {/* Email Address */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2 ml-1">Admin Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="admin@notessnipt.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:bg-white/10 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2 ml-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 pr-12 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:bg-white/10 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                    {showPassword ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl text-white font-bold text-sm shadow-2xl transition-all ${
                  loading ? "bg-slate-700 cursor-wait" : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:-translate-y-1 active:scale-95"
                }`}
              >
                {loading ? "Authenticating..." : "Access Control Panel"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;