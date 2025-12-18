import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api'; 

const CreateNote = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: ''
  });

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
      await api.post('/notesapp/create/', formData);
      setShowSuccess(true); 
      setTimeout(() => {
        navigate('/'); 
      }, 1000);
    } catch (err) {
      console.error("Error creating note:", err);
      if (err.response && err.response.data) {
        if (err.response.data.title) setError(err.response.data.title[0]); 
        else if (err.response.data.detail) setError(err.response.data.detail);
        else setError("Failed to create note. Please try again.");
      } else {
        setError("Network error or server is down.");
      }
      setLoading(false);
    } 
  };

  return (
    // 1. MAIN CONTAINER: Fixed Height (h-screen) & Flex Column
    <div className="h-screen w-full font-sans text-slate-800 relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      
      {/* --- BACKGROUND BLOBS --- */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-400 opacity-20 blur-[80px] pointer-events-none mix-blend-multiply animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-400 opacity-20 blur-[100px] pointer-events-none mix-blend-multiply" />
      <div className="absolute top-[40%] left-[40%] w-[400px] h-[400px] rounded-full bg-indigo-300 opacity-20 blur-[90px] pointer-events-none" />

      {/* --- HEADER (Stays at Top) --- */}
      <div className="shrink-0 z-30 bg-white/80 backdrop-blur-md border-b border-white/50 shadow-sm px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
            <button 
              onClick={() => navigate('/')}
              className="
                group flex items-center px-4 py-2 
                text-sm font-medium text-slate-600 
                bg-white/50 backdrop-blur-sm border border-slate-200 rounded-lg shadow-sm
                hover:bg-white hover:text-slate-800 hover:shadow-md
                transition-all duration-200
              "
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back to Notes
            </button>
            <h1 className="text-xl font-bold text-slate-800">Add Snippet</h1>
        </div>
      </div>

      {/* 2. SCROLLABLE CONTENT AREA (Hide Scrollbar Classes Applied Here) */}
      <div className="
        flex-1 relative z-10 
        overflow-y-auto                         /* Enable Scrolling */
        [&::-webkit-scrollbar]:hidden           /* Hide Scrollbar (Chrome/Safari) */
        [-ms-overflow-style:'none']             /* Hide Scrollbar (IE/Edge) */
        [scrollbar-width:'none']                /* Hide Scrollbar (Firefox) */
      ">
        
        <div className="p-6 flex items-center justify-center min-h-full">
          <div className="w-full max-w-2xl">
            
            {/* Form Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden">
              
              <div className="h-2 bg-gradient-to-r from-blue-500 to-[#6C92F4] w-full"></div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                
                {/* Error Message */}
                {error && (
                  <div className="flex items-center bg-red-50/90 text-red-600 px-4 py-3 rounded-lg text-sm border border-red-200 animate-pulse">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span className="font-medium">{error}</span>
                  </div>
                )}

                {/* Title Input */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Title (e.g. React Custom Hooks)"
                    className={`w-full px-4 py-3 rounded-xl border bg-white/50 text-slate-800 outline-none transition-all focus:bg-white focus:ring-2 shadow-sm
                      ${error && error.toLowerCase().includes('title') 
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-100' 
                        : 'border-slate-200 focus:border-[#6C92F4] focus:ring-blue-100'
                      }`}
                  />
                </div>

                {/* Description Input */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows="2"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Short summary of what this code does..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 text-slate-800 focus:bg-white focus:border-[#6C92F4] focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none shadow-sm"
                  />
                </div>

                {/* Content (Code) Input - Also Hidden Scrollbar */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Code / Content
                  </label>
                  <div className="relative">
                    <textarea
                      name="content"
                      required
                      rows="10"
                      value={formData.content}
                      onChange={handleChange}
                      placeholder="// Paste your code here..."
                      className="
                        w-full px-4 py-3 rounded-xl border border-slate-200 bg-[#1e1e1e] text-gray-200 font-mono text-sm 
                        focus:border-[#6C92F4] focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-inner
                        [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] /* Hides Scrollbar inside Textarea */
                      "
                    />
                    <span className="absolute top-2 right-4 text-xs text-gray-500 font-mono">
                       {formData.content.length} chars
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="flex-1 px-6 py-3 rounded-xl border border-gray-300 text-slate-600 font-medium hover:bg-gray-50 transition-all bg-white/50"
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    disabled={loading || showSuccess}
                    className={`flex-1 px-6 py-3 rounded-xl text-white font-medium shadow-lg hover:shadow-blue-200 transition-all ${
                      loading || showSuccess
                        ? 'bg-blue-300 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-500 to-[#6C92F4] hover:-translate-y-0.5'
                    }`}
                  >
                    {loading || showSuccess ? 'Saving...' : 'Save Snippet'}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center justify-center animate-[fadeIn_0.3s_ease-out] border border-gray-100">
            <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
               </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800">Snippet Saved!</h3>
            <p className="text-slate-500 text-sm mt-1">Redirecting to home...</p>
          </div>
        </div>
      )}

    </div>
  );
};

export default CreateNote;