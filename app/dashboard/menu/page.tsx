"use client";
import { useState, useEffect } from "react";

export default function ViewMenu() {
  const [menu, setMenu] = useState<
    {
      itemName: string;
      typeOfItem: string;
      price: number;
      description: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch("/api/menu");
        const data = await res.json();
        setMenu(data.menu || []);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch menu:", error);
        setLoading(false);
      }
    }
    fetchMenu();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading menu...</p>;
  }

  return (
    <div className=" min-h-min w-full flex flex-col overflow-hidden">
      <div className=" h-max ">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-200 ">
          📜 Menu
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 ">
          {menu.map((item, index) => (
            <div
              key={index}
              className=" dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700  bg-gradient-to-bl from-pink-50 to-cyan-50  opacity-90 drop-shadow-sm"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
                {item.itemName}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.typeOfItem}
              </p>
              <p className="text-gray-700 dark:text-gray-300 mt-1">
                {item.description}
              </p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400 mt-1">
                ${item.price.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
