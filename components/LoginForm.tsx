"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function LoginForm() {
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const router = useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("⏳ Checking credentials...");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("✅ Login Successful! 🎉");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Login to Your Account
        </h2>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-2">
            <input
              type="text"
              name="login"
              placeholder="Username"
              value={formData.login}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-br from-green-500 to-teal-600 text-white p-3 rounded-lg hover:from-teal-600 hover:to-green-500 transition duration-300"
          >
            LOGIN
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-gray-700 font-semibold">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
