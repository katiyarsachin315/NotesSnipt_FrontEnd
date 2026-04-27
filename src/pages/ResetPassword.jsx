import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { openApi } from "../utils/api";

const ResetPassword = () => {
  // URL se uid aur token nikalne ke liye (App.js route setup zaroori hai)
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirm_password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Auto-hide error logic
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 8000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // API call using the uid and token from URL
      console.log(formData);
      await openApi.post(`/accounts/reset-password/${uid}/${token}/`, {
        password: formData.password,
        confirm_password: formData.confirm_password,
      });

      setIsSuccess(true);
      // 3 seconds baad login pe redirect
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
        // console.log("BACKEND ERROR:", err.response?.data);
        // console.error("Reset Error:", err);
      if (err.response && err.response.data) {
        setError(err.response.data.detail || "This reset link is invalid or has already been used.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full font-sans text-slate-800 relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      
      {/* BACKGROUND BLOBS */}
      <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-400 opacity-20 blur-[80px] pointer-events-none mix-blend-multiply animate-pulse" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-400 opacity-20 blur-[100px] pointer-events-none mix-blend-multiply" />

      <div className="relative z-10 w-full max-w-lg">
        
        {/* Brand Logo */}
        <div className="flex justify-center mb-4">
           <div className="flex items-center gap-2 px-4 py-1.5 bg-white/50 backdrop-blur-md rounded-full border border-white/50 shadow-sm">
              <div className="text-[#6C92F4]">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <h1 className="text-lg font-bold tracking-tight text-slate-800">NotesSnipt</h1>
           </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-blue-500 to-[#6C92F4] w-full"></div>

          <div className="p-8">
            {!isSuccess ? (
              <>
                <h2 className="text-xl font-bold text-center text-slate-800 mb-1">Set New Password</h2>
                <p className="text-center text-slate-500 text-xs mb-6">Choose a strong password to secure your account.</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {error && (
                    <div className="bg-red-50/90 text-red-600 px-3 py-2 rounded-lg text-xs border border-red-200 flex items-center gap-2 animate-pulse">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      {error}
                    </div>
                  )}

                  {/* New Password Field */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">New Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        required
                        placeholder="Min 8 characters"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white/50 text-slate-800 text-sm focus:bg-white focus:border-[#6C92F4] focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirm_password"
                      required
                      placeholder="Repeat your password"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white/50 text-slate-800 text-sm focus:bg-white focus:border-[#6C92F4] focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded-lg text-white font-bold text-sm shadow-lg hover:shadow-blue-200 transition-all ${
                      loading
                        ? "bg-blue-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-500 to-[#6C92F4] hover:-translate-y-0.5 active:scale-[0.98]"
                    }`}
                  >
                    {loading ? "Resetting..." : "Update Password"}
                  </button>
                </form>
              </>
            ) : (
              /* SUCCESS VIEW */
              <div className="py-4 flex flex-col items-center text-center animate-[fadeIn_0.3s_ease-out]">
                <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
                   <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Password Updated!</h3>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                  Your password has been reset successfully.
                </p>
                <div className="bg-blue-50 text-blue-700 text-[11px] font-bold px-3 py-1 rounded-full animate-pulse mb-8">
                  Redirecting to login in 3 seconds...
                </div>
                <Link to="/" className="w-full py-3 rounded-lg bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-all text-center">
                  Login Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;