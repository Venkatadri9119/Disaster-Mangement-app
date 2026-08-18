"use client";

import React from "react";
import { User, ShieldAlert, HeartHandshake, LogIn } from "lucide-react";

export type RoleType = "CITIZEN" | "VOLUNTEER" | "ADMIN";

interface Props {
  activeRole: RoleType;
  onSelectRole: (role: RoleType) => void;
  onOpenLoginModal: () => void;
}

export function RoleSelectorBar({ activeRole, onSelectRole, onOpenLoginModal }: Props) {
  return (
    <div className="bg-white border-b border-[#EFEFEF] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50 shadow-sm">
      {/* Role Switcher Pills */}
      <div className="flex items-center space-x-2">
        <span className="text-xs text-[#737373] font-bold uppercase tracking-wider hidden sm:inline">
          SELECT APP ROLE:
        </span>

        <div className="flex items-center gap-1 bg-[#FAFAFA] p-1 rounded-xl border border-[#EFEFEF]">
          <button
            onClick={() => onSelectRole("CITIZEN")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeRole === "CITIZEN"
                ? "bg-[#FF007A] text-white shadow-sm"
                : "text-[#737373] hover:text-[#000000]"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            1. Citizen / Help Seeker
          </button>

          <button
            onClick={() => onSelectRole("VOLUNTEER")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeRole === "VOLUNTEER"
                ? "bg-[#0095F6] text-white shadow-sm"
                : "text-[#737373] hover:text-[#000000]"
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            2. Volunteer / NGO
          </button>

          <button
            onClick={() => onSelectRole("ADMIN")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeRole === "ADMIN"
                ? "bg-amber-500 text-white shadow-sm"
                : "text-[#737373] hover:text-[#000000]"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            3. Admin / Authority
          </button>
        </div>
      </div>

      {/* Login Modal Action */}
      <button
        onClick={onOpenLoginModal}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAFAFA] hover:bg-[#F4F4F4] text-[#000000] rounded-xl text-xs font-bold border border-[#DBDBDB] transition"
      >
        <LogIn className="w-3.5 h-3.5 text-[#0095F6]" />
        <span>Switch Account</span>
      </button>
    </div>
  );
}
