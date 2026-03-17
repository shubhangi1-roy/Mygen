"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [fitnessLevel, setFitnessLevel] = useState("intermediate");
  const [goal, setGoal] = useState("strength");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    setIsLoading(true);

    // Simulate login delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Store user preferences in localStorage
    localStorage.setItem(
      "workoutUser",
      JSON.stringify({ name, fitnessLevel, goal })
    );

    setIsLoading(false);
    router.push("/workout");
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-black/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-black">
              AdaptX Exercise Engine
            </span>
          </h1>
          <p className="text-gray-400">Your personalized workout generator</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">
            Get Started
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Fitness Level */}
            <div>
              <label htmlFor="fitness" className="block text-sm font-medium text-gray-300 mb-2">
                Fitness Level
              </label>
              <select
                id="fitness"
                value={fitnessLevel}
                onChange={(e) => setFitnessLevel(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all appearance-none cursor-pointer"
              >
                <option value="beginner" className="bg-[#1a1a2e]">Beginner</option>
                <option value="intermediate" className="bg-[#1a1a2e]">Intermediate</option>
                <option value="advanced" className="bg-[#1a1a2e]">Advanced</option>
              </select>
            </div>

            {/* Goal */}
            <div>
              <label htmlFor="goal" className="block text-sm font-medium text-gray-300 mb-2">
                Primary Goal
              </label>
              <select
                id="goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all appearance-none cursor-pointer"
              >
                <option value="strength" className="bg-[#1a1a2e]">Build Strength</option>
                <option value="cardio" className="bg-[#1a1a2e]">Improve Cardio</option>
                <option value="flexibility" className="bg-[#1a1a2e]">Increase Flexibility</option>
                <option value="weightloss" className="bg-[#1a1a2e]">Weight Loss</option>
                <option value="muscle" className="bg-[#1a1a2e]">Build Muscle</option>
              </select>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-coral-500 text-sm text-center bg-coral-500/10 py-2 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 bg-gradient-to-r from-red-600 to-black text-white font-semibold rounded-xl hover:from-red-500 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#1a1a2e] transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating...
                </span>
              ) : (
                "Start Your Journey"
              )}
            </button>
          </form>

          {/* Decorative line */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-center text-gray-500 text-sm">
              Personalized workouts based on your goals
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-6">
          © 2026 AdaptX Exercise Engine - Your Personal Workout Companion
        </p>
      </div>
    </div>
  );
}
