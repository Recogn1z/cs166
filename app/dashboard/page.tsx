"use client";

import { useState, useEffect } from "react";

export default function DashboardPage() {
  const [user, setUser] = useState<{ login: string } | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    }
    fetchProfile();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-200">
        Welcome, {user?.login || "Loading..."}
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        This is your dashboard.
      </p>
    </div>
  );
}
