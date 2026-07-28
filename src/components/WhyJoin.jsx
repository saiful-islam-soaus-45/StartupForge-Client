"use client";

import { motion } from "framer-motion";
import { FiTrendingUp, FiShield, FiUsers, FiZap } from "react-icons/fi";

export default function WhyJoin() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const benefits = [
    {
      icon: <FiZap size={22} className="text-indigo-600" />,
      title: "High-Impact Projects",
      description: "Work on cutting-edge products and disruptive ideas alongside visionary founders.",
    },
    {
      icon: <FiUsers size={22} className="text-indigo-600" />,
      title: "Elite Startup Network",
      description: "Connect with top-tier developers, designers, and innovators scaling the future.",
    },
    {
      icon: <FiTrendingUp size={22} className="text-indigo-600" />,
      title: "Accelerated Growth",
      description: "Level up your technical and professional expertise in a fast-paced environment.",
    },
    {
      icon: <FiShield size={22} className="text-indigo-600" />,
      title: "Verified & Secure",
      description: "Collaborate safely with vetted startups, transparent roles, and structured workflows.",
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-white via-indigo-50/20 to-white py-20">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mx-auto max-w-7xl px-6 relative"
      >
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span 
            variants={itemVariants} 
            className="inline-block px-3.5 py-1 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs uppercase tracking-wider border border-indigo-100/60 mb-3"
          >
            Why Choose Us
          </motion.span>
          <motion.h2 
            variants={itemVariants} 
            className="text-3xl font-black text-slate-950 tracking-tight sm:text-4xl bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent"
          >
            Why Join StartupForge?
          </motion.h2>
          <motion.p 
            variants={itemVariants} 
            className="mt-3 text-base sm:text-lg text-slate-500 font-medium leading-relaxed"
          >
            Everything you need to accelerate your career, build exciting products, and grow with top innovators.
          </motion.p>
        </div>

        {/* Grid Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {benefits.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300"
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100/50 mb-5 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors duration-200">
                  {item.title}
                </h3>
                <div className="w-6 h-[2px] bg-indigo-600/30 my-3 group-hover:w-12 transition-all duration-300 rounded-full" />
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}