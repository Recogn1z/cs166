"use client";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState<{ login: string; phoneNum: string } | null>(
    null
  );

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
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200">
        Profile
      </h2>
      {user ? (
        <div className="mt-4 space-y-3">
          <p className="text-lg text-gray-700 dark:text-gray-300">
            <strong>Username:</strong> {user.login}
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            <strong>Phone Number:</strong> {user.phoneNum}
          </p>
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      )}
    </div>
  );
}
