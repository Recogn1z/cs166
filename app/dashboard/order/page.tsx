"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PlaceOrder() {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState<
    { itemName: string; price: number }[]
  >([]);
  const [stores, setStores] = useState<{ storeID: number; address: string }[]>(
    []
  );
  const [selectedStore, setSelectedStore] = useState<number | null>(null);
  const [order, setOrder] = useState<{ [key: string]: number }>({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      const menuRes = await fetch("/api/menu");
      const storeRes = await fetch("/api/stores");

      if (menuRes.ok) {
        const menuData = await menuRes.json();
        setMenuItems(menuData.menu);
      }

      if (storeRes.ok) {
        const storeData = await storeRes.json();
        setStores(storeData.stores);
      }
    }
    fetchData();
  }, []);

  const handleQuantityChange = (itemName: string, quantity: number) => {
    setOrder((prev) => ({
      ...prev,
      [itemName]: Math.max(0, quantity),
    }));
  };

  const handleSubmit = async () => {
    if (!selectedStore) {
      setMessage("❌ pick one seller");
      return;
    }

    const itemsInOrder = Object.entries(order)
      .filter(([, qty]) => qty > 0)
      .map(([itemName, quantity]) => ({ itemName, quantity }));

    if (itemsInOrder.length === 0) {
      setMessage("❌ pick at least one item ");
      return;
    }

    setMessage("⏳ loading...");

    try {
      const res = await fetch("/api/place-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeID: selectedStore, items: itemsInOrder }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ successed！");
        router.push("/dashboard/order-history");
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (error) {
      setMessage("❌ failed");
      console.error(error);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-200">
        📦 Place Order
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        pick item and then choose items
      </p>

      <div className="mt-4">
        <label className="font-semibold text-gray-900 dark:text-gray-200">
          pick stores
        </label>
        <select
          value={selectedStore || ""}
          onChange={(e) => setSelectedStore(Number(e.target.value))}
          className="w-full p-2 mt-2 border rounded-md"
        >
          <option value="">-- pick stores --</option>
          {stores.map((store) => (
            <option key={store.storeID} value={store.storeID}>
              {store.address}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {menuItems.map((item) => (
          <div
            key={item.itemName}
            className="p-4 bg-white shadow-md rounded-lg border border-gray-200"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              {item.itemName}
            </h2>
            <p className="text-green-600 font-bold">${item.price.toFixed(2)}</p>
            <div className="flex items-center mt-2">
              <button
                className="px-3 py-1 bg-gray-300 text-gray-800 rounded-l"
                onClick={() =>
                  handleQuantityChange(
                    item.itemName,
                    (order[item.itemName] || 0) - 1
                  )
                }
              >
                ➖
              </button>
              <input
                type="number"
                value={order[item.itemName] || 0}
                onChange={(e) =>
                  handleQuantityChange(item.itemName, Number(e.target.value))
                }
                className="w-12 text-center border border-gray-300"
              />
              <button
                className="px-3 py-1 bg-gray-300 text-gray-800 rounded-r"
                onClick={() =>
                  handleQuantityChange(
                    item.itemName,
                    (order[item.itemName] || 0) + 1
                  )
                }
              >
                ➕
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
      >
        🛒 place order
      </button>

      {message && <p className="mt-4 text-gray-800 font-semibold">{message}</p>}
    </div>
  );
}
