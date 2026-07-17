import React from 'react';

const DashboardHomepage = () => {
  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Overview</h1>
        <p className="text-sm text-slate-500">Welcome back! Here is what&apos;s happening with your startups today.</p>
      </div>

      {/* Content Placeholder Grid */}
      <div className="grid h-[60vh] place-items-center rounded-2xl border-2 border-dashed border-slate-200 bg-white">
        <div className="text-center space-y-2">
          <p className="text-lg font-bold text-slate-700">Dashboard homepage content goes here</p>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">Select any option from the left sidebar to start managing opportunities and checking applications.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHomepage;