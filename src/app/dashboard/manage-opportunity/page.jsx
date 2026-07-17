"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit2, FiTrash2, FiX, FiCheck, FiAlertCircle, FiBriefcase, FiCpu, FiClock, FiCalendar } from "react-icons/fi";

export default function ManageOpportunityPage() {
  // ডেমো ডেটা
  const [opportunities, setOpportunities] = useState([
    {
      id: "1",
      roleTitle: "Frontend Web Developer",
      requiredSkills: "React, Tailwind CSS, daisyUI",
      workType: "Remote",
      commitmentLevel: "Full-time",
      deadline: "2026-08-15",
    },
    {
      id: "2",
      roleTitle: "AI Research Assistant",
      requiredSkills: "Python, PyTorch, Machine Learning",
      workType: "Hybrid",
      commitmentLevel: "Part-time",
      deadline: "2026-08-30",
    }
  ]);

  // স্টেটস
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [notification, setNotification] = useState("");

  // ডিলিট হ্যান্ডলার
  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this opportunity?")) {
      setOpportunities(opportunities.filter((item) => item.id !== id));
      showNotification("Opportunity deleted successfully!");
    }
  };

  // এডিট মডাল ওপেন হ্যান্ডলার
  const openEditModal = (opp) => {
    setSelectedOpportunity({ ...opp });
    setIsEditModalOpen(true);
  };

  // আপডেট সাবমিট হ্যান্ডলার
  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    setOpportunities(
      opportunities.map((item) =>
        item.id === selectedOpportunity.id ? selectedOpportunity : item
      )
    );
    setIsEditModalOpen(false);
    showNotification("Opportunity updated successfully!");
  };

  // নোটিফিকেশন দেখানোর ফাংশন
  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  // Framer Motion ভ্যারিয়েন্টস
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      
      {/* 🚀 Header */}
      <motion.div className="border-b border-slate-100 pb-5" variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Manage Opportunity</h1>
        <p className="text-sm text-slate-500">View, update, or remove active opportunities published by your startup.</p>
      </motion.div>

      {/* 🔔 Toast Notification with AnimatePresence */}
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
      <motion.div 
        variants={itemVariants}
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
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
                {opportunities.length === 0 ? (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key="empty"
                  >
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
                      key={opp.id} 
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
                          {/* Update Button */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => openEditModal(opp)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition"
                            title="Edit Opportunity"
                          >
                            <FiEdit2 size={16} />
                          </motion.button>
                          {/* Delete Button */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(opp.id)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition"
                            title="Delete Opportunity"
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

      {/* 📝 Update Section: Edit Modal with Backdrop Animation */}
      <AnimatePresence>
        {isEditModalOpen && selectedOpportunity && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-xl font-bold text-slate-900">Update Opportunity</h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                >
                  <FiX size={18} />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleUpdateSubmit} className="space-y-4 mt-4">
                {/* Role Title */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                    <FiBriefcase size={14} /> Role Title
                  </label>
                  <input
                    type="text"
                    required
                    value={selectedOpportunity.roleTitle}
                    onChange={(e) => setSelectedOpportunity({ ...selectedOpportunity, roleTitle: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none transition bg-slate-50"
                  />
                </div>

                {/* Required Skills */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                    <FiCpu size={14} /> Required Skills
                  </label>
                  <input
                    type="text"
                    required
                    value={selectedOpportunity.requiredSkills}
                    onChange={(e) => setSelectedOpportunity({ ...selectedOpportunity, requiredSkills: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none transition bg-slate-50"
                  />
                </div>

                {/* Work Type & Commitment */}
                <div className="grid gap-4 grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                      <FiBriefcase size={14} /> Work Type
                    </label>
                    <select
                      value={selectedOpportunity.workType}
                      onChange={(e) => setSelectedOpportunity({ ...selectedOpportunity, workType: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none transition bg-slate-50 font-medium text-slate-700"
                    >
                      <option value="Remote">Remote</option>
                      <option value="On-site">On-site</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                      <FiClock size={14} /> Commitment
                    </label>
                    <select
                      value={selectedOpportunity.commitmentLevel}
                      onChange={(e) => setSelectedOpportunity({ ...selectedOpportunity, commitmentLevel: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none transition bg-slate-50 font-medium text-slate-700"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contractual">Contractual</option>
                      <option value="Equity-Based">Equity-Based</option>
                    </select>
                  </div>
                </div>

                {/* Deadline */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                    <FiCalendar size={14} /> Deadline
                  </label>
                  <input
                    type="date"
                    required
                    value={selectedOpportunity.deadline}
                    onChange={(e) => setSelectedOpportunity({ ...selectedOpportunity, deadline: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none transition bg-slate-50 font-medium text-slate-700"
                  />
                </div>

                {/* Actions Button */}
                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 mt-5">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition shadow-md shadow-indigo-100"
                  >
                    Save Changes
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}