"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { FiUser, FiImage, FiSave, FiUpload } from "react-icons/fi";

export default function DashboardProfilePage() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // ImgBB API Key
  const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "970abc38b137d87cc59368c9a1e16fde";

  useEffect(() => {
    if (session?.user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(session.user.name || "");
      setImage(session.user.image || "");
    }
  }, [session]);

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
        setImage(data.data.url);
        alert("Image uploaded successfully!");
      } else {
        alert("Failed to upload image. Check your API key.");
      }
    } catch (err) {
      console.error("ImgBB upload error:", err);
      alert("Something went wrong while uploading image");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!session?.user?.email) return;

    setLoading(true);

    try {

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/profile/${session.user.email}`,
        {
          method: "put",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            image,
          }),
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        try {
          await authClient.getSession();
        } catch (err) {
          console.error("Session refresh error:", err);
        }

        alert("Profile Updated Successfully!");
        
        window.location.href = "/profile";
      } else {
        alert(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (sessionLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-xl mx-auto bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-100"
    >
      <div className="border-b border-slate-100 pb-5 mb-6">
        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <FiUser className="text-indigo-600" /> Edit Profile
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Update your display name and profile picture.
        </p>
      </div>

      <form onSubmit={handleUpdate} className="space-y-5">
        {/* Name Field */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Full Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 transition bg-slate-50/50 text-slate-700"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <FiImage size={14} /> Profile Picture
          </label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">

            <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-slate-300 hover:border-indigo-600 transition bg-slate-50/30 cursor-pointer text-sm font-medium text-slate-600">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
              {uploading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></span>
                  <span className="text-xs text-slate-400">Uploading...</span>
                </>
              ) : (
                <>
                  <FiUpload className="w-4 h-4 text-indigo-600" />
                  <span>Upload Image</span>
                </>
              )}
            </label>


            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Or paste image URL"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 transition bg-slate-50/50 text-slate-700"
            />
          </div>
        </div>

        {/* Image Preview */}
        {image && (
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <img
              src={image}
              alt="Preview"
              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm"
            />
            <span className="text-xs text-slate-500 font-medium">Image Preview Ready</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition shadow-md shadow-indigo-100 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
          ) : (
            <>
              <FiSave size={16} /> Save Changes
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}