"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiArrowRight, FiMail, FiCalendar } from "react-icons/fi";
import { motion } from "framer-motion";

export default function BrowseStartups() {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/public/startups");
        const resData = await res.json();
        if (resData.success) {
          setStartups(resData.data);
        }
      } catch (error) {
        console.error("Error fetching startups:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStartups();
  }, []);

  // 🗓️ ISO Date-কে সুন্দর ফরম্যাটে দেখানোর ফাংশন
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 relative">
      {/* 🚀 Header Area */}
      <div className="mb-12 text-center lg:text-left">
        <h2 className="text-3xl font-black text-slate-950 tracking-tight sm:text-4xl bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
          Explore Innovative Startups
        </h2>
        <p className="mt-3 text-base sm:text-lg text-slate-500 max-w-2xl font-medium leading-relaxed">
          Discover ground-breaking teams, connect with visionaries, and find your next milestone.
        </p>
      </div>

      {startups.length === 0 ? (
        <div className="text-center py-24 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 backdrop-blur-[1px]">
          <p className="text-slate-400 font-semibold tracking-wide">No startups published yet!</p>
        </div>
      ) : (
        /* 🎨 Interactive Square Grid System */
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {startups.map((startup, index) => (
            <motion.div
              key={startup._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group flex flex-col justify-between aspect-square rounded-2xl border border-slate-200/60 bg-slate-50/60 p-6 shadow-sm hover:shadow-xl hover:bg-white hover:border-indigo-100 transition-all duration-300 overflow-hidden"
            >
              <div>
                {/* Upper Area: Logo & Industry Badge */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 font-bold text-2xl overflow-hidden border border-slate-200 shadow-sm group-hover:scale-105 transition-transform duration-300">
                    {startup.logo ? (
                      <img src={startup.logo} alt={startup.name} className="h-full w-full object-cover" />
                    ) : (
                      startup.name ? startup.name.charAt(0).toUpperCase() : "S"
                    )}
                  </div>

                  <span className="inline-flex rounded-lg bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-600 uppercase tracking-wider border border-indigo-100/30 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                    {startup.industry || "General"}
                  </span>
                </div>

                {/* Startup Name */}
                <div className="mt-2">
                  <h3 className="text-xl font-extrabold text-slate-900 capitalize tracking-tight group-hover:text-indigo-600 transition-colors duration-200 line-clamp-1">
                    {startup.name}
                  </h3>

                  {/* Subtle Separator */}
                  <div className="w-6 h-[2px] bg-indigo-600/30 my-3 group-hover:w-12 transition-all duration-300 rounded-full" />

                  {/* 📊 Extra Info: Founder Email & Created At */}
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-medium break-all">
                      <FiMail size={14} className="text-slate-400 shrink-0" />
                      <span>{startup.founderEmail || "No Email"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-medium">
                      <FiCalendar size={14} className="text-slate-400 shrink-0" />
                      <span>Created: {formatDate(startup.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 🎯 Details Button -> সঠিক ডাইনামিক রাউট লিংক (বাড়তি 's' রিমুভ করা হয়েছে) */}
              <Link
                href={`/browse-startups/${startup._id}`}
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-indigo-600 px-4 py-3 text-xs font-bold text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-100 transition-all duration-200 cursor-pointer group/btn mt-auto"
              >
                Details
                <FiArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform duration-200" />
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}