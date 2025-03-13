"use client";
import { useEffect, useState } from "react";

interface Store {
  storeID: number;
  address: string;
  city: string;
  state: string;
  isOpen: string;
  reviewScore: number | null;
}

export default function ViewStores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStores() {
      try {
        const res = await fetch("/api/viewstores");
        if (!res.ok) {
          throw new Error("failed");
        }
        const data = await res.json();
        setStores(data.stores);
      } catch (err) {
        setError("failed");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStores();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-200">
        🏬 View Stores
      </h1>
      <p className="text-gray-600 dark:text-gray-400">view stroe info</p>

      {loading && <p className="text-gray-500 mt-4">⏳ loading...</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {!loading && !error && stores.length === 0 && (
        <p className="text-gray-500 mt-4">no more info</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {stores.map((store) => (
          <div
            key={store.storeID}
            className="p-6 bg-white shadow-md rounded-lg border border-gray-200"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              📍 {store.address}
            </h2>
            <p className="text-gray-600">
              {store.city}, {store.state}
            </p>
            <p
              className={`mt-2 font-semibold ${
                store.isOpen === "Yes" ? "text-green-600" : "text-red-600"
              }`}
            >
              {store.isOpen === "Yes" ? "✅ opening" : "❌ closed"}
            </p>
            <p className="text-yellow-600 mt-1">
              ⭐ rates: {store.reviewScore ?? "no rate"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
