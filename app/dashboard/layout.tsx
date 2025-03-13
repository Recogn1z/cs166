"use client";
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
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    { label: "Dashboard", href: "/dashboard", icon: <IconBrandTabler /> },
    { label: "Profile", href: "/dashboard/profile", icon: <IconUserBolt /> },
    { label: "Settings", href: "/dashboard/settings", icon: <IconSettings /> },
    { label: "View Menu", href: "/dashboard/menu", icon: <IconList /> },
    {
      label: "Place Order",
      href: "/dashboard/order",
      icon: <IconShoppingCart />,
    },
    {
      label: "Order History",
      href: "/dashboard/order-history",
      icon: <IconClipboard />,
    },
    {
      label: "Recent Orders",
      href: "/dashboard/recent-orders",
      icon: <IconClock />,
    },
    { label: "Stores", href: "/dashboard/stores", icon: <IconBuildingStore /> },
    {
      label: "Update Orders",
      href: "/dashboard/update-order",
      icon: <IconClipboard />,
    },
    {
      label: "Update Menu",
      href: "/dashboard/update-menu",
      icon: <IconList />,
    },
    { label: "Manage Users", href: "/dashboard/users", icon: <IconUsers /> },
    { label: "Logout", href: "/logout", icon: <IconArrowLeft /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-neutral-900">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 bg-gradient-to-tr from-rose-100 to-pink-200">
          <div className="flex flex-col flex-1 overflow-y-auto">
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div className="p-4 text-gray-700 dark:text-gray-300">
            {user?.login || "Loading..."}
          </div>
        </SidebarBody>
      </Sidebar>

      {/* 右侧动态切换的内容 */}
      <div className="flex-1 p-10 bg-gradient-to-bl from-yellow-50 to-orange-100 bg-opacity-60 backdrop-blur-lg">
        {children}
      </div>
    </div>
  );
}
