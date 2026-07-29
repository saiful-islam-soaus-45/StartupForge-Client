"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";

export default function ManageStartupsPage() {
    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        fetchStartups();
    }, []);

    const fetchStartups = async () => {
        try {
            const {data: tokenData} = await authClient.token();
            const res = await fetch("http://localhost:5000/api/admin/startups", {
                headers: {
                    'Authorization': `Bearer ${tokenData?.token}`
                }
            });
            const data = await res.json();

            if (data.success) {
                setStartups(data.data);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus =
            currentStatus === "approved"
                ? "removed"
                : "approved";

        try {
            const {data: tokenData} = await authClient.token();
            const res = await fetch(
                `http://localhost:5000/api/admin/startups/${id}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${tokenData?.token}`
                    },
                    body: JSON.stringify({
                        status: newStatus,
                    }),
                }
            );

            const data = await res.json();

            if (data.success) {
                fetchStartups();
            }
        } catch (err) {
            console.log(err);
        }
    };

    if (loading) {
        return (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="py-20 text-center text-slate-500"
            >
                Loading startups...
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
        >
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
            >
                <h1 className="text-3xl font-bold text-slate-800">
                    Manage Startups
                </h1>

                <p className="text-slate-500 mt-2">
                    Approve or remove startups from the platform.
                </p>
            </motion.div>

            {/* Desktop Table */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="hidden lg:block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
            >
                <table className="w-full">
                    <thead className="bg-slate-50">
                        <tr className="text-left text-sm text-slate-600">
                            <th className="px-6 py-4">Logo</th>
                            <th className="px-6 py-4">Startup</th>
                            <th className="px-6 py-4">Founder</th>
                            <th className="px-6 py-4">Industry</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {startups.map((startup, index) => (
                            <motion.tr
                                key={startup._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: index * 0.04 }}
                                className="border-t hover:bg-slate-50 transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <img
                                        src={startup.logo}
                                        alt={startup.name}
                                        className="w-10 h-10 rounded-lg object-cover"
                                    />
                                </td>

                                <td className="px-6 py-4 font-semibold">
                                    {startup.name}
                                </td>

                                <td className="px-6 py-4">
                                    {startup.founderEmail}
                                </td>

                                <td className="px-6 py-4">
                                    {startup.industry}
                                </td>

                                <td className="px-6 py-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${startup.status === "approved"
                                            ? "bg-green-100 text-green-600"
                                            : startup.status === "removed"
                                                ? "bg-red-100 text-red-600"
                                                : "bg-yellow-100 text-yellow-700"
                                            }`}
                                    >
                                        {startup.status}
                                    </span>
                                </td>

                                <td className="px-6 py-4">
                                    <div className="flex justify-center">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() =>
                                                handleToggleStatus(startup._id, startup.status)
                                            }
                                            className={`px-4 py-2 rounded-lg text-white text-sm cursor-pointer transition shadow-sm ${startup.status === "approved"
                                                ? "bg-red-500 hover:bg-red-600"
                                                : "bg-green-600 hover:bg-green-700"
                                                }`}
                                        >
                                            {startup.status === "approved"
                                                ? "Remove"
                                                : "Approve"}
                                        </motion.button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>

            {/* Mobile + Tablet Cards */}
            <div className="grid gap-5 lg:hidden">
                {startups.map((startup, index) => (
                    <motion.div
                        key={startup._id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
                    >
                        <div className="flex items-center gap-4">
                            <img
                                src={startup.logo}
                                alt={startup.name}
                                className="w-14 h-14 rounded-xl object-cover"
                            />

                            <div>
                                <h2 className="font-bold text-slate-800">
                                    {startup.name}
                                </h2>

                                <p className="text-sm text-slate-500">
                                    {startup.industry}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2 text-sm">
                            <p>
                                <span className="font-semibold">Founder:</span>{" "}
                                {startup.founderEmail}
                            </p>

                            <p>
                                <span className="font-semibold">Status:</span>{" "}
                                <span
                                    className={`font-semibold ${startup.status === "approved"
                                        ? "text-green-600"
                                        : startup.status === "removed"
                                            ? "text-red-600"
                                            : "text-yellow-600"
                                        }`}
                                >
                                    {startup.status}
                                </span>
                            </p>
                        </div>

                        <div className="mt-5">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() =>
                                    handleToggleStatus(startup._id, startup.status)
                                }
                                className={`w-full py-2 rounded-xl text-white cursor-pointer transition shadow-sm ${startup.status === "approved"
                                    ? "bg-red-500 hover:bg-red-600"
                                    : "bg-green-600 hover:bg-green-700"
                                    }`}
                            >
                                {startup.status === "approved"
                                    ? "Remove"
                                    : "Approve"}
                            </motion.button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}