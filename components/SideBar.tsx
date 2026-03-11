"use client";

import {
  LuActivity,
  LuArchive,
  LuLayers,
  LuPackage,
  LuReceipt,
  LuSettings,
  LuTrendingUp,
  LuUser,
  LuUsers,
} from "react-icons/lu";
import { VscDashboard } from "react-icons/vsc";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/hook/useUser";
import { useMemo } from "react";

interface SideBarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (value: boolean) => void;
}

export default function Sidebar({
  isMobileOpen,
  setIsMobileOpen,
}: SideBarProps) {
  const pathname = usePathname();
  const { user } = useUser();

  const navLinks = [
    {
      label: "Dashboard",
      icon: VscDashboard,
      path: "/dashboard",
      roles: ["admin", "staff"],
    },
    {
      label: "Inventory",
      icon: LuPackage,
      path: "/dashboard/inventory",
      roles: ["admin", "staff"],
    },
    {
      label: "Borrow Records",
      icon: LuReceipt,
      path: "/dashboard/borrow",
      roles: ["admin", "staff"],
    },
    {
      label: "Cupboards",
      icon: LuArchive,
      path: "/dashboard/cupboard",
      roles: ["admin", "staff"],
    },
    {
      label: "Storage Places",
      icon: LuLayers,
      path: "/dashboard/storage-places",
      roles: ["admin", "staff"],
    },
    {
      label: "Users",
      icon: LuUsers,
      path: "/dashboard/users",
      roles: ["admin"],
    },
    {
      label: "Activity Logs",
      icon: LuActivity,
      path: "/dashboard/activity-logs",
      roles: ["admin"],
    },
    {
      label: "Reports",
      icon: LuTrendingUp,
      path: "/coming-soon",
      roles: ["admin", "staff"],
    },
    {
      label: "Profile",
      icon: LuUser,
      path: "/coming-soon",
      roles: ["admin", "staff"],
    },
    {
      label: "Settings",
      icon: LuSettings,
      path: "/coming-soon",
      roles: ["admin", "staff"],
    },
  ];

  const filteredLinks = useMemo(
    () =>
      navLinks.filter((link) => user?.role && link.roles.includes(user.role)),
    [user],
  );
  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`bg-secondary fixed top-0 left-0 z-50 h-screen w-64 border-r transition-transform duration-300 md:relative md:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 w-full items-center justify-center border-b">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight text-[#F8FAFC]">
              Smart
            </span>
            <span className="text-xl font-light tracking-tight text-[#F8FAFC]/70">
              Stock
            </span>
          </Link>
        </div>

        <nav className="mt-6 flex w-full flex-col space-y-1 px-3">
          {filteredLinks.map((item, key) => {
            const Icon = item.icon;

            const isActive = pathname === item.path;

            return (
              <Link
                key={key}
                href={item.path}
                className={`flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium text-[#F8FAFC] ${
                  isActive
                    ? "bg-accent"
                    : "hover:bg-accent hover:text-primary transition-colors"
                }`}
              >
                <Icon className="text-primary h-5 w-5 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
