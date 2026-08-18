"use client";

import React, { useState } from "react";
import { RoleType } from "@/components/RoleSelectorBar";
import { User, HeartHandshake, ShieldAlert, Key, Phone, Mail, CheckCircle2, Lock } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: RoleType) => void;
}

export function LoginModal({ isOpen, onClose, onLoginSuccess }: Props) {
  const [selectedRole, setSelectedRole] = useState<RoleType>("CITIZEN");
  const [phone, setPhone] = useState("+919876543210");
  const [otp, setOtp] = useState("123456");
  const [email, setEmail] = useState("admin@disasterai.org");
  const [password, setPassword] = useState("••••••••");

  if (!isOpen) return null;

  const handleQuickDemoFill = (role: RoleType) => {
    setSelectedRole(role);
    if (role === "CITIZEN") {
      setPhone("+919123456789");
      setOtp("123456");
    } else if (role === "VOLUNTEER") {
      setPhone("+919876543210");
      setOtp("123456");
    } else if (role === "ADMIN") {
      setEmail("admin@disasterai.org");
      setPassword("password123");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(selectedRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-md w-full glass-panel shadow-2xl relative">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-extrabold text-white text-lg">AUTHENTICATION PORTAL</h3>
            <p className="text-xs text-gray-400">Select one of the 3 main user login roles</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-sm font-bold bg-gray-800 px-2 py-1 rounded">
            ✕
          </button>
        </div>

        {/* 3 Role Selection Tabs */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <button
            type="button"
            onClick={() => handleQuickDemoFill("CITIZEN")}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition ${
              selectedRole === "CITIZEN" ? "bg-red-600/30 border-red-500 text-white shadow-lg" : "bg-gray-900/60 border-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            <User className="w-5 h-5 text-red-400" />
            <span className="text-[11px] font-bold">1. Citizen</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoFill("VOLUNTEER")}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition ${
              selectedRole === "VOLUNTEER" ? "bg-blue-600/30 border-blue-500 text-white shadow-lg" : "bg-gray-900/60 border-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            <HeartHandshake className="w-5 h-5 text-blue-400" />
            <span className="text-[11px] font-bold">2. Volunteer</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoFill("ADMIN")}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition ${
              selectedRole === "ADMIN" ? "bg-amber-600/30 border-amber-500 text-white shadow-lg" : "bg-gray-900/60 border-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <span className="text-[11px] font-bold">3. Admin</span>
          </button>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {selectedRole !== "ADMIN" ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Mobile Number (OTP Auth)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Verification OTP Code</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <p className="text-[10px] text-emerald-400 mt-1">Demo OTP: 123456 auto-validated</p>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Disaster Officer Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Officer Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className={`w-full py-3 rounded-xl font-extrabold text-xs text-white uppercase tracking-wider shadow-lg transition ${
              selectedRole === "CITIZEN" ? "bg-red-600 hover:bg-red-500 shadow-red-900/40" : (selectedRole === "VOLUNTEER" ? "bg-blue-600 hover:bg-blue-500 shadow-blue-900/40" : "bg-amber-600 hover:bg-amber-500 shadow-amber-900/40")
            }`}
          >
            Authenticate & Open {selectedRole} Portal
          </button>
        </form>
      </div>
    </div>
  );
}
