"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { 
  FiPieChart, 
  FiBriefcase, 
  FiPlusSquare, 
  FiFolder, 
  FiFileText, 
  FiArrowLeft,
  FiMenu,
  FiX 
} from "react-icons/fi";

export default function SideBar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); // মোবাইলে সাইডবার টগল করার জন্য

  const menuItems = [
    { name: "Overview", href: "/dashboard", icon: FiPieChart },
    { name: "My Startup", href: "/dashboard/my-startup", icon: FiBriefcase },
    { name: "Add Opportunity", href: "/dashboard/add-opportunity", icon: FiPlusSquare },
    { name: "Manage Opportunities", href: "/dashboard/manage-opportunity", icon: FiFolder },
    { name: "Applications", href: "/dashboard/applications", icon: FiFileText },
  ];

  return (
    <>
      {/* 📱 ১. মোবাইল ও ট্যাবলেটের জন্য টপবার (লোগো এবং হ্যামবার্গার বাটন) */}
      <div className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden sticky top-0 z-30">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-slate-800">
          <span className="text-indigo-600">⚡</span> StartupForge
        </Link>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition"
        >
          {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* 🌫️ ২. মোবাইলে সাইডবার ওপেন হলে পেছনের ব্যাকড্রপ (ক্লিক করলে বন্ধ হবে) */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* 🗂️ ৩. মেইন সাইডবার (মোবাইলে স্লাইড মেনু, ডেক্সটপে ফিক্সড) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col border-r border-slate-200 bg-white px-4 py-6 justify-between transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:z-20
      `}>
        
        <div className="space-y-7">
          {/* লোগো এবং বন্ধ করার বাটন (মোবাইলের জন্য) */}
          <div className="flex items-center justify-between lg:block">
            <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition px-2 text-sm font-medium">
              <FiArrowLeft size={16} />
              <span>Back to Home</span>
            </Link>
            <button className="lg:hidden p-1 text-slate-400" onClick={() => setIsOpen(false)}>
              <FiX size={20} />
            </button>
          </div>

          {/* নেভিগেশন লিংকসমূহ */}
          <nav className="flex flex-col gap-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)} // লিংকে ক্লিক করলে মোবাইল মেনু বন্ধ হবে
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-semibold transition-all ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-indigo-600" : "text-slate-400"} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* বটম সেকশন */}
        <div className="rounded-2xl bg-slate-50 p-3 text-center border border-slate-100">
          <p className="text-[11px] font-medium text-slate-400">Startup Forge Dashboard</p>
          <p className="text-[10px] text-indigo-500 font-bold mt-0.5">v1.0.0 Pro</p>
        </div>
      </aside>
    </>
  );
}