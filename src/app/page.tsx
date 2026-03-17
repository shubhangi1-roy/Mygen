"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("workoutUser");
    if (userData) {
      router.push("/workout");
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-[#1a1a2e] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500" />
    </main>
  );
}
