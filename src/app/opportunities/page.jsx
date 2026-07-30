"use client";

import { useEffect, useState } from "react";
import { FiCalendar, FiCpu, FiClock, FiSend, FiX, FiLink, FiMail, FiCheck, FiSearch, FiFilter } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function BrowseOpportunities() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔍 Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWorkType, setSelectedWorkType] = useState("");
  const [selectedCommitment, setSelectedCommitment] = useState("");

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

  // 📦 Fetch Opportunities with Search & Filters query params
  useEffect(() => {
    const fetchOpportunities = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", limit);
        if (searchTerm.trim()) {
          params.append("search", searchTerm.trim());
        }
        if (selectedWorkType) {
          params.append("workType", selectedWorkType);
        }
        if (selectedCommitment) {
          params.append("commitmentLevel", selectedCommitment);
        }

        // 👈 credentials: "include" ব্যবহার করা হয়েছে যাতে কুকি/টোকেন ব্যাকএন্ডে যায়
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/opportunities?${params.toString()}`, {
          method: "GET",
          
          headers: {
            "Content-Type": "application/json",
          },
        });
        const resData = await res.json();

        if (resData.success) {
          setOpportunities(resData.data);
          setTotalPages(resData.pagination.totalPages);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchOpportunities();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedWorkType, selectedCommitment, page]);

  useEffect(() => {
    if (isModalOpen) {
      if (session?.user?.email) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setApplicantEmail(session.user.email);
      } else {
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

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 3050);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleWorkTypeToggle = (type) => {
    setSelectedWorkType(prev => prev === type ? "" : type);
  };

  const handleCommitmentToggle = (level) => {
    setSelectedCommitment(prev => prev === level ? "" : level);
  };

  const openApplyModal = (opp) => {
    const role = session?.user?.role?.toLowerCase();

    if (role !== "collaborator") {
      toast.error("Only collaborators can apply for opportunities.", {
        duration: 3000,
        style: {
          borderRadius: "14px",
          background: "#0f172a",
          color: "#fff",
          border: "1px solid #334155",
          padding: "14px 18px",
          fontWeight: "600",
        },
        icon: "🚫",
      });

      return;
    }

    setSelectedOpp(opp);
    setIsModalOpen(true);
  };

  const closeApplyModal = () => {
    setIsModalOpen(false);
    setSelectedOpp(null);
    setApplicantEmail("");
    setPortfolioLink("");
    setMotivationMessage("");
  };

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
      startupId: selectedOpp.startupId,
      roleTitle: selectedOpp.roleTitle,
      founderEmail: selectedOpp.founderEmail,
      applicantEmail,
      motivationMessage,
      portfolioLink,
      appliedDate: new Date(),
      status: "Pending"
    };

    try {
      // 👈 এখানেও credentials: "include" দেওয়া হয়েছে
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/applications`, {
        method: "POST",
       
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(applicationData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        closeApplyModal();
        showToast(`Successfully applied for ${selectedOpp.roleTitle}! 🎉`);
      } else {
        if (data.message === "You have already applied for this opportunity.") {
          alert("❌ You have already applied for this opportunity.");
        } else {
          alert(data.message || "Failed to apply.");
        }
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
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
        <motion.div variants={itemVariants} className="mb-10 text-center lg:text-left">
          <h2 className="text-3xl font-black text-slate-950 tracking-tight sm:text-4xl bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Explore Open Opportunities
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-500 max-w-2xl font-medium leading-relaxed">
            Join fast-growing startups and bring your talent to revolutionary projects.
          </p>
        </motion.div>

        {/* 🔍 Search & Filter Control Panel */}
        <motion.div variants={itemVariants} className="mb-10 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <FiSearch size={18} />
              </span>
              <input
                type="text"
                placeholder="Search by role title or skills..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              />
            </div>

            {/* Clear Filters */}
            {(searchTerm || selectedWorkType || selectedCommitment) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedWorkType("");
                  setSelectedCommitment("");
                  setPage(1);
                }}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
              >
                Clear All Filters
              </button>
            )}
          </div>

          {/* Filter Layout */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            {/* Line 1: Work Type */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1 mr-1">
                <FiFilter size={13} className="text-slate-400" /> Work Type:
              </span>
              {["Remote", "On-site", "Hybrid"].map((type) => {
                const isSelected = selectedWorkType === type;
                return (
                  <button
                    key={type}
                    onClick={() => {
                      handleWorkTypeToggle(type);
                      setPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border ${
                      isSelected
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>

            {/* Line 2: Commitment Level */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1 mr-1">
                <span className="w-[13px]" /> Commitment:
              </span>
              {["Full-time", "Part-time", "Contractual", "Equity-Based"].map((level) => {
                const isSelected = selectedCommitment === level;
                return (
                  <button
                    key={level}
                    onClick={() => {
                      handleCommitmentToggle(level);
                      setPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border ${
                      isSelected
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Grid List */}
        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          </div>
        ) : opportunities.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="text-center py-24 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200"
          >
            <p className="text-slate-400 font-semibold tracking-wide">No opportunities found matching your criteria!</p>
          </motion.div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {opportunities.map((opp) => (
                <motion.div
                  key={opp._id}
                  variants={itemVariants}
                  className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      {opp.workType && (
                        <span className="inline-flex rounded-lg bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600 border border-indigo-100/50">
                          {opp.workType}
                        </span>
                      )}
                      {opp.commitmentLevel && (
                        <span className="inline-flex rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 border border-slate-200/60">
                          {opp.commitmentLevel}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900 capitalize tracking-tight group-hover:text-indigo-600 transition-colors duration-200 line-clamp-1">
                        {opp.roleTitle}
                      </h3>

                      <div className="w-6 h-[2px] bg-indigo-600/30 my-3 group-hover:w-12 transition-all duration-300 rounded-full" />

                      <div className="space-y-2.5 mt-4">
                        <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 font-medium">
                          <FiCpu size={15} className="text-slate-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">
                            <strong className="text-slate-700">Skills:</strong> {opp.requiredSkills}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-medium">
                          <FiCalendar size={15} className="text-slate-400 shrink-0" />
                          <span>
                            <strong className="text-slate-700">Deadline:</strong> {opp.deadline}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium italic">
                          <FiClock size={15} className="text-slate-400 shrink-0" />
                          <span>Posted: {formatDate(opp.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => openApplyModal(opp)}
                      className="flex items-center justify-center gap-2 w-full rounded-xl bg-indigo-600 px-4 py-3 text-xs font-bold text-white hover:bg-indigo-700 shadow-md hover:shadow-lg hover:shadow-indigo-100 transition-all duration-200 cursor-pointer group/btn"
                    >
                      Apply Now
                      <FiSend size={13} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-2 px-4">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm ${
                    page === 1
                      ? "cursor-not-allowed bg-slate-100 text-slate-400"
                      : "border border-slate-200 bg-white hover:border-indigo-500 hover:text-indigo-600"
                  }`}
                >
                  ← Previous
                </button>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => setPage(index + 1)}
                      className={`h-9 w-9 rounded-lg text-xs font-bold transition sm:h-10 sm:w-10 sm:text-sm ${
                        page === index + 1
                          ? "bg-indigo-600 text-white shadow-md"
                          : "border border-slate-200 bg-white text-slate-700 hover:border-indigo-500 hover:text-indigo-600"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm ${
                    page === totalPages
                      ? "cursor-not-allowed bg-slate-100 text-slate-400"
                      : "border border-slate-200 bg-white hover:border-indigo-500 hover:text-indigo-600"
                  }`}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Modal */}
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
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                    <FiMail size={12} className="text-slate-400" /> Applicant Email <span className="text-rose-500">*</span>
                  </label>

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

      {/* Toast Notification */}
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