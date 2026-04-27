import React, { useState, useEffect } from "react";
import { openApi } from "../utils/api";
import { useNavigate, Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // Success state

  const navigate = useNavigate();

  // --- NEW: Auto-redirect after success ---
  useEffect(() => {
    if (isSubmitted) {
      const redirectTimer = setTimeout(() => {
        navigate("/"); // Login page ka path
      }, 3000); // 3 seconds delay

      return () => clearTimeout(redirectTimer);
    }
  }, [isSubmitted, navigate]);

  // Auto-hide error
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 8000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Working API Call
      await openApi.post("/accounts/forgot-password/", { email });
      setIsSubmitted(true); // Show success view
    } catch (err) {
      console.error("Forgot Password Error:", err);
      if (err.response && err.response.data) {
        setError(err.response.data.detail || "Email not found. Please check and try again.");
      } else {
        setError("Network error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full font-sans text-slate-800 relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      
      {/* --- BACKGROUND BLOBS --- */}
      <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-400 opacity-20 blur-[80px] pointer-events-none mix-blend-multiply animate-pulse" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-400 opacity-20 blur-[100px] pointer-events-none mix-blend-multiply" />
      <div className="fixed top-[40%] left-[40%] w-[400px] h-[400px] rounded-full bg-indigo-300 opacity-20 blur-[90px] pointer-events-none" />

      {/* --- CONTENT CARD --- */}
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
            {!isSubmitted ? (
              <>
                <h2 className="text-xl font-bold text-center text-slate-800 mb-1">Reset Password</h2>
                <p className="text-center text-slate-500 text-xs mb-6 px-4">
                  Enter your email address and we'll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {error && (
                    <div className="bg-red-50/90 text-red-600 px-3 py-2 rounded-lg text-xs border border-red-200 flex items-center gap-2 animate-pulse">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if(error) setError("");
                      }}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white/50 text-slate-800 text-sm focus:bg-white focus:border-[#6C92F4] focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded-lg text-white font-bold text-sm shadow-lg hover:shadow-blue-200 transition-all ${
                      loading
                        ? "bg-blue-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-500 to-[#6C92F4] hover:-translate-y-0.5 active:scale-[0.98]"
                    }`}
                  >
                    {loading ? "Sending link..." : "Send Reset Link"}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link
                    to="/"
                    className="text-xs font-bold text-slate-500 hover:text-[#6C92F4] flex items-center justify-center gap-1 transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                    Back to Login
                  </Link>
                </div>
              </>
            ) : (
              /* --- SUCCESS VIEW --- */
              <div className="py-4 flex flex-col items-center text-center animate-[fadeIn_0.3s_ease-out]">
                <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                   </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Check your email</h3>
                <p className="text-slate-500 text-sm mb-4 leading-relaxed px-2">
                  We've sent a password reset link to <span className="font-bold text-slate-700">{email}</span>.
                </p>
                <div className="bg-blue-50 text-blue-700 text-[11px] font-bold px-3 py-1 rounded-full animate-pulse mb-8">
                  Redirecting to login in 3 seconds...
                </div>
                <Link
                  to="/"
                  className="w-full py-3 rounded-lg bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-all text-center"
                >
                  Return to Login Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;