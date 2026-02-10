"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/interceptors/api";
import Loader from "@/components/Lodder";

export default function HomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const name = searchParams.get("name");

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!name);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (name) {
      setIsLoggedIn(true);
      setLoading(false);
    } else {
      setIsLoggedIn(false);
      router.replace("/auth/login");
    }
  }, [name, router]);

  const handleLogout = async () => {
    try {
      await api.get("/auth/signout");
      setIsLoggedIn(false);
      router.replace("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-400">
      {/* 🌟 Navbar */}
      <nav className="flex justify-between items-center bg-blue-600 text-white px-6 py-4 shadow-md">
        <h1 className="text-xl font-bold">MyApp</h1>
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-200 transition"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => router.push("/auth/login")}
            className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-200 transition"
          >
            Login
          </button>
        )}
      </nav>

      {/* 🏠 Main Content */}
      <main className="flex flex-col items-center justify-center h-[80vh] text-center">
        {isLoggedIn ? (
          <h2 className="text-3xl font-semibold text-gray-800 hover:text-gray-600 transition">
            👋 Welcome Back, {name}!
          </h2>
        ) : (
          <h2 className="text-2xl text-gray-600">
            Please login to continue 🙂
          </h2>
        )}
      </main>
    </div>
  );
}
