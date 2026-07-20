"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiEdit2, FiTrash2, FiX, FiCheck, FiAlertCircle, 
  FiBriefcase, FiCpu, FiClock, FiCalendar, FiLoader 
} from "react-icons/fi";

export default function ManageOpportunityPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 📝 Edit Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  // 🗑️ Custom Delete Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [opportunityToDelete, setOpportunityToDelete] = useState(null);

  // 🔔 Toast Notification State
  const [notification, setNotification] = useState("");

  // 📥 ডাটাবেজ থেকে সব অপরচুনিটি ফেচ করার ফাংশন
  const fetchOpportunities = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/opportunities");
      const data = await res.json();
      if (data.success) {
        setOpportunities(data.data);
      }
    } catch (error) {
      console.error("Error fetching opportunities:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOpportunities();
  }, []);

  // 🗑️ কাস্টম মডাল ওপেন করার হ্যান্ডলার
  const openDeleteModal = (opp) => {
    setOpportunityToDelete(opp);
    setIsDeleteModalOpen(true);
  };

  // 💣 মঙ্গোডিবি থেকে ফাইনাল ডিলিট করার হ্যান্ডলার
  const handleConfirmDelete = async () => {
    if (!opportunityToDelete) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/opportunities/${opportunityToDelete._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      
      if (data.success) {
        setOpportunities(opportunities.filter((item) => item._id !== opportunityToDelete._id));
        showNotification("Opportunity deleted successfully!");
      } else {
        alert(data.message || "Failed to delete.");
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsDeleteModalOpen(false);
      setOpportunityToDelete(null);
    }
  };

  // এডিট মডাল ওপেন হ্যান্ডলার
  const openEditModal = (opp) => {
    setSelectedOpportunity({ ...opp });
    setIsEditModalOpen(true);
  };

  // 📝 মঙ্গোডিবিতে আপডেট করার সাবমিট হ্যান্ডলার
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/opportunities/${selectedOpportunity._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedOpportunity),
      });
      const data = await res.json();

      if (data.success) {
        setOpportunities(
          opportunities.map((item) =>
            item._id === selectedOpportunity._id ? data.data : item
          )
        );
        setIsEditModalOpen(false);
        showNotification("Opportunity updated successfully!");
      } else {
        alert(data.message || "Failed to update.");
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  // Framer Motion Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="show">
      
      {/* 🚀 Header */}
      <motion.div className="border-b border-slate-100 pb-5" variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Manage Opportunity</h1>
        <p className="text-sm text-slate-500">View, update, or remove active opportunities published by your startup.</p>
      </motion.div>

      {/* 🔔 Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-sm font-medium"
          >
            <FiCheck className="text-emerald-400" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 📊 View Section: Table */}
      <motion.div variants={itemVariants} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-slate-500">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Role Title</th>
                <th className="px-6 py-4">Required Skills</th>
                <th className="px-6 py-4">Work Type</th>
                <th className="px-6 py-4">Commitment</th>
                <th className="px-6 py-4">Deadline</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  <motion.tr key="loading">
                    <td colSpan="6" className="px-6 py-10 text-center text-slate-400">
                      <FiLoader className="mx-auto mb-2 text-indigo-600 animate-spin" size={24} />
                      Loading opportunities...
                    </td>
                  </motion.tr>
                ) : opportunities.length === 0 ? (
                  <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="empty">
                    <td colSpan="6" className="px-6 py-10 text-center text-slate-400">
                      <FiAlertCircle className="mx-auto mb-2 text-slate-300" size={24} />
                      No opportunities found. Add one to get started!
                    </td>
                  </motion.tr>
                ) : (
                  opportunities.map((opp) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -30, transition: { duration: 0.2 } }}
                      key={opp._id}
                      className="hover:bg-slate-50/50 transition"
                    >
                      <td className="px-6 py-4 font-bold text-slate-900">{opp.roleTitle}</td>
                      <td className="px-6 py-4">
                        <span className="max-w-[200px] truncate block text-slate-500 font-normal">{opp.requiredSkills}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          opp.workType === "Remote" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"
                        }`}>
                          {opp.workType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">{opp.commitmentLevel}</td>
                      <td className="px-6 py-4 text-slate-500">{opp.deadline}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => openEditModal(opp)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition"
                            title="Edit"
                          >
                            <FiEdit2 size={16} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => openDeleteModal(opp)} // কাস্টম মডাল ওপের করবে
                            className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition"
                            title="Delete"
                          >
                            <FiTrash2 size={16} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* 📝 Update Section: Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && selectedOpportunity && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} transition={{ type: "spring", duration: 0.3 }} className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-xl font-bold text-slate-900">Update Opportunity</h3>
                <button onClick={() => setIsEditModalOpen(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
                  <FiX size={18} />
                </button>
              </div>

              <form onSubmit={handleUpdateSubmit} className="space-y-4 mt-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 flex items-center gap-1"><FiBriefcase size={14} /> Role Title</label>
                  <input type="text" required value={selectedOpportunity.roleTitle} onChange={(e) => setSelectedOpportunity({ ...selectedOpportunity, roleTitle: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none transition bg-slate-50" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 flex items-center gap-1"><FiCpu size={14} /> Required Skills</label>
                  <input type="text" required value={selectedOpportunity.requiredSkills} onChange={(e) => setSelectedOpportunity({ ...selectedOpportunity, requiredSkills: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none transition bg-slate-50" />
                </div>

                <div className="grid gap-4 grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 flex items-center gap-1"><FiBriefcase size={14} /> Work Type</label>
                    <select value={selectedOpportunity.workType} onChange={(e) => setSelectedOpportunity({ ...selectedOpportunity, workType: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none transition bg-slate-50 font-medium text-slate-700">
                      <option value="Remote">Remote</option>
                      <option value="On-site">On-site</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 flex items-center gap-1"><FiClock size={14} /> Commitment</label>
                    <select value={selectedOpportunity.commitmentLevel} onChange={(e) => setSelectedOpportunity({ ...selectedOpportunity, commitmentLevel: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none transition bg-slate-50 font-medium text-slate-700">
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contractual">Contractual</option>
                      <option value="Equity-Based">Equity-Based</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 flex items-center gap-1"><FiCalendar size={14} /> Deadline</label>
                  <input type="date" required value={selectedOpportunity.deadline} onChange={(e) => setSelectedOpportunity({ ...selectedOpportunity, deadline: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none transition bg-slate-50 font-medium text-slate-700" />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 mt-5">
                  <button type="button" onClick={() => setIsEditModalOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">Cancel</button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition shadow-md shadow-indigo-100">Save Changes</motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🗑️ [🎯 NEW] Huhuhi Image Layout: Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 15 }} 
              transition={{ type: "spring", duration: 0.4 }} 
              className="w-full max-w-[500px] rounded-3xl bg-white p-7 shadow-2xl border border-slate-100"
            >
              {/* Header Icon & Title */}
              <div className="flex items-start gap-4 mb-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 shrink-0">
                  <FiTrash2 size={26} />
                </div>
                <div className="pt-1">
                  <h3 className="text-xl font-bold text-rose-600 tracking-tight">
                    Delete Opportunity?
                  </h3>
                </div>
              </div>

              {/* Description Body */}
              <p className="text-[15px] leading-relaxed text-slate-500 font-normal mb-8">
                Are you absolutely sure you want to delete this opportunity role (<span className="font-semibold text-slate-700">{opportunityToDelete?.roleTitle}</span>)? 
                This action cannot be undone and all data will be permanently removed.
              </p>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsDeleteModalOpen(false)} 
                  className="w-full rounded-2xl border border-slate-300 py-3.5 text-base font-semibold text-slate-700 hover:bg-slate-50 transition active:scale-[0.98] outline-none"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={handleConfirmDelete} 
                  className="w-full rounded-2xl bg-[#e10042] py-3.5 text-base font-semibold text-white hover:bg-[#c20037] transition shadow-lg shadow-rose-100 active:scale-[0.98] outline-none"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}