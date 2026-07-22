"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LuUser, LuSave, LuImage, LuBriefcase, LuUpload } from "react-icons/lu";

export default function ProfilePage({ user }) {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    skills: "",
    bio: "",
  });

  // 🎯 আপনার দেওয়া ImgBB API Key এবং এনভায়রনমেন্ট ভেরিয়েবল ফলব্যাক
  const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "970abc38b137d87cc59368c9a1e16fde";

  // ডাটাবেজ বা সেশন থেকে ডিফল্ট ডাটা লোড করা
  useEffect(() => {
    // ১. শুরুতে সেশনের ডিফল্ট ডাটা দিয়ে ফর্ম সেট করে রাখা
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        image: user.image || "",
      }));
    }

    // ২. ডাটাবেজে আগে থেকে কোনো সেভ করা প্রোফাইল থাকলে তা ব্যাকএন্ড থেকে ফেচ করা
    const fetchProfile = async () => {
      const targetEmail = user?.email || "soausahmedbd91@gmail.com";

      try {
        const res = await fetch(`http://localhost:5000/api/profile/${targetEmail}`);
        const resData = await res.json();
        
        if (resData.success && resData.data) {
          setFormData({
            name: resData.data.name || user?.name || "",
            image: resData.data.image || user?.image || "",
            skills: resData.data.skills || "",
            bio: resData.data.bio || "",
          });
        }
      } catch (error) {
        console.error("Error fetching database profile:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, [user]);

  // 📸 ImgBB-তে ইমেজ আপলোড হ্যান্ডলার
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append("image", file);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: uploadData,
      });
      const data = await res.json();

      if (data.success) {
        setFormData((prev) => ({ ...prev, image: data.data.url }));
        alert("Image uploaded successfully to ImgBB!");
      } else {
        alert("Failed to upload image to ImgBB. Check your API key.");
      }
    } catch (err) {
      console.error("ImgBB upload error:", err);
      alert("Something went wrong while uploading image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const targetEmail = user?.email || "soausahmedbd91@gmail.com";

    try {
      const res = await fetch(`http://localhost:5000/api/profile/${targetEmail}`, {
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
      className="max-w-2xl mx-auto text-slate-700"
    >
      <div className="w-full bg-white p-6 md:p-8 rounded-2xl border border-slate-200/60 shadow-sm">
        {/* হেডার */}
        <div className="border-b border-slate-100 pb-5 mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <LuUser className="text-[#6366F1] w-5 h-5" />
              My Profile
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Update your personal details, avatar, skills, and bio.
            </p>
          </div>
          
          {/* প্রোফাইল প্রিভিউ অ্যাভাটার */}
          <div className="h-14 w-14 rounded-full bg-slate-50 border border-slate-200 overflow-hidden shadow-inner flex items-center justify-center relative">
            {formData.image ? (
              <img src={formData.image} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg font-bold text-slate-400">
                {formData.name ? formData.name.charAt(0).toUpperCase() : "C"}
              </span>
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
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#6366F1] transition bg-slate-50/50 focus:bg-white text-slate-700"
            />
          </div>

          {/* Profile Image Uploader */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <LuImage className="w-3.5 h-3.5" /> Profile Image
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* ফাইল আপলোডার বাটন */}
              <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-slate-300 hover:border-[#6366F1] transition bg-slate-50/30 cursor-pointer text-sm font-medium text-slate-600">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
                {uploading ? (
                  <>
                    <span className="loading loading-spinner loading-sm text-[#6366F1]"></span>
                    <span className="text-xs text-slate-400">Uploading to ImgBB...</span>
                  </>
                ) : (
                  <>
                    <LuUpload className="w-4 h-4 text-[#6366F1]" />
                    <span>Upload via ImgBB</span>
                  </>
                )}
              </label>

              {/* জেনারেটেড ইউআরএল ভিউ/পেস্ট ফিল্ড */}
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="Or paste an image URL directly"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#6366F1] transition bg-slate-50/50 focus:bg-white text-slate-700"
              />
            </div>
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
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#6366F1] transition bg-slate-50/50 focus:bg-white text-slate-700"
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
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#6366F1] transition bg-slate-50/50 focus:bg-white resize-none text-slate-700 leading-relaxed"
            />
          </div>

          {/* সেভ বাটন */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading || uploading}
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