"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlusSquare, FiBriefcase, FiCpu, FiClock, FiCalendar, FiAlertCircle, FiLoader, FiZap } from "react-icons/fi";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

export default function AddOpportunityPage() {
  const [formData, setFormData] = useState({
    roleTitle: "",
    requiredSkills: "",
    workType: "Remote",
    commitmentLevel: "Full-time",
    deadline: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });

  // ইউজার ও অপরচুনিটি কাউন্ট স্টেট
  const [userPlan, setUserPlan] = useState("free");
  const [opportunityCount, setOpportunityCount] = useState(0);
  const [isCheckingLimit, setIsCheckingLimit] = useState(true);

  // 🔴 আপনার আসল ইউজার আইডি এখানে সেট করুন (যেমন: লোকালস্টোরেজ, সেশন বা প্রপস থেকে এনে)
  // আপনার ডাটাবেজ অনুযায়ী টেস্ট ইউজার আইডি: "6a63b866eb5492714bc29c12" এবং ইমেইল: "s@gmail.com"
  const { data: session, isPending } = useSession();

  const currentUser = {
    userId: session?.user?.id,
    email: session?.user?.email,
  };

  // পেজ লোড হওয়ার সময় ব্যাকএন্ড থেকে ইউজারের লিমিট ও প্ল্যান চেক করা
  useEffect(() => {
    async function fetchUserLimit() {
      try {
        if (!currentUser.userId) return;

        const res = await fetch(`http://localhost:5000/api/my-opportunities-count?userId=${currentUser.userId}`);
        const data = await res.json();

        if (data.success) {
          setUserPlan(data.user.plan);
          setOpportunityCount(data.count);
        }
      } catch (error) {
        console.error("Failed to fetch user limits:", error);
      } finally {
        setIsCheckingLimit(false);
      }
    }

    fetchUserLimit();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMsg({ type: "", text: "" });

    // অপরচুনিটি ডাটার সাথে ইউজারের সঠিক `userId` এবং `founderEmail` যুক্ত করা হলো
    const payload = {
      ...formData,
      userId: currentUser.userId,
      founderEmail: currentUser.email
    };

    try {
      const res = await fetch("http://localhost:5000/api/opportunities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setIsLoading(false);
        setStatusMsg({ type: "success", text: "Opportunity added successfully to the marketplace!" });
        setOpportunityCount((prev) => prev + 1); // সফলভাবে পোস্ট হওয়ার পর কাউন্ট ১ বাড়িয়ে দেওয়া
        setFormData({
          roleTitle: "",
          requiredSkills: "",
          workType: "Remote",
          commitmentLevel: "Full-time",
          deadline: "",
        });
      } else {
        setIsLoading(false);
        setStatusMsg({ type: "error", text: data.message || "Failed to add opportunity." });
      }
    } catch (error) {
      setIsLoading(false);
      setStatusMsg({ type: "error", text: "Failed to connect to the server." });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 110 } },
  };

  // কন্ডিশন: ইউজার ফ্রি প্ল্যানে থাকলে এবং ৩টি বা তার বেশি পোস্ট করলে ব্যানার দেখাবে
  const isLimitExceeded = userPlan === "free" && opportunityCount >= 3;

  if (isCheckingLimit) {
    return (
      <div className="flex justify-center items-center h-64">
        <FiLoader className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-3xl mx-auto space-y-6 text-slate-900 dark:text-slate-100"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >

      {/* 🚀 Header */}
      <motion.div className="border-b border-slate-100 dark:border-slate-800 pb-5" variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">Add Opportunity</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Post a role for your startup. {userPlan === "free" && `(${opportunityCount}/3 free slots used)`}
        </p>
      </motion.div>

      {/* Status Message Alert */}
      <AnimatePresence mode="wait">
        {statusMsg.text && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-2 ${statusMsg.type === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-rose-50 text-rose-700 border border-rose-200"
              }`}
          >
            <FiAlertCircle size={18} />
            <span>{statusMsg.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ⚡ Premium Required Banner (লিমিট শেষ হলে এটি দেখাবে) */}
      {isLimitExceeded ? (
        <motion.div
          variants={itemVariants}
          className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-200/80 p-6 md:p-8 shadow-sm space-y-4"
        >
          <div className="flex items-center gap-2 text-amber-800 font-bold text-base">
            <FiZap className="text-amber-600 fill-amber-500" />
            <span>Premium Required</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            You&apos;ve used all 3 free opportunity slots. Upgrade to post unlimited opportunities.
          </p>
          <div>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3 text-xs font-bold text-white shadow-md shadow-orange-500/20 hover:opacity-95 transition cursor-pointer"
            >
              Upgrade — $14/month
            </Link>
          </div>
        </motion.div>
      ) : (
        /* 📝 Form Card (লিমিট শেষ না হলে ফর্ম দেখাবে) */
        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 md:p-8 shadow-sm"
        >
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* 1. Role Title */}
            <motion.div className="space-y-2" variants={itemVariants}>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <FiBriefcase className="text-slate-400" />
                Role Title *
              </label>
              <input
                type="text"
                name="roleTitle"
                required
                value={formData.roleTitle}
                onChange={handleChange}
                placeholder="e.g. Frontend Developer, Co-Founder, AI Researcher"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none transition bg-slate-50/50 dark:bg-slate-950"
              />
            </motion.div>

            {/* 2. Required Skills */}
            <motion.div className="space-y-2" variants={itemVariants}>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <FiCpu className="text-slate-400" />
                Required Skills *
              </label>
              <input
                type="text"
                name="requiredSkills"
                required
                value={formData.requiredSkills}
                onChange={handleChange}
                placeholder="e.g. React, Tailwind CSS, Node.js (comma separated)"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none transition bg-slate-50/50 dark:bg-slate-950"
              />
            </motion.div>

            {/* Two Column Layout for Dropdowns */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">

              {/* 3. Work Type */}
              <motion.div className="space-y-2" variants={itemVariants}>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <FiBriefcase className="text-slate-400" />
                  Work Type *
                </label>
                <select
                  name="workType"
                  value={formData.workType}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none transition bg-slate-50/50 dark:bg-slate-950 font-medium text-slate-700 dark:text-slate-300"
                >
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </motion.div>

              {/* 4. Commitment Level */}
              <motion.div className="space-y-2" variants={itemVariants}>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <FiClock className="text-slate-400" />
                  Commitment Level *
                </label>
                <select
                  name="commitmentLevel"
                  value={formData.commitmentLevel}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none transition bg-slate-50/50 dark:bg-slate-950 font-medium text-slate-700 dark:text-slate-300"
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
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <FiCalendar className="text-slate-400" />
                Deadline *
              </label>
              <input
                type="date"
                name="deadline"
                required
                value={formData.deadline}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none transition bg-slate-50/50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-medium"
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
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white hover:bg-indigo-700 transition shadow-md hover:shadow-indigo-100 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? <FiLoader className="animate-spin" /> : <FiPlusSquare size={18} />}
                <span>{isLoading ? "Posting Opportunity..." : "Post Opportunity"}</span>
              </button>
            </motion.div>

          </form>
        </motion.div>
      )}

    </motion.div>
  );
}