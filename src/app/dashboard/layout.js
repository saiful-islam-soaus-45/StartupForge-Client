import SideBar from "@/components/dashboard/sideBar";

export const metadata = {
  title: "Dashboard | Startup Forge",
};

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col lg:flex-row">
      {/* রেসপন্সিভ সাইডবার */}
      <SideBar />

      {/* 
        - lg:pl-64: বড় স্ক্রিনে (Desktop) বামে সাইডবারের জন্য ৬৪ সাইজ জায়গা খালি থাকবে।
        - w-full: মোবাইল ও ট্যাবলেটে কন্টেন্ট পুরো স্ক্রিন জুড়ে থাকবে।
      */}
      <div className="w-full lg:pl-64 flex-1">
        <main className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}