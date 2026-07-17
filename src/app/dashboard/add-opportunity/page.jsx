"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiPlusSquare, FiBriefcase, FiCpu, FiClock, FiCalendar, FiAlertCircle } from "react-icons/fi";

export default function AddOpportunityPage() {
  const [formData, setFormData] = useState({
    roleTitle: "",
    requiredSkills: "",
    workType: "Remote", // Default Value
    commitmentLevel: "Full-time", // Default Value
    deadline: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });

  // ইনপুট চেঞ্জ হ্যান্ডলার
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ফর্ম সাবমিট হ্যান্ডলার (opportunities কালেকশনের জন্য)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMsg({ type: "", text: "" });

    // এখানে পরবর্তীতে আপনার API কল হবে যা MongoDB-র opportunities কালেকশনে ডাটা সেভ করবে
    console.log("Saving to opportunities collection:", formData);

    setTimeout(() => {
      setIsLoading(false);
      setStatusMsg({ type: "success", text: "Opportunity added successfully to the marketplace!" });
      // ফর্ম রিসেট
      setFormData({
        roleTitle: "",
        requiredSkills: "",
        workType: "Remote",
        commitmentLevel: "Full-time",
        deadline: "",
      });
    }, 1000);
  };

  // Framer Motion ভ্যারিয়েন্টস
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08, // ফর্মের ভেতরের প্রতিটি এলিমেন্ট ০.০৮ সেকেন্ড পর পর আসবে
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 110 } },
  };

  return (
    <motion.div 
      className="max-w-3xl mx-auto space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      
      {/* 🚀 Header */}
      <motion.div className="border-b border-slate-100 pb-5" variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Add Opportunity</h1>
        <p className="text-sm text-slate-500">Create a new opening for talent, co-founders, or contributors to join your startup venture.</p>
      </motion.div>

      {/* 📝 Form Card */}
      <motion.div 
        variants={itemVariants}
        className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          
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

          {/* 1. Role Title */}
          <motion.div className="space-y-2" variants={itemVariants}>
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <FiBriefcase className="text-slate-400" />
              Role Title
            </label>
            <input
              type="text"
              name="roleTitle"
              required
              value={formData.roleTitle}
              onChange={handleChange}
              placeholder="e.g. Frontend Developer, Co-Founder, AI Researcher"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none transition bg-slate-50/50"
            />
          </motion.div>

          {/* 2. Required Skills */}
          <motion.div className="space-y-2" variants={itemVariants}>
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <FiCpu className="text-slate-400" />
              Required Skills
            </label>
            <input
              type="text"
              name="requiredSkills"
              required
              value={formData.requiredSkills}
              onChange={handleChange}
              placeholder="e.g. React, Tailwind CSS, Node.js, Machine Learning (comma separated)"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none transition bg-slate-50/50"
            />
          </motion.div>

          {/* Two Column Layout for Dropdowns */}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
            
            {/* 3. Work Type */}
            <motion.div className="space-y-2" variants={itemVariants}>
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <FiBriefcase className="text-slate-400" />
                Work Type
              </label>
              <select
                name="workType"
                value={formData.workType}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none transition bg-slate-50/50 appearance-none font-medium text-slate-700"
              >
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </motion.div>

            {/* 4. Commitment Level */}
            <motion.div className="space-y-2" variants={itemVariants}>
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <FiClock className="text-slate-400" />
                Commitment Level
              </label>
              <select
                name="commitmentLevel"
                value={formData.commitmentLevel}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none transition bg-slate-50/50 appearance-none font-medium text-slate-700"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contractual">Contractual</option>
                <option value="Equity-Based">Equity-Based</option>
              </select>
            </motion.div>

          </div>

          {/* 5. Deadline */}
          <motion.div className="space-y-2" variants={itemVariants}>
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <FiCalendar className="text-slate-400" />
              Deadline
            </label>
            <input
              type="date"
              name="deadline"
              required
              value={formData.deadline}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none transition bg-slate-50/50 text-slate-700 font-medium"
            />
          </motion.div>

          {/* Submit Button */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white hover:bg-indigo-700 transition shadow-md hover:shadow-indigo-100 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <FiPlusSquare size={18} />
              <span>{isLoading ? "Publishing Opportunity..." : "Publish Opportunity"}</span>
            </button>
          </motion.div>

        </form>
      </motion.div>

    </motion.div>
  );
}