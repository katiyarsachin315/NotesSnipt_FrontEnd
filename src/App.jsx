import React from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import CreateNote from "./pages/CreateNote";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword"; 
import VerifyEmail from "./pages/VerifyEmail";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

// ==========================================
// 1. User Protected Route (For Normal Users)
// ==========================================
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    return <Navigate to="/" replace />; 
  }
  return children;
};

// ==========================================
// 2. Admin Protected Route (For Admin Only)
// ==========================================
const AdminRoute = ({ children }) => {
  const adminToken = localStorage.getItem("admin_token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (!adminToken || !isAdmin) {
    // Agar admin logged in nahi hai toh admin login page par bhej do
    return <Navigate to="/control-center" replace />; 
  }
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 font-sans">
        <Routes>

          {/* ✅ PUBLIC ROUTES */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
          <Route path="/verify-email/:uid/:token" element={<VerifyEmail />} />

          {/* ✅ ADMIN ROUTES (Protected) */}
          <Route path="/control-center" element={<AdminLogin />} />
          <Route 
            path="/admin-dashboard" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />

          {/* ✅ USER ROUTES (Protected) */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/createnote"
            element={
              <ProtectedRoute>
                <CreateNote />
              </ProtectedRoute>
            }
          />

          {/* ❌ 404 - PAGE NOT FOUND */}
          <Route
            path="*"
            element={
              <div className="flex flex-col items-center justify-center h-screen space-y-4 bg-white text-center p-6">
                <div className="text-6xl font-black text-slate-200">404</div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Oops! Page not found.</h1>
                <p className="text-slate-500 max-w-xs">The page you're looking for doesn't exist or has been moved.</p>
                <Link to="/" className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all">
                  Go to Login
                </Link>
              </div>
            }
          />

        </Routes>
      </div>
    </BrowserRouter>
  );
}