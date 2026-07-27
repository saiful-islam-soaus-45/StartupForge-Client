"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiBriefcase, FiFileText, FiCheckCircle } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

export default function FounderOverview({ user: propUser }) {
  const [stats, setStats] = useState({
    totalOpportunities: 0,
    totalApplications: 0,
    acceptedMembers: 0,
  });
  const [loading, setLoading] = useState(true);

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    let founderEmail = propUser?.email || propUser?.user?.email || session?.user?.email;

    if (!founderEmail) {
      try {
        const localData = localStorage.getItem("user");
        if (localData) {
          const parsed = JSON.parse(localData);
          founderEmail = parsed?.email || parsed?.user?.email || parsed?.userEmail;
        }
      } catch (err) {
        console.error("Error reading localStorage user:", err);
      }
    }

    const identifier = founderEmail || propUser?.id || propUser?.user?._id || session?.user?.id;

    if (!identifier) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }

    const fetchFounderStats = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/founder/stats?email=${encodeURIComponent(identifier)}`);
        const data = await res.json();

        if (data.success && data.data) {
          setStats({
            totalOpportunities: data.data.totalOpportunities || 0,
            totalApplications: data.data.totalApplications || 0,
            acceptedMembers: data.data.acceptedMembers || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching founder stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFounderStats();
  }, [propUser, session, isPending]);

  const pieData = [
    {
      name: "Opportunities",
      value: stats.totalOpportunities,
    },
    {
      name: "Applications",
      value: stats.totalApplications,
    },
    {
      name: "Accepted",
      value: stats.acceptedMembers,
    },
  ];

  const COLORS = ["#4F46E5", "#3B82F6", "#10B981"];

  const currentUserName = propUser?.name || propUser?.user?.name || session?.user?.name || "Founder";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
  className="space-y-8"
>
  {/* Header */}
  <motion.div variants={itemVariants}>
    <h1 className="text-3xl font-bold text-slate-900">
      Founder Overview
    </h1>

    <p className="text-slate-500 mt-2">
      Welcome back, {currentUserName}! Track your startup growth.
    </p>
  </motion.div>

  {/* Cards */}
  <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

    {/* Card 1 */}
    <motion.div
      variants={itemVariants}
      className="group rounded-2xl border border-slate-200/60 bg-slate-50/60 p-6 shadow-sm hover:shadow-xl hover:bg-white hover:border-indigo-100 transition-all duration-300 flex items-center justify-between"
    >
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Total Opportunities
        </p>

        <p className="text-3xl font-black text-slate-900 mt-1 group-hover:text-indigo-600 transition">
          {loading ? (
            <span className="loading loading-spinner loading-sm text-indigo-600"></span>
          ) : (
            stats.totalOpportunities
          )}
        </p>
      </div>

      <div className="rounded-2xl bg-indigo-50 p-4 text-indigo-600">
        <FiBriefcase size={26} />
      </div>
    </motion.div>

    {/* Card 2 */}
    <motion.div
      variants={itemVariants}
      className="group rounded-2xl border border-slate-200/60 bg-slate-50/60 p-6 shadow-sm hover:shadow-xl hover:bg-white hover:border-blue-100 transition-all duration-300 flex items-center justify-between"
    >
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Total Applications
        </p>

        <p className="text-3xl font-black text-slate-900 mt-1 group-hover:text-blue-600 transition">
          {loading ? (
            <span className="loading loading-spinner loading-sm text-blue-600"></span>
          ) : (
            stats.totalApplications
          )}
        </p>
      </div>

      <div className="rounded-2xl bg-blue-50 p-4 text-blue-600">
        <FiFileText size={26} />
      </div>
    </motion.div>

    {/* Card 3 */}
    <motion.div
      variants={itemVariants}
      className="group rounded-2xl border border-slate-200/60 bg-slate-50/60 p-6 shadow-sm hover:shadow-xl hover:bg-white hover:border-emerald-100 transition-all duration-300 flex items-center justify-between"
    >
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Accepted Members
        </p>

        <p className="text-3xl font-black text-slate-900 mt-1 group-hover:text-emerald-600 transition">
          {loading ? (
            <span className="loading loading-spinner loading-sm text-emerald-600"></span>
          ) : (
            stats.acceptedMembers
          )}
        </p>
      </div>

      <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-600">
        <FiCheckCircle size={26} />
      </div>
    </motion.div>

  </div>

  {/* Founder Analytics */}
  <motion.div
    variants={itemVariants}
    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
  >
    <h2 className="text-2xl font-bold text-slate-900">
      Founder Analytics
    </h2>

    <p className="text-sm text-slate-500 mt-2">
      Overview of opportunities, applications and accepted members.
    </p>

    <div className="h-[380px] mt-8">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={130}
            paddingAngle={5}
            label
          >
            {pieData.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />

          <Legend
            verticalAlign="bottom"
            height={40}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </motion.div>

</motion.div>
  );
}