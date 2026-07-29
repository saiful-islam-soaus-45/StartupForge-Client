"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { FiUser, FiMail, FiShield, FiCheckCircle } from "react-icons/fi";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestProfile = async () => {
      if (session?.user?.email) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/profile/${session.user.email}`);
          const data = await res.json();
          if (data.success && data.data) {
            setProfileData(data.data);
          } else {
            setProfileData(session.user);
          }
        } catch (error) {
          console.error("Failed to fetch profile:", error);
          setProfileData(session.user);
        } finally {
          setLoading(false);
        }
      }
    };

    if (!sessionLoading) {
      fetchLatestProfile();
    }
  }, [session, sessionLoading]);

  if (sessionLoading || loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4 bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h2>
        <p className="text-slate-500 mb-6">Please log in to view your profile details.</p>
        <a
          href="/auth/login"
          className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-indigo-700 transition"
        >
          Go to Login
        </a>
      </div>
    );
  }

  const userInfo = profileData || session.user;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/30 via-white to-white py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto space-y-6"
      >
        {/* Profile Header Card */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-100">
          <div className="absolute top-0 left-0 h-32 w-full bg-gradient-to-r from-indigo-500 to-purple-600 opacity-90" />

          <div className="relative mt-12 flex flex-col sm:flex-row items-center sm:items-end gap-6">
            <img
              src={userInfo.image || `https://api.dicebear.com/7.x/initials/svg?seed=${userInfo.name}`}
              alt="Profile Avatar"
              className="h-28 w-28 rounded-2xl border-4 border-white object-cover shadow-lg bg-white"
            />
            <div className="text-center sm:text-left flex-1 pb-1">
              <h1 className="text-2xl font-black text-slate-900 capitalize">{userInfo.name}</h1>
              <p className="text-sm font-medium text-slate-500 flex items-center justify-center sm:justify-start gap-1.5 mt-1">
                <FiMail size={14} className="text-indigo-600" /> {userInfo.email}
              </p>
            </div>
            <div className="mb-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-bold text-indigo-600 border border-indigo-100 uppercase tracking-wide">
                <FiShield size={12} /> {userInfo.role || "User"}
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <FiUser className="text-indigo-600" /> Account Details
            </h3>

            <div className="space-y-3 text-sm">
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</span>
                <span className="font-semibold text-slate-800 capitalize">{userInfo.name}</span>
              </div>

              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</span>
                <span className="font-semibold text-slate-800">{userInfo.email}</span>
              </div>

              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Role</span>
                <span className="font-semibold text-indigo-600 capitalize">{userInfo.role || "Standard User"}</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <FiCheckCircle className="text-emerald-500" /> Status & Security
            </h3>

            <div className="space-y-3 text-sm">
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Account Status</span>
                <span className="inline-flex items-center gap-1.5 font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md mt-1 text-xs">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Active & Verified
                </span>
              </div>

              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Authentication Provider</span>
                <span className="font-semibold text-slate-800 capitalize">Credentials / Better-Auth</span>
              </div>

              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Joined Date</span>
                <span className="font-semibold text-slate-800">
                  {userInfo.createdAt ? new Date(userInfo.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }) : "Recent"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}