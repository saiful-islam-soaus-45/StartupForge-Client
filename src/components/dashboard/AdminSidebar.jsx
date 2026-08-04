"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

import {
  HiBars3,
  HiOutlineArrowLeft,
} from "react-icons/hi2";

import {
  LuLayoutDashboard,
  LuUsers,
  LuRocket,
  LuCreditCard,
} from "react-icons/lu";

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      id: "overview",
      label: "Overview",
      route: "/dashboard", 
      icon: <LuLayoutDashboard size={20} />,
    },
    {
      id: "users",
      label: "Manage Users",
      route: "/dashboard/manage-users",
      icon: <LuUsers size={20} />,
    },
    {
      id: "startups",
      label: "Manage Startups",
      route: "/dashboard/manage-startups",
      icon: <LuRocket size={20} />,
    },
    {
      id: "transactions",
      label: "Transactions",
      route: "/dashboard/transactions",
      icon: <LuCreditCard size={20} />,
    },
  ];

  return (
    <>
      {/* Mobile Topbar */}
      <div className="lg:hidden flex items-center justify-between bg-white border-b px-4 py-3">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 cursor-pointer"
        >
          <HiOutlineArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
            ⚡
          </div>
          <span className="font-bold text-slate-800">
            StartupForge
          </span>
        </div>

        <button onClick={() => setIsOpen(!isOpen)}>
          <HiBars3 className="w-6 h-6 text-slate-600" />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transition-transform duration-300
  ${isOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
      >
        {/* Header */}
        <div className="border-b p-5">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 cursor-pointer"
          >
            <HiOutlineArrowLeft />
            Back
          </button>

          <div className="flex items-center gap-3 mt-5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
              ⚡
            </div>

            <div>
              <h2 className="font-bold text-slate-800">
                StartupForge
              </h2>

              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                Admin
              </span>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="p-3 space-y-2">
          {menuItems.map((item) => {
            const active =
              item.route === "/admin"
                ? pathname === "/admin" || pathname === "/admin/"
                : pathname === item.route;

            return (
              <Link
                key={item.id}
                href={item.route}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${active
                    ? "bg-indigo-50 text-indigo-600 font-semibold"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
        />
      )}
    </>
  );
}