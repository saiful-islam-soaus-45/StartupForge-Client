"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiBriefcase, FiFileText, FiCheckCircle, FiTrendingUp } from "react-icons/fi";

export default function DashboardOverview() {
  // ডেমো কাউন্টার ডেটা
  const [stats, setStats] = useState({
    totalOpportunities: 5,
    totalApplications: 24,
    acceptedMembers: 8,
  });

  // Framer Motion ভ্যারিয়েন্টস (অ্যানিমেশন কন্টেইনারের জন্য)
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // প্রতিটি কার্ডের মাঝে ০.১ সেকেন্ডের গ্যাপ থাকবে
      },
    },
  };

  // প্রতিটি কার্ডের অ্যানিমেশন ভ্যারিয়েন্ট
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      
      {/* 🚀 Header */}
      <motion.div className="border-b border-slate-100 pb-5" variants={cardVariants}>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Overview</h1>
        <p className="text-sm text-slate-500">Welcome back! Here&apos;s a quick look at what&apos;s happening with your startups today.</p>
      </motion.div>

      {/* 📊 Metrics / Stats Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        
        {/* Card 1: Total Opportunities */}
        <motion.div 
          variants={cardVariants}
          whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.2 } }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center justify-between group cursor-pointer"
        >
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Opportunities</p>
            <p className="text-3xl font-black text-slate-900">{stats.totalOpportunities}</p>
            <p className="text-xs text-indigo-600 font-semibold flex items-center gap-1">
              <FiTrendingUp /> <span>Active openings</span>
            </p>
          </div>
          <div className="rounded-2xl bg-indigo-50 p-4 text-indigo-600 group-hover:scale-110 transition-transform duration-200">
            <FiBriefcase size={26} />
          </div>
        </motion.div>

        {/* Card 2: Total Applications */}
        <motion.div 
          variants={cardVariants}
          whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.2 } }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center justify-between group cursor-pointer"
        >
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Applications</p>
            <p className="text-3xl font-black text-slate-900">{stats.totalApplications}</p>
            <p className="text-xs text-blue-600 font-semibold flex items-center gap-1">
              <span>+4 new this week</span>
            </p>
          </div>
          <div className="rounded-2xl bg-blue-50 p-4 text-blue-600 group-hover:scale-110 transition-transform duration-200">
            <FiFileText size={26} />
          </div>
        </motion.div>

        {/* Card 3: Accepted Members */}
        <motion.div 
          variants={cardVariants}
          whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.2 } }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center justify-between group cursor-pointer sm:col-span-2 lg:col-span-1"
        >
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Accepted Members</p>
            <p className="text-3xl font-black text-slate-900">{stats.acceptedMembers}</p>
            <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <span>Joined your venture</span>
            </p>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-600 group-hover:scale-110 transition-transform duration-200">
            <FiCheckCircle size={26} />
          </div>
        </motion.div>

      </div>

      {/* 📋 Visual Placeholder Section with Smooth Animation */}
      <motion.div 
        variants={cardVariants}
        className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center"
      >
        <div className="max-w-md mx-auto space-y-3">
          <p className="text-base font-bold text-slate-700">Startup Analytics & Activity</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Once you connect the live MongoDB collections, real-time graphs, performance trackers, and recent applications log will safely sync and appear right here.
          </p>
        </div>
      </motion.div>

    </motion.div>
  );
}