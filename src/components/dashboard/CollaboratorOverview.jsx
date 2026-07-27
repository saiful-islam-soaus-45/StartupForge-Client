"use client";

import React, { useEffect, useState } from "react";
import { FiSend, FiBriefcase, FiXCircle } from "react-icons/fi"; // FiBriefcase যুক্ত করা হয়েছে Opportunities এর জন্য
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

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

  const chartData = [
    {
      name: "Startups",
      value: stats.appliedStartups,
    },
    {
      name: "Opportunities",
      value: stats.appliedOpportunities,
    },
    {
      name: "Rejected",
      value: stats.rejections,
    },
  ];

  const COLORS = ["#4F46E5", "#F59E0B", "#EF4444"];

  return (
    <div className="space-y-8">

  {/* Stats Cards */}
  <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

    {/* Applied Startups */}
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase text-slate-400">
            Applied Startups
          </p>

          <h2 className="mt-2 text-3xl font-black text-slate-900">
            {loading ? (
              <span className="loading loading-spinner loading-sm text-indigo-600"></span>
            ) : (
              stats.appliedStartups
            )}
          </h2>
        </div>

        <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
          <FiSend size={26} />
        </div>
      </div>
    </div>

    {/* Applied Opportunities */}
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase text-slate-400">
            Applied Opportunities
          </p>

          <h2 className="mt-2 text-3xl font-black text-slate-900">
            {loading ? (
              <span className="loading loading-spinner loading-sm text-amber-600"></span>
            ) : (
              stats.appliedOpportunities
            )}
          </h2>
        </div>

        <div className="h-14 w-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
          <FiBriefcase size={26} />
        </div>
      </div>
    </div>

    {/* Rejections */}
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase text-slate-400">
            Rejections
          </p>

          <h2 className="mt-2 text-3xl font-black text-slate-900">
            {loading ? (
              <span className="loading loading-spinner loading-sm text-rose-600"></span>
            ) : (
              stats.rejections
            )}
          </h2>
        </div>

        <div className="h-14 w-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
          <FiXCircle size={26} />
        </div>
      </div>
    </div>
  </div>

  {/* Pie Chart */}
  <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

    <h2 className="text-2xl font-bold text-slate-900">
      Application Analytics
    </h2>

    <p className="mt-1 text-sm text-slate-500">
      Distribution of your startup and opportunity applications.
    </p>

    <div className="mt-8 h-[420px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={[
              {
                name: "Startups",
                value: stats.appliedStartups,
              },
              {
                name: "Opportunities",
                value: stats.appliedOpportunities,
              },
              {
                name: "Rejected",
                value: stats.rejections,
              },
            ]}
            cx="50%"
            cy="50%"
            outerRadius={140}
            dataKey="value"
            label
          >
            <Cell fill="#6366F1" />
            <Cell fill="#F59E0B" />
            <Cell fill="#EF4444" />
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>

  </div>

</div>
  );
}