"use client";
import { useState, useEffect } from "react";

export default function RecentOrders() {
  const [orders, setOrders] = useState<
    {
      orderID: number;
      storeID: number;
      totalPrice: number;
      orderTimestamp: string;
      orderStatus: string;
    }[]
  >([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchRecentOrders() {
      setMessage("⏳ Loading...");
      try {
        const res = await fetch("/api/recent-orders");
        const data = await res.json();

        if (res.ok) {
          setOrders(data.orders);
          setMessage("");
        } else {
          setMessage(`❌ ${data.error}`);
        }
      } catch (error) {
        setMessage("❌ Failed to load recent orders");
        console.error(error);
      }
    }
    fetchRecentOrders();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-200">
        📌 Recent Orders
      </h1>

      {message && <p className="mt-4 text-gray-800 font-semibold">{message}</p>}

      {orders.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <div
              key={order.orderID}
              className="p-4 bg-white shadow-md rounded-lg border border-gray-200"
            >
              <h2 className="text-lg font-semibold text-gray-900">
                Order #{order.orderID}
              </h2>
              <p className="text-gray-700">Store: {order.storeID}</p>
              <p className="text-gray-700">
                Total: ${order.totalPrice.toFixed(2)}
              </p>
              <p className="text-gray-700">Status: {order.orderStatus}</p>
              <p className="text-gray-500 text-sm">
                Placed on: {new Date(order.orderTimestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        !message && <p className="text-gray-600">No recent orders found.</p>
      )}
    </div>
  );
}
