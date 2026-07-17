"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle, FiXCircle, FiClock, FiMail, FiCpu, FiUser, FiAlertCircle, FiCheck } from "react-icons/fi";

export default function ApplicationsPage() {
  // ডেমো অ্যাপ্লিকেশন ডাটা
  const [applications, setApplications] = useState([
    {
      id: "app_1",
      applicantName: "Rahat Karim",
      applicantEmail: "rahat@gmail.com",
      appliedRole: "Frontend Web Developer",
      skills: "React, Tailwind CSS, JavaScript",
      status: "Pending", // Pending, Accepted, Rejected
      appliedDate: "2026-07-16",
    },
    {
      id: "app_2",
      applicantName: "Anika Rahman",
      applicantEmail: "anika.dev@gmail.com",
      appliedRole: "AI Research Assistant",
      skills: "Python, PyTorch, Scikit-Learn",
      status: "Pending",
      appliedDate: "2026-07-15",
    },
    {
      id: "app_3",
      applicantName: "Tanvir Ahmed",
      applicantEmail: "tanvir.design@gmail.com",
      appliedRole: "Frontend Web Developer",
      skills: "HTML, CSS, Figma to React",
      status: "Accepted",
      appliedDate: "2026-07-14",
    }
  ]);

  const [notification, setNotification] = useState("");

  // স্ট্যাটাস আপডেট হ্যান্ডলার (Accept / Reject)
  const handleStatusUpdate = (id, newStatus) => {
    setApplications(
      applications.map((app) =>
        app.id === id ? { ...app, status: newStatus } : app
      )
    );
    showNotification(`Application status updated to ${newStatus}!`);
  };

  // নোটিফিকেশন টোস্ট ফাংশন
  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  // স্ট্যাটাস অনুযায়ী ব্যাজের স্টাইল রিটার্ন করার ফাংশন
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

  // Framer Motion ভ্যারিয়েন্টস
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06 }
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
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Applications</h1>
        <p className="text-sm text-slate-500">Review and manage incoming talent applications for your active startup opportunities.</p>
      </motion.div>

      {/* 🔔 Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9, transition: { duration: 0.2 } }}
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
                <th className="px-6 py-4">Applicant</th>
                <th className="px-6 py-4">Applied Role</th>
                <th className="px-6 py-4">Skills</th>
                <th className="px-6 py-4">Applied Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              <AnimatePresence mode="popLayout">
                {applications.length === 0 ? (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key="empty"
                  >
                    <td colSpan="6" className="px-6 py-10 text-center text-slate-400">
                      <FiAlertCircle className="mx-auto mb-2 text-slate-300" size={24} />
                      No applications received yet.
                    </td>
                  </motion.tr>
                ) : (
                  applications.map((app) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, transition: { duration: 0.15 } }}
                      key={app.id} 
                      className="hover:bg-slate-50/50 transition"
                    >
                      {/* Applicant Name & Email */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 shadow-sm"
                          >
                            <FiUser size={16} />
                          </motion.div>
                          <div>
                            <p className="font-bold text-slate-900">{app.applicantName}</p>
                            <p className="text-xs text-slate-400 font-normal flex items-center gap-1 mt-0.5">
                              <FiMail size={12} /> {app.applicantEmail}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Applied Role */}
                      <td className="px-6 py-4 font-semibold text-slate-800">{app.appliedRole}</td>

                      {/* Applicant Skills */}
                      <td className="px-6 py-4">
                        <span className="max-w-[180px] truncate block text-slate-500 font-normal flex items-center gap-1">
                          <FiCpu size={14} className="text-slate-400 shrink-0" />
                          {app.skills}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-slate-500 font-normal">{app.appliedDate}</td>

                      {/* Status Badge */}
                      <td className="px-6 py-4">
                        <motion.span 
                          layout
                          key={app.status}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusBadge(app.status)}`}
                        >
                          {app.status === "Pending" && <FiClock size={12} />}
                          {app.status === "Accepted" && <FiCheckCircle size={12} />}
                          {app.status === "Rejected" && <FiXCircle size={12} />}
                          {app.status}
                        </motion.span>
                      </td>

                      {/* Action Buttons */}
                      <td className="px-6 py-4 text-right">
                        <AnimatePresence mode="wait">
                          {app.status === "Pending" ? (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              className="flex justify-end gap-2"
                              key="actions"
                            >
                              {/* Accept Button */}
                              <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => handleStatusUpdate(app.id, "Accepted")}
                                className="flex items-center gap-1 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 border border-emerald-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition shadow-sm"
                                title="Accept Applicant"
                              >
                                <FiCheckCircle size={14} />
                                <span>Accept</span>
                              </motion.button>
                              
                              {/* Reject Button */}
                              <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => handleStatusUpdate(app.id, "Rejected")}
                                className="flex items-center gap-1 rounded-xl bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 border border-rose-200 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition shadow-sm"
                                title="Reject Applicant"
                              >
                                <FiXCircle size={14} />
                                <span>Reject</span>
                              </motion.button>
                            </motion.div>
                          ) : (
                            <motion.span 
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-xs text-slate-400 font-normal italic block"
                              key="decision"
                            >
                              Decision made
                            </motion.span>
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