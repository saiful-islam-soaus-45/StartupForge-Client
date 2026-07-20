"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LuLayoutDashboard, LuRocket, LuCirclePlus } from "react-icons/lu";
import { HiOutlineQueueList } from "react-icons/hi2";
import { HiOutlineDocumentText, HiOutlineArrowLeft, HiBars3 } from "react-icons/hi2";

export default function FounderSidebar({ user }) {
  const router = useRouter();
  const currentPath = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { 
      id: "overview", 
      label: "Overview", 
      route: "/dashboard",
      icon: <LuLayoutDashboard className="w-5 h-5" />
    },
    { 
      id: "my-startup", 
      label: "My Startup", 
      route: "/dashboard/my-startup",
      icon: <LuRocket className="w-5 h-5" />
    },
    { 
      id: "add-opportunity", 
      label: "Add Opportunity", 
      route: "/dashboard/add-opportunity",
      icon: <LuCirclePlus className="w-5 h-5" />
    },
    { 
      id: "manage-opportunities", 
      label: "Manage Opportunities", 
      route: "/dashboard/manage-opportunity",
      icon: <HiOutlineQueueList className="w-5 h-5" />
    },
    { 
      id: "applications", 
      label: "Applications", 
      route: "/dashboard/applications",
      icon: <HiOutlineDocumentText className="w-5 h-5" />
    },
  ];

  return (
    <>
      {/* 📱 মোবাইল ও ট্যাবলেটের হোয়াইট টপবার */}
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

      {/* 💻 ক্লিন হোয়াইট সাইডবার */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white text-slate-600 flex flex-col border-r border-slate-100 font-sans transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:h-screen
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        
        {/* ⚡ টপ হেডার সেকশন */}
        <div className="p-5 border-b border-slate-50 flex flex-col items-start gap-3">
          <button 
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-[#4F46E5] transition bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200"
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

        {/* 👤 ডাইনামিক ইউজার প্রোফাইল সেকশন (লগইন করা অ্যাকাউন্ট অনুযায়ী পরিবর্তন হবে) */}
        <div className="p-5 border-b border-slate-50 flex items-center gap-3">
          {user?.image ? (
            // যদি ইউজার ছবি দেয়, তবে সেই ছবি লোড হবে
            <img 
              src={user.image} 
              alt={user.name || "User Profile"} 
              className="h-10 w-10 rounded-full object-cover border border-slate-200 ring-2 ring-slate-100"
            />
          ) : (
            // যদি ছবি না থাকে, তবে নামের ১ম অক্ষর দিয়ে ডিফোল্ট অ্যাভাটার তৈরি হবে
            <div className="h-10 w-10 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] font-bold flex items-center justify-center text-base border border-[#8B5CF6]/20">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
          )}
          
          <div className="flex flex-col items-start gap-0.5 max-w-[170px]">
            {/* ডাইনামিক নাম */}
            <span className="text-sm font-semibold text-slate-700 truncate w-full">
              {user?.name || "Guest User"}
            </span>
            {/* ডাইনামিক রোল */}
            <span className="px-2 py-0.5 text-[10px] font-medium bg-[#EEF2FF] text-[#6366F1] rounded-full border border-indigo-100 capitalize">
              {user?.role || "Member"}
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