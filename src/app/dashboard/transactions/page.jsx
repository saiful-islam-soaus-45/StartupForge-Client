"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const res = await fetch(
                "http://localhost:5000/api/admin/transactions"
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
            <div className="flex items-center justify-center h-80">
                <p className="text-slate-500">Loading transactions...</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
        >
            <div>
                <h1 className="text-3xl font-bold text-slate-800">
                    Transactions
                </h1>

                <p className="text-slate-500 mt-2">
                    View all subscription payments.
                </p>
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 overflow-hidden">
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
                        {transactions.map((item) => (
                            <tr
                                key={item._id}
                                className="border-t hover:bg-slate-50"
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="grid gap-5 lg:hidden">
                {transactions.map((item) => (
                    <div
                        key={item._id}
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
                    </div>
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