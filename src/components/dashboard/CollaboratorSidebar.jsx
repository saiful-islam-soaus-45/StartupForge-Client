import React from "react";
import Link from "next/link";
import { FiLayout, FiSearch, FiBriefcase, FiUser } from "react-icons/fi";

export default function CollaboratorSidebar({ user }) {
  return (
    <aside className="w-64 bg-indigo-950 text-indigo-200 p-6 flex flex-col justify-between hidden md:flex">
      <div>
        <div className="mb-8">
          <h2 className="text-xl font-black text-white tracking-wider">StartupForge</h2>
          <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
            Collaborator Mode
          </span>
        </div>

        <nav className="space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-indigo-900 text-white font-medium transition">
            <FiLayout /> <span>Overview</span>
          </Link>
          <Link href="/browse-startups" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-indigo-900/60 transition text-indigo-300 hover:text-white">
            <FiSearch /> <span>Browse Startups</span>
          </Link>
          <Link href="/dashboard/my-applications" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-indigo-900/60 transition text-indigo-300 hover:text-white">
            <FiBriefcase /> <span>My Applications</span>
          </Link>
          <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-indigo-900/60 transition text-indigo-300 hover:text-white">
            <FiUser /> <span>My Profile</span>
          </Link>
        </nav>
      </div>

      {/* ইউজার প্রোফাইল ফুটনোট */}
      <div className="border-t border-indigo-900 pt-4 flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-indigo-800 flex items-center justify-center text-sm font-bold text-white uppercase">
          {user.name?.[0]}
        </div>
        <div className="truncate">
          <p className="text-xs font-bold text-white truncate">{user.name}</p>
          <p className="text-[10px] text-indigo-400 truncate">{user.email}</p>
        </div>
      </div>
    </aside>
  );
}