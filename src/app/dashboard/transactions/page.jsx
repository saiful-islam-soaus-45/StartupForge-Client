"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const {data: tokenData} = await authClient.token();
            const res = await fetch(
                "${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/transactions",
                {
                    headers: {
                        'Authorization': `Bearer ${tokenData?.token}`
                    }
                }
            );

            const data = await res.json();

            if (data.success) {
                setTransactions(data.data);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="flex items-center justify-center h-80"
            >
                <p className="text-slate-500">Loading transactions...</p>
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
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
            >
                <h1 className="text-3xl font-bold text-slate-800">
                    Transactions
                </h1>

                <p className="text-slate-500 mt-2">
                    View all subscription payments.
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
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Amount ($)</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Payment Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {transactions.map((item, index) => (
                            <motion.tr
                                key={item._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: index * 0.04 }}
                                className="border-t hover:bg-slate-50 transition-colors"
                            >
                                <td className="px-6 py-4 font-semibold">
                                    {item.userName}
                                </td>

                                <td className="px-6 py-4">
                                    {item.userEmail}
                                </td>

                                <td className="px-6 py-4 font-medium">
                                    {item.amount}
                                </td>

                                <td className="px-6 py-4">
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </td>

                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-semibold">
                                        {item.paymentStatus}
                                    </span>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>

            {/* Mobile Cards */}
            <div className="grid gap-5 lg:hidden">
                {transactions.map((item, index) => (
                    <motion.div
                        key={item._id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
                    >
                        <h2 className="font-bold text-slate-800">
                            {item.userName}
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            {item.userEmail}
                        </p>

                        <div className="mt-4 space-y-2 text-sm">
                            <p>
                                <span className="font-semibold">
                                    Amount:
                                </span>{" "}
                                ${item.amount}
                            </p>

                            <p>
                                <span className="font-semibold">
                                    Date:
                                </span>{" "}
                                {new Date(item.createdAt).toLocaleDateString()}
                            </p>

                            <p>
                                <span className="font-semibold">
                                    Status:
                                </span>{" "}
                                <span className="text-green-600 font-semibold">
                                    {item.paymentStatus}
                                </span>
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {transactions.length === 0 && (
                <div className="text-center py-16 text-slate-500">
                    No transactions found.
                </div>
            )}
        </motion.div>
    );
}