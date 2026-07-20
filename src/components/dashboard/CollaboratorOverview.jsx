"use client";

import React from "react";
import { FiSend, FiClock, FiXCircle } from "react-icons/fi";

export default function CollaboratorOverview({ user }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Collaborator Overview</h1>
        <p className="text-sm text-slate-500">Welcome, {user?.name}! Keep an eye on your applications.</p>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card 1: Applied */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Applied Startups</p>
            <p className="text-3xl font-black text-slate-900">12</p>
          </div>
          <div className="rounded-2xl bg-indigo-50 p-4 text-indigo-600"><FiSend size={26} /></div>
        </div>

        {/* Card 2: Interviews */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Interviews Scheduled</p>
            <p className="text-3xl font-black text-slate-900">3</p>
          </div>
          <div className="rounded-2xl bg-amber-50 p-4 text-amber-600"><FiClock size={26} /></div>
        </div>

        {/* Card 3: Rejections */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Rejections</p>
            <p className="text-3xl font-black text-slate-900">2</p>
          </div>
          <div className="rounded-2xl bg-rose-50 p-4 text-rose-600"><FiXCircle size={26} /></div>
        </div>
      </div>
    </div>
  );
}