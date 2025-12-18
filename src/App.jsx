import React from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import CreateNote from "./pages/CreateNote";
import Login from "./pages/login";
import Signup from "./pages/Signup";

// 1. Create the ProtectedRoute Component
// This wrapper checks for a token before rendering the page
const ProtectedRoute = ({ children }) => {
  // Retrieve the token you saved during Login (ensure key matches your Login.jsx)
  const token = localStorage.getItem("access_token");

  // If no token exists, redirect to Login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token exists, render the protected page (children)
  return children;
};

// App (default export)
export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* 2. Protect the Home Route */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />

          {/* Public Route */}
          <Route path="/login" element={<Login />} />
          <Route path="/createnote" element={<CreateNote />} />
          <Route path="/signup" element={<Signup />} />

          {/* 404 Route */}
          <Route 
            path="*" 
            element={<div className="p-6">Page not found. <Link to="/">Go home</Link></div>} 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}