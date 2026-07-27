import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import FounderSidebar from "@/components/dashboard/FounderSidebar";
import CollaboratorSidebar from "@/components/dashboard/CollaboratorSidebar";
import AdminSidebar from "@/components/dashboard/AdminSidebar";

export default async function DashboardLayout({ children }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const loggedInUser = {
    name: session.user.name,
    image: session.user.image,
    email: session.user.email,
    role: session.user.role?.toLowerCase() || "founder",
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ================= Mobile Sidebar ================= */}
      <div className="lg:hidden">
        {loggedInUser.role === "admin" ? (
          <AdminSidebar user={loggedInUser} />
        ) : loggedInUser.role === "collaborator" ? (
          <CollaboratorSidebar user={loggedInUser} />
        ) : (
          <FounderSidebar user={loggedInUser} />
        )}
      </div>

      {/* ================= Desktop Layout ================= */}
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-72 shrink-0">
          {loggedInUser.role === "admin" ? (
            <AdminSidebar user={loggedInUser} />
          ) : loggedInUser.role === "collaborator" ? (
            <CollaboratorSidebar user={loggedInUser} />
          ) : (
            <FounderSidebar user={loggedInUser} />
          )}
        </div>

        {/* Main Content */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-10">
          {/* Horizontal Scroll Support */}
          <div className="w-full overflow-x-auto">
            <div className="mx-auto w-full max-w-7xl">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}