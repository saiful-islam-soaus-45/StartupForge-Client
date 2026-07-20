"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LuSend } from "react-icons/lu";

export default function ApplyOpportunityPage({ user }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    opportunityId: "",
    applicantEmail: "",
    portfolioLink: "",
    motivationMessage: "",
  });

  // ইউজার লগইন থাকলে ইমেইল ফিল্ডটি স্বয়ংক্রিয়ভাবে ইনিশিয়াল ভ্যালু হিসেবে সেট হবে
  useEffect(() => {
    if (user?.email) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData((prev) => ({ ...prev, applicantEmail: user.email }));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🎯 ফিক্সড: এক্সপ্রেস সার্ভারের পোর্ট (৫০০০) সহ ফুল ইউআরএল সেট করা হয়েছে
      const res = await fetch("http://localhost:5000/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/dashboard/my-applications");
      } else {
        const errData = await res.json();
        alert(errData.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Failed to submit application. Make sure your backend server is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-2xl mx-auto"
    >
      {/* মেইন কন্টেইনারের বর্ডার ফাউন্ডার টেবিলের মতো করা হয়েছে */}
      <div className="w-full bg-white p-6 md:p-8 rounded-2xl border border-slate-200/60 shadow-sm">
        
        {/* হেডার */}
        <div className="border-b border-slate-100 pb-5 mb-6">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <LuSend className="text-[#6366F1] w-5 h-5" />
            Apply to Opportunity
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review your information and fill up the remaining fields to apply.
          </p>
        </div>

        {/* ফর্ম সেকশন */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Opportunity ID */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Opportunity ID
            </label>
            <input
              type="text"
              required
              value={formData.opportunityId}
              onChange={(e) => setFormData({ ...formData, opportunityId: e.target.value })}
              placeholder="e.g., OPP-98721"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#6366F1] transition bg-slate-50/30 focus:bg-white text-slate-700 font-sans"
            />
          </div>

          {/* Applicant Email (🎯 এডিটেবল করা হয়েছে, ইউজার চাইলে পরিবর্তন করতে পারবেন) */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Applicant Email
            </label>
            <input
              type="email"
              required
              value={formData.applicantEmail}
              onChange={(e) => setFormData({ ...formData, applicantEmail: e.target.value })}
              placeholder="Enter your email address"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#6366F1] transition bg-slate-50/30 focus:bg-white text-slate-700 font-sans"
            />
          </div>

          {/* Portfolio Link */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Portfolio Link
            </label>
            <input
              type="url"
              required
              value={formData.portfolioLink}
              onChange={(e) => setFormData({ ...formData, portfolioLink: e.target.value })}
              placeholder="https://yourportfolio.dev"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#6366F1] transition bg-slate-50/30 focus:bg-white text-slate-700 font-sans"
            />
          </div>

          {/* Motivation Message */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Motivation Message
            </label>
            <textarea
              required
              rows={5}
              value={formData.motivationMessage}
              onChange={(e) => setFormData({ ...formData, motivationMessage: e.target.value })}
              placeholder="Tell the founder why you're a great fit for this role..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#6366F1] transition bg-slate-50/30 focus:bg-white resize-none text-slate-700 font-sans leading-relaxed"
            />
          </div>

          {/* সাবমিট বাটন */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <>
                <LuSend className="w-4 h-4" />
                <span>Submit Application</span>
              </>
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}