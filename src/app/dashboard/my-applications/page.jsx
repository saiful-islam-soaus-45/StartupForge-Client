"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LuLayers } from "react-icons/lu";

export default function MyApplicationsPage({ user }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      let targetEmail = user?.email || user?.applicantEmail;
      
      if (!targetEmail) {
        targetEmail = "soausahmedbd91@gmail.com"; 
      }

      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/applications/${targetEmail}`);
        if (!res.ok) throw new Error("Failed to fetch data from server");
        
        const data = await res.json();
        if (data.success) {
          setApplications(data.data || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user, user?.email]); 

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
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
        <p className="text-xs text-slate-400 mt-2 font-medium">Fetching your applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-rose-500 text-sm w-full">
        Error: {error}. Please refresh or try again.
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
          My Applications
        </h1>
        <p className="text-xs text-slate-400 mt-1">Track the status of your sent collaboration proposals.</p>
      </div>

      {/* টেবিল কন্টেইনার */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden w-full">
        {!applications || applications.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <LuLayers className="w-5 h-5 text-slate-300" />
            </div>
            <p className="text-sm text-slate-400 font-medium">You haven't applied to any opportunities yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Opportunity Name</th>
                  <th className="py-4 px-6">Startup Name</th>
                  <th className="py-4 px-6">Applied Date</th>
                  <th className="py-4 px-6 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/30 transition-colors">
                    {/* Opportunity Name */}
                    <td className="py-4 px-6 font-semibold text-slate-800 align-middle">
                      {app.opportunityDetails?.roleTitle || "Applied Role"}
                    </td>

                    {/* Startup Name */}
                    <td className="py-4 px-6 text-slate-600 align-middle">
                      <div className="flex items-center gap-2">
                        {app.startupDetails?.logo && (
                          <img
                            src={app.startupDetails.logo}
                            alt={app.startupDetails.name}
                            className="w-6 h-6 rounded-md object-cover border border-slate-100"
                          />
                        )}
                        <span className="font-medium">
                          {app.startupDetails?.name || `ID: ${app.opportunityId}`}
                        </span>
                      </div>
                    </td>

                    {/* Applied Date */}
                    <td className="py-4 px-6 text-xs text-slate-400 font-medium align-middle">
                      {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }) : "N/A"}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6 text-center align-middle">
                      <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusClass(app.status)}`}>
                        {app.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}