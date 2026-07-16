"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

export default function Banner() {
  // এনিমেশনের জন্য ভ্যারিয়েন্ট (স্ট্যাগারিং ইফেক্ট তৈরি করতে)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // প্রতিটি চাইল্ড এলিমেন্ট একটু গ্যাপ দিয়ে এনিমেট হবে
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-indigo-50/50 via-white to-white py-20 md:py-32">
      {/* ব্যাকগ্রাউন্ডের মডার্ন গ্লোয়িং ব্লার ইফেক্ট (ছবির মতো প্রিমিয়াম লুক দিতে) */}
      <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-200/30 to-purple-200/30 blur-[120px]" />

      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center"
        >
          {/* ১. টপ ব্যাজ (The #1 Startup Team Building Platform) */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/80 px-4 py-1.5 text-xs md:text-sm font-medium text-indigo-700 backdrop-blur-sm"
          >
            🚀 The #1 Startup Team Building Platform
          </motion.div>

          {/* ২. মেইন বোল্ড হেডিং */}
          <motion.h1
            variants={itemVariants}
            className="mt-8 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Build Your Dream <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Startup Team
            </span>
          </motion.h1>

          {/* ৩. সাবহেডিং ডিসক্রিপশন */}
          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-gray-500"
          >
            StartupForge connects visionary founders with talented collaborators. 
            Find your co-founder, hire your first developer, build your dream team 
            — all in one place.
          </motion.p>

          {/* ৪. কল-টু-অ্যাকশন বাটনসমূহ */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link
              href="/register"
              className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-100 hover:opacity-95 hover:shadow-xl transition-all duration-200"
            >
              Start Building
              <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/opportunities"
              className="flex w-full sm:w-auto items-center justify-center rounded-xl border border-gray-200 bg-white px-8 py-3.5 text-base font-semibold text-slate-700 hover:bg-gray-50 hover:border-indigo-200 transition-all duration-200"
            >
              Browse Opportunities
            </Link>
          </motion.div>

          {/* ৫. ট্রাস্টেড ফুটার টেক্সট */}
          <motion.p
            variants={itemVariants}
            className="mt-12 text-xs md:text-sm text-gray-400"
          >
            Trusted by 500+ startups worldwide <span className="mx-1.5">•</span> No credit card required
          </motion.p>

        </motion.div>
      </div>
    </section>
  );
}