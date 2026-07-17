"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth-client"; // আপনার Better-Auth ক্লায়েন্ট পাথ

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ১. ইউজার অন্য কোনো পেজ থেকে রিডাইরেক্ট হয়ে আসলে সেই পেজ, নতুবা ডিফল্ট হোমপেজে ('/') রিডাইরেক্ট করবে
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  // ২. Credential (ইমেইল ও পাসওয়ার্ড) লগইন হ্যান্ডলার
  const handleCredentialLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      await authClient.signIn.email({
        email,
        password,
        callbackURL: callbackUrl,
      }, {
        onRequest: () => setIsLoading(true),
        onSuccess: () => {
          setIsLoading(false);
          router.push(callbackUrl);
          router.refresh();
        },
        onError: (ctx) => {
          setIsLoading(false);
          setErrorMsg(ctx.error.message || "Invalid email or password.");
        }
      });
    } catch (err) {
      setIsLoading(false);
      setErrorMsg("An unexpected error occurred. Please try again.");
    }
  };

  // ৩. গুগল সোশ্যাল লগইন হ্যান্ডলার
  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackUrl,
      });
    } catch (err) {
      setErrorMsg("Failed to sign in with Google.");
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center bg-slate-50/50 px-4 py-8">
      {/* সাইনআপ কার্ডের মতোই কম্প্যাক্ট সাইজ max-w-[400px] */}
      <div className="w-full max-w-[400px] rounded-2xl border border-slate-100 bg-white p-6 shadow-lg shadow-slate-100/50">
        
        {/* লোগো ও হেডার */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-sm">
            <span className="text-base text-white font-bold">⚡</span>
          </div>
          <h2 className="mt-2.5 text-xs font-bold text-slate-800 tracking-tight flex items-center gap-1">
            <span className="text-slate-900">⚡ Startup</span>
            <span className="text-indigo-600">Forge</span>
          </h2>
          <h1 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900">
            Welcome back
          </h1>
          <p className="mt-0.5 text-xs text-gray-400 font-medium">
            Sign in to your account
          </p>
        </div>

        {/* এরর মেসেজ */}
        {errorMsg && (
          <div className="mt-3 rounded-lg bg-red-50 p-2 text-center text-xs font-medium text-red-600 border border-red-100">
            {errorMsg}
          </div>
        )}

        

        {/* ডিভাইডার */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-100" />
          </div>
          <div className="relative flex justify-center text-[10px] font-semibold uppercase">
            <span className="bg-white px-2 text-gray-400">or</span>
          </div>
        </div>

        {/* সাইনইন ফর্ম */}
        <form onSubmit={handleCredentialLogin} className="space-y-3.5">
          
          {/* ইমেইল ফিল্ড */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <FiMail size={15} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="block w-full rounded-xl border border-slate-200 py-2 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>
          </div>

          {/* পাসওয়ার্ড ফিল্ড */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">Password</label>
              <Link href="/forgot-password" className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-500">
                Forgot?
              </Link>
            </div>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <FiLock size={15} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full rounded-xl border border-slate-200 py-2 pl-10 pr-10 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
              </button>
            </div>
          </div>

          {/* সাবমিট বাটন */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 text-xs font-semibold text-white shadow-md hover:opacity-95 disabled:opacity-70 transition-all"
            >
              {isLoading ? (
                <span className="flex items-center gap-1.5">
                  <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
            {/* Google দিয়ে ওয়ান-ক্লিক সাইনইন */}
        <div className="mt-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
          >
            <FcGoogle size={16} />
            Continue with Google
          </button>
        </div>
          </div>
        </form>

        {/* সাইন-আপ করার লিংক */}
        <p className="mt-5 text-center text-xs font-medium text-gray-400">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="font-semibold text-indigo-600 hover:text-indigo-500 transition">
            Sign up free
          </Link>
        </p>

      </div>
    </div>
  );
}