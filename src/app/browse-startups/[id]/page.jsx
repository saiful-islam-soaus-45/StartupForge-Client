"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft, FiMail, FiCalendar, FiTrendingUp, FiCheck, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/auth-client"; // 🎯 আপনার প্রজেক্টের Better Auth ক্লায়েন্ট পাথটি এখানে ঠিক করে নিন

export default function StartupDetails({ user }) {
  const { id } = useParams();
  const router = useRouter();
  
  // 🎯 Better Auth সেশন হুক
  const { data: session, isPending } = authClient.useSession();

  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);

  // অ্যাপ্লিকেশনের জন্য স্টেটসমূহ
  const [applicantEmail, setApplicantEmail] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");
  const [motivationMessage, setMotivationMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔔 কাস্টম টোস্ট স্টেট
  const [toastMessage, setToastMessage] = useState("");

  // 🎯 Better Auth এর ইউজার টেবিল/কালেকশন থেকে ইমেইল সেট করা
  useEffect(() => {
    if (isModalOpen) {
      if (user?.email) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setApplicantEmail(user.email);
      } else if (session?.user?.email) {
        setApplicantEmail(session.user.email);
      }
    }
  }, [user?.email, session?.user?.email, isModalOpen]);

  // 🚀 স্টার্টআপ ডিটেইলস ফেচ করা
  useEffect(() => {
    if (!id) return;
    const fetchStartupDetails = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/public/startups/${id}`);
        
        if (!res.ok) {
          throw new Error("Failed to fetch startup details from server");
        }

        const resData = await res.json();
        if (resData.success) {
          setStartup(resData.data);
        }
      } catch (error) {
        console.error("Error fetching startup details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStartupDetails();
  }, [id]);

  // 🎯 কাস্টম টোস্ট শোর ফাংশন
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 3050);
  };

  // 🚀 Application Submit Logic
  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    
    if (!applicantEmail.trim() || !portfolioLink.trim() || !motivationMessage.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    const applicationData = {
      opportunityId: null, 
      roleTitle: null,
      startupId: startup._id, 
      founderEmail: startup.founderEmail, 
      applicantEmail: applicantEmail,     
      portfolioLink: portfolioLink,
      motivationMessage: motivationMessage,
    };

    try {
      const res = await fetch("http://localhost:5000/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(applicationData),
      });

      if (!res.ok) throw new Error("Submission failed");

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setPortfolioLink("");
        setMotivationMessage("");
        
        showToast(`Application submitted successfully to ${startup.name}! 🎉`);
      } else {
        alert(data.message || "Failed to submit application");
      }
    } catch (error) {
      console.error("Application submission error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🎬 Motion Guidelines Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  if (loading || isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 font-semibold">Startup not found!</p>
        <button 
          onClick={() => router.push("/browse-startups")} 
          className="mt-4 text-indigo-600 font-bold flex items-center gap-2 mx-auto cursor-pointer"
        >
          <FiArrowLeft /> Back to List
        </button>
      </div>
    );
  }

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-indigo-50/40 via-white to-white py-12">
      <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-200/20 to-purple-200/20 blur-[120px]" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-4xl px-6 relative"
      >
        {/* Back Button */}
        <motion.button 
          variants={itemVariants}
          onClick={() => router.push("/browse-startups")}
          className="group flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-600 transition mb-8 cursor-pointer"
        >
          <FiArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> Back to Startups
        </motion.button>

        {/* Main Details Card */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-all duration-300 space-y-8"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-indigo-600 font-bold text-3xl overflow-hidden border border-slate-200 transition-transform hover:scale-105 duration-300">
                {startup.logo ? (
                  <img src={startup.logo} alt={startup.name} className="h-full w-full object-cover" />
                ) : (
                  startup.name ? startup.name.charAt(0).toUpperCase() : "S"
                )}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 capitalize tracking-tight">{startup.name}</h1>
                <span className="inline-block rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-600 uppercase tracking-wider mt-1.5">
                  {startup.industry || "General"}
                </span>
              </div>
            </div>
            
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200 capitalize">
                ● {startup.status || "Pending"}
              </span>
            </div>
          </div>

          {/* Metadata Block */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200/60">
            <div className="flex items-center gap-3 text-slate-700 text-sm font-medium">
              <FiMail size={16} className="text-slate-400" />
              <span className="break-all"><strong>Founder:</strong> {startup.founderEmail}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700 text-sm font-medium">
              <FiTrendingUp size={16} className="text-slate-400" />
              <span><strong>Funding Stage:</strong> {startup.fundingStage || "Idea"}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700 text-sm font-medium sm:col-span-2">
              <FiCalendar size={16} className="text-slate-400" />
              <span><strong>Published:</strong> {startup.createdAt ? new Date(startup.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }) : "N/A"}</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900">About the Startup</h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {startup.description || "No description available for this venture."}
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto rounded-2xl bg-indigo-600 px-8 py-4 text-sm font-bold text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-100 transition-all duration-200 shadow-sm cursor-pointer"
            >
              Apply Now
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* 📥 Application Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative bg-white rounded-3xl p-6 max-w-md w-full border border-slate-100 shadow-2xl space-y-4 z-10"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <FiX size={18} />
              </button>

              <div>
                <h2 className="text-xl font-bold text-slate-900">Apply to {startup.name}</h2>
                <p className="text-xs text-indigo-600 font-semibold mt-0.5">Pitch yourself directly to the founder.</p>
              </div>

              <form onSubmit={handleSubmitApplication} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                    <FiMail size={12} className="text-slate-400" /> Your Email <span className="text-rose-500">*</span>
                  </label>
                  
                  {/* Better Auth থেকে ইমেইল পেলে লক থাকবে, নাহলে টাইপ করা যাবে */}
                  <input 
                    type="email" 
                    placeholder="name@example.com" 
                    value={applicantEmail} 
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    disabled={!!applicantEmail} 
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium shadow-sm outline-none transition ${
                      applicantEmail 
                        ? "bg-slate-50 text-slate-400 border-slate-200/80 cursor-not-allowed font-semibold" 
                        : "bg-white text-slate-800 border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    }`} 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                    <FiArrowLeft size={12} className="text-slate-400 rotate-135" /> Portfolio Link <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="url" 
                    placeholder="https://github.com/or-portfolio" 
                    value={portfolioLink} 
                    onChange={(e) => setPortfolioLink(e.target.value)} 
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 font-medium placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition" 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Why do you want to join? <span className="text-rose-500">*</span></label>
                  <textarea 
                    rows="4" 
                    placeholder="Write a brief motivation letter..." 
                    value={motivationMessage} 
                    onChange={(e) => setMotivationMessage(e.target.value)} 
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 font-medium placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition resize-none" 
                    required 
                  ></textarea>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)} 
                    disabled={isSubmitting}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-md hover:shadow-lg hover:shadow-indigo-100 transition cursor-pointer min-w-[110px] disabled:bg-indigo-500 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Submitting...
                      </>
                    ) : (
                      "Submit Pitch"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🔔 Custom Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl text-sm font-semibold border border-slate-800 max-w-sm"
          >
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
              <FiCheck size={12} className="stroke-[3]" />
            </div>
            <span className="truncate">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}