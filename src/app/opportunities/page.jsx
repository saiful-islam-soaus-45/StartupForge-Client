"use client";

import { useEffect, useState } from "react";
import { FiCalendar, FiCpu, FiClock, FiSend, FiX, FiLink, FiMail, FiCheck } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/auth-client"; // 🎯 আপনার প্রজেক্টের Better Auth ক্লায়েন্ট পাথটি এখানে ঠিক করে নিন

export default function BrowseOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 🎯 Better Auth সেশন হুক
  const { data: session } = authClient.useSession();
  
  // 📧 ইমেইল স্টেট
  const [applicantEmail, setApplicantEmail] = useState("");

  // 📝 Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [portfolioLink, setPortfolioLink] = useState("");
  const [motivationMessage, setMotivationMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔔 Toast Notification State
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/opportunities")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setOpportunities(resData.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // 🎯 মডাল ওপেন হলে Better Auth সেশন থেকে ইমেইল সেট করার ইফেক্ট
  useEffect(() => {
    if (isModalOpen) {
      if (session?.user?.email) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setApplicantEmail(session.user.email);
      } else {
        // ফলব্যাক: যদি সেশনে না পাওয়া যায় তবে লোকাল স্টোরেজ চেক করবে
        try {
          const userData = localStorage.getItem("user");
          if (userData) {
            const parsed = JSON.parse(userData);
            if (parsed?.email) setApplicantEmail(parsed.email);
            else if (parsed?.user?.email) setApplicantEmail(parsed.user.email);
          }
        } catch (err) {
          console.error("Error reading fallback user data:", err);
        }
      }
    }
  }, [session?.user?.email, isModalOpen]);

  // 🎯 Show Toast Function
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 3050);
  };

  // 🎯 Apply Button Click Handler
  const openApplyModal = (opp) => {
    // Better Auth সেশন অথবা লোকাল স্টোরেজ থেকে রোল চেক
    let role = session?.user?.role;
    if (!role) {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          const parsed = JSON.parse(userData);
          role = parsed?.role || parsed?.user?.role;
        }
      } catch (e) {
        console.error(e);
      }
    }

    if (role === "founder") {
      alert("As a Founder, you cannot apply for opportunities!");
      return;
    }
    setSelectedOpp(opp);
    setIsModalOpen(true);
  };

  // ❌ Close Modal Function
  const closeApplyModal = () => {
    setIsModalOpen(false);
    setSelectedOpp(null);
    setApplicantEmail("");
    setPortfolioLink("");
    setMotivationMessage("");
  };

  // 🚀 Form Submit Action
  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    
    if (!applicantEmail.trim()) {
      alert("Applicant email is required!");
      return;
    }
    if (!motivationMessage.trim()) {
      alert("Motivation message is required!");
      return;
    }

    setIsSubmitting(true);

    const applicationData = {
      opportunityId: selectedOpp._id,
      roleTitle: selectedOpp.roleTitle,
      applicantEmail: applicantEmail,
      motivationMessage: motivationMessage,
      portfolioLink: portfolioLink,
      appliedDate: new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }),
      status: "Pending"
    };

    try {
      const res = await fetch("http://localhost:5000/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(applicationData),
      });

      const data = await res.json();
      
      if (data.success) {
        closeApplyModal();
        showToast(`Successfully applied for ${selectedOpp.roleTitle}! 🎉`);
      } else {
        alert(data.message || "Failed to apply.");
      }
    } catch (error) {
      console.error("Application submission error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  // 🎬 মোশন গাইডলাইন ভ্যারিয়েন্টস
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
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

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-indigo-50/40 via-white to-white py-16">
      <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-200/20 to-purple-200/20 blur-[120px]" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-7xl px-6 relative"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="mb-12 text-center lg:text-left">
          <h2 className="text-3xl font-black text-slate-950 tracking-tight sm:text-4xl bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Explore Open Opportunities
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-500 max-w-2xl font-medium leading-relaxed">
            Join fast-growing startups and bring your talent to revolutionary projects.
          </p>
        </motion.div>

        {/* Grid List */}
        {opportunities.length === 0 ? (
          <motion.div 
            variants={itemVariants}
            className="text-center py-24 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200"
          >
            <p className="text-slate-400 font-semibold tracking-wide">No opportunities posted yet!</p>
          </motion.div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {opportunities.map((opp) => (
              <motion.div 
                key={opp._id}
                variants={itemVariants}
                className="group flex flex-col justify-between aspect-square rounded-2xl border border-slate-200/60 bg-slate-50/60 p-6 shadow-sm hover:shadow-xl hover:bg-white hover:border-indigo-100 transition-all duration-300 overflow-hidden"
              >
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="inline-flex rounded-lg bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-600 uppercase tracking-wider border border-indigo-100/30">
                      {opp.workType}
                    </span>
                    <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider border border-slate-200/40">
                      {opp.commitmentLevel}
                    </span>
                  </div>

                  <div className="mt-2">
                    <h3 className="text-xl font-extrabold text-slate-900 capitalize tracking-tight group-hover:text-indigo-600 transition-colors duration-200 line-clamp-1">
                      {opp.roleTitle}
                    </h3>
                    
                    <div className="w-6 h-[2px] bg-indigo-600/30 my-3 group-hover:w-12 transition-all duration-300 rounded-full" />
                    
                    <div className="space-y-2 mt-4">
                      <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 font-medium">
                        <FiCpu size={14} className="text-slate-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">
                          <strong className="text-slate-700">Skills:</strong> {opp.requiredSkills}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-medium">
                        <FiCalendar size={14} className="text-slate-400 shrink-0" />
                        <span>
                          <strong className="text-slate-700">Deadline:</strong> {opp.deadline}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium italic">
                        <FiClock size={14} className="text-slate-400 shrink-0" />
                        <span>Posted: {formatDate(opp.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => openApplyModal(opp)}
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-indigo-600 border border-slate-200 px-4 py-3 text-xs font-bold text-white hover:bg-indigo-700  hover:border-indigo-600 hover:shadow-lg hover:shadow-indigo-100 transition-all duration-200 cursor-pointer group/btn mt-auto"
                >
                  Apply Now
                  <FiSend size={13} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* 🔮 CUSTOM APPLICATION MODAL */}
      <AnimatePresence>
        {isModalOpen && selectedOpp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeApplyModal}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 z-10 space-y-4"
            >
              <button 
                onClick={closeApplyModal}
                className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <FiX size={18} />
              </button>

              <div>
                <h3 className="text-xl font-bold text-slate-900">Apply for Role</h3>
                <p className="text-xs text-indigo-600 font-semibold mt-0.5 capitalize">
                  {selectedOpp.roleTitle} • {selectedOpp.workType || "Remote"}
                </p>
              </div>

              <form onSubmit={handleSubmitApplication} className="space-y-4">
                {/* Applicant Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                    <FiMail size={12} className="text-slate-400" /> Applicant Email <span className="text-rose-500">*</span>
                  </label>
                  
                  {/* 🔒 Better Auth থেকে ইমেইল পেলে ইনপুট লক হবে, না পেলে টাইপ করতে দেবে */}
                  <input 
                    type="email" 
                    placeholder="Enter your email address"
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

                {/* Portfolio / GitHub Link */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                    <FiLink size={12} className="text-slate-400" /> Portfolio / GitHub Link
                  </label>
                  <input 
                    type="url" 
                    placeholder="https://yourportfolio.com"
                    value={portfolioLink}
                    onChange={(e) => setPortfolioLink(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 font-medium placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                  />
                </div>

                {/* Motivation Message */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Motivation Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea 
                    rows={4}
                    placeholder="Why do you want to join this project? What value can you bring?"
                    value={motivationMessage}
                    onChange={(e) => setMotivationMessage(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 font-medium placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeApplyModal}
                    disabled={isSubmitting}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-md hover:shadow-lg hover:shadow-indigo-100 transition cursor-pointer min-w-[110px] disabled:bg-indigo-500 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🔔 DYNAMIC TOAST NOTIFICATION */}
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