"use client";
import { useState } from "react";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    login: "",
    password: "",
    phoneNum: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("⏳ Loading...");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("✅ Successfully Registered! 🎉");
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
          Create an Account
        </h2>
        <p className="text-gray-600 text-sm text-center mt-1">
          Sign up to access your account
        </p>

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
            <input
              type="text"
              name="phoneNum"
              placeholder="Phone Number"
              value={formData.phoneNum}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-3 rounded-lg hover:from-indigo-600 hover:to-blue-500 transition duration-300"
          >
            SIGN UP
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
