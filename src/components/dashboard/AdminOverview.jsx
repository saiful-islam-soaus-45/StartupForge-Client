"use client";

import { useEffect, useState } from "react";
import {
  FiUsers,
  FiBriefcase,
  FiTrendingUp,
  FiDollarSign,
} from "react-icons/fi";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";

export default function AdminOverview() {
  const [stats, setStats] = useState({
    users: 0,
    startups: 0,
    opportunities: 0,
    revenue: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/admin/overview"
        );
        const data = await res.json();

        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: "Total Users",
      value: stats.users,
      icon: FiUsers,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Total Startups",
      value: stats.startups,
      icon: FiTrendingUp,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Total Opportunities",
      value: stats.opportunities,
      icon: FiBriefcase,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Total Revenue",
      value: `$${Number(stats.revenue).toFixed(2)}`,
      icon: FiDollarSign,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },


  ];

  const chartData = [
    {
      name: "Users",
      value: stats.users,
    },
    {
      name: "Startups",
      value: stats.startups,
    },
    {
      name: "Opportunities",
      value: stats.opportunities,
    },
    {
      name: "Revenue",
      value: stats.revenue,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900">
          Admin Overview
        </h1>
        <p className="text-slate-500 mt-2">
          Monitor your platform statistics and growth.
        </p>
      </div>

      {/* Cards */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{card.title}</p>

                  <h2 className="mt-2 text-3xl font-bold text-slate-900">
                    {card.value}
                  </h2>
                </div>

                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center ${card.bg}`}
                >
                  <Icon className={`text-2xl ${card.color}`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts & Statistics */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          Platform Performance Overview
        </h2>

        <p className="text-slate-500 mt-2">
          Track key metrics and monitor overall platform performance.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm h-[450px] ">


        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="value"
              radius={[8, 8, 0, 0]}
              fill="#4F46E5"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}