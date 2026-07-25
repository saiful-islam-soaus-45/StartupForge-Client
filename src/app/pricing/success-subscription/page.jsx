import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Mail,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { subscription } from "@/lib/actions/payment";

export default async function Success({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const session_id = resolvedSearchParams?.session_id;

  const session = await auth.api.getSession({
      headers: await headers(),
    });
    const user = session?.user;

  if (!session_id) {
    throw new Error("Please provide a valid session_id (`cs_test_...`)");
  }

  const {
    status,
    customer_details: { email: customerEmail } = {},
    amount_total,
    currency,
  } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  if (status === "open") {
    redirect("/");
  }

  const formattedAmount = amount_total
    ? `${(amount_total / 100).toFixed(2)} ${currency.toUpperCase()}`
    : "$15.00 USD";

  if (status === "complete") {
    const result = await subscription({user, session_id})
    console.log(result);
    return (
      <main className="min-h-[85vh] bg-gradient-to-br from-indigo-50/50 via-white to-violet-50/50 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-sm rounded-2xl border border-indigo-100/80 bg-white/95 backdrop-blur-md p-6 shadow-xl shadow-indigo-100/40">

          {/* Success Icon */}
          <div className="flex justify-center mb-3">
            <div className="rounded-full bg-emerald-50 p-2.5 text-emerald-600 shadow-sm">
              <CheckCircle2 className="h-7 w-7" />
            </div>
          </div>

          {/* Payment Successful Header with Background Color Box */}
          <div className="rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-100/60 p-4 text-center">
            <h1 className="text-lg font-bold tracking-tight text-slate-900">
              Payment Successful! 🎉
            </h1>
            <p className="mt-1 text-[11px] font-medium text-slate-600">
              Your founder account has been successfully unlocked.
            </p>
          </div>

          {/* Details Box (Email & Amount) */}
          <div className="mt-4 space-y-2">
            {/* Email info */}
            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-3.5 py-2.5">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-indigo-600" />
                <span className="text-[11px] font-semibold text-slate-600">Email</span>
              </div>
              <span className="text-[11px] font-medium text-slate-900 max-w-[160px] truncate">
                {customerEmail || "N/A"}
              </span>
            </div>

            {/* Total Paid */}
            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-3.5 py-2.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span className="text-[11px] font-semibold text-slate-600">Total Paid</span>
              </div>
              <span className="text-[11px] font-bold text-indigo-600">
                {formattedAmount}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-5 space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-200 hover:opacity-95 transition"
            >
              Go to Dashboard
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <Link
              href="/"
              className="block w-full rounded-xl border border-slate-200/80 py-2 text-center text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Back to Home
            </Link>
          </div>

          {/* Footer Support */}
          <div className="mt-4 border-t border-slate-100 pt-3 text-center">
            <p className="text-[10px] text-slate-400">
              Need help?{" "}
              <a
                href="mailto:orders@example.com"
                className="font-semibold text-indigo-600 hover:underline"
              >
                orders@example.com
              </a>
            </p>
          </div>

        </div>
      </main>
    );
  }

  return null;
}