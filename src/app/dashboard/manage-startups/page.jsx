"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ManageStartupsPage() {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchStartups();
  }, []);

  const fetchStartups = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/startups");
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

  const handleApprove = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/startups/${id}/approve`,
        {
          method: "PATCH",
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

  const handleDelete = async (id) => {
    const confirmDelete = confirm(
      "Are you sure you want to remove this startup?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/startups/${id}`,
        {
          method: "DELETE",
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
      <div className="py-20 text-center text-slate-500">
        Loading startups...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Manage Startups
        </h1>

        <p className="text-slate-500 mt-2">
          Approve or remove startups from the platform.
        </p>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 overflow-hidden">
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
            {startups.map((startup) => (
              <tr
                key={startup._id}
                className="border-t hover:bg-slate-50"
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
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      startup.status === "approved"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {startup.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    {startup.status !== "approved" && (
                      <button
                        onClick={() =>
                          handleApprove(startup._id)
                        }
                        className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm cursor-pointer"
                      >
                        Approve
                      </button>
                    )}

                    <button
                      onClick={() =>
                        handleDelete(startup._id)
                      }
                      className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile + Tablet Cards */}
      <div className="grid gap-5 lg:hidden">
        {startups.map((startup) => (
          <div
            key={startup._id}
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
                  className={`font-semibold ${
                    startup.status === "approved"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {startup.status}
                </span>
              </p>
            </div>

            <div className="flex gap-3 mt-5">
              {startup.status !== "approved" && (
                <button
                  onClick={() =>
                    handleApprove(startup._id)
                  }
                  className="flex-1 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                >
                  Approve
                </button>
              )}

              <button
                onClick={() =>
                  handleDelete(startup._id)
                }
                className="flex-1 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}