"use client";

import { useState } from "react";
import Link from "next/link";
import { FiRefreshCw, FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600">
            <span className="text-lg text-white">⚡</span>
          </div>

          <h1 className="text-2xl font-bold">
            <span className="text-black">Startup</span>
            <span className="text-indigo-600">Forge</span>
          </h1>
        </Link>

        {/* Navigation - Desktop (md এবং তার বড় স্ক্রিনের জন্য) */}
        <div className="hidden items-center gap-10 text-[15px] font-medium text-gray-700 md:flex">
          <Link href="/" className="hover:text-indigo-600 transition">
            Home
          </Link>

          <Link
            href="/browse-startups"
            className="hover:text-indigo-600 transition"
          >
            Browse Startups
          </Link>

          <Link
            href="/opportunities"
            className="hover:text-indigo-600 transition"
          >
            Opportunities
          </Link>
        </div>

        {/* Right Side Buttons - Desktop (md এবং তার বড় স্ক্রিনের জন্য) */}
        <div className="hidden items-center gap-3 md:flex">
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition">
            <FiRefreshCw size={18} />
          </button>

          <Link
            href="/login"
            className="rounded-xl border border-gray-300 px-5 py-2 font-medium hover:bg-gray-100 transition"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2 text-white font-medium hover:opacity-90 transition"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button - (শুধু ছোট স্ক্রিনের জন্য দৃশ্যমান) */}
        <div className="flex md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-700 hover:text-indigo-600 focus:outline-none transition"
            aria-label="Toggle Menu"
          >
            {isOpen ? <FiX size={26} /> : <FiMenu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu - (মোবাইলে মেনু বাটন ক্লিক করলে ওপেন হবে) */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-6 space-y-5 shadow-inner">
          <div className="flex flex-col space-y-4 font-medium text-gray-700">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="hover:text-indigo-600 transition py-1 text-lg"
            >
              Home
            </Link>
            <Link
              href="/browse-startups"
              onClick={() => setIsOpen(false)}
              className="hover:text-indigo-600 transition py-1 text-lg"
            >
              Browse Startups
            </Link>
            <Link
              href="/opportunities"
              onClick={() => setIsOpen(false)}
              className="hover:text-indigo-600 transition py-1 text-lg"
            >
              Opportunities
            </Link>
          </div>

          <hr className="border-gray-200" />

          {/* Mobile Right Side Actions */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-gray-500 text-sm">
              <span>Theme / Refresh</span>
              <button className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition">
                <FiRefreshCw size={18} />
              </button>
            </div>

            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="flex justify-center rounded-xl border border-gray-300 py-3 font-semibold hover:bg-gray-100 transition text-center"
            >
              Login
            </Link>

            <Link
              href="/register"
              onClick={() => setIsOpen(false)}
              className="flex justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 text-white font-semibold hover:opacity-90 transition text-center shadow-md shadow-indigo-100"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}