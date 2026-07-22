"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LuLayoutDashboard, LuFolderHeart, LuUser } from "react-icons/lu";
import { HiOutlineArrowLeft, HiBars3 } from "react-icons/hi2";

export default function CollaboratorSidebar({ user }) {
  const router = useRouter();
  const currentPath = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  
  // 🎯 ডাইনামিক প্রোফাইল স্টেট (লাইভ ডাটা সিঙ্কের জন্য)
  const [dbProfile, setDbProfile] = useState({ name: "", image: "" });
  const userEmail = user?.email || "soausahmedbd91@gmail.com";

  // ডাটাবেজ থেকে লাইভ প্রোফাইল ডাটা লোড করা
  useEffect(() => {
    if (!userEmail) return;

    const fetchSidebarProfile = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/profile/${userEmail}`);
        const resData = await res.json();
        
        if (resData.success && resData.data) {
          setDbProfile({
            name: resData.data.name || user?.name || "",
            image: resData.data.image || user?.image || "",
          });
        }
      } catch (error) {
        console.error("Error fetching sidebar dynamic profile:", error);
      }
    };

    fetchSidebarProfile();
  }, [userEmail, user]);

  // 🎯 "Apply to Opportunity" অপশনটি এখান থেকে সম্পূর্ণ বাদ দেওয়া হয়েছে
  const menuItems = [
    { 
      id: "overview", 
      label: "Overview", 
      route: "/dashboard",
      icon: <LuLayoutDashboard className="w-5 h-5" />
    },
    { 
      id: "my-applications", 
      label: "My Applications", 
      route: "/dashboard/my-applications",
      icon: <LuFolderHeart className="w-5 h-5" />
    },
    { 
      id: "profile", 
      label: "Profile", 
      route: "/dashboard/profile",
      icon: <LuUser className="w-5 h-5" />
    },
  ];

  // ডিসপ্লে নাম এবং ইমেজের জন্য ফলব্যাক নির্ধারণ
  const displayName = dbProfile.name || user?.name || "Guest Collaborator";
  const displayImage = dbProfile.image || user?.image || "";

  return (
    <>
      {/* 📱 মোবাইল ও ট্যাবলেটের হোয়াইট টপবার */}
      <div className="lg:hidden w-full bg-white text-slate-800 p-4 flex items-center justify-between border-b border-slate-100 sticky top-0 z-50">
        <div className="flex flex-col items-start gap-1">
          <button 
            onClick={() => router.push("/")}
            className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-[#4F46E5] transition"
          >
            <HiOutlineArrowLeft className="w-3 h-3 stroke-[2.5]" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-[#6366F1] rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-md">
              ⚡
            </div>
            <span className="text-sm font-bold tracking-tight text-slate-800">StartupForge</span>
          </div>
        </div>
        
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-2 text-slate-500 hover:text-slate-800 transition focus:outline-none"
        >
          <HiBars3 className="w-6 h-6" />
        </button>
      </div>

      {/* 💻 ক্লিন হোয়াইট সাইডবার */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white text-slate-600 flex flex-col border-r border-slate-100 font-sans transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:h-screen
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        
        {/* ⚡ টপ হেডার সেকশন */}
        <div className="p-5 border-b border-slate-50 flex flex-col items-start gap-3">
          <button 
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-[#4F46E5] transition bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 cursor-pointer"
          >
            <HiOutlineArrowLeft className="w-3 h-3 stroke-[2.5]" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2 mt-1">
            <div className="h-7 w-7 bg-[#6366F1] rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-md">
              ⚡
            </div>
            <span className="text-base font-bold text-slate-800 tracking-tight">StartupForge</span>
          </div>
        </div>

        {/* 👤 ডাইনামিক ইউজার প্রোফাইল সেকশন (লাইভ ডাটাবেজ ইমেজ ও নাম দেখাবে) */}
        <div className="p-5 border-b border-slate-50 flex items-center gap-3">
          {displayImage ? (
            <img 
              src={displayImage} 
              alt={displayName} 
              className="h-10 w-10 rounded-full object-cover border border-slate-200 ring-2 ring-slate-100"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] font-bold flex items-center justify-center text-base border border-[#8B5CF6]/20">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          
          <div className="flex flex-col items-start gap-0.5 max-w-[170px]">
            {/* ডাইনামিক নাম */}
            <span className="text-sm font-semibold text-slate-700 truncate w-full">
              {displayName}
            </span>
            {/* রোল */}
            <span className="px-2 py-0.5 text-[10px] font-medium bg-[#E6F4EA] text-[#137333] rounded-full border border-green-100 capitalize">
              {user?.role || "Collaborator"}
            </span>
          </div>
        </div>

        {/* 📋 মেইন মেনু আইটেমস */}
        <nav className="p-3 flex-1 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = currentPath === item.route;
            return (
              <Link
                key={item.id}
                href={item.route}
                onClick={() => setIsOpen(false)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-[13.5px] font-medium transition-all ${
                  isActive
                    ? "bg-[#EEF2FF] text-[#4F46E5] font-semibold"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <span className={isActive ? "text-[#4F46E5]" : "text-slate-400"}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* 📱 ব্যাকড্রপ ওভারলে */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
        />
      )}
    </>
  );
}