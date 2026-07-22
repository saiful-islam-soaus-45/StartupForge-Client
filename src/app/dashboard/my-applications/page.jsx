"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuLayers } from "react-icons/lu";

export default function MyApplicationsPage({ user }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 🎯 ইউজার সেশন ইমেইল ট্র্যাকিং (কোলাবোরেটর বা ফাউন্ডার যেই হোক)
    const targetEmail = user?.email || user?.applicantEmail || "soausahmedbd91@gmail.com";

    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch(`http://localhost:5000/api/applications/${targetEmail}`);
        if (!res.ok) throw new Error("Failed to fetch applications from server");
        
        const data = await res.json();
        if (data.success) {
          setApplications(data.data || []);
        } else {
          throw new Error(data.message || "Something went wrong");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (targetEmail) {
      fetchApplications();
    }
  }, [user?.email, user?.applicantEmail]);

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "rejected":
        return "bg-rose-50 text-rose-600 border-rose-100";
      default:
        return "bg-amber-50 text-amber-600 border-amber-100";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] w-full">
        <span className="loading loading-spinner loading-md text-[#6366F1]"></span>
        <p className="text-xs text-slate-400 mt-2 font-medium">Fetching applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[300px] text-center p-6 bg-rose-50/50 border border-rose-100 rounded-2xl text-rose-600 text-sm w-full font-medium">
        Error: {error}. Please refresh or try again later.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full text-slate-700"
    >
      {/* হেডার */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <LuLayers className="text-[#6366F1] w-5 h-5" />
          Application Dashboard
        </h1>
        <p className="text-xs text-slate-400 mt-1">Track history and statuses of startup collaborations.</p>
      </div>

      {/* টেবিল কন্টেইনার */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden w-full">
        <AnimatePresence mode="wait">
          {!applications || applications.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <LuLayers className="w-5 h-5 text-slate-300" />
              </div>
              <p className="text-sm text-slate-400 font-medium">No applications found.</p>
            </motion.div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-4 px-6">Opportunity Role</th>
                    <th className="py-4 px-6">Startup Profile</th>
                    <th className="py-4 px-6">Applicant Email</th>
                    <th className="py-4 px-6">Applied Date</th>
                    <th className="py-4 px-6 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                  {applications.map((app) => {
                    // 🔍 পপুলেটেড অবজেক্ট বা র ডেটা স্ট্রাকচার সেফলি রেন্ডার করা হচ্ছে
                    const roleName = app.roleTitle || app.opportunityDetails?.roleTitle || app.opportunityId?.roleTitle;
                    const startupName = app.startupDetails?.name || app.startupId?.name || "Direct Application";
                    const startupLogo = app.startupDetails?.logo || app.startupId?.logo;
                    const applicant = app.applicantEmail || "Unknown Applicant";

                    return (
                      <tr key={app._id} className="hover:bg-slate-50/30 transition-colors">
                        
                        {/* ১. Opportunity Role */}
                        <td className="py-4 px-6 font-semibold text-slate-800 align-middle">
                          {roleName ? (
                            <span className="capitalize">{roleName}</span>
                          ) : (
                            <span className="text-slate-400 font-normal italic text-xs bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-md">
                              Direct Startup Apply
                            </span>
                          )}
                        </td>

                        {/* ২. Startup Name */}
                        <td className="py-4 px-6 text-slate-600 align-middle">
                          <div className="flex items-center gap-2">
                            {startupLogo ? (
                              <img
                                src={startupLogo}
                                alt={startupName}
                                className="w-6 h-6 rounded-md object-cover border border-slate-100"
                              />
                            ) : (
                              <div className="w-6 h-6 bg-indigo-50 text-[10px] font-bold text-indigo-500 flex items-center justify-center rounded-md border border-indigo-100/30">
                                SU
                              </div>
                            )}
                            <span className="font-medium">{startupName}</span>
                          </div>
                        </td>

                        {/* ৩. Applicant Email */}
                        <td className="py-4 px-6 text-xs text-slate-600 font-medium align-middle">
                          {applicant}
                        </td>

                        {/* ৪. Applied Date */}
                        <td className="py-4 px-6 text-xs text-slate-400 font-medium align-middle">
                          {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }) : app.appliedDate || "N/A"}
                        </td>

                        {/* ৫. Status */}
                        <td className="py-4 px-6 text-center align-middle">
                          <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusClass(app.status)}`}>
                            {app.status || "Pending"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}