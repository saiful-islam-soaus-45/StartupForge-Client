import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import FounderSidebar from "@/components/dashboard/FounderSidebar";
import CollaboratorSidebar from "@/components/dashboard/CollaboratorSidebar"; // Collaborator সাইডবার ইমপোর্ট

export default async function DashboardLayout({ children }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  // Better-Auth থেকে লাইভ ইউজার ডেটা ও রোল নেওয়া হচ্ছে
  const loggedInUser = {
    name: session.user.name,
    image: session.user.image,
    role: session.user.role?.toLowerCase() || "founder", // lowercase করে নেওয়া সেফ
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50/50">
      {/* 🔄 রোল অনুযায়ী ডাইনামিক সাইডবার রেন্ডারিং */}
      {loggedInUser.role === "collaborator" ? (
        <CollaboratorSidebar user={loggedInUser} />
      ) : (
        <FounderSidebar user={loggedInUser} />
      )}
      
      {/* ডান পাশে মেইন কメント এরিয়া */}
      <main className="flex-1 p-6 lg:p-10 overflow-x-auto">
        <div className="w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}