"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LuUser, LuSave, LuImage, LuBriefcase } from "react-icons/lu";

export default function ProfilePage({ user }) {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    skills: "",
    bio: "",
  });

  // ডাটাবেজ থেকে ইউজারের বর্তমান প্রোফাইল ডাটা লোড করা
  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:5000/api/profile/${user.email}`)
        .then((res) => res.json())
        .then((resData) => {
          if (resData.success && resData.data) {
            setFormData({
              name: resData.data.name || user.name || "",
              image: resData.data.image || user.image || "",
              skills: resData.data.skills || "",
              bio: resData.data.bio || "",
            });
          }
          setFetching(false);
        })
        .catch(() => {
          // ফেইল করলে সেশনের ডিফল্ট ডাটা বসবে
          setFormData((prev) => ({
            ...prev,
            name: user.name || "",
            image: user.image || "",
          }));
          setFetching(false);
        });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:5000/api/profile/${user?.email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const resData = await res.json();
      if (res.ok && resData.success) {
        alert("Profile updated successfully!");
      } else {
        alert(resData.message || "Failed to update profile");
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400">
        <span className="loading loading-spinner loading-md text-[#6366F1]"></span>
        <p className="mt-2 text-xs font-medium">Loading profile data...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-2xl mx-auto"
    >
      <div className="w-full bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
        {/* হেডার */}
        <div className="border-b border-slate-50 pb-5 mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <LuUser className="text-[#6366F1] w-5 h-5" />
              My Profile
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Update your personal details, avatar url, skills, and bio.
            </p>
          </div>
          
          {/* প্রোফাইল প্রিভিউ অ্যাভাটার */}
          <div className="h-14 w-14 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shadow-inner flex items-center justify-center">
            {formData.image ? (
              <img src={formData.image} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg font-bold text-slate-400">{formData.name ? formData.name.charAt(0).toUpperCase() : "C"}</span>
            )}
          </div>
        </div>

        {/* ফর্ম সেকশন */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., John Doe"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#6366F1] transition bg-slate-50/50 focus:bg-white text-slate-700 font-sans"
            />
          </div>

          {/* Profile Image URL */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <LuImage className="w-3.5 h-3.5" /> Image URL
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://images.unsplash.com/your-avatar-link"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#6366F1] transition bg-slate-50/50 focus:bg-white text-slate-700 font-sans"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <LuBriefcase className="w-3.5 h-3.5" /> Skills
            </label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              placeholder="e.g., React, Node.js, Tailwind CSS, Figma"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#6366F1] transition bg-slate-50/50 focus:bg-white text-slate-700 font-sans"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Separate individual skills with a comma ( , )</span>
          </div>

          {/* Professional Bio */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Professional Bio
            </label>
            <textarea
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Write a brief intro about your expertise and passion..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#6366F1] transition bg-slate-50/50 focus:bg-white resize-none text-slate-700 font-sans leading-relaxed"
            />
          </div>

          {/* সেভ বাটন */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <>
                <LuSave className="w-4 h-4" />
                <span>Save Profile Settings</span>
              </>
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}