"use client";

import React, { useState } from "react";
import { Play, Flame, Waves, Wind, Activity, CheckCircle2, AlertTriangle } from "lucide-react";

interface Props {
  onTriggerSimulation: (disasterType: string) => void;
  isLoading: boolean;
}

export function DemoSimulationBar({ onTriggerSimulation, isLoading }: Props) {
  const [activeMode, setActiveMode] = useState<string | null>(null);

  const handleSimulate = (type: string) => {
    setActiveMode(type);
    onTriggerSimulation(type);
  };

  return (
    <div className="bg-gradient-to-r from-amber-950/40 via-red-950/40 to-indigo-950/40 border border-amber-500/30 rounded-xl p-4 mb-6 shadow-xl relative overflow-hidden">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Title */}
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/30">
            <Play className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-sm">HACKATHON DEMO / SIMULATION CONTROLLER</h3>
              <span className="bg-amber-500 text-black text-[10px] font-extrabold px-2 py-0.5 rounded tracking-wider">
                DEMO MODE
              </span>
            </div>
            <p className="text-xs text-amber-200/80">
              Instantly generate 50 simulated citizens, 10 rescue units, and live hotspot clusters on the command map.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <button
            onClick={() => handleSimulate("flood")}
            disabled={isLoading}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition border ${
              activeMode === "flood"
                ? "bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/50"
                : "bg-blue-950/60 border-blue-800/80 text-blue-300 hover:bg-blue-900/60"
            }`}
          >
            <Waves className="w-4 h-4 text-blue-400" />
            Simulate Flood
          </button>

          <button
            onClick={() => handleSimulate("cyclone")}
            disabled={isLoading}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition border ${
              activeMode === "cyclone"
                ? "bg-cyan-600 border-cyan-400 text-white shadow-lg shadow-cyan-900/50"
                : "bg-cyan-950/60 border-cyan-800/80 text-cyan-300 hover:bg-cyan-900/60"
            }`}
          >
            <Wind className="w-4 h-4 text-cyan-400" />
            Simulate Cyclone
          </button>

          <button
            onClick={() => handleSimulate("fire")}
            disabled={isLoading}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition border ${
              activeMode === "fire"
                ? "bg-red-600 border-red-400 text-white shadow-lg shadow-red-900/50"
                : "bg-red-950/60 border-red-800/80 text-red-300 hover:bg-red-900/60"
            }`}
          >
            <Flame className="w-4 h-4 text-red-400" />
            Simulate Fire
          </button>

          <button
            onClick={() => handleSimulate("earthquake")}
            disabled={isLoading}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition border ${
              activeMode === "earthquake"
                ? "bg-amber-600 border-amber-400 text-white shadow-lg shadow-amber-900/50"
                : "bg-amber-950/60 border-amber-800/80 text-amber-300 hover:bg-amber-900/60"
            }`}
          >
            <Activity className="w-4 h-4 text-amber-400" />
            Simulate Earthquake
          </button>
        </div>
      </div>
    </div>
  );
}
