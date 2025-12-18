import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { openApi } from '../utils/api'; 

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State for Success Modal & Message
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); 
  
  // Toggle Password State
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: ''
  });

  // --- NEW: Auto-hide error after 10 seconds ---
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 10000); // 10000ms = 10 seconds

      // Cleanup function to clear timer if component unmounts or error changes
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await openApi.post('/accounts/signup/', formData);
      
      const msg = response.data.message || "Account created successfully!";
      setSuccessMessage(msg);

      setShowSuccess(true); 
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      console.error("Signup Error:", err);
      if (err.response && err.response.data) {
        if (err.response.data.email) setError(err.response.data.email[0]);
        else if (err.response.data.password) setError(err.response.data.password[0]);
        else if (err.response.data.detail) setError(err.response.data.detail);
        else setError("Signup failed. Please check your details.");
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
            <h2 className="text-xl font-bold text-center text-slate-800 mb-1">Create Account</h2>
            <p className="text-center text-slate-500 text-xs mb-5">Join us to save and manage your code snippets.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Error Message */}
              {error && (
                <div className="bg-red-50/90 text-red-600 px-3 py-2 rounded-lg text-xs border border-red-200 flex items-center gap-2 animate-pulse">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  required
                  placeholder="e.g. Sachin Katiyar"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white/50 text-slate-800 text-sm focus:bg-white focus:border-[#6C92F4] focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white/50 text-slate-800 text-sm focus:bg-white focus:border-[#6C92F4] focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm"
                />
              </div>

              {/* Password with Toggle */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 pr-10 rounded-lg border border-slate-200 bg-white/50 text-slate-800 text-sm focus:bg-white focus:border-[#6C92F4] focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm"
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
                disabled={loading || showSuccess}
                className={`w-full py-2.5 rounded-lg text-white font-medium shadow-lg hover:shadow-blue-200 transition-all ${
                  loading || showSuccess
                    ? 'bg-blue-300 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-500 to-[#6C92F4] hover:-translate-y-0.5'
                }`}
              >
                {loading || showSuccess ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>

            {/* Footer Links */}
            <p className="mt-5 text-center text-xs text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-[#6C92F4] hover:text-blue-600 hover:underline">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* ================= SUCCESS MODAL ================= */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" />
          
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center justify-center animate-[fadeIn_0.3s_ease-out] border border-gray-100 max-w-sm w-full text-center">
            <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
               </svg>
            </div>
            
            <h3 className="text-xl font-bold text-slate-800">Success!</h3>
            <p className="text-slate-600 text-sm mt-2 font-medium">
              {successMessage}
            </p>
            
            <p className="text-slate-400 text-xs mt-4">Redirecting to login...</p>
          </div>
        </div>
      )}

    </div>
  );
};

export default Signup;