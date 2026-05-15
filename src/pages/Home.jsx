import React, { useState, useEffect, useRef } from "react";
import api from "../utils/api";
import { openApi } from "../utils/api";
import { useNavigate } from 'react-router-dom';
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-css";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [search, setSearch] = useState("");
  const [copyStatus, setCopyStatus] = useState("Copy");
  const [isMyNotesOnly, setIsMyNotesOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  
  const [deleteId, setDeleteId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({ id: "", title: "", description: "", content: "" });
  
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showMobileUserMenu, setShowMobileUserMenu] = useState(false);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  const [userInitials, setUserInitials] = useState(""); 
  const [userInfo, setUserInfo] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("userDetails");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserInfo(user);
        if (user.full_name) {
          const names = user.full_name.split(" ");
          const initials = names.length > 1 
            ? `${names[0][0]}${names[names.length - 1][0]}` 
            : `${names[0][0]}${names[0][1] || ''}`;
          setUserInitials(initials.toUpperCase());
        }
      } catch (e) { console.error("User data error", e); }
    }
    fetchNotes();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) setShowMobileSearch(false);
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) setShowMobileUserMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotes = () => {
    api.get("/notesapp/getnotes/").then((res) => setNotes(res.data));
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/notesapp/delete/${deleteId}/`);
      fetchNotes();
      setDeleteId(null);
    } catch (err) { setDeleteId(null); }
  };

  useEffect(() => {
    const esc = (e) => {
      if (e.key === "Escape") {
        setSelectedNote(null);
        setIsEditing(false);
        setDeleteId(null);
      }
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  const openEditMode = (note) => {
    setEditFormData({ id: note.id, title: note.title, description: note.description, content: note.content });
    setIsEditing(true);
    setSelectedNote(null);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/notesapp/update/${editFormData.id}/`, {
        title: editFormData.title,
        description: editFormData.description,
        content: editFormData.content
      });
      setShowUpdateSuccess(true);
      setTimeout(() => {
        setShowUpdateSuccess(false);
        setIsEditing(false);
        fetchNotes();
      }, 1000);
    } catch (err) { setLoading(false); } 
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("access_token");
    try { await openApi.post("/accounts/logout/", {}, { headers: { Authorization: `Token ${token}` } }); } catch(e){}
    localStorage.removeItem("access_token");
    localStorage.removeItem("userDetails");
    navigate("/");
  };

  const handleCopy = () => {
    if (selectedNote?.content) {
      navigator.clipboard.writeText(selectedNote.content);
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus("Copy"), 1500);
    }
  };

  useEffect(() => {
    if (selectedNote && !isEditing) Prism.highlightAll();
  }, [selectedNote, isEditing]);

  const filteredNotes = notes.filter((n) => {
    const matchesTitle = n.title.toLowerCase().includes(search.toLowerCase());
    const isOwner = isMyNotesOnly ? (n.user === userInfo?.id) : true;
    return matchesTitle && isOwner;
  });

  // --- EDITING VIEW (IS BLOCK KE BUTTONS AB PERFECT ALIGNED HAIN) ---
  if (isEditing) {
    return (
      <div className="h-screen w-full font-sans text-slate-800 relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-400 opacity-20 blur-[80px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-400 opacity-20 blur-[100px] pointer-events-none" />
        <div className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-white/50 shadow-sm px-6 py-4">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <button onClick={() => setIsEditing(false)} className="group flex items-center px-4 py-2 text-sm font-medium text-slate-600 bg-white/50 border border-slate-200 rounded-lg shadow-sm hover:bg-white hover:text-slate-800 transition-all">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              Back to Notes
            </button>
            <h1 className="text-xl font-bold text-slate-800">Editing Snippet</h1>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto pt-24 pb-12 p-4 md:p-6 flex items-start justify-center relative z-10 [&::-webkit-scrollbar]:hidden">
          <div className="w-full max-w-2xl">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-[#6C92F4] w-full"></div>
              <form onSubmit={handleUpdateSubmit} className="p-6 md:p-8 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Title *</label>
                  <input type="text" required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 outline-none transition-all focus:ring-2 focus:ring-blue-100 shadow-sm" value={editFormData.title} onChange={(e) => setEditFormData({...editFormData, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                  <textarea rows="2" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none shadow-sm" value={editFormData.description} onChange={(e) => setEditFormData({...editFormData, description: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Code / Content</label>
                  <div className="relative">
                    <textarea required rows="12" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-[#1e1e1e] text-gray-200 font-mono text-sm focus:border-[#6C92F4] focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-inner [&::-webkit-scrollbar]:hidden" value={editFormData.content} onChange={(e) => setEditFormData({...editFormData, content: e.target.value})} spellCheck="false" />
                    <span className="absolute top-2 right-4 text-xs text-gray-500 font-mono">{editFormData.content.length} chars</span>
                  </div>
                </div>
                
                {/* --- DEFINITIVE BUTTON FIX FOR MOBILE ALIGNMENT --- */}
                <div className="flex flex-row items-center justify-center gap-3 pt-4 w-full h-[52px]">
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(false)} 
                    className="flex-1 h-full rounded-xl border border-gray-200 text-slate-600 font-medium bg-white active:scale-95 transition-all text-xs sm:text-sm md:text-base flex items-center justify-center text-center whitespace-nowrap flex-shrink-0"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading || showUpdateSuccess} 
                    className={`flex-1 h-full rounded-xl text-white font-medium shadow-lg bg-gradient-to-r from-blue-500 to-[#6C92F4] active:scale-95 transition-all text-xs sm:text-sm md:text-base flex items-center justify-center text-center whitespace-nowrap flex-shrink-0 ${loading ? 'opacity-50' : ''}`}
                  >
                    {loading ? 'Updating...' : 'Save Snippet'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {showUpdateSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" />
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center justify-center animate-[fadeIn_0.3s_ease-out] border border-gray-100">
              <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800">Changes Saved!</h3>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans text-slate-800 relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-400 opacity-20 blur-[80px] pointer-events-none mix-blend-multiply" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-400 opacity-20 blur-[100px] pointer-events-none mix-blend-multiply" />

      <div className="relative z-10 flex-1">
        {/* DESKTOP HEADER (Original) */}
        <div className="hidden md:block fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-white/50 px-6 py-4 shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 lg:gap-8">
              <div className="flex items-center gap-2">
                <div className="text-[#6C92F4]"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg></div>
                <h1 className="text-xl font-bold tracking-tight text-slate-800">NotesSnipt</h1>
              </div>
              <button onClick={() => setIsMyNotesOnly(!isMyNotesOnly)} className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${isMyNotesOnly ? "bg-blue-600 text-white border-blue-600 shadow-lg" : "bg-white text-slate-600 border-slate-200 hover:border-blue-400"}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                {isMyNotesOnly ? "Showing My Notes" : "My Notes"}
              </button>
            </div>
            <div className="relative w-full md:w-[450px]"><input type="text" className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-white/80 text-sm outline-none focus:border-[#6C92F4] transition-all" placeholder="Search by title..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/CreateNote')} className="rounded-lg bg-gradient-to-r from-blue-500 to-[#6C92F4] px-5 py-2 text-sm font-medium text-white shadow-md hover:-translate-y-0.5 transition-all">+ Create New</button>
              {userInitials && (
                <div className="relative group">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-sm tracking-wide cursor-pointer transition-transform group-hover:scale-105 shadow-sm">{userInitials}</div>
                  <div className="absolute right-0 top-full mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                        <p className="text-sm font-bold text-slate-800 truncate">{userInfo?.full_name}</p>
                        <p className="text-xs text-slate-500 truncate">{userInfo?.email}</p>
                      </div>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-600 font-medium hover:bg-red-50 flex items-center gap-2">Logout</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MOBILE HEADER & ACTIONS (Shifted Up) */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="px-4 py-3 flex items-center justify-between">
                <div className="relative" ref={userMenuRef}>
                    <div onClick={() => setShowMobileUserMenu(!showMobileUserMenu)} className="w-10 h-10 rounded-full bg-[#DFE4F2] flex items-center justify-center text-[#7C89B3] font-bold text-sm border border-white cursor-pointer active:scale-95">
                        {userInitials || "SK"}
                    </div>
                    {showMobileUserMenu && (
                        <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[60]">
                            <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                                <p className="text-sm font-bold text-slate-800 truncate">{userInfo?.full_name}</p>
                                <p className="text-xs text-slate-500 truncate">{userInfo?.email}</p>
                            </div>
                            <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-600 font-medium active:bg-red-50">Logout</button>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <h1 className="text-xl font-bold text-[#333]">NotesSnipt</h1>
                </div>
                <div ref={searchRef} className="relative">
                    <button onClick={() => setShowMobileSearch(!showMobileSearch)} className="w-10 h-10 rounded-full bg-[#EDF0F8] flex items-center justify-center text-[#7C89B3] active:scale-95">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    </button>
                    {showMobileSearch && (
                        <div className="absolute right-0 top-full mt-2 w-[75vw] bg-white rounded-xl shadow-2xl border border-blue-100 p-2 z-[60]">
                            <input type="text" className="w-full px-4 py-2 rounded-lg bg-slate-50 border-none outline-none text-sm" placeholder="Search title..." value={search} onChange={(e) => setSearch(e.target.value)} autoFocus />
                        </div>
                    )}
                </div>
            </div>
            <div className="px-4 pb-3 flex items-center gap-2">
                <button onClick={() => navigate('/CreateNote')} className="flex-1 bg-[#7D93D1] text-white py-2 rounded-full font-bold text-xs uppercase flex items-center justify-center gap-1 shadow-md active:scale-95">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Create Note
                </button>
                <button onClick={() => setIsMyNotesOnly(!isMyNotesOnly)} className={`flex-1 py-2 rounded-full font-bold text-xs uppercase transition-all shadow-sm flex items-center justify-center gap-1 ${isMyNotesOnly ? 'bg-blue-600 text-white' : 'bg-white text-[#6B7280] border border-gray-200'}`}>
                    {isMyNotesOnly && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                    {isMyNotesOnly ? "Showing My Notes" : "My Notes"}
                </button>
            </div>
        </div>

        <main className="max-w-7xl mx-auto p-4 md:p-6 pt-36 md:pt-28">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredNotes.map((note) => {
              const isOwner = note.user === userInfo?.id;
              return (
                <div key={note.id} className="group relative bg-white/70 backdrop-blur-sm p-6 border rounded-2xl shadow-sm hover:shadow-xl transition-all cursor-pointer" onClick={() => setSelectedNote(note)}>
                  {isOwner && (
                    <div className="absolute top-4 right-4 flex gap-2 z-20 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); openEditMode(note); }} className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-colors shadow-sm"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                      <button onClick={(e) => { e.stopPropagation(); setDeleteId(note.id); }} className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-colors shadow-sm"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                    </div>
                  )}
                  <h2 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2 pr-10 group-hover:text-[#6C92F4] transition-colors">{note.title}</h2>
                  <p className="text-sm text-slate-500 line-clamp-3 italic mb-4">{note.description || "No description."}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${isOwner ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}>
                      {isOwner ? 'My Snipt' : 'Community'}
                    </span>
                    <div className="text-xs font-semibold text-[#6C92F4]">View Snippet →</div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* VIEW MODAL (Original Restored) */}
      {selectedNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setSelectedNote(null)} />
          <div className="relative z-10 flex flex-col w-11/12 max-w-5xl h-[85vh] bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 animate-[fadeIn_0.2s_ease-out]" onClick={(e) => e.stopPropagation()}>
            <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-slate-800 truncate">{selectedNote.title}</h2>
                <p className="text-xs text-slate-400 mt-1 truncate max-w-md">{selectedNote.description || "Snippet details"}</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleCopy} className="px-4 py-2 bg-gray-50 text-slate-600 rounded-lg text-xs font-bold hover:bg-[#6C92F4] hover:text-white transition-all shadow-sm">{copyStatus}</button>
                <button onClick={() => setSelectedNote(null)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto bg-[#1e1e1e]">
              <div className="p-8 min-h-full">
                <pre className="!bg-transparent !m-0 !p-0"><code className="language-javascript text-sm font-mono leading-relaxed text-gray-300">{selectedNote.content}</code></pre>
              </div>
            </div>
            <div className="shrink-0 flex justify-between items-center px-6 py-3 bg-white border-t border-gray-100 text-xs font-medium">
                <div className="flex items-center gap-4 text-slate-400">
                  <span className="flex items-center gap-1.5 uppercase tracking-wider"><span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>Read Only</span>
                  <span>UTF-8 Encoding</span>
                </div>
                <button onClick={() => setSelectedNote(null)} className="text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors font-bold uppercase tracking-wider">
                  Close Window <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-bold ml-1">ESC</span>
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Popup */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-gray-100 animate-[fadeIn_0.2s_ease-out]">
            <h3 className="text-lg font-bold text-slate-800">Delete Snippet?</h3>
            <p className="text-sm text-slate-500">This action cannot be undone.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-slate-600 font-bold text-sm">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;