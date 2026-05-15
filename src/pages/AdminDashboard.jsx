import React, { useState, useEffect, useCallback } from "react";
import { adminApi, openApi } from "../utils/api";
import { useNavigate } from "react-router-dom";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-css";
import "prismjs/components/prism-python";
import "prismjs/components/prism-json";

// ------------------------------------------------------------------
// Toast Notification Component
// ------------------------------------------------------------------
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "error" ? "bg-red-500" : type === "success" ? "bg-green-500" : "bg-blue-500";
  return (
    <div className="fixed top-20 right-4 z-[200] animate-[slideIn_0.3s_ease-out]">
      <div className={`${bgColor} text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3`}>
        {type === "error" && (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        )}
        {type === "success" && (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
        )}
        {type === "info" && (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        )}
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------
// Loading Skeleton
// ------------------------------------------------------------------
const UserTableSkeleton = () => (
  <div className="bg-white rounded-xl shadow overflow-hidden">
    <div className="animate-pulse">
      <div className="h-12 bg-gray-200" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 border-t">
          <div className="flex-1 h-5 bg-gray-200 rounded" />
          <div className="w-24 h-5 bg-gray-200 rounded" />
          <div className="w-20 h-5 bg-gray-200 rounded" />
          <div className="w-36 h-8 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  </div>
);

// ------------------------------------------------------------------
// Edit Note Screen
// ------------------------------------------------------------------
const EditNoteScreen = ({ note, onBack, onSave }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setDescription(note.description || "");
      setContent(note.content);
    }
  }, [note]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(note.id, { title, description, content });
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onBack();
      }, 1000);
    } catch (err) {
      // Error handled by parent
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full font-sans text-slate-800 relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-400 opacity-20 blur-[80px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-400 opacity-20 blur-[100px] pointer-events-none" />

      <div className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-white/50 shadow-sm px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="group flex items-center px-4 py-2 text-sm font-medium text-slate-600 bg-white/50 border border-slate-200 rounded-lg shadow-sm hover:bg-white hover:text-slate-800 transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-xl font-bold text-slate-800">Editing Snippet (Admin)</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pt-24 pb-12 p-6 flex items-start justify-center relative z-10">
        <div className="w-full max-w-2xl">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-[#6C92F4] w-full" />
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Title *</label>
                <input type="text" required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 outline-none transition-all focus:ring-2 focus:ring-blue-100 shadow-sm" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                <textarea rows="2" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none shadow-sm" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Code / Content</label>
                <div className="relative">
                  <textarea required rows="12" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-[#1e1e1e] text-gray-200 font-mono text-sm focus:border-[#6C92F4] focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-inner" value={content} onChange={(e) => setContent(e.target.value)} spellCheck="false" />
                  <span className="absolute top-2 right-4 text-xs text-gray-500 font-mono">{content.length} chars</span>
                </div>
              </div>
              <div className="flex items-center gap-4 pt-4">
                <button type="button" onClick={onBack} className="flex-1 px-6 py-3 rounded-xl border border-gray-300 text-slate-600 font-medium hover:bg-gray-50 transition-all bg-white">Cancel</button>
                <button type="submit" disabled={loading || showSuccess} className={`flex-1 px-6 py-3 rounded-xl text-white font-medium shadow-lg transition-all bg-gradient-to-r from-blue-500 to-[#6C92F4] hover:-translate-y-0.5 ${loading ? "opacity-50" : ""}`}>{loading ? "Updating..." : "Update Snippet"}</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center justify-center animate-[fadeIn_0.3s_ease-out] border border-gray-100">
            <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800">Changes Saved!</h3>
            <p className="text-slate-500 text-sm mt-1">Snippet updated successfully.</p>
          </div>
        </div>
      )}
    </div>
  );
};

// ------------------------------------------------------------------
// View Note Modal (same as Home component)
// ------------------------------------------------------------------
const ViewNoteModal = ({ note, onClose }) => {
  const [copyStatus, setCopyStatus] = useState("Copy");

  useEffect(() => {
    if (note) {
      setTimeout(() => Prism.highlightAll(), 100);
    }
  }, [note]);

  const handleCopy = () => {
    if (note?.content) {
      navigator.clipboard.writeText(note.content);
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus("Copy"), 1500);
    }
  };

  if (!note) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative z-10 flex flex-col w-11/12 max-w-5xl h-[85vh] bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 animate-[fadeIn_0.2s_ease-out]" onClick={(e) => e.stopPropagation()}>
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-slate-800 truncate">{note.title}</h2>
            <p className="text-xs text-slate-400 mt-1 truncate max-w-md">{note.description || "Snippet details"}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleCopy} className="px-4 py-2 bg-gray-50 text-slate-600 rounded-lg text-xs font-bold hover:bg-[#6C92F4] hover:text-white transition-all shadow-sm">
              {copyStatus}
            </button>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#1e1e1e]">
          <div className="p-8 min-h-full">
            <pre className="!bg-transparent !m-0 !p-0">
              <code className="language-javascript text-sm font-mono leading-relaxed text-gray-300">
                {note.content}
              </code>
            </pre>
          </div>
        </div>

        <div className="shrink-0 flex justify-between items-center px-6 py-3 bg-white border-t border-gray-100 text-xs font-medium">
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5 uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
              Read Only
            </span>
            <span>UTF-8 Encoding</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors font-bold uppercase tracking-wider">
            Close Window <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-bold ml-1">ESC</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------
// Confirmation Popup (reusable, with colour based on action type)
// ------------------------------------------------------------------
const ConfirmPopup = ({ isOpen, title, message, onConfirm, onCancel, type = "warning" }) => {
  if (!isOpen) return null;
  
  const isSuccess = type === "success";
  const bgColor = isSuccess ? "bg-green-50" : "bg-red-50";
  const iconColor = isSuccess ? "text-green-500" : "text-red-500";
  const buttonBg = isSuccess ? "bg-green-500 hover:bg-green-600 shadow-green-100" : "bg-red-500 hover:bg-red-600 shadow-red-100";
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-gray-100 animate-[fadeIn_0.2s_ease-out]">
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center ${iconColor} shrink-0`}>
            {isSuccess ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
              </svg>
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
            <p className="text-sm text-slate-500">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-slate-600 font-bold text-sm hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className={`flex-1 px-4 py-2.5 rounded-xl text-white font-bold text-sm shadow-lg transition-all ${buttonBg}`}>
            Yes, Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------
// Main Admin Component
// ------------------------------------------------------------------
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [view, setView] = useState("list");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminInitials, setAdminInitials] = useState("");
  const [currentAdminId, setCurrentAdminId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState(null);
  const itemsPerPage = 5;

  const [noteFilter, setNoteFilter] = useState("all");
  const [viewingNote, setViewingNote] = useState(null);

  const [editingNote, setEditingNote] = useState(null);
  const [popup, setPopup] = useState({ isOpen: false, title: "", message: "", onConfirm: null, type: "warning" });
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });

  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "info" }), 2000);
  };

  // ------------------------------------------------------------------
  // Data fetching
  // ------------------------------------------------------------------
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.get("/accounts/admin/users/");
      let usersData = response.data;
      if (!Array.isArray(usersData)) {
        if (usersData.results) usersData = usersData.results;
        else if (usersData.users) usersData = usersData.users;
        else if (usersData.data) usersData = usersData.data;
        else throw new Error("Unexpected API response");
      }
      const processed = usersData.map((user) => ({
        ...user,
        is_active: user.is_active !== undefined ? user.is_active : true,
        is_verified: user.is_verified !== undefined ? user.is_verified : false,
        is_admin: user.is_admin !== undefined ? user.is_admin : false,
        notes: user.notes || [],
      }));
      setUsers(processed);
    } catch (err) {
      setError(err.message);
      showToast("Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserDetails = useCallback(async (userId) => {
    setLoading(true);
    try {
      const response = await adminApi.get("/accounts/admin/users/");
      let usersData = response.data;
      if (!Array.isArray(usersData)) {
        if (usersData.results) usersData = usersData.results;
        else if (usersData.users) usersData = usersData.users;
      }
      const user = usersData.find((u) => u.id === userId);
      if (!user) throw new Error("User not found");
      setSelectedUser({
        ...user,
        notes: user.notes || [],
        is_active: user.is_active !== undefined ? user.is_active : true,
        is_verified: user.is_verified !== undefined ? user.is_verified : false,
        is_admin: user.is_admin !== undefined ? user.is_admin : false,
      });
      setNoteFilter("all");
    } catch (err) {
      setError(err.message);
      showToast("Failed to fetch user details", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem("userDetails");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setAdminName(user.full_name || user.email || "Admin");
        setAdminEmail(user.email || "");
        setCurrentAdminId(user.id);
        if (user.full_name) {
          const names = user.full_name.split(" ");
          const initials = names.length > 1 ? `${names[0][0]}${names[names.length - 1][0]}` : `${names[0][0]}${names[0][1] || ""}`;
          setAdminInitials(initials.toUpperCase());
        }
      } catch (e) {}
    }
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (view === "detail" && selectedUserId) {
      fetchUserDetails(selectedUserId);
    }
  }, [view, selectedUserId, fetchUserDetails]);

  // ------------------------------------------------------------------
  // User actions (with correct popup colours)
  // ------------------------------------------------------------------
  const handleUpdateUser = async (userId, isActive, userName) => {
    if (userId === currentAdminId) {
      showToast("You cannot change the status of your own admin account.", "error");
      return;
    }
    const action = isActive ? "activate" : "deactivate";
    const popupType = action === "activate" ? "success" : "warning";
    setPopup({
      isOpen: true,
      type: popupType,
      title: `${action === "activate" ? "Activate" : "Deactivate"} User?`,
      message: `Are you sure you want to ${action} user "${userName}"?`,
      onConfirm: async () => {
        try {
          await adminApi.put(`/accounts/admin/user/${userId}/update/`, { is_active: isActive });
          await fetchUsers();
          showToast(`User ${action}d successfully!`, "success");
        } catch (err) {
          showToast(`You cannot change the status of your own admin account.`, "error");
        }
        setPopup({ isOpen: false, title: "", message: "", onConfirm: null, type: "warning" });
      },
    });
  };

  const handleDeleteUser = async (userId, userName) => {
    if (userId === currentAdminId) {
      showToast("You cannot delete your own admin account.", "error");
      return;
    }
    setPopup({
      isOpen: true,
      type: "warning",
      title: "Delete User?",
      message: `User "${userName}" and all their snippets will be permanently removed.`,
      onConfirm: async () => {
        try {
          await adminApi.delete(`/accounts/admin/user/${userId}/delete/`);
          if (view === "detail" && selectedUser?.id === userId) setView("list");
          await fetchUsers();
          showToast("User deleted successfully!", "success");
        } catch (err) {
          showToast("You cannot delete your own admin account.", "error");
        }
        setPopup({ isOpen: false, title: "", message: "", onConfirm: null, type: "warning" });
      },
    });
  };

  // ------------------------------------------------------------------
  // Note actions
  // ------------------------------------------------------------------
  const handleUpdateNote = async (noteId, updatedData) => {
    try {
      await adminApi.put(`/notesapp/admin/note/${noteId}/update/`, updatedData);
      if (view === "detail" && selectedUser) {
        await fetchUserDetails(selectedUser.id);
      } else {
        await fetchUsers();
      }
      showToast("Note updated successfully!", "success");
    } catch (err) {
      showToast("Failed to update note", "error");
      throw err;
    }
  };

  const handleSoftDeleteNote = async (noteId, noteTitle) => {
    setPopup({
      isOpen: true,
      type: "warning",
      title: "Move to Trash?",
      message: `Snippet "${noteTitle}" will be moved to trash. You can restore it later.`,
      onConfirm: async () => {
        try {
          await adminApi.delete(`/notesapp/admin/note/${noteId}/delete/`);
          if (view === "detail" && selectedUser) await fetchUserDetails(selectedUser.id);
          else await fetchUsers();
          showToast("Note moved to trash", "success");
        } catch (err) {
          showToast("Failed to delete note", "error");
        }
        setPopup({ isOpen: false, title: "", message: "", onConfirm: null, type: "warning" });
      },
    });
  };

  const handleRestoreNote = async (noteId, noteTitle) => {
    setPopup({
      isOpen: true,
      type: "success",
      title: "Restore Snippet?",
      message: `Snippet "${noteTitle}" will be restored from trash.`,
      onConfirm: async () => {
        try {
          await adminApi.patch(`/notesapp/admin/note/${noteId}/restore/`);
          if (view === "detail" && selectedUser) await fetchUserDetails(selectedUser.id);
          else await fetchUsers();
          showToast("Note restored successfully!", "success");
        } catch (err) {
          showToast("Failed to restore note", "error");
        }
        setPopup({ isOpen: false, title: "", message: "", onConfirm: null, type: "warning" });
      },
    });
  };

  const handlePermanentDeleteNote = async (noteId, noteTitle) => {
    setPopup({
      isOpen: true,
      type: "warning",
      title: "Permanently Delete?",
      message: `Snippet "${noteTitle}" will be permanently removed and cannot be restored.`,
      onConfirm: async () => {
        try {
          await adminApi.delete(`/notesapp/admin/note/${noteId}/delete/`);
          if (view === "detail" && selectedUser) await fetchUserDetails(selectedUser.id);
          else await fetchUsers();
          showToast("Note permanently deleted", "success");
        } catch (err) {
          showToast("Failed to permanently delete note", "error");
        }
        setPopup({ isOpen: false, title: "", message: "", onConfirm: null, type: "warning" });
      },
    });
  };

  // ------------------------------------------------------------------
  // Helpers & filtering
  // ------------------------------------------------------------------
  const getNoteCounts = (user) => ({
    active: user.notes.filter((n) => !n.is_deleted).length,
    deleted: user.notes.filter((n) => n.is_deleted).length,
  });

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesFilter = true;
    if (activeFilter === "active") matchesFilter = u.is_active === true;
    else if (activeFilter === "inactive") matchesFilter = u.is_active === false;
    else if (activeFilter === "verified") matchesFilter = u.is_verified === true;
    else if (activeFilter === "unverified") matchesFilter = u.is_verified === false;
    else if (activeFilter === "admin") matchesFilter = u.is_admin === true;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilter]);

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.is_active).length;
  const inactiveUsers = users.filter((u) => !u.is_active).length;
  const verifiedUsers = users.filter((u) => u.is_verified).length;
  const unverifiedUsers = users.filter((u) => !u.is_verified).length;
  const adminUsers = users.filter((u) => u.is_admin).length;
  const totalNotes = users.reduce((sum, u) => sum + u.notes.length, 0);

  // ------------------------------------------------------------------
  // Logout - redirects to /control-center as requested
  // ------------------------------------------------------------------
  const handleLogout = async () => {
    const token = localStorage.getItem("admin_token") || localStorage.getItem("access_token");
    try {
      await openApi.post(
        "/accounts/admin/logout/",
        {},
        { headers: { Authorization: `Token ${token}` } }
      );
    } catch (err) {
      // silent fail – still clear local storage
      console.error("Logout API error", err);
    }
    // Clear all auth-related local storage
    localStorage.removeItem("admin_token");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("userDetails");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/control-center");   // ✅ Changed to control-center
  };

  const getCardClass = (filterValue) => {
    const baseClass = "bg-white p-5 rounded-2xl shadow-sm border transition-all cursor-pointer hover:shadow-md group";
    const activeClass = "ring-2 ring-blue-500 shadow-md bg-blue-50/30";
    if (activeFilter === filterValue) return `${baseClass} ${activeClass}`;
    return `${baseClass} border-gray-100`;
  };

  const getNoteFilterCardClass = (filterValue) => {
    const baseClass = "bg-white p-4 rounded-xl shadow-sm border transition-all cursor-pointer hover:shadow-md group flex-1";
    const activeClass = "ring-2 ring-blue-500 shadow-md bg-blue-50/30";
    if (noteFilter === filterValue) return `${baseClass} ${activeClass}`;
    return `${baseClass} border-gray-100`;
  };

  // ------------------------------------------------------------------
  // RENDER: User List View
  // ------------------------------------------------------------------
  const renderUserList = () => (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-5 mb-8">
        <div onClick={() => setActiveFilter(null)} className={getCardClass(null)}>
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-500">Total Users</p><p className="text-3xl font-bold text-gray-800">{totalUsers}</p></div>
            <div className="p-3 bg-blue-50 rounded-full group-hover:scale-105 transition"><svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg></div>
          </div>
        </div>
        <div onClick={() => setActiveFilter("active")} className={getCardClass("active")}>
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-500">Active</p><p className="text-3xl font-bold text-gray-800">{activeUsers}</p></div>
            <div className="p-3 bg-green-50 rounded-full group-hover:scale-105 transition"><svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
          </div>
        </div>
        <div onClick={() => setActiveFilter("inactive")} className={getCardClass("inactive")}>
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-500">Inactive</p><p className="text-3xl font-bold text-gray-800">{inactiveUsers}</p></div>
            <div className="p-3 bg-red-50 rounded-full group-hover:scale-105 transition"><svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg></div>
          </div>
        </div>
        <div onClick={() => setActiveFilter("verified")} className={getCardClass("verified")}>
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-500">Verified</p><p className="text-3xl font-bold text-gray-800">{verifiedUsers}</p></div>
            <div className="p-3 bg-indigo-50 rounded-full group-hover:scale-105 transition"><svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg></div>
          </div>
        </div>
        <div onClick={() => setActiveFilter("unverified")} className={getCardClass("unverified")}>
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-500">Unverified</p><p className="text-3xl font-bold text-gray-800">{unverifiedUsers}</p></div>
            <div className="p-3 bg-orange-50 rounded-full group-hover:scale-105 transition"><svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
          </div>
        </div>
        <div onClick={() => setActiveFilter("admin")} className={getCardClass("admin")}>
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-500">Admin</p><p className="text-3xl font-bold text-gray-800">{adminUsers}</p></div>
            <div className="p-3 bg-purple-50 rounded-full group-hover:scale-105 transition"><svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-500">Total Notes</p><p className="text-3xl font-bold text-gray-800">{totalNotes}</p></div>
            <div className="p-3 bg-amber-50 rounded-full group-hover:scale-105 transition"><svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Search by name or email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
        </div>
      </div>

      {loading && users.length === 0 ? (
        <UserTableSkeleton />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr><th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th><th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th><th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Active Notes</th><th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Deleted Notes</th><th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedUsers.map((user) => {
                  const { active, deleted } = getNoteCounts(user);
                  const isSelf = user.id === currentAdminId;
                  return (
                    <tr key={user.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap"><div className="font-medium text-gray-900">{user.full_name} {isSelf && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full ml-2">You</span>}</div><div className="text-sm text-gray-500">{user.email}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{user.is_active ? "Active" : "Inactive"}</span></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{active}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{deleted}</td>
                      <td className="px-6 py-4 whitespace-nowrap space-x-2">
                        <button onClick={() => { setSelectedUserId(user.id); setView("detail"); }} className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-lg hover:bg-blue-100 transition shadow-sm">View Notes</button>
                        {!isSelf && (
                          <>
                            <button onClick={() => handleUpdateUser(user.id, !user.is_active, user.full_name)} className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg transition shadow-sm ${user.is_active ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100" : "bg-green-50 text-green-700 hover:bg-green-100"}`}>{user.is_active ? "Deactivate" : "Activate"}</button>
                            <button onClick={() => handleDeleteUser(user.id, user.full_name)} className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 text-sm rounded-lg hover:bg-red-100 transition shadow-sm">Delete</button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {paginatedUsers.length === 0 && <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">No users found matching your search or filter.</td></tr>}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="px-6 py-3 bg-gray-50 border-t flex items-center justify-between">
              <div className="text-sm text-gray-600">Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users</div>
              <div className="flex gap-2">
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition">Previous</button>
                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition">Next</button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );

  // ------------------------------------------------------------------
  // RENDER: User Detail View
  // ------------------------------------------------------------------
  const renderUserDetail = () => {
    if (!selectedUser) return null;
    
    const allNotes = selectedUser.notes || [];
    const activeNotes = allNotes.filter((n) => !n.is_deleted);
    const deletedNotes = allNotes.filter((n) => n.is_deleted);
    
    let displayedNotes = [];
    if (noteFilter === "active") displayedNotes = activeNotes;
    else if (noteFilter === "deleted") displayedNotes = deletedNotes;
    else displayedNotes = allNotes;

    return (
      <>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setView("list")} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                <span>Back to Users</span>
              </button>
              <div><h1 className="text-xl font-bold text-gray-800">{selectedUser.full_name}</h1><p className="text-sm text-gray-500">{selectedUser.email}</p></div>
            </div>
            <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">{allNotes.length} total snippets</div>
          </div>
          
          <div className="flex gap-4 mt-2">
            <div onClick={() => setNoteFilter("all")} className={getNoteFilterCardClass("all")}>
              <div className="flex items-center justify-between">
                <div><p className="text-xs text-gray-500">All Notes</p><p className="text-2xl font-bold text-gray-800">{allNotes.length}</p></div>
                <div className="p-2 bg-gray-100 rounded-full"><svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg></div>
              </div>
            </div>
            <div onClick={() => setNoteFilter("active")} className={getNoteFilterCardClass("active")}>
              <div className="flex items-center justify-between">
                <div><p className="text-xs text-gray-500">Active Notes</p><p className="text-2xl font-bold text-green-600">{activeNotes.length}</p></div>
                <div className="p-2 bg-green-50 rounded-full"><svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
              </div>
            </div>
            <div onClick={() => setNoteFilter("deleted")} className={getNoteFilterCardClass("deleted")}>
              <div className="flex items-center justify-between">
                <div><p className="text-xs text-gray-500">Deleted Notes</p><p className="text-2xl font-bold text-red-600">{deletedNotes.length}</p></div>
                <div className="p-2 bg-red-50 rounded-full"><svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4 mt-6"><div className="bg-white p-6 rounded-xl shadow animate-pulse"><div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div><div className="space-y-3"><div className="h-20 bg-gray-100 rounded"></div><div className="h-20 bg-gray-100 rounded"></div></div></div></div>
        ) : (
          <div className="mt-6">
            {displayedNotes.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center text-gray-400">No notes to display.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayedNotes.map((note) => {
                  const isDeleted = note.is_deleted === true;
                  return (
                    <div key={note.id} className="group relative bg-white/70 backdrop-blur-sm p-5 border rounded-2xl shadow-sm hover:shadow-xl transition-all">
                      <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2 pr-10 group-hover:text-[#6C92F4] transition-colors">{note.title}</h3>
                      <p className="text-sm text-slate-500 line-clamp-3 italic mb-4">{note.description || "No description."}</p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${isDeleted ? 'bg-red-100 text-red-600 border border-red-200' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                          {isDeleted ? 'Deleted' : 'Active'}
                        </span>
                        <div className="flex gap-2">
                          <button onClick={(e) => { e.stopPropagation(); setViewingNote(note); }} className="p-1.5 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-300 transition-colors shadow-sm" title="View">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                          </button>
                          {!isDeleted && (
                            <>
                              <button onClick={(e) => { e.stopPropagation(); setEditingNote(note); }} className="p-1.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-colors shadow-sm" title="Edit">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); handleSoftDeleteNote(note.id, note.title); }} className="p-1.5 bg-red-50 text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-colors shadow-sm" title="Delete">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                              </button>
                            </>
                          )}
                          {isDeleted && (
                            <>
                              <button onClick={(e) => { e.stopPropagation(); handleRestoreNote(note.id, note.title); }} className="p-1.5 bg-green-50 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-colors shadow-sm" title="Restore">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); handlePermanentDeleteNote(note.id, note.title); }} className="p-1.5 bg-red-700/10 text-red-700 rounded-full hover:bg-red-700 hover:text-white transition-colors shadow-sm" title="Delete Permanently">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </>
    );
  };

  // ------------------------------------------------------------------
  // Main Render
  // ------------------------------------------------------------------
  if (editingNote) {
    return <EditNoteScreen note={editingNote} onBack={() => setEditingNote(null)} onSave={handleUpdateNote} />;
  }

  if (loading && view === "list" && users.length === 0) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  if (error && view === "list") {
    return <div className="min-h-screen bg-gray-100 p-8"><div className="bg-red-50 border-l-4 border-red-500 p-4 rounded"><p className="text-red-700">Error: {error}</p><button onClick={fetchUsers} className="mt-2 text-blue-600 hover:underline">Retry</button></div></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-white/50 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="text-[#6C92F4]"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg></div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">NotesSnipt <span className="text-indigo-400 text-xs font-mono ml-1">ADMIN</span></h1>
          </div>
          <div className="flex items-center gap-4">
            {adminInitials && (
              <div className="relative group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-sm tracking-wide cursor-pointer transition-transform group-hover:scale-105 shadow-sm">
                  {adminInitials}
                </div>
                <div className="absolute right-0 top-full mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                  <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                      <p className="text-sm font-bold text-slate-800 truncate">{adminName}</p>
                      <p className="text-xs text-slate-500 truncate">{adminEmail}</p>
                    </div>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-600 font-medium hover:bg-red-50 flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
        {view === "list" ? renderUserList() : renderUserDetail()}
      </main>

      <ConfirmPopup 
        isOpen={popup.isOpen} 
        title={popup.title} 
        message={popup.message} 
        onConfirm={popup.onConfirm} 
        onCancel={() => setPopup({ isOpen: false, title: "", message: "", onConfirm: null, type: "warning" })} 
        type={popup.type || "warning"} 
      />
      {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ show: false, message: "", type: "info" })} />}
      {viewingNote && <ViewNoteModal note={viewingNote} onClose={() => setViewingNote(null)} />}
    </div>
  );
};

export default AdminDashboard;