import React, { useState, useEffect } from "react";
// import api from "../utils/api";
import { adminApi } from "../utils/api";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [expandedUser, setExpandedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adminInitials, setAdminInitials] = useState("");
  const [adminInfo, setAdminInfo] = useState(null);

  // --- PAGINATION & SEARCH STATES ---
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("userDetails");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setAdminInfo(user);
        if (user.full_name) {
          const names = user.full_name.split(" ");
          const initials = names.length > 1
            ? `${names[0][0]}${names[names.length - 1][0]}`
            : `${names[0][0]}${names[0][1] || ""}`;
          setAdminInitials(initials.toUpperCase());
        }
      } catch (e) { console.error("Admin data error", e); }
    }
    fetchAdminData();
  }, [currentPage, searchQuery]); // Re-fetch when page or search changes

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // Backend pagination handled here via query params
      const res = await adminApi.get(`/accounts/admin/users/?page=${currentPage}&search=${searchQuery}`);
      
      // Agar backend DRF Pagination use kar raha hai toh data 'results' mein hoga
      setUsers(res.data.results || res.data); 
      setTotalCount(res.data.count || res.data.length);
      setTotalPages(Math.ceil((res.data.count || 0) / 10)); // Assuming 10 per page
    } catch (err) {
      console.error("Admin Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // --- DELETE USER ---
  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure? This will remove the user and all their snippets!")) {
      try {
        await adminApi.delete(`/accounts/admin/user/${id}/delete/`);
        fetchAdminData();
      } catch (err) { alert("Error deleting user"); }
    }
  };

  // --- DELETE NOTE ---
  const handleDeleteNote = async (noteId) => {
    if (window.confirm("Delete this snippet permanently?")) {
      try {
        await adminApi.delete(`/accounts/admin/note/${noteId}/delete/`);
        fetchAdminData();
      } catch (err) { alert("Error deleting note"); }
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-200 relative bg-[#0f172a] flex flex-col transition-all">
      <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-600 opacity-10 blur-[80px] pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-600 opacity-10 blur-[100px] pointer-events-none" />

      {/* --- HEADER --- */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#1e293b]/80 backdrop-blur-md border-b border-white/10 px-8 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center relative">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-lg shadow-indigo-500/20">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h1 className="text-xl font-black tracking-tight text-white uppercase italic">NotesSnipt <span className="text-indigo-400 text-sm not-italic ml-2 font-bold tracking-widest uppercase">Admin</span></h1>
          </div>

          {adminInitials && (
            <div className="relative group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 font-bold text-sm cursor-pointer transition-transform group-hover:scale-105 shadow-sm">
                {adminInitials}
              </div>
              <div className="absolute right-0 top-full mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                <div className="bg-[#1e293b] rounded-xl shadow-xl border border-white/10 overflow-hidden">
                  <div className="px-5 py-4 border-b border-white/5 bg-white/5">
                    <p className="text-sm font-bold text-white truncate">{adminInfo?.full_name}</p>
                    <p className="text-xs text-slate-400 truncate">{adminInfo?.email}</p>
                  </div>
                  <button onClick={handleLogout} className="w-full text-left px-5 py-3 text-sm text-red-400 font-semibold hover:bg-red-500/10 transition-colors flex items-center gap-2.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto w-full p-8 pt-28">
        
        {/* --- CONTROLS: SEARCH & STATS --- */}
        <div className="flex flex-col md:flex-row gap-6 mb-8 items-end">
          <div className="flex-1 w-full">
            <label className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] mb-2 block ml-1">Search Database</label>
            <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search users by name or email..." 
                  className="w-full bg-[#1e293b]/60 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:border-indigo-500 outline-none transition-all"
                  value={searchQuery}
                  onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}}
                />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
          </div>
          <div className="bg-[#1e293b]/60 backdrop-blur-xl px-8 py-3 rounded-2xl border border-white/5 shadow-xl min-w-[150px]">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Results</p>
            <h3 className="text-xl font-black text-indigo-400">{totalCount}</h3>
          </div>
        </div>

        {/* --- MAIN USERS TABLE --- */}
        <div className="bg-[#1e293b]/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-slate-400 text-[10px] uppercase tracking-widest font-black border-b border-white/5">
                  <th className="px-6 py-5">User Profile</th>
                  <th className="px-6 py-5">Network Identifier</th>
                  <th className="px-6 py-5">Access Status</th>
                  <th className="px-6 py-5 text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                    <tr><td colSpan="4" className="py-20 text-center text-slate-500 animate-pulse font-bold tracking-widest uppercase text-xs">Accessing Records...</td></tr>
                ) : (
                  users.map((user) => (
                    <React.Fragment key={user.id}>
                      <tr 
                        className={`hover:bg-indigo-500/5 transition-all cursor-pointer ${expandedUser === user.id ? 'bg-indigo-500/10' : ''}`}
                        onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-indigo-400 font-black border border-white/10 shadow-inner">
                              {user.full_name?.[0]}
                            </div>
                            <span className="font-black text-white text-sm tracking-wide">{user.full_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm text-slate-400 font-medium">{user.email}</td>
                        <td className="px-6 py-5">
                          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">Authorized</span>
                        </td>
                        <td className="px-6 py-5 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                          <button className="p-2 text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all" title="Edit User Profile">
                             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          </button>
                          <button onClick={() => handleDeleteUser(user.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all" title="Terminate User Access">
                             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                          </button>
                        </td>
                      </tr>

                      {expandedUser === user.id && (
                        <tr>
                          <td colSpan="4" className="px-10 py-8 bg-black/20 border-y border-white/5">
                            <div className="animate-[fadeIn_0.3s_ease-out]">
                              <div className="flex items-center gap-3 mb-6">
                                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Encrypted User Snippets ({user.notes?.length || 0})</h4>
                                <div className="h-px bg-indigo-500/20 flex-1"></div>
                              </div>
                              
                              {user.notes && user.notes.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                  {user.notes.map((note) => (
                                    <div key={note.id} className="bg-[#1e293b]/60 p-6 rounded-3xl border border-white/5 hover:border-indigo-500/30 transition-all shadow-lg group relative">
                                      <h5 className="font-black text-white text-sm mb-2">{note.title}</h5>
                                      <p className="text-[11px] text-slate-500 line-clamp-2 italic mb-4 leading-relaxed">{note.description || "No metadata provided."}</p>
                                      <div className="flex justify-end gap-4 border-t border-white/5 pt-4">
                                        <button className="text-[10px] font-black text-indigo-400 hover:text-white uppercase tracking-widest">Edit</button>
                                        <button onClick={() => handleDeleteNote(note.id)} className="text-[10px] font-black text-red-500 hover:text-white uppercase tracking-widest">Delete</button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs text-slate-500 italic font-medium text-center py-4">No snippet records found for this entity.</p>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* --- PAGINATION UI --- */}
          <div className="px-8 py-5 border-t border-white/5 flex items-center justify-between bg-white/5">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Page {currentPage} of {totalPages || 1}</p>
              <div className="flex gap-2">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="px-4 py-2 bg-indigo-500/10 border border-white/5 rounded-xl text-[10px] font-black uppercase text-indigo-400 disabled:opacity-20 hover:bg-indigo-500 hover:text-white transition-all"
                  >
                    Previous
                  </button>
                  <button 
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="px-4 py-2 bg-indigo-500/10 border border-white/5 rounded-xl text-[10px] font-black uppercase text-indigo-400 disabled:opacity-20 hover:bg-indigo-500 hover:text-white transition-all"
                  >
                    Next
                  </button>
              </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;