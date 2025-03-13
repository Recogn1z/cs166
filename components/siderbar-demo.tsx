"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconList,
  IconShoppingCart,
  IconClock,
  IconBuildingStore,
  IconClipboard,
  IconUsers,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export default function SidebarDemo() {
  const router = useRouter();
  const [user, setUser] = useState<{ login: string } | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.log(error);
        router.push("/login");
      }
    }
    checkAuth();
  }, [router]);

  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <IconBrandTabler className="icon" />,
    },
    {
      label: "Profile",
      href: "/dashboard/profile",
      icon: <IconUserBolt className="icon" />,
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: <IconSettings className="icon" />,
    },
    {
      label: "View Menu",
      href: "/dashboard/menu",
      icon: <IconList className="icon" />,
    },
    {
      label: "Place Order",
      href: "/dashboard/order",
      icon: <IconShoppingCart className="icon" />,
    },
    {
      label: "Order History",
      href: "/dashboard/order-history",
      icon: <IconClipboard className="icon" />,
    },
    {
      label: "Recent Orders",
      href: "/dashboard/recent-orders",
      icon: <IconClock className="icon" />,
    },
    {
      label: "Stores",
      href: "/dashboard/stores",
      icon: <IconBuildingStore className="icon" />,
    },
    {
      label: "Update Orders",
      href: "/dashboard/update-order",
      icon: <IconClipboard className="icon" />,
    },
    {
      label: "Update Menu",
      href: "/dashboard/update-menu",
      icon: <IconList className="icon" />,
    },
    {
      label: "Manage Users",
      href: "/dashboard/users",
      icon: <IconUsers className="icon" />,
    },
    {
      label: "Logout",
      href: "/logout",
      icon: <IconArrowLeft className="icon" />,
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1  mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <DashboardContent user={user} />
    </div>
  );
}

const DashboardContent = ({ user }: { user: { login: string } | null }) => (
  <div className="flex flex-1">
    <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-200">
        Welcome, {user?.login || "Loading..."}
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        This is your dashboard.
      </p>
    </div>
  </div>
);
