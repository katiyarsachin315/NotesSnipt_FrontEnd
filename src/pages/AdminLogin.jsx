import React, { useState, useEffect } from "react";
import { openApi } from "../utils/api";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Auto‑clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
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
      const response = await openApi.post("/accounts/admin-login/", formData);
      const { token, is_admin, full_name, email } = response.data;

      if (is_admin !== true) {
        setError("Unauthorized access. Admin privileges required.");
        setLoading(false);
        return;
      }

      if (token) {
        localStorage.setItem("admin_token", token);
        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("userDetails", JSON.stringify({ full_name, email, is_admin }));
        navigate("/admin-dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Unauthorized access. Admin credentials required.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-800 relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      {/* Background decorative blobs */}
      <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-400 opacity-20 blur-[80px] pointer-events-none mix-blend-multiply" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-400 opacity-20 blur-[100px] pointer-events-none mix-blend-multiply" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-blue-500 to-[#6C92F4]" />

          <div className="p-8">
            {/* Logo / Brand */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/50 shadow-sm">
                <div className="text-[#6C92F4]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <h1 className="text-lg font-bold tracking-tight text-slate-800">NotesSnipt</h1>
                <span className="text-[10px] font-mono text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">ADMIN</span>
              </div>
            </div>

            <p className="text-center text-slate-500 text-sm mb-8">
              Secure access to the management console
            </p>

            {/* Error message */}
            {error && (
              <div className="mb-5 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2 animate-shake">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 ml-1">Admin Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="admin@notessnipt.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/60 text-slate-800 text-sm focus:border-[#6C92F4] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 ml-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 bg-white/60 text-slate-800 text-sm focus:border-[#6C92F4] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full mt-4 py-3.5 rounded-xl text-white font-bold text-sm shadow-lg transition-all ${
                  loading
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-[#6C92F4] hover:from-blue-600 hover:to-[#5a7dd4] hover:-translate-y-0.5 active:scale-95"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Authenticating...
                  </div>
                ) : (
                  "Access Control Panel"
                )}
              </button>
            </form>

            {/* Additional info */}
            <div className="mt-6 text-center text-xs text-slate-400">
              <p>Secure gateway for authorised personnel only</p>
            </div>
          </div>
        </div>
      </div>

      {/* Optional: small animation keyframes (add to global CSS if not present) */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;