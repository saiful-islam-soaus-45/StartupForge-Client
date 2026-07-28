"use client";

import { motion } from "framer-motion";
import { FiStar } from "react-icons/fi";

export default function Testimonials() {
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

  const testimonials = [
    {
      quote: "StartupForge completely changed how I find meaningful projects. I landed my dream collaborator role within a week!",
      name: "Alex Rivera",
      role: "Frontend Engineer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    {
      quote: "As a founder, finding passionate and skilled team members used to be exhausting. StartupForge made it seamless and fast.",
      name: "Sarah Chen",
      role: "Startup Founder",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    },
    {
      quote: "The quality of projects and transparency on this platform are unmatched. Highly recommended for any serious developer.",
      name: "Marcus Vance",
      role: "Full-Stack Developer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
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
            Testimonials
          </motion.span>
          <motion.h2 
            variants={itemVariants} 
            className="text-3xl font-black text-slate-950 tracking-tight sm:text-4xl bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent"
          >
            Loved by Builders & Founders
          </motion.h2>
          <motion.p 
            variants={itemVariants} 
            className="mt-3 text-base sm:text-lg text-slate-500 font-medium leading-relaxed"
          >
            Hear success stories from community members who found their path through StartupForge.
          </motion.p>
        </div>

        {/* Grid Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300"
            >
              <div>
                <div className="flex gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} size={16} className="fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 font-medium leading-relaxed italic">
                  &quot;{item.quote}&quot;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="h-10 w-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">{item.name}</h4>
                  <p className="text-xs text-indigo-600 font-semibold">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}