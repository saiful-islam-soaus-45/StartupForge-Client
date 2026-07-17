"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiRefreshCw, FiMenu, FiX, FiChevronDown, FiUser, FiLogOut } from "react-icons/fi";
import { RxDashboard } from "react-icons/rx";
import { authClient } from "@/lib/auth-client"; // আপনার Better-Auth ক্লায়েন্ট

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname(); // ১. সব হুক শুরুতে থাকবে
  const dropdownRef = useRef(null);
  
  const [isOpen, setIsOpen] = useState(false); // মোবাইল মেনুর জন্য
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // প্রোফাইল ড্রপডাউনের জন্য

  // ২. সেশন ডেটা চেক করার জন্য Better-Auth হুক (সবসময় কন্ডিশনের উপরে থাকবে)
  const { data: session } = authClient.useSession();

  // ৩. ড্রপডাউনের বাইরে ক্লিক করলে যেন ড্রপডাউন বন্ধ হয়ে যায়
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🎯 ৪. ড্যাশবোর্ডে নেববার রিমুভ করার কন্ডিশন (সব হুক ডিফাইন করার পর নিচে বসবে)
  if (pathname.includes("dashboard")) {
    return null;
  }

  // লগআউট হ্যান্ডলার ফাংশন
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setIsDropdownOpen(false);
          setIsOpen(false);
          router.push("/auth/login"); // লগআউট হলে লগইন পেজে নিয়ে যাবে
          router.refresh();
        },
      },
    });
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600">
            <span className="text-lg text-white font-bold">⚡</span>
          </div>
          <h1 className="text-2xl font-bold">
            <span className="text-black">Startup</span>
            <span className="text-indigo-600">Forge</span>
          </h1>
        </Link>

        {/* Navigation - Desktop */}
        <div className="hidden items-center gap-10 text-[15px] font-medium text-gray-700 md:flex">
          <Link href="/" className="hover:text-indigo-600 transition">Home</Link>
          <Link href="/browse-startups" className="hover:text-indigo-600 transition">Browse Startups</Link>
          <Link href="/opportunities" className="hover:text-indigo-600 transition">Browse Opportunities</Link>
        </div>

        {/* Right Side Buttons - Desktop */}
        <div className="hidden items-center gap-3 md:flex">
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition">
            <FiRefreshCw size={18} />
          </button>

          {!session ? (
            <>
              <Link href="/auth/login" className="rounded-xl border border-gray-300 px-5 py-2 text-[14px] font-semibold text-slate-700 hover:bg-gray-50 transition">
                Login
              </Link>
              <Link href="/auth/signup" className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2 text-[14px] text-white font-semibold hover:opacity-95 transition shadow-sm">
                Get Started
              </Link>
            </>
          ) : (
            /* 🎯 ডাইনামিক প্রোফাইল ড্রপডাউন বাটন */
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white p-1.5 pr-3 hover:bg-gray-50 transition"
              >
                <img
                  src={session.user.image || `https://api.dicebear.com/7.x/initials/svg?seed=${session.user.name}`}
                  alt="Profile"
                  className="h-8 w-8 rounded-full border border-indigo-100 object-cover"
                />
                <span className="text-sm font-semibold text-slate-700">{session.user.name.split(" ")[0]}</span>
                <FiChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* 🎯 ড্রপডাউন মেনু কার্ড */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-100 bg-white p-2.5 shadow-xl shadow-slate-200/80 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2">
                    <p className="text-[11px] font-medium text-slate-400">Signed in as</p>
                    <p className="text-sm font-bold text-slate-800 capitalize mt-0.5">
                      {session.user.role || "User"}
                    </p>
                  </div>
                  
                  <hr className="my-1.5 border-slate-100" />
                  
                  <div className="space-y-0.5">
                    <Link 
                      href="/dashboard" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
                    >
                      <RxDashboard size={16} className="text-slate-400" />
                      Dashboard
                    </Link>
                    
                    <Link 
                      href="/profile" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
                    >
                      <FiUser size={16} className="text-slate-400" />
                      Profile
                    </Link>
                    
                    <button 
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition text-left"
                    >
                      <FiLogOut size={16} className="text-rose-400" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-700 hover:text-indigo-600 transition">
            {isOpen ? <FiX size={26} /> : <FiMenu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-6 space-y-5 shadow-inner">
          <div className="flex flex-col space-y-4 font-medium text-gray-700">
            <Link href="/" onClick={() => setIsOpen(false)} className="hover:text-indigo-600 transition py-1 text-lg">Home</Link>
            <Link href="/browse-startups" onClick={() => setIsOpen(false)} className="hover:text-indigo-600 transition py-1 text-lg">Browse Startups</Link>
            <Link href="/opportunities" onClick={() => setIsOpen(false)} className="hover:text-indigo-600 transition py-1 text-lg">Browse Opportunities</Link>
          </div>

          <hr className="border-gray-200" />

          {/* Mobile Right Side Actions */}
          <div className="flex flex-col gap-4">
            {!session ? (
              <>
                <Link href="/auth/login" onClick={() => setIsOpen(false)} className="flex justify-center rounded-xl border border-gray-300 py-3 font-semibold hover:bg-gray-100 transition text-center text-sm">
                  Login
                </Link>
                <Link href="/auth/signup" onClick={() => setIsOpen(false)} className="flex justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 text-white font-semibold hover:opacity-90 transition text-center text-sm shadow-md">
                  Get Started
                </Link>
              </>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                  <img
                    src={session.user.image || `https://api.dicebear.com/7.x/initials/svg?seed=${session.user.name}`}
                    alt="Profile"
                    className="h-10 w-10 rounded-full border border-indigo-100 object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800">{session.user.name}</span>
                    <span className="text-xs font-semibold text-indigo-600 capitalize">{session.user.role || "User"}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700">
                    <RxDashboard size={14} /> Dashboard
                  </Link>
                  <Link href="/profile" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700">
                    <FiUser size={14} /> Profile
                  </Link>
                </div>
                <button onClick={handleLogout} className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 py-2.5 text-xs font-bold text-rose-600">
                  <FiLogOut size={14} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  ); 
}