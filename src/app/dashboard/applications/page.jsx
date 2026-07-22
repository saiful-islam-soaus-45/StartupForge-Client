"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle, FiXCircle, FiClock, FiMail, FiUser, FiAlertCircle, FiCheck, FiLink, FiBriefcase } from "react-icons/fi";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");

  // 🔄 API থেকে অ্যাপ্লিকেশন ডেটা লোড করা
  useEffect(() => {
    fetch("http://localhost:5000/api/applications")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setApplications(resData.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching applications:", err);
        setLoading(false);
      });
  }, []);

  // 🎯 স্ট্যাটাস আপডেট হ্যান্ডলার (Accepted / Rejected)
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        setApplications((prevApps) =>
          prevApps.map((app) =>
            app._id === id ? { ...app, status: newStatus } : app
          )
        );
        showNotification(`Application status updated to ${newStatus}! 🎉`);
      } else {
        alert(data.message || "Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Accepted":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Rejected":
        return "bg-rose-50 text-rose-700 border-rose-100";
      default:
        return "bg-amber-50 text-amber-700 border-amber-100";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="show">
      {/* 🚀 Header */}
      <motion.div className="border-b border-slate-100 pb-5" variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Incoming Applications</h1>
        <p className="text-sm text-slate-500">Review and manage incoming talent applications for your active startup opportunities.</p>
      </motion.div>

      {/* 🔔 Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-sm font-medium"
          >
            <FiCheck className="text-emerald-400" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 📊 Applications Table */}
      <motion.div variants={itemVariants} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-slate-500">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Applicant Info</th>
                <th className="px-6 py-4">Applied Role</th>
                <th className="px-6 py-4">Portfolio Link</th>
                <th className="px-6 py-4">Motivation Message</th>
                <th className="px-6 py-4">Applied Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              <AnimatePresence mode="popLayout">
                {applications.length === 0 ? (
                  <motion.tr key="empty">
                    <td colSpan="7" className="px-6 py-10 text-center text-slate-400">
                      <FiAlertCircle className="mx-auto mb-2 text-slate-300" size={24} />
                      No applications received yet.
                    </td>
                  </motion.tr>
                ) : (
                  applications.map((app) => (
                    <motion.tr layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key={app._id} className="hover:bg-slate-50/50 transition">
                      
                      {/* Applicant Email */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 shadow-sm">
                            <FiUser size={16} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 truncate max-w-[140px]" title={app.applicantEmail}>
                              {app.applicantEmail ? app.applicantEmail.split('@')[0] : "User"}
                            </p>
                            <p className="text-xs text-slate-400 font-normal flex items-center gap-1 mt-0.5">
                              <FiMail size={12} /> {app.applicantEmail}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Applied Role */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-slate-900 font-semibold">
                          <FiBriefcase size={14} className="text-indigo-500" />
                          <span className="capitalize">{app.roleTitle || "General Application"}</span>
                        </div>
                      </td>

                      {/* Portfolio Link */}
                      <td className="px-6 py-4">
                        {app.portfolioLink ? (
                          <a href={app.portfolioLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 hover:underline bg-indigo-50/50 px-2.5 py-1.5 rounded-lg border border-indigo-100/50 transition">
                            <FiLink size={12} /> View Portfolio
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400 font-normal">Not Provided</span>
                        )}
                      </td>

                      {/* Motivation Message */}
                      <td className="px-6 py-4">
                        <p className="max-w-[200px] text-slate-600 font-normal text-xs line-clamp-2 bg-slate-50 p-2 rounded-lg border border-slate-100" title={app.motivationMessage}>
                          {app.motivationMessage || "No message provided."}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-slate-500 font-normal text-xs">
                        {app.appliedDate || "N/A"}
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusBadge(app.status)}`}>
                          {app.status === "Pending" && <FiClock size={12} />}
                          {app.status === "Accepted" && <FiCheckCircle size={12} />}
                          {app.status === "Rejected" && <FiXCircle size={12} />}
                          {app.status}
                        </span>
                      </td>

                      {/* Action Buttons */}
                      <td className="px-6 py-4 text-right">
                        <AnimatePresence mode="wait">
                          {app.status === "Pending" ? (
                            <div className="flex justify-end gap-2" key="actions">
                              <button onClick={() => handleStatusUpdate(app._id, "Accepted")} className="flex items-center gap-1 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 border border-emerald-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition shadow-sm cursor-pointer">
                                <FiCheckCircle size={14} /> Accept
                              </button>
                              <button onClick={() => handleStatusUpdate(app._id, "Rejected")} className="flex items-center gap-1 rounded-xl bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 border border-rose-200 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition shadow-sm cursor-pointer">
                                <FiXCircle size={14} /> Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 font-normal italic block pr-2" key="decision">
                              Decision made
                            </span>
                          )}
                        </AnimatePresence>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}