"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { FiUpload, FiEdit, FiTrash2, FiLoader, FiAlertCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function MyStartupPage() {
  const { data: session } = authClient.useSession();
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });
  const [isEditing, setIsEditing] = useState(false); 
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // ডিলিট পারমিশন স্টেট
  
  const [formData, setFormData] = useState({
    name: "",          
    logo: "",          
    industry: "",      
    fundingStage: "",  
    description: "",   
    founderEmail: "",  
  });

  const IMGBB_API_KEY = "970abc38b137d87cc59368c9a1e16fde"; 

  useEffect(() => {
    if (session?.user?.email && !formData.founderEmail) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData((prev) => ({ ...prev, founderEmail: session.user.email }));
    }
  }, [session]);

  useEffect(() => {
    if (session?.user?.email) {
      fetch(`http://localhost:5000/api/startups/${session.user.email}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setStartup(data.data);
            setFormData(data.data);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [session]);

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setStatusMsg({ type: "", text: "" });
    
    const bodyFormData = new FormData();
    bodyFormData.append("image", file);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: bodyFormData,
      });
      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, logo: data.data.url }));
        setStatusMsg({ type: "success", text: "Logo uploaded successfully!" });
      } else {
        setStatusMsg({ type: "error", text: data.error?.message || "Logo upload failed!" });
      }
    } catch (error) {
      setStatusMsg({ type: "error", text: "Network error during logo upload." });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.logo) return setStatusMsg({ type: "error", text: "Please upload a logo first!" });

    setIsUploading(true);
    setStatusMsg({ type: "", text: "" });

    const url = isEditing 
      ? `http://localhost:5000/api/startups/${startup._id}`
      : "http://localhost:5000/api/startups";
      
    const method = isEditing ? "PUT" : "POST";

    const payload = {
      ...formData,
      status: "pending", 
    };

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setStartup(data.data);
        setIsEditing(false); 
        setStatusMsg({ 
          type: "success", 
          text: isEditing ? "Startup profile updated successfully!" : "Startup profile created successfully!" 
        });
      } else {
        setStatusMsg({ type: "error", text: data.message });
      }
    } catch (error) {
      setStatusMsg({ type: "error", text: "Failed to connect to the server." });
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    e.target.blur(); // বাটন ক্লিক হওয়ার পর ফোকাস রিমুভ করার জন্য
    setIsEditing(true);
  };

  // ডিলিট কনফার্ম করার পর আসল এপিআই কল
  const handleConfirmDelete = async () => {
    setShowDeleteConfirm(false);
    try {
      const res = await fetch(`http://localhost:5000/api/startups/${startup._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setStartup(null);
        setIsEditing(false);
        setFormData({ 
          name: "", 
          logo: "", 
          industry: "", 
          fundingStage: "", 
          description: "", 
          founderEmail: session?.user?.email || "" 
        });
        setStatusMsg({ type: "success", text: "Startup profile deleted successfully." });
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 110 } },
  };

  if (loading) return <div className="p-10 text-center dark:text-white">Loading...</div>;

  return (
    <motion.div 
      className="max-w-3xl mx-auto space-y-6 text-slate-900 dark:text-slate-100 relative"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      
      {/* 🚀 Header */}
      <motion.div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-5" variants={itemVariants}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Startup</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Create and manage your startup profile.</p>
        </div>
        
        <AnimatePresence mode="wait">
          {startup && !isEditing && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex gap-2"
            >
              {/* 🎯 Edit বাটন ফিক্সড (আউটলাইন ও ফোকাস রিং রিমুভড) */}
              <button 
                onClick={handleEditClick} 
                className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition focus:outline-none focus:ring-0 select-none active:scale-95"
              >
                <FiEdit /> Edit
              </button>
              {/* 🎯 Delete বাটনে ক্লিক করলে এখন পারমিশন বক্স আসবে */}
              <button 
                onClick={() => setShowDeleteConfirm(true)} 
                className="flex items-center gap-2 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer shadow-sm hover:bg-rose-100 dark:hover:bg-rose-900/40 transition focus:outline-none focus:ring-0 active:scale-95"
              >
                <FiTrash2 /> Delete
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 🛑 Modern Delete Confirmation Modal/Box */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 rounded-2xl shadow-xl space-y-4"
            >
              <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
                <div className="p-3 bg-rose-50 dark:bg-rose-950/30 rounded-xl">
                  <FiTrash2 size={24} />
                </div>
                <h3 className="text-lg font-bold">Delete Startup Profile?</h3>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Are you absolutely sure you want to delete your startup profile? This action cannot be undone and all data will be permanently removed.
              </p>
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  className="w-1/2 border border-slate-200 dark:border-slate-800 py-2.5 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition text-sm cursor-pointer focus:outline-none"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmDelete}
                  className="w-1/2 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl font-semibold shadow-md transition text-sm cursor-pointer focus:outline-none"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Message Alert */}
      {statusMsg.text && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-2 ${
            statusMsg.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
          }`}
        >
          <FiAlertCircle size={18} />
          <span>{statusMsg.text}</span>
        </motion.div>
      )}

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {!startup || isEditing ? (
          
          /* 📝 1st State: Create / Edit Startup Form */
          <motion.div
            key="create-form-card"
            variants={itemVariants}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 md:p-8 shadow-sm"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <motion.h2 variants={itemVariants} className="text-lg font-bold flex items-center gap-2">
                <span className="text-indigo-600">{isEditing ? "📝" : "+"}</span> {isEditing ? "Edit Startup Profile" : "Create Startup"}
              </motion.h2>
              
              {/* Field 1: Startup Name */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Startup Name *</label>
                <input 
                  type="text" required placeholder="e.g. TechNova"
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none transition bg-slate-50/50 dark:bg-slate-950"
                />
              </motion.div>

              {/* Field 2: Founder Email */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Founder Email *</label>
                <input 
                  type="email" required placeholder="e.g. founder@company.com"
                  value={formData.founderEmail} onChange={(e) => setFormData({...formData, founderEmail: e.target.value})}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none transition bg-slate-50/50 dark:bg-slate-950"
                />
              </motion.div>

              {/* Field 3: Logo */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Logo Image *</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center justify-center gap-2 border border-dashed border-indigo-300 dark:border-slate-700 bg-indigo-50/50 dark:bg-slate-950 px-5 py-3 rounded-xl text-sm font-medium text-indigo-600 dark:text-indigo-400 cursor-pointer w-full text-center hover:bg-indigo-100/50 dark:hover:bg-slate-900 transition">
                    <FiUpload /> {isUploading ? "Uploading..." : formData.logo ? "Change Logo" : "Upload Logo"}
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                  {formData.logo && (
                    <motion.img 
                      initial={{ scale: 0.8, opacity: 0 }} 
                      animate={{ scale: 1, opacity: 1 }}
                      src={formData.logo} alt="Preview" 
                      className="h-12 w-12 rounded-xl border border-slate-200 dark:border-slate-800 object-cover shadow-sm" 
                    />
                  )}
                </div>
              </motion.div>

              {/* Two Column Layout for Dropdowns */}
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
                {/* Field 4: Industry */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Industry *</label>
                  <select required value={formData.industry} onChange={(e) => setFormData({...formData, industry: e.target.value})} className="w-full rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none transition bg-slate-50/50 dark:bg-slate-950 font-medium text-slate-700 dark:text-slate-300">
                    <option value="">Select industry</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="SaaS">SaaS</option>
                    <option value="Fintech">Fintech</option>
                    <option value="AI/ML">AI/ML</option>
                  </select>
                </motion.div>

                {/* Field 5: Funding Stage */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Funding Stage *</label>
                  <select required value={formData.fundingStage} onChange={(e) => setFormData({...formData, fundingStage: e.target.value})} className="w-full rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none transition bg-slate-50/50 dark:bg-slate-950 font-medium text-slate-700 dark:text-slate-300">
                    <option value="">Select stage</option>
                    <option value="Idea">Idea / Bootstrapped</option>
                    <option value="Pre-Seed">Pre-Seed</option>
                    <option value="Seed">Seed</option>
                    <option value="Series A">Series A+</option>
                  </select>
                </motion.div>
              </div>

              {/* Field 6: Description */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Description *</label>
                <textarea required rows={4} placeholder="Describe your startup, mission, and what you're building..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none transition bg-slate-50/50 dark:bg-slate-950" />
              </motion.div>

              {/* Submit / Cancel Buttons */}
              <div className="flex gap-3">
                {isEditing && (
                  <button type="button" onClick={() => setIsEditing(false)} className="w-1/3 border border-slate-200 dark:border-slate-800 py-3.5 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-900 transition text-sm cursor-pointer">
                    Cancel
                  </button>
                )}
                <motion.div 
                  className={isEditing ? "w-2/3" : "w-full"}
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <button type="submit" disabled={isUploading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed text-sm">
                    {isUploading ? <FiLoader className="animate-spin" /> : null} 
                    <span>{isUploading ? "Saving..." : isEditing ? "Update Startup" : "Create Startup"}</span>
                  </button>
                </motion.div>
              </div>
            </form>
          </motion.div>
        ) : (
          
          /* 📋 2nd State: Startup Details Card */
          <motion.div
            key="details-card"
            variants={itemVariants}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 md:p-8 shadow-sm"
          >
            <div className="flex items-start gap-4">
              <img src={startup.logo} alt={startup.name} className="h-16 w-16 rounded-2xl border border-slate-200 dark:border-slate-800 object-cover shadow-sm" />
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">{startup.name}</h2>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-lg border border-indigo-100 dark:border-indigo-900/30">{startup.industry}</span>
                  <span className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-lg">{startup.fundingStage}</span>
                  <span className="text-xs font-bold bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-lg border border-amber-200/30 capitalize">{startup.status}</span>
                </div>
              </div>
            </div>
            
            <p className="mt-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{startup.description}</p>
            
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              <strong>Founder Email:</strong> {startup.founderEmail}
            </div>

            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, type: "spring" }}
              className="mt-6 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/40 rounded-xl p-4 text-xs font-medium text-amber-700 dark:text-amber-400 flex items-center gap-2"
            >
              ⏳ Your startup is pending admin approval before it appears publicly.
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}