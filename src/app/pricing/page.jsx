"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiCheck, FiZap } from "react-icons/fi";

export default function PricingPage() {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div className="flex min-h-[85vh] items-center justify-center bg-slate-50/50 px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-100/80"
            >
                {/* হেডার */}
                <div className="text-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600 mb-3">
                        <FiZap size={14} /> Pro Plan
                    </span>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                        Unlock Unlimited Growth
                    </h1>
                    <p className="mt-2 text-xs text-slate-500 font-medium">
                        Upgrade your founder account to create unlimited opportunities and scale your startup.
                    </p>
                </div>

                {/* প্রাইসিং কার্ড */}
                <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/60 p-6 text-center">
                    <div className="flex items-baseline justify-center gap-1">
                        <span className="text-3xl font-black text-slate-900">$15</span>
                        <span className="text-xs font-semibold text-slate-400">/ month</span>
                    </div>

                    <ul className="mt-6 space-y-3 text-left">
                        <li className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                <FiCheck size={12} />
                            </div>
                            Create unlimited opportunities (Bypass 3-limit)
                        </li>
                        <li className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                <FiCheck size={12} />
                            </div>
                            Priority listing on browse startups
                        </li>
                        <li className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                <FiCheck size={12} />
                            </div>
                            24/7 dedicated support
                        </li>
                    </ul>

                    {/* ফর্ম সাবমিট */}
                    <div className="mt-8">
                        <form 
                            action='/api/subcription'
                            method="POST"
                            onSubmit={() => setIsLoading(true)}
                        >
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isLoading}
                                className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 text-xs font-semibold text-white shadow-md hover:opacity-95 disabled:opacity-70 transition-all cursor-pointer"
                            >
                                {isLoading ? "Redirecting to Checkout..." : "Upgrade to Pro Now"}
                            </motion.button>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}