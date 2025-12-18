import React, { useState, useEffect } from "react";
import { openApi } from "../utils/api";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Toggle Password State
  
  const navigate = useNavigate();

  // --- NEW: Auto-hide error after 10 seconds ---
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 10000); // 10000ms = 10 seconds

      // Cleanup function to clear timer if component unmounts or error changes
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear errors when user types
    if (error) setError("");
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await openApi.post("/accounts/login/", {
        email: formData.email,
        password: formData.password,
      });

      if (response?.data?.token) {
        localStorage.setItem("access_token", response?.data?.token);
        const { id, full_name, email } = response?.data;
        localStorage.setItem("userDetails", JSON.stringify({ id, full_name, email }));

        navigate("/");
      }
    } catch (err) {
      console.error("Login Error:", err);
      if (err.response && err.response.data) {
        // alert(err.response.data)
        setError(err.response.data.detail || "Invalid email or password.");
      } else {
        setError("Something went wrong. Please try again.");
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
      <div className="relative z-10 w-full max-w-lg max-h-full overflow-y-auto no-scrollbar">
        
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

          <div className="p-6">
            <h2 className="text-xl font-bold text-center text-slate-800 mb-1">Welcome Back</h2>
            <p className="text-center text-slate-500 text-xs mb-5">Please sign in to continue managing your notes.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              
               {/* Error Message */}
               {error && (
                <div className="bg-red-50/90 text-red-600 px-3 py-2 rounded-lg text-xs border border-red-200 flex items-center gap-2 animate-pulse">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  {error}
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white/50 text-slate-800 text-sm focus:bg-white focus:border-[#6C92F4] focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 pr-10 rounded-lg border border-slate-200 bg-white/50 text-slate-800 text-sm focus:bg-white focus:border-[#6C92F4] focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm"
                  />
                  {/* Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2.5 rounded-lg text-white font-medium shadow-lg hover:shadow-blue-200 transition-all ${
                  loading
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-[#6C92F4] hover:-translate-y-0.5"
                }`}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="mt-5 text-center text-xs text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-[#6C92F4] hover:text-blue-600 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;