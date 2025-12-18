import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { useNavigate } from 'react-router-dom';
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-css";
import "prismjs/components/prism-javascript";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [search, setSearch] = useState("");
  const [copyStatus, setCopyStatus] = useState("Copy");
  
  // User Data States
  const [userInitials, setUserInitials] = useState(""); 
  const [userInfo, setUserInfo] = useState(null); // To store full name/email
  
  const navigate = useNavigate();

  // 1. Fetch User Details & Initials
  useEffect(() => {
    const userData = localStorage.getItem("userDetails");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserInfo(user); // Save full object for the dropdown

        if (user.full_name) {
          const names = user.full_name.split(" ");
          const initials = names.length > 1 
            ? `${names[0][0]}${names[names.length - 1][0]}` 
            : `${names[0][0]}${names[0][1] || ''}`;
          setUserInitials(initials.toUpperCase());
        }
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
  }, []);

  // 2. Logout Function
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("userDetails");
    navigate("/login");
  };

  useEffect(() => {
    api.get("/notesapp/getnotes/").then((res) => setNotes(res.data));
  }, []);

  useEffect(() => {
    if (selectedNote) {
      Prism.highlightAll();
    }
  }, [selectedNote]);

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && setSelectedNote(null);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  const handleCopy = () => {
    if (selectedNote?.content) {
      navigator.clipboard.writeText(selectedNote.content);
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus("Copy"), 1500);
    }
  };

  const filteredNotes = notes.filter((n) =>
    `${n.title} ${n.description} ${n.content}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen font-sans text-slate-800 relative bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      
      {/* --- BACKGROUND BLOBS --- */}
      <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-400 opacity-20 blur-[80px] pointer-events-none mix-blend-multiply animate-pulse" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-400 opacity-20 blur-[100px] pointer-events-none mix-blend-multiply" />
      <div className="fixed top-[40%] left-[40%] w-[400px] h-[400px] rounded-full bg-indigo-300 opacity-20 blur-[90px] pointer-events-none" />

      {/* --- CONTENT WRAPPER --- */}
      <div className="relative z-10">

        {/* ================= FIXED HEADER ================= */}
        <div className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-white/50 px-6 py-4 shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Brand */}
            <div className="flex items-center gap-2">
              <div className="text-[#6C92F4]">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-800">NotesSnipt</h1>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-[400px] lg:w-[500px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </span>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white/80 backdrop-blur-sm text-sm outline-none focus:border-[#6C92F4] focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-gray-400"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Right Side: Button + User Menu */}
            <div className="flex items-center gap-4">
              
              <button 
                onClick={() => navigate('/CreateNote')} 
                className="whitespace-nowrap rounded-lg bg-gradient-to-r from-blue-500 to-[#6C92F4] px-5 py-2.5 text-sm font-medium text-white shadow-md hover:shadow-blue-200 hover:-translate-y-0.5 transition-all"
              >
                + Create New
              </button>

              {/* ================= USER PROFILE DROPDOWN (Better Approach) ================= */}
              {userInitials && (
                <div className="relative group">
                  {/* 1. The Avatar Circle */}
                  <div 
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 border border-indigo-200 shadow-sm text-indigo-700 font-bold text-sm tracking-wide cursor-pointer transition-transform group-hover:scale-105"
                  >
                    {userInitials}
                  </div>

                  {/* 2. The Dropdown Menu (Hidden by default, visible on group-hover) */}
                  <div className="absolute right-0 top-full mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                     <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                        
                        {/* User Info Section */}
                        <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                           <p className="text-sm font-bold text-slate-800 truncate">
                             {userInfo?.full_name || "User"}
                           </p>
                           <p className="text-xs text-slate-500 truncate">
                             {userInfo?.email || "user@email.com"}
                           </p>
                        </div>

                        {/* Logout Button */}
                        <button 
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-600 font-medium hover:bg-red-50 transition-colors flex items-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                          Logout
                        </button>
                     </div>
                  </div>
                  {/* Invisible bridge to prevent menu from closing when moving mouse from avatar to menu */}
                  <div className="absolute top-full right-0 h-2 w-full"></div>
                </div>
              )}
              {/* ========================================================================= */}

            </div>
          </div>
        </div>

        {/* ================= CONTENT GRID ================= */}
        <main className="max-w-7xl mx-auto p-6 pt-28">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className="
                  group cursor-pointer flex flex-col justify-between 
                  rounded-2xl bg-white/70 backdrop-blur-sm p-6 
                  border border-white/50 shadow-sm
                  hover:bg-white hover:border-[#6C92F4] hover:shadow-xl hover:-translate-y-1 
                  transition-all duration-300 ease-in-out
                "
              >
                <div>
                  <h2 className="text-lg font-bold text-slate-800 mb-3 leading-tight group-hover:text-[#6C92F4] transition-colors">
                    {note.title}
                  </h2>
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-4">
                    {note.description || "No description available for this note."}
                  </p>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-50/50 flex justify-between items-center">
                   <span className="text-[10px] font-bold uppercase text-gray-400 bg-gray-50/50 px-2 py-1 rounded">
                      
                   </span>
                   <span className="text-xs font-semibold text-[#6C92F4] opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0 duration-300">
                      View Code →
                   </span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* ================= MODAL ================= */}
      {selectedNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity"
            onClick={() => setSelectedNote(null)}
          />

          <div
            className="
              relative z-10 
              flex flex-col 
              w-11/12 max-w-5xl 
              h-[85vh] 
              bg-white rounded-xl shadow-2xl overflow-hidden
              border border-gray-100
              animate-[fadeIn_0.2s_ease-out]
            "
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* --- HEADER --- */}
            <div className="shrink-0 flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-white z-20">
              <div className="flex flex-col justify-center">
                <h2 className="text-lg font-bold text-slate-800 leading-tight">
                  {selectedNote.title}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 max-w-md">
                   {selectedNote.description || "No description available for this note."}
                </p>
              </div>

              <div className="flex items-center gap-3">
                 <button
                    onClick={handleCopy}
                    className={`
                        flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold transition-all
                        ${copyStatus.includes("Copied") 
                            ? "bg-green-50 text-green-700 ring-1 ring-green-200" 
                            : "bg-gray-50 text-slate-600 hover:bg-[#6C92F4] hover:text-white"}
                    `}
                  >
                    {copyStatus.includes("Copied") ? (
                         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    ) : (
                         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    )}
                    {copyStatus}
                 </button>

                 <div className="h-5 w-px bg-gray-200"></div>

                 <button
                    onClick={() => setSelectedNote(null)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                 >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                 </button>
              </div>
            </div>

            {/* --- BODY (Scrollable with Custom Scrollbar) --- */}
            <div className="
              flex-1 overflow-y-auto bg-[#1e1e1e] relative group
              [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-track]:bg-[#1e1e1e]
              [&::-webkit-scrollbar-thumb]:bg-gray-700
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-thumb]:hover:bg-gray-600
            ">
              <div className="p-6">
                <pre className="!bg-transparent !m-0 !p-0">
                  <code className="language-css text-sm font-mono leading-relaxed">
                    {selectedNote.content}
                  </code>
                </pre>
              </div>
            </div>

            {/* --- FOOTER --- */}
            <div className="shrink-0 flex justify-between items-center px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs z-20">
               <div className="flex items-center gap-4 text-gray-500 font-medium">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#6C92F4]"></span>
                    Read Only
                  </span>
                  <span>UTF-8</span>
               </div>
               
               <button 
                onClick={() => setSelectedNote(null)}
                className="text-gray-400 hover:text-slate-700 font-medium transition-colors"
               >
                 Close Window
               </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Home;