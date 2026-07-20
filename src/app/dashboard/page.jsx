import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import FounderOverview from "@/components/dashboard/FounderOverview";
import CollaboratorOverview from "@/components/dashboard/CollaboratorOverview"; // Collaborator ওভারভিউ ইমপোর্ট

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userRole = session?.user?.role?.toLowerCase() || "founder";

  // 🔄 রোল অনুযায়ী ডাইনামিক ওভারভিউ কন্টেন্ট রেন্ডারিং
  if (userRole === "collaborator") {
    return <CollaboratorOverview user={session?.user} />;
  }

  return <FounderOverview user={session?.user} />;
}