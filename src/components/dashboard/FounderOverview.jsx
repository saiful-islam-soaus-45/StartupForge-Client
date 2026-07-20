"use client";

import React from "react";
import { motion } from "framer-motion";
import { FiBriefcase, FiFileText, FiCheckCircle } from "react-icons/fi";

export default function FounderOverview({ user }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Founder Overview</h1>
        <p className="text-sm text-slate-500">Welcome, {user?.name}! Track your startup growth.</p>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card 1 */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Total Opportunities</p>
            <p className="text-3xl font-black text-slate-900">5</p>
          </div>
          <div className="rounded-2xl bg-indigo-50 p-4 text-indigo-600"><FiBriefcase size={26} /></div>
        </div>

        {/* Card 2 */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Total Applications</p>
            <p className="text-3xl font-black text-slate-900">24</p>
          </div>
          <div className="rounded-2xl bg-blue-50 p-4 text-blue-600"><FiFileText size={26} /></div>
        </div>

        {/* Card 3 */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Accepted Members</p>
            <p className="text-3xl font-black text-slate-900">8</p>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-600"><FiCheckCircle size={26} /></div>
        </div>
      </div>
    </div>
  );
}