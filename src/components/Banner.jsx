"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { Feather } from "lucide-react";
import FeaturedStartups from "./FeaturedStartups";
import FeaturedOpportunities from "./FeaturedOpportunities";
import WhyJoin from "./WhyJoin";
import Testimonials from "./Testimonials";

export default function Banner() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, 
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

      <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-200/30 to-purple-200/30 blur-[120px]" />

      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/80 px-4 py-1.5 text-xs md:text-sm font-medium text-indigo-700 backdrop-blur-sm"
          >
            🚀 The #1 Startup Team Building Platform
          </motion.div>


          <motion.h1
            variants={itemVariants}
            className="mt-8 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Build Your Dream <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Startup Team
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-gray-500"
          >
            StartupForge connects visionary founders with talented collaborators.
            Find your co-founder, hire your first developer, build your dream team
            — all in one place.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link
              href="/dashboard/my-startup"
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

          <motion.p
            variants={itemVariants}
            className="mt-12 text-xs md:text-sm text-gray-400"
          >
            Trusted by 500+ startups worldwide <span className="mx-1.5">•</span> No credit card required
          </motion.p>



        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-30 grid w-full max-w-6xl grid-cols-2 gap-5 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg backdrop-blur-md md:grid-cols-4"
        >
          <div className="text-center">
            <h3 className="text-3xl font-extrabold text-indigo-600">500+</h3>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Startups
            </p>
          </div>

          <div className="text-center">
            <h3 className="text-3xl font-extrabold text-indigo-600">2K+</h3>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Collaborators
            </p>
          </div>

          <div className="text-center">
            <h3 className="text-3xl font-extrabold text-indigo-600">1.5K+</h3>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Opportunities
            </p>
          </div>

          <div className="text-center">
            <h3 className="text-3xl font-extrabold text-indigo-600">95%</h3>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Success Rate
            </p>
          </div>
        </motion.div>

      </div>
      <FeaturedStartups />
      <FeaturedOpportunities></FeaturedOpportunities>
      <WhyJoin></WhyJoin>
      <Testimonials></Testimonials>
    </section>
  );
}