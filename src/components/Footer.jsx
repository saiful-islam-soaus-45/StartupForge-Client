"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiGithub, 
  FiTwitter, 
  FiLinkedin, 
  FiGlobe 
} from "react-icons/fi";

export default function Footer() {
  const currentYear = new Date().getFullYear();

   //dashboard e footer remove korar jonno
    const pathname = usePathname();
    if(pathname.includes("dashboard")){
      return null
    }

  return (
    <footer className="w-full bg-slate-50 border-t border-slate-200 mt-auto">
      {/* Main Footer Container */}
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1: Logo & Tagline */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600">
                <span className="text-lg text-white">⚡</span>
              </div>
              <h1 className="text-2xl font-bold">
                <span className="text-black">Startup</span>
                <span className="text-indigo-600">Forge</span>
              </h1>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              A platform where startup founders can publish startup ideas, build teams, and recruit passionate collaborators to turn vision into reality.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-gray-600 hover:text-indigo-600 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/browse-startups" className="text-gray-600 hover:text-indigo-600 transition">
                  Browse Startups
                </Link>
              </li>
              <li>
                <Link href="/opportunities" className="text-gray-600 hover:text-indigo-600 transition">
                  Opportunities
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-600 hover:text-indigo-600 transition">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <FiMail size={16} />
                </span>
                <a href="mailto:support@startupforge.com" className="hover:text-indigo-600 transition">
                  support@startupforge.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <FiPhone size={16} />
                </span>
                <a href="tel:+8801700000000" className="hover:text-indigo-600 transition">
                  +880 1700-000000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <FiMapPin size={16} />
                </span>
                <span>Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Social Links & Newsletter Intro */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Follow Us
            </h3>
            <p className="text-sm text-gray-500">
              Stay updated with our latest features and startup opportunities.
            </p>
            {/* Social Icons Row */}
            <div className="flex items-center gap-3">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 hover:border-indigo-500 hover:text-indigo-600 hover:shadow-sm transition"
              >
                <FiGithub size={18} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 hover:border-indigo-500 hover:text-indigo-600 hover:shadow-sm transition"
              >
                <FiTwitter size={18} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 hover:border-indigo-500 hover:text-indigo-600 hover:shadow-sm transition"
              >
                <FiLinkedin size={18} />
              </a>
              <a 
                href="https://startupforge.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 hover:border-indigo-500 hover:text-indigo-600 hover:shadow-sm transition"
              >
                <FiGlobe size={18} />
              </a>
            </div>
          </div>

        </div>

        {/* Divider */}
        <hr className="my-10 border-slate-200" />

        {/* Bottom Section: Copyright & Legal Links */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500 text-center sm:text-left">
            &copy; {currentYear} StartupForge. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-indigo-600 transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-indigo-600 transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}