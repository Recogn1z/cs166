"use client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Welcome to Pizza Store 🍕
        </h1>
        <p className="text-center text-gray-600 mt-2">
          Please log in or sign up to continue.
        </p>
        <div className="mt-6 flex flex-col space-y-4">
          <button
            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600"
            onClick={() => router.push("/login")}
          >
            Login
          </button>
          <button
            className="w-full bg-green-500 text-white p-3 rounded-md hover:bg-green-600"
            onClick={() => router.push("/register")}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
