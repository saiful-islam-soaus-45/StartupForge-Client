"use client";

import React, { useEffect, useState } from "react";
import { FiSend, FiBriefcase, FiXCircle } from "react-icons/fi"; // FiBriefcase যুক্ত করা হয়েছে Opportunities এর জন্য

export default function CollaboratorOverview({ user }) {
  const [stats, setStats] = useState({
    appliedStartups: 0,
    appliedOpportunities: 0,
    rejections: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const fetchCollaboratorStats = async () => {
      try {
        setLoading(true);
        // ব্যাকএন্ডের এপিআই থেকে কোলাবোরেটরের সব অ্যাপ্লিকেশন নিয়ে আসা
        const response = await fetch(`http://localhost:5000/api/applications/${user.email}`);
        const result = await response.json();

        if (result.success && result.data) {
          const applications = result.data;

          // ১. সরাসরি স্টার্টআপে অ্যাপ্লিকেশন (যেখানে startupId আছে কিন্তু opportunityId নেই/null)
          const startupCount = applications.filter(
            (app) => app.startupId && !app.opportunityId
          ).length;

          // ২. নির্দিষ্ট অপরচুনিটি/রোলে অ্যাপ্লিকেশন (যেখানে opportunityId বিদ্যমান)
          const opportunityCount = applications.filter(
            (app) => app.opportunityId
          ).length;

          // ৩. ফাউন্ডার কর্তৃক রিজেক্টেড অ্যাপ্লিকেশন (স্ট্যাটাস "Rejected")
          // নোট: আপনার ব্যাকএন্ডে স্ট্যাটাস যেভাবে সেভ হয় ("Rejected" বা "rejected"), বানানটি সেভাবে লিখবেন
          const rejectionCount = applications.filter(
            (app) => app.status?.toLowerCase() === "rejected"
          ).length;

          setStats({
            appliedStartups: startupCount,
            appliedOpportunities: opportunityCount,
            rejections: rejectionCount,
          });
        }
      } catch (error) {
        console.error("Error fetching collaborator stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollaboratorStats();
  }, [user?.email]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Collaborator Overview</h1>
        <p className="text-sm text-slate-500">Welcome, {user?.name}! Keep an eye on your applications.</p>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card 1: Applied Startups */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Applied Startups</p>
            <p className="text-3xl font-black text-slate-900">
              {loading ? <span className="loading loading-spinner loading-sm text-indigo-600"></span> : stats.appliedStartups}
            </p>
          </div>
          <div className="rounded-2xl bg-indigo-50 p-4 text-indigo-600"><FiSend size={26} /></div>
        </div>

        {/* Card 2: Applied Opportunities */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Applied Opportunities</p>
            <p className="text-3xl font-black text-slate-900">
              {loading ? <span className="loading loading-spinner loading-sm text-amber-600"></span> : stats.appliedOpportunities}
            </p>
          </div>
          <div className="rounded-2xl bg-amber-50 p-4 text-amber-600"><FiBriefcase size={26} /></div>
        </div>

        {/* Card 3: Rejections */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Rejections</p>
            <p className="text-3xl font-black text-slate-900">
              {loading ? <span className="loading loading-spinner loading-sm text-rose-600"></span> : stats.rejections}
            </p>
          </div>
          <div className="rounded-2xl bg-rose-50 p-4 text-rose-600"><FiXCircle size={26} /></div>
        </div>
      </div>
    </div>
  );
}