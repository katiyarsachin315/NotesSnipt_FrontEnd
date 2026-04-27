import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { openApi } from "../utils/api"; 

const VerifyEmail = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState("loading"); // 'loading', 'success', 'error'
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    openApi
      .get(`/accounts/verify-email/${uid}/${token}/`)
      .then((res) => {
        setStatus("success");
        setMessage("Email verified successfully!");
        
        // --- 3 SECONDS REDIRECT ---
        setTimeout(() => {
          navigate("/");
        }, 3000);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(
          err.response?.data?.error || "Invalid or expired verification link"
        );
      });
  }, [uid, token, navigate]);

  return (
    <div className="h-screen w-full font-sans text-slate-800 relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      
      {/* BACKGROUND BLOBS (Consistency) */}
      <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-400 opacity-20 blur-[80px] pointer-events-none animate-pulse" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-400 opacity-20 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden text-center p-10">
          <div className="h-1.5 bg-gradient-to-r from-blue-500 to-[#6C92F4] absolute top-0 left-0 w-full"></div>

          {status === "loading" && (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-600 font-medium">{message}</p>
            </div>
          )}

          {status === "success" && (
            <div className="animate-[fadeIn_0.3s_ease-out]">
              <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-sm">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Verified!</h2>
              <p className="text-slate-500 text-sm mb-6">{message}</p>
              
              <div className="bg-blue-50 text-blue-700 text-[11px] font-bold px-3 py-1 rounded-full animate-pulse inline-block">
                Redirecting to login in 3 seconds...
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="animate-[fadeIn_0.3s_ease-out]">
              <div className="h-20 w-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-sm">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Verification Failed</h2>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">{message}</p>
              <Link to="/" className="block w-full py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-all">
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;