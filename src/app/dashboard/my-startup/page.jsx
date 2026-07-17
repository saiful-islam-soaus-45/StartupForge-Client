"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiGlobe, FiMail, FiMapPin, FiCpu, FiUsers, FiDollarSign, FiEdit3 } from "react-icons/fi";

export default function MyStartupPage() {
  // ডেমো ডেটা
  const [startup, setStartup] = useState({
    name: "TechForge AI",
    tagline: "Accelerating Next-Gen SaaS Solutions with Artificial Intelligence",
    description: "TechForge AI is a cutting-edge platform designed to help developers and businesses build, scale, and optimize their digital products using generative AI models. We provide seamless integration APIs and ready-to-deploy microservices.",
    industry: "Artificial Intelligence / SaaS",
    stage: "Seed Stage",
    teamSize: "5 - 10 Members",
    location: "Dhaka, Bangladesh",
    website: "https://techforge-ai.com",
    email: "contact@techforge-ai.com",
    fundingRaised: "$150,000",
  });

  // Framer Motion কন্টেইনার এবং আইটেম ভ্যারিয়েন্টস
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08, // প্রতিটি চাইল্ড এলিমেন্ট ০.০৮ সেকেন্ড পর পর আসবে
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      
      {/* 🚀 Top Header Section */}
      <motion.div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5" variants={itemVariants}>
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Startup</h1>
          <p className="text-sm text-slate-500">Manage and view your startup&apos;s public profile and venture details.</p>
        </div>
        
        {/* Edit Button with Hover/Tap Motion */}
        <motion.button 
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition shadow-sm self-start sm:self-center"
        >
          <FiEdit3 size={16} />
          <span>Edit Profile</span>
        </motion.button>
      </motion.div>

      {/* 📊 Metrics / Stats Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {/* Stat 1 */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="rounded-2xl border border-slate-200 bg-white p-5 flex items-center gap-4 shadow-sm"
        >
          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
            <FiCpu size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Venture Stage</p>
            <p className="text-lg font-bold text-slate-800 mt-0.5">{startup.stage}</p>
          </div>
        </motion.div>

        {/* Stat 2 */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="rounded-2xl border border-slate-200 bg-white p-5 flex items-center gap-4 shadow-sm"
        >
          <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
            <FiUsers size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Team Size</p>
            <p className="text-lg font-bold text-slate-800 mt-0.5">{startup.teamSize}</p>
          </div>
        </motion.div>

        {/* Stat 3 */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="rounded-2xl border border-slate-200 bg-white p-5 flex items-center gap-4 shadow-sm sm:col-span-2 lg:col-span-1"
        >
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
            <FiDollarSign size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Funding Raised</p>
            <p className="text-lg font-bold text-slate-800 mt-0.5">{startup.fundingRaised}</p>
          </div>
        </motion.div>
      </div>

      {/* 🏢 Main Profile Layout */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        
        {/* Left Side: About & Description */}
        <motion.div className="lg:col-span-2 space-y-6" variants={itemVariants}>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-4">
              {/* Logo Placeholder with custom animation */}
              <motion.div 
                whileHover={{ rotate: 5, scale: 1.05 }}
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-2xl font-black shadow-md cursor-pointer select-none"
              >
                {startup.name.charAt(0)}
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{startup.name}</h2>
                <span className="inline-block mt-1 rounded-full bg-slate-100 px-3 py-0.5 text-xs font-medium text-slate-600">
                  {startup.industry}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Tagline</h3>
              <p className="text-base font-medium text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100 italic">
                &quot;{startup.tagline}&quot;
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Company Overview</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                {startup.description}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Quick Links & Contact Info */}
        <motion.div className="space-y-6" variants={itemVariants}>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
              Venture Details
            </h3>

            <div className="space-y-4">
              {/* Location */}
              <div className="flex items-start gap-3">
                <FiMapPin className="text-slate-400 mt-0.5" size={16} />
                <div>
                  <p className="text-xs font-medium text-slate-400">Headquarters</p>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">{startup.location}</p>
                </div>
              </div>

              {/* Website */}
              <div className="flex items-start gap-3">
                <FiGlobe className="text-slate-400 mt-0.5" size={16} />
                <div>
                  <p className="text-xs font-medium text-slate-400">Website</p>
                  <a href={startup.website} target="_blank" rel="noreferrer" className="text-sm font-semibold text-indigo-600 hover:underline mt-0.5 block">
                    {startup.website.replace("https://", "")}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <FiMail className="text-slate-400 mt-0.5" size={16} />
                <div>
                  <p className="text-xs font-medium text-slate-400">Contact Email</p>
                  <a href={`mailto:${startup.email}`} className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition mt-0.5 block">
                    {startup.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>

    </motion.div>
  );
}