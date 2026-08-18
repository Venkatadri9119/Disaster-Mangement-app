"use client";

import React from "react";
import { ShieldAlert, Bell, Radio } from "lucide-react";

export function Navbar() {
  return (
    <header className="h-16 border-b border-[#EFEFEF] bg-white sticky top-0 z-50 px-6 flex items-center justify-between shadow-sm">
      {/* Brand & Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FCAF45] via-[#E4405F] to-[#833AB4] flex items-center justify-center shadow-md shadow-pink-500/20">
          <ShieldAlert className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-lg text-[#000000] tracking-tight">Disaster AI</span>
            <span className="bg-rose-50 text-rose-600 text-xs px-2 py-0.5 rounded-full border border-rose-200 font-bold flex items-center gap-1">
              <Radio className="w-3 h-3 animate-pulse text-rose-500" /> COMMAND CENTER
            </span>
          </div>
          <p className="text-xs text-[#737373]">Tell us what happened. AI finds the right help.</p>
        </div>
      </div>

      {/* Live System Status */}
      <div className="hidden md:flex items-center space-x-6">
        <div className="flex items-center space-x-2 bg-[#FAFAFA] px-3 py-1.5 rounded-xl border border-[#EFEFEF] text-xs">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-[#000000] font-semibold">AI Assistant Active</span>
          <span className="text-gray-300">|</span>
          <span className="text-[#737373]">Live Rescue Network Online</span>
        </div>
      </div>

      {/* Admin Action Buttons */}
      <div className="flex items-center space-x-3">
        <button className="relative p-2 rounded-xl bg-[#FAFAFA] text-gray-700 hover:text-black hover:bg-[#F4F4F4] transition border border-[#EFEFEF]">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
        </button>

        <div className="flex items-center space-x-2 border-l border-[#EFEFEF] pl-3">
          <div className="w-8 h-8 rounded-full bg-[#0095F6] flex items-center justify-center font-bold text-white text-xs shadow-sm">
            DA
          </div>
          <div className="hidden sm:block text-left text-xs">
            <p className="font-bold text-[#000000]">Disaster Officer</p>
            <p className="text-[#737373]">AP State Command</p>
          </div>
        </div>
      </div>
    </header>
  );
}
