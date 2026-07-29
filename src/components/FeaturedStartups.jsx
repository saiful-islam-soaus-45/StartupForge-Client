"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight, FiMail, FiCalendar } from "react-icons/fi";

export default function FeaturedStartups() {
    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStartups = async () => {
            try {
                const res = await fetch(
                    "${process.env.NEXT_PUBLIC_SERVER_URL}/api/public/startups?limit=6"
                );

                const data = await res.json();

                if (data.success) {
                    setStartups(data.data || []);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStartups();
    }, []);

    if (loading) {
        return (
            <section className="py-20">
                <div className="flex justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
                </div>
            </section>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";

        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 25 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" },
        },
    };

    return (
        <section className="relative w-full overflow-hidden bg-gradient-to-b from-indigo-50/40 via-white to-white py-16">
            <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-200/20 to-purple-200/20 blur-[120px]" />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="mx-auto max-w-7xl px-6 relative"
            >
                {/* Header Section */}
                <motion.div variants={itemVariants} className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-slate-950 tracking-tight sm:text-4xl bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                            Latest Startup Teams
                        </h2>
                        <p className="mt-3 text-base sm:text-lg text-slate-500 max-w-2xl font-medium leading-relaxed">
                            Discover the newest startups looking for talented collaborators.
                        </p>
                    </div>
                </motion.div>

                {/* Empty State */}
                {startups.length === 0 ? (
                    <motion.div
                        variants={itemVariants}
                        className="text-center py-24 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200"
                    >
                        <p className="text-slate-400 font-semibold tracking-wide">There are no approved startups available yet.</p>
                    </motion.div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {startups.map((startup) => (
                            <motion.div
                                key={startup._id}
                                variants={itemVariants}
                                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300"
                            >
                                <div>
                                    {/* Logo + Industry */}
                                    <div className="flex items-start justify-between gap-3 mb-4">
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 font-bold text-xl overflow-hidden border border-slate-200 shadow-sm group-hover:scale-105 transition-transform duration-300">
                                            {startup.logo ? (
                                                <img
                                                    src={startup.logo}
                                                    alt={startup.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                startup.name?.charAt(0).toUpperCase()
                                            )}
                                        </div>

                                        <span className="inline-flex rounded-lg bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600 border border-indigo-100/50 uppercase tracking-wider">
                                            {startup.industry || "General"}
                                        </span>
                                    </div>

                                    <div>
                                        {/* Name */}
                                        <h3 className="text-xl font-extrabold text-slate-900 capitalize tracking-tight group-hover:text-indigo-600 transition-colors duration-200 line-clamp-1">
                                            {startup.name}
                                        </h3>

                                        <div className="w-6 h-[2px] bg-indigo-600/30 my-3 group-hover:w-12 transition-all duration-300 rounded-full" />

                                        {/* Info */}
                                        <div className="space-y-2.5 mt-4">
                                            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-medium break-all">
                                                <FiMail size={15} className="text-slate-400 shrink-0" />
                                                <span className="line-clamp-1">{startup.founderEmail}</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium italic">
                                                <FiCalendar size={15} className="text-slate-400 shrink-0" />
                                                <span>Created: {formatDate(startup.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Button */}
                                <div className="mt-6 pt-4 border-t border-slate-100">
                                    <Link
                                        href={`/browse-startups/${startup._id}`}
                                        className="flex items-center justify-center gap-2 w-full rounded-xl bg-indigo-600 px-4 py-3 text-xs font-bold text-white hover:bg-indigo-700 shadow-md hover:shadow-lg hover:shadow-indigo-100 transition-all duration-200 group/btn"
                                    >
                                        Details
                                        <FiArrowRight
                                            size={14}
                                            className="group-hover/btn:translate-x-0.5 transition-transform duration-200"
                                        />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* View All Startups Link at bottom right */}
                {!loading && startups.length > 0 && (
                    <motion.div variants={itemVariants} className="mt-10 flex justify-end">
                        <Link
                            href="/browse-startups"
                            className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition group"
                        >
                            View All Startups 
                            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                        </Link>
                    </motion.div>
                )}
            </motion.div>
        </section>
    );
}