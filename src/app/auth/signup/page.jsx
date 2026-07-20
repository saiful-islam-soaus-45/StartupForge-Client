"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiUploadCloud, FiCheck, FiX } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth-client"; // আপনার Better-Auth ক্লায়েন্ট পাথ

export default function SignupPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // ফর্ম স্টেটস
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Collaborator"); // ডিফল্ট রোল
    const [imageUrl, setImageUrl] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    // পাসওয়ার্ড ভ্যালিডেশন চেকার্স
    const hasMinLength = password.length >= 6;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const isPasswordValid = hasMinLength && hasUppercase && hasLowercase;

    // Imgbb-তে সরাসরি ইমেজ ফাইল আপলোড করার ফাংশন
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        setErrorMsg("");

        const formData = new FormData();
        formData.append("image", file);

        const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

        if (!IMGBB_API_KEY) {
            setTimeout(() => {
                setImageUrl(`https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name || "user")}`);
                setIsUploading(false);
                alert("Using placeholder avatar. Please put your real ImgBB API key in the .env file for actual file uploads!");
            }, 800);
            return;
        }

        try {
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (data.success) {
                setImageUrl(data.data.url);
            } else {
                setErrorMsg("Failed to upload image. Please try again.");
            }
        } catch (err) {
            setErrorMsg("Image upload failed. Check connection.");
        } finally {
            setIsUploading(false);
        }
    };

    // ফর্ম সাবমিট ও Better-Auth দিয়ে অ্যাকাউন্ট তৈরি
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isPasswordValid) {
            setErrorMsg("Please satisfy all password requirements.");
            return;
        }

        setIsLoading(true);
        setErrorMsg("");

        try {
            await authClient.signUp.email({
                email,
                password,
                name,
                image: imageUrl || undefined,
                role: role, // ⚡ ফিক্স: Better-Auth এ কাস্টম এডিশনাল ফিল্ড এভাবে সরাসরি পাস করতে হয়
                callbackURL: "/", // সফল হলে হোম পেজে রিডাইরেক্ট হবে
            }, {
                onRequest: () => setIsLoading(true),
                onSuccess: () => {
                    setIsLoading(false);
                    router.push("/");
                    router.refresh();
                },
                onError: (ctx) => {
                    setIsLoading(false);
                    setErrorMsg(ctx.error.message || "Something went wrong.");
                }
            });
        } catch (err) {
            setIsLoading(false);
            setErrorMsg("Failed to sign up. Connection error.");
        }
    };

    return (
        <div className="flex min-h-[90vh] items-center justify-center bg-slate-50/50 px-4 py-8">
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
                        Create account
                    </h1>
                    <p className="mt-0.5 text-xs text-gray-400 font-medium">
                        Join the dream team builder platform
                    </p>
                </div>

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

                {/* সাইনআপ ফর্ম */}
                <form onSubmit={handleSubmit} className="space-y-3.5">

                    {/* নাম ফিল্ড */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                        <div className="relative rounded-xl shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                <FiUser size={15} />
                            </div>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                className="block w-full rounded-xl border border-slate-200 py-2 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                            />
                        </div>
                    </div>

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

                    {/* রোল সিলেকশন */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Select Role</label>
                        <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-slate-100 p-1">
                            <button
                                type="button"
                                onClick={() => setRole("Founder")}
                                className={`rounded-lg py-1 text-xs font-bold transition-all ${role === "Founder"
                                    ? "bg-white text-indigo-600 shadow-sm"
                                    : "text-slate-500 hover:text-slate-800"
                                    }`}
                            >
                                Founder
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole("Collaborator")}
                                className={`rounded-lg py-1 text-xs font-bold transition-all ${role === "Collaborator"
                                    ? "bg-white text-indigo-600 shadow-sm"
                                    : "text-slate-500 hover:text-slate-800"
                                    }`}
                            >
                                Collaborator
                            </button>
                        </div>
                    </div>

                    {/* ইমেজ আপলোড */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Profile Image</label>
                        <div className="flex items-center gap-3">
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt="Profile Preview"
                                    className="h-10 w-10 rounded-full object-cover border border-indigo-100"
                                />
                            ) : (
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400 text-[10px] font-semibold">
                                    No Pic
                                </div>
                            )}
                            <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 transition">
                                <FiUploadCloud size={16} className="text-indigo-500" />
                                <span>{isUploading ? "Uploading..." : imageUrl ? "Change Image" : "Upload File"}</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    {/* পাসওয়ার্ড ফিল্ড */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
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

                        {/* পাসওয়ার্ড ইন্ডিকেটর */}
                        <div className="mt-2 space-y-1 rounded-xl bg-slate-50 p-2 border border-slate-100/70">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Requirements:</p>
                            <div className="flex items-center gap-1 text-[10px]">
                                {hasMinLength ? <FiCheck className="text-emerald-500" /> : <FiX className="text-rose-400" />}
                                <span className={hasMinLength ? "text-emerald-600 font-semibold" : "text-slate-400"}>Min 6 characters</span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px]">
                                {hasUppercase ? <FiCheck className="text-emerald-500" /> : <FiX className="text-rose-400" />}
                                <span className={hasUppercase ? "text-emerald-600 font-semibold" : "text-slate-400"}>At least one uppercase letter (A-Z)</span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px]">
                                {hasLowercase ? <FiCheck className="text-emerald-500" /> : <FiX className="text-rose-400" />}
                                <span className={hasLowercase ? "text-emerald-600 font-semibold" : "text-slate-400"}>At least one lowercase letter (a-z)</span>
                            </div>
                        </div>
                    </div>

                    {/* সাবমিট বাটন */}
                    <div className="pt-1">
                        <button
                            type="submit"
                            disabled={isLoading || isUploading}
                            className="flex w-full justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 text-xs font-semibold text-white shadow-md hover:opacity-95 disabled:opacity-70 transition-all"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-1.5">
                                    <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Creating account...
                                </span>
                            ) : (
                                "Sign up"
                            )}
                        </button>
                        <div className="mt-4">
                            <button
                                type="button"
                                onClick={async () => {
                                    await authClient.signIn.social({ provider: "google", callbackURL: "/" });
                                }}
                                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
                            >
                                <FcGoogle size={16} />
                                Sign up with Google
                            </button>
                        </div>
                    </div>
                </form>

                <p className="mt-5 text-center text-xs font-medium text-gray-400">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}