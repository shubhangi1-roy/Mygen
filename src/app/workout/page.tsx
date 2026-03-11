"use client";

import { useState, useSyncExternalStore, useEffect } from "react";
import { useRouter } from "next/navigation";

interface UserData {
  name: string;
  fitnessLevel: string;
  goal: string;
}

interface Exercise {
  id: number;
  name: string;
  category: string;
  duration: string;
  durationMinutes: number;
  reps?: string;
  sets?: number;
  calories: number;
  description: string;
  icon: string;
  intensity: "low" | "medium" | "high";
  bodyParts: string[];
  mood?: string[];
}

const exerciseDatabase: Record<string, Exercise[]> = {
  strength: [
    { id: 1, name: "Barbell Squats", category: "Legs", duration: "45 min", durationMinutes: 45, sets: 4, reps: "12", calories: 280, description: "Compound movement for legs and glutes", icon: "🦵", intensity: "high", bodyParts: ["legs", "glutes", "knees"] },
    { id: 2, name: "Bench Press", category: "Chest", duration: "40 min", durationMinutes: 40, sets: 4, reps: "10", calories: 250, description: "Classic chest exercise with barbell", icon: "💪", intensity: "high", bodyParts: ["chest", "shoulders", "arms"] },
    { id: 3, name: "Deadlifts", category: "Back", duration: "50 min", durationMinutes: 50, sets: 4, reps: "8", calories: 350, description: "Full body compound lift", icon: "🏋️", intensity: "high", bodyParts: ["back", "legs", "core"] },
    { id: 4, name: "Overhead Press", category: "Shoulders", duration: "35 min", durationMinutes: 35, sets: 3, reps: "12", calories: 200, description: "Build shoulder strength and stability", icon: "🎯", intensity: "medium", bodyParts: ["shoulders", "arms"] },
    { id: 5, name: "Barbell Rows", category: "Back", duration: "40 min", durationMinutes: 40, sets: 4, reps: "10", calories: 220, description: "Back thickness builder", icon: "🚣", intensity: "medium", bodyParts: ["back", "biceps"] },
    { id: 6, name: "Light Dumbbell Work", category: "Arms", duration: "20 min", durationMinutes: 20, sets: 3, reps: "15", calories: 120, description: "Low impact arm strengthening", icon: "💪", intensity: "low", bodyParts: ["arms"] },
    { id: 7, name: "Bodyweight Squats", category: "Legs", duration: "15 min", durationMinutes: 15, sets: 3, reps: "20", calories: 100, description: "Gentle leg exercise", icon: "🦵", intensity: "low", bodyParts: ["legs"] },
  ],
  cardio: [
    { id: 1, name: "HIIT Sprint Intervals", category: "Cardio", duration: "30 min", durationMinutes: 30, reps: "20 rounds", calories: 400, description: "High intensity interval training", icon: "⚡", intensity: "high", bodyParts: ["legs", "core"] },
    { id: 2, name: "Jump Rope", category: "Cardio", duration: "20 min", durationMinutes: 20, reps: "15 min", calories: 300, description: "Full body cardio burst", icon: "🪢", intensity: "medium", bodyParts: ["legs", "shoulders"] },
    { id: 3, name: "Burpees", category: "Cardio", duration: "25 min", durationMinutes: 25, reps: "50", calories: 350, description: "Full body explosive movement", icon: "🔥", intensity: "high", bodyParts: ["full body", "core"] },
    { id: 4, name: "Mountain Climbers", category: "Cardio", duration: "20 min", durationMinutes: 20, reps: "100", calories: 280, description: "Core and cardio combo", icon: "⛰️", intensity: "medium", bodyParts: ["core", "shoulders"] },
    { id: 5, name: "Box Jumps", category: "Cardio", duration: "25 min", durationMinutes: 25, reps: "3x15", calories: 320, description: "Explosive lower body power", icon: "📦", intensity: "high", bodyParts: ["legs"] },
    { id: 6, name: "Brisk Walk", category: "Cardio", duration: "20 min", durationMinutes: 20, reps: "1", calories: 150, description: "Low impact cardio", icon: "🚶", intensity: "low", bodyParts: ["legs"] },
    { id: 7, name: "Light Cycling", category: "Cardio", duration: "15 min", durationMinutes: 15, reps: "1", calories: 100, description: "Easy cardio option", icon: "🚴", intensity: "low", bodyParts: ["legs"] },
  ],
  flexibility: [
    { id: 1, name: "Dynamic Stretching", category: "Flexibility", duration: "15 min", durationMinutes: 15, reps: "1 set", calories: 80, description: "Movement-based stretches", icon: "🤸", intensity: "low", bodyParts: ["full body"] },
    { id: 2, name: "Yoga Flow", category: "Flexibility", duration: "45 min", durationMinutes: 45, reps: "1 session", calories: 150, description: "Full body yoga sequence", icon: "🧘", intensity: "low", bodyParts: ["full body"] },
    { id: 3, name: "Foam Rolling", category: "Recovery", duration: "20 min", durationMinutes: 20, reps: "1 session", calories: 60, description: "Muscle recovery and release", icon: "🧴", intensity: "low", bodyParts: ["full body"] },
    { id: 4, name: "Deep Breathing", category: "Relaxation", duration: "10 min", durationMinutes: 10, reps: "20 breaths", calories: 30, description: "Calm mind and body", icon: "🌬️", intensity: "low", bodyParts: [] },
    { id: 5, name: "Hip Flexor Stretch", category: "Flexibility", duration: "15 min", durationMinutes: 15, reps: "3x30 sec", calories: 50, description: "Open up tight hips", icon: "🦴", intensity: "low", bodyParts: ["hips", "legs"] },
    { id: 6, name: "Tai Chi", category: "Flexibility", duration: "30 min", durationMinutes: 30, reps: "1 session", calories: 120, description: "Gentle mindful movement", icon: "☯️", intensity: "low", bodyParts: ["full body"] },
  ],
  weightloss: [
    { id: 1, name: "Circuit Training", category: "Full Body", duration: "40 min", durationMinutes: 40, reps: "3 rounds", calories: 450, description: "High calorie burn workout", icon: "🔄", intensity: "high", bodyParts: ["full body"] },
    { id: 2, name: "Kettlebell Swings", category: "Full Body", duration: "25 min", durationMinutes: 25, reps: "3x20", calories: 300, description: "Metabolic conditioning", icon: "🔔", intensity: "medium", bodyParts: ["legs", "core", "back"] },
    { id: 3, name: "Walking Lunges", category: "Legs", duration: "30 min", durationMinutes: 30, reps: "50", calories: 250, description: "Lower body toning", icon: "🚶", intensity: "medium", bodyParts: ["legs", "glutes"] },
    { id: 4, name: "Plank Variations", category: "Core", duration: "20 min", durationMinutes: 20, reps: "5x1 min", calories: 180, description: "Core stability and strength", icon: "🧱", intensity: "medium", bodyParts: ["core", "shoulders"] },
    { id: 5, name: "Battle Ropes", category: "Cardio", duration: "20 min", durationMinutes: 20, reps: "10 rounds", calories: 380, description: "Upper body cardio blast", icon: "🌊", intensity: "high", bodyParts: ["arms", "shoulders", "core"] },
    { id: 6, name: "Marching in Place", category: "Low Impact", duration: "15 min", durationMinutes: 15, reps: "1", calories: 100, description: "Gentle calorie burn", icon: "🚶", intensity: "low", bodyParts: ["legs"] },
    { id: 7, name: "Chair Squats", category: "Legs", duration: "10 min", durationMinutes: 10, reps: "3x15", calories: 80, description: "Supported leg exercise", icon: "🪑", intensity: "low", bodyParts: ["legs"] },
  ],
  muscle: [
    { id: 1, name: "Dumbbell Press", category: "Chest", duration: "40 min", durationMinutes: 40, sets: 4, reps: "12", calories: 220, description: "Hypertrophy-focused chest work", icon: "💪", intensity: "medium", bodyParts: ["chest", "shoulders"] },
    { id: 2, name: "Pull-Ups", category: "Back", duration: "30 min", durationMinutes: 30, sets: 4, reps: "AMRAP", calories: 250, description: "Back width and grip strength", icon: "🏋️", intensity: "high", bodyParts: ["back", "biceps"] },
    { id: 3, name: "Dumbbell Curls", category: "Arms", duration: "25 min", durationMinutes: 25, sets: 3, reps: "15", calories: 120, description: "Bicep isolation exercise", icon: "💪", intensity: "low", bodyParts: ["biceps"] },
    { id: 4, name: "Tricep Dips", category: "Arms", duration: "25 min", durationMinutes: 25, sets: 3, reps: "12", calories: 150, description: "Tricep compound movement", icon: "💪", intensity: "medium", bodyParts: ["triceps", "chest"] },
    { id: 5, name: "Leg Press", category: "Legs", duration: "35 min", durationMinutes: 35, sets: 4, reps: "12", calories: 280, description: "Leg hypertrophy builder", icon: "🦵", intensity: "medium", bodyParts: ["legs", "glutes"] },
    { id: 6, name: "Isometric Holds", category: "Strength", duration: "15 min", durationMinutes: 15, reps: "3x30 sec", calories: 80, description: "Time under tension training", icon: "⏱️", intensity: "low", bodyParts: ["core", "full body"] },
    { id: 7, name: "Resistance Band Work", category: "Strength", duration: "20 min", durationMinutes: 20, reps: "3x15", calories: 100, description: "Joint-friendly strength", icon: "💪", intensity: "low", bodyParts: ["arms", "back"] },
  ],
};

const moodFilters: Record<string, { intensity: string[], message: string }> = {
  energetic: { intensity: ["high", "medium"], message: "You're feeling pumped! Let's crush this workout! 🔥" },
  tired: { intensity: ["low", "medium"], message: "Rest is part of training. Let's take it easy today. 😴" },
  stressed: { intensity: ["low"], message: "Let's calm your mind and body with gentle movement. 🧘" },
  motivated: { intensity: ["high", "medium"], message: "Your drive is inspiring! Let's maximize gains! 💪" },
  relaxed: { intensity: ["low", "medium"], message: "Perfect mindset for mindful movement. Let's enjoy this. 🌊" },
};

const personalizedMessages = [
  "You've got this! Every rep brings you closer to your goals. 💪",
  "Your dedication is inspiring! Keep pushing boundaries. 🌟",
  "Today is another step toward becoming your best self. 🔥",
  "Your body is capable of amazing things. Believe it! 💯",
  "Progress, not perfection. You're doing great! 🎯",
  "Each workout is a victory. Celebrate your effort! 🏆",
  "You're stronger than you think. Let's prove it! 💪",
  "Your future self will thank you for today's work. 🙏",
];

const injuryOptions = [
  { value: "none", label: "None - I'm good!", icon: "✅" },
  { value: "knees", label: "Knee Issues", icon: "🦵" },
  { value: "shoulders", label: "Shoulder Pain", icon: "💪" },
  { value: "back", label: "Back Problems", icon: "🚣" },
  { value: "wrist", label: "Wrist/Elbow", icon: "🤲" },
  { value: "hips", label: "Hip Issues", icon: "🦴" },
  { value: "ankles", label: "Ankle/Foot", icon: "🦶" },
];

const moodOptions = [
  { value: "energetic", label: "Energetic ⚡", icon: "⚡" },
  { value: "tired", label: "Tired 😴", icon: "😴" },
  { value: "stressed", label: "Stressed 😰", icon: "😰" },
  { value: "motivated", label: "Motivated 🔥", icon: "🔥" },
  { value: "relaxed", label: "Relaxed 😌", icon: "😌" },
];

const timeOptions = [
  { value: 15, label: "15 min", desc: "Quick burn" },
  { value: 30, label: "30 min", desc: "Standard" },
  { value: 45, label: "45 min", desc: "Full session" },
  { value: 60, label: "60 min", desc: "Maximum" },
];

// Default exercises for initial state
const defaultExercises = exerciseDatabase.strength;

// External store for localStorage
function getUserData(): UserData | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("workoutUser");
  return stored ? JSON.parse(stored) : null;
}

function getRecentExercises(): number[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("recentExercises");
  return stored ? JSON.parse(stored) : [];
}

function saveRecentExercises(ids: number[]) {
  if (typeof window === "undefined") return;
  // Keep only last 10 unique exercises
  const unique = [...new Set(ids)].slice(-10);
  localStorage.setItem("recentExercises", JSON.stringify(unique));
}

function getExercises(goal: string): Exercise[] {
  return exerciseDatabase[goal] || exerciseDatabase.strength;
}

function getMessage(): string {
  return personalizedMessages[Math.floor(Math.random() * personalizedMessages.length)];
}

// Subscribe to external store
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("popstate", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("popstate", callback);
  };
}

// Client-side check hook
function useClientCheck() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}

export default function WorkoutPage() {
  const router = useRouter();
  const isClient = useClientCheck();
  
  // All hooks must be called unconditionally at the top
  const [userData, setUserData] = useState<UserData | null>(() => {
    if (!isClient) return null;
    return getUserData();
  });
  
  const [exercises, setExercises] = useState<Exercise[]>(() => {
    if (!isClient || !userData) return defaultExercises;
    return getExercises(userData.goal);
  });
  
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [message, setMessage] = useState(() => {
    if (!isClient) return "";
    return getMessage();
  });
  const [showAll, setShowAll] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // New feature states
  const [fatigueLevel, setFatigueLevel] = useState(5);
  const [selectedInjuries, setSelectedInjuries] = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState("energetic");
  const [selectedTime, setSelectedTime] = useState(30);
  const [showFilters, setShowFilters] = useState(false);

  // Redirect if no user data on client
  if (isClient && !userData) {
    router.push("/login");
    return null;
  }

  // Show loading on server
  if (!isClient) {
    return (
      <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500" />
      </div>
    );
  }

  const toggleInjury = (injury: string) => {
    if (injury === "none") {
      setSelectedInjuries(["none"]);
    } else {
      const filtered = selectedInjuries.filter(i => i !== "none");
      if (filtered.includes(injury)) {
        setSelectedInjuries(filtered.filter(i => i !== injury));
      } else {
        setSelectedInjuries([...filtered, injury]);
      }
    }
  };

  const regenerateWorkout = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const user = getUserData();
    if (!user) return;
    
    let goalExercises = exerciseDatabase[user.goal] || exerciseDatabase.strength;
    const recentExercises = getRecentExercises();

    // Apply fatigue-based intensity filter
    let allowedIntensities: string[] = [];
    if (fatigueLevel <= 3) {
      allowedIntensities = ["low"];
    } else if (fatigueLevel <= 5) {
      allowedIntensities = ["low", "medium"];
    } else if (fatigueLevel <= 7) {
      allowedIntensities = ["medium", "high"];
    } else {
      allowedIntensities = ["high", "medium"];
    }

    // Apply mood-based intensity filter
    const moodData = moodFilters[selectedMood];
    if (moodData) {
      allowedIntensities = allowedIntensities.filter(i => moodData.intensity.includes(i));
      // Update message based on mood
      setMessage(moodData.message);
    }

    // Filter by injuries (exclude exercises targeting injured body parts)
    let filteredExercises = goalExercises.filter(ex => {
      // Skip if recent
      if (recentExercises.includes(ex.id)) return false;
      
      // Check intensity
      if (!allowedIntensities.includes(ex.intensity)) return false;
      
      // Check injuries
      if (selectedInjuries.includes("none")) return true;
      const hasInjury = ex.bodyParts.some(part => selectedInjuries.includes(part));
      return !hasInjury;
    });

    // If not enough exercises, get more from other categories
    if (filteredExercises.length < 3) {
      const allExercises = Object.values(exerciseDatabase).flat();
      const additional = allExercises.filter(ex => {
        if (filteredExercises.includes(ex)) return false;
        if (recentExercises.includes(ex.id)) return false;
        if (!allowedIntensities.includes(ex.intensity)) return false;
        if (!selectedInjuries.includes("none") && ex.bodyParts.some(part => selectedInjuries.includes(part))) return false;
        return true;
      });
      filteredExercises = [...filteredExercises, ...additional];
    }

    // Apply time filter - select exercises that fit within time
    const timeFiltered: Exercise[] = [];
    let totalTime = 0;
    
    // Shuffle filtered exercises
    const shuffled = [...filteredExercises].sort(() => Math.random() - 0.5);
    
    for (const ex of shuffled) {
      if (totalTime + ex.durationMinutes <= selectedTime + 5) { // Allow 5 min buffer
        timeFiltered.push(ex);
        totalTime += ex.durationMinutes;
      }
    }

    // If no exercises fit, at least get one light exercise
    if (timeFiltered.length === 0) {
      const lightExercises = goalExercises.filter(e => e.intensity === "low");
      if (lightExercises.length > 0) {
        timeFiltered.push(lightExercises[Math.floor(Math.random() * lightExercises.length)]);
      }
    }

    // Save to recent exercises
    const exerciseIds = timeFiltered.map(e => e.id);
    saveRecentExercises([...recentExercises, ...exerciseIds]);

    setExercises(timeFiltered);
    setCurrentExerciseIndex(0);
    setShowAll(false);
    
    setIsGenerating(false);
  };

  const logout = () => {
    localStorage.removeItem("workoutUser");
    router.push("/login");
  };

  const currentExercise = exercises[currentExerciseIndex];
  const totalCalories = exercises.reduce((sum, ex) => sum + ex.calories, 0);
  const totalDuration = exercises.reduce((sum, ex) => sum + ex.durationMinutes, 0);

  return (
    <div className="min-h-screen bg-[#1a1a2e] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-black">
                AdaptX Exercise Engine
              </span>
            </h1>
            <p className="text-gray-400 text-sm">Smart Workout Generator</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                showFilters 
                  ? "bg-red-600 text-white" 
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              🎛️ Smart Filters
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 pb-12">
        {/* Smart Filters Panel */}
        {showFilters && (
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-red-500/30">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              🎛️ Smart Filters
              <span className="text-xs font-normal text-gray-400">Customize your workout</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Fatigue Detection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  😴 Smart Fatigue Detection
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={fatigueLevel}
                    onChange={(e) => setFatigueLevel(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Rest Day</span>
                    <span className={`font-bold ${
                      fatigueLevel <= 3 ? "text-green-400" : 
                      fatigueLevel <= 6 ? "text-yellow-400" : "text-coral-400"
                    }`}>
                      Level {fatigueLevel}
                    </span>
                    <span>Max Effort</span>
                  </div>
                </div>
              </div>

              {/* Injury Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  🏥 Injury-Aware Filter
                </label>
                <div className="flex flex-wrap gap-2">
                  {injuryOptions.map((injury) => (
                    <button
                      key={injury.value}
                      onClick={() => toggleInjury(injury.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                        selectedInjuries.includes(injury.value)
                          ? "bg-coral-500/30 text-coral-300 border border-coral-500/50"
                          : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {injury.icon} {injury.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mood Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  😊 Mood-Based Generator
                </label>
                <div className="flex flex-wrap gap-2">
                  {moodOptions.map((mood) => (
                    <button
                      key={mood.value}
                      onClick={() => setSelectedMood(mood.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                        selectedMood === mood.value
                          ? "bg-black/30 text-gray-300 border border-black/50"
                          : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {mood.icon} {mood.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  ⏱️ Time-Adaptive Builder
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {timeOptions.map((time) => (
                    <button
                      key={time.value}
                      onClick={() => setSelectedTime(time.value)}
                      className={`px-3 py-2 rounded-lg text-xs transition-all ${
                        selectedTime === time.value
                          ? "bg-red-500/30 text-red-300 border border-red-500/50"
                          : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <div className="font-semibold">{time.label}</div>
                      <div className="text-[10px] opacity-70">{time.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, <span className="text-red-400">{userData?.name}</span>! 👋
          </h2>
          <div className="flex flex-wrap gap-3 mt-3">
            <span className="px-3 py-1 bg-red-600/20 text-red-300 rounded-full text-sm border border-red-500/30">
              Level: {userData?.fitnessLevel}
            </span>
            <span className="px-3 py-1 bg-black/20 text-gray-300 rounded-full text-sm border border-black/30">
              Goal: {userData?.goal}
            </span>
            <span className="px-3 py-1 bg-coral-600/20 text-coral-300 rounded-full text-sm border border-coral-500/30">
              🕐 {selectedTime} min
            </span>
            <span className="px-3 py-1 bg-green-600/20 text-green-300 rounded-full text-sm border border-green-500/30">
              💪 Energy: {fatigueLevel}/10
            </span>
          </div>
        </div>

        {/* Personalized Message */}
        <div className="bg-gradient-to-r from-red-600/20 to-black/20 rounded-2xl p-6 mb-8 border border-red-500/20">
          <p className="text-white text-lg font-medium text-center">
            {message}
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-5 border border-white/10">
            <div className="text-gray-400 text-sm mb-1">Total Exercises</div>
            <div className="text-3xl font-bold text-white">{exercises.length}</div>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-5 border border-white/10">
            <div className="text-gray-400 text-sm mb-1">Est. Calories</div>
            <div className="text-3xl font-bold text-coral-400">{totalCalories}</div>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-5 border border-white/10">
            <div className="text-gray-400 text-sm mb-1">Duration</div>
            <div className="text-3xl font-bold text-black">{totalDuration} min</div>
          </div>
        </div>

        {/* Daily Randomizer Notice */}
        <div className="bg-gradient-to-r from-green-600/20 to-black/20 rounded-xl p-4 mb-8 border border-green-500/20">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎲</span>
            <div>
              <div className="text-white font-medium">Daily Workout Randomizer</div>
              <div className="text-gray-400 text-sm">Exercises are selected to avoid repetition from your recent workouts</div>
            </div>
          </div>
        </div>

        {/* Current Exercise Card */}
        {currentExercise && !showAll && (
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 mb-8">
            <div className="flex items-center justify-between mb-6">
              <span className="px-3 py-1 bg-red-600/30 text-red-300 rounded-full text-sm">
                Exercise {currentExerciseIndex + 1} of {exercises.length}
              </span>
              <span className="text-4xl">{currentExercise.icon}</span>
            </div>
            
            <h3 className="text-3xl font-bold text-white mb-2">{currentExercise.name}</h3>
            <p className="text-gray-400 mb-6">{currentExercise.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <div className="text-gray-400 text-xs">Duration</div>
                <div className="text-white font-semibold">{currentExercise.duration}</div>
              </div>
              {currentExercise.sets && (
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <div className="text-gray-400 text-xs">Sets</div>
                  <div className="text-white font-semibold">{currentExercise.sets}</div>
                </div>
              )}
              {currentExercise.reps && (
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <div className="text-gray-400 text-xs">Reps</div>
                  <div className="text-white font-semibold">{currentExercise.reps}</div>
                </div>
              )}
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <div className="text-gray-400 text-xs">Calories</div>
                <div className="text-coral-400 font-semibold">{currentExercise.calories}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <div className="text-gray-400 text-xs">Intensity</div>
                <div className={`font-semibold ${
                  currentExercise.intensity === "high" ? "text-coral-400" :
                  currentExercise.intensity === "medium" ? "text-yellow-400" :
                  "text-green-400"
                }`}>
                  {currentExercise.intensity}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-4">
              {currentExerciseIndex > 0 && (
                <button
                  onClick={() => setCurrentExerciseIndex((prev) => prev - 1)}
                  className="flex-1 py-3 px-6 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
                >
                  Previous
                </button>
              )}
              <button
                onClick={() => {
                  if (currentExerciseIndex < exercises.length - 1) {
                    setCurrentExerciseIndex((prev) => prev + 1);
                  } else {
                    setShowAll(true);
                  }
                }}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-red-600 to-black text-white font-semibold rounded-xl hover:from-red-500 hover:to-gray-800 transition-all"
              >
                {currentExerciseIndex < exercises.length - 1 ? "Next Exercise" : "View All"}
              </button>
            </div>
          </div>
        )}

        {/* All Exercises View */}
        {showAll && (
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 mb-8">
            <h3 className="text-2xl font-bold text-white mb-6">Your Complete Workout</h3>
            <div className="space-y-4">
              {exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5"
                >
                  <span className="text-2xl">{exercise.icon}</span>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">{exercise.name}</h4>
                    <p className="text-gray-400 text-sm">{exercise.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-black font-semibold">{exercise.duration}</div>
                    <div className="text-coral-400 text-sm">{exercise.calories} cal</div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                setShowAll(false);
                setCurrentExerciseIndex(0);
              }}
              className="mt-6 w-full py-3 px-6 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
            >
              Back to Current Exercise
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={regenerateWorkout}
            disabled={isGenerating}
            className="flex-1 py-4 px-6 bg-gradient-to-r from-red-600 to-black text-white font-semibold rounded-xl hover:from-red-500 hover:to-gray-800 transition-all transform hover:scale-[1.02] disabled:opacity-50"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating Smart Workout...
              </span>
            ) : (
              "🎲 Generate Smart Workout"
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
