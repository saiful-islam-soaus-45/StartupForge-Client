"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ManageUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/admin/users");
            const data = await res.json();

            if (data.success) {
                setUsers(data.data);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatus = async (id, status) => {
        try {
            const res = await fetch(
                `http://localhost:5000/api/admin/users/${id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        status,
                    }),
                }
            );

            const data = await res.json();

            if (data.success) {
                fetchUsers();
            }
        } catch (err) {
            console.log(err);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-20 text-slate-500">
                Loading users...
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
                <h1 className="text-3xl font-bold text-slate-900">
                    Manage Users
                </h1>

                <p className="text-slate-500 mt-2">
                    View, Block and Unblock platform users.
                </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto">
                <table className="min-w-[750px] w-full">
                    <thead className="bg-slate-50">
                        <tr className="text-left text-sm text-slate-600">
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((user) => (
                            <tr
                                key={user._id}
                                className="border-t hover:bg-slate-50"
                            >
                                <td className="px-6 py-4 font-medium">
                                    {user.name}
                                </td>

                                <td className="px-6 py-4">
                                    {user.email}
                                </td>

                                <td className="px-6 py-4 capitalize">
                                    {user.role}
                                </td>

                                <td className="px-6 py-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${user.status === "blocked"
                                            ? "bg-red-100 text-red-600"
                                            : "bg-green-100 text-green-600"
                                            }`}
                                    >
                                        {user.status || "active"}
                                    </span>
                                </td>

                                <td className="px-6 py-4 text-center whitespace-nowrap">
                                    {user.status === "blocked" ? (
                                        <button
                                            onClick={() => handleStatus(user._id, "active")}
                                            className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-medium cursor-pointer"
                                        >
                                            Unblock
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleStatus(user._id, "blocked")}
                                            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium cursor-pointer"
                                        >
                                            Block
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}