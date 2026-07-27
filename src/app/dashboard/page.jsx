import { auth } from "@/lib/auth";
import { headers } from "next/headers";


import FounderOverview from "@/components/dashboard/FounderOverview";
import CollaboratorOverview from "@/components/dashboard/CollaboratorOverview";
import AdminOverview from "@/components/dashboard/AdminOverview";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userRole = session?.user?.role?.toLowerCase() || "founder";

 if (userRole === "admin") {
  return <AdminOverview user={session.user} />;
}

if (userRole === "collaborator") {
  return <CollaboratorOverview user={session.user} />;
}

return <FounderOverview user={session.user} />;
}
