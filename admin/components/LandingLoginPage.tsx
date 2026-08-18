"use client";

import React, { useState } from "react";
import { RoleType } from "@/components/RoleSelectorBar";
import { ShieldAlert, User, Compass, Shield } from "lucide-react";

interface Props {
  onLoginSuccess: (user: { user_id: string; name: string; role: RoleType; token: string; phone: string; preferred_language: string }) => void;
}

export function LandingLoginPage({ onLoginSuccess }: Props) {
  const [authMode, setAuthMode] = useState<"LOGIN" | "SIGNUP">("SIGNUP");
  const [selectedRole, setSelectedRole] = useState<RoleType>("USER");
  
  // Fields
  const [name, setName] = useState("");
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [otpOrPassword, setOtpOrPassword] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("en");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE = "http://localhost:8000/api/v1";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let finalName = name || (selectedRole === "USER" ? "Venkat Rao" : (selectedRole === "COORDINATOR" ? "Coordinator Ravi" : "State Disaster Admin"));
    let finalPhone = phoneOrEmail || (selectedRole === "ADMIN" ? "+919900000001" : "+919123456789");

    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: finalPhone,
          code: otpOrPassword || "123456",
          name: finalName,
          role: selectedRole,
          preferred_language: preferredLanguage
        })
      });

      if (res.ok) {
        const data = await res.json();
        onLoginSuccess({
          user_id: data.user_id,
          name: data.name || finalName,
          role: data.role as RoleType,
          token: data.access_token,
          phone: finalPhone,
          preferred_language: preferredLanguage
        });
      } else {
        onLoginSuccess({
          user_id: "demo-uid-100",
          name: finalName,
          role: selectedRole,
          token: "demo-jwt-token",
          phone: finalPhone,
          preferred_language: preferredLanguage
        });
      }
    } catch (err) {
      onLoginSuccess({
        user_id: "demo-uid-100",
        name: finalName,
        role: selectedRole,
        token: "demo-jwt-token",
        phone: finalPhone,
        preferred_language: preferredLanguage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillQuickDemo = (role: RoleType) => {
    setSelectedRole(role);
    if (role === "USER") {
      setName("Venkat Rao");
      setPhoneOrEmail("+919123456789");
      setOtpOrPassword("123456");
      setPreferredLanguage("en");
    } else if (role === "COORDINATOR") {
      setName("Ravi Kumar (Rescue & Shelter Coordinator)");
      setPhoneOrEmail("+919876543210");
      setOtpOrPassword("123456");
    } else if (role === "ADMIN") {
      setName("State Disaster Officer");
      setPhoneOrEmail("admin@disasterai.org");
      setOtpOrPassword("password123");
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#000000] flex flex-col justify-between font-sans">
      {/* Dual Column Layout matching Instagram Screenshot */}
      <div className="flex-1 w-full max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        
        {/* Left Showcase Column */}
        <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-r border-[#EFEFEF]">
          {/* Top Logo Glyph */}
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 rounded-[18px] bg-gradient-to-tr from-[#FCAF45] via-[#E4405F] to-[#833AB4] flex items-center justify-center shadow-lg shadow-pink-500/20">
              <ShieldAlert className="w-8 h-8 text-white" />
            </div>
            <span className="font-black text-2xl tracking-tight text-[#000000]">Hopeforce</span>
          </div>

          {/* Hero Typography */}
          <div className="my-auto max-w-xl py-6">
            <h1 className="text-[44px] sm:text-[52px] font-bold text-[#000000] tracking-[-0.03em] leading-[1.12]">
              Get emergency help from your{" "}
              <span className="bg-gradient-to-r from-[#FF007A] via-[#E4405F] to-[#C13584] bg-clip-text text-transparent">
                rescue network.
              </span>
            </h1>
            <p className="mt-4 text-lg text-[#737373] font-normal">
              Tell us what happened. AI finds the right help in seconds.
            </p>

            {/* Visual Floating Cards Mockup */}
            <div className="mt-10 relative h-64 w-full flex items-center justify-center">
              <div className="absolute w-80 bg-white rounded-3xl border border-[#EFEFEF] shadow-2xl p-4 transform -rotate-3 z-10">
                <div className="flex items-center space-x-2 border-b border-[#F4F4F4] pb-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF007A] to-[#E4405F] flex items-center justify-center text-white text-xs font-bold">AI</div>
                  <div>
                    <p className="text-xs font-bold text-[#000000]">Hopeforce AI Assistant</p>
                    <p className="text-[10px] text-[#737373]">Telugu & English STT Active</p>
                  </div>
                </div>
                <p className="text-xs text-[#262626] font-medium">"మా ఇంట్లోకి వరద నీళ్లు వచ్చాయి. మేము ఐదుగురం ఉన్నాం."</p>
                <span className="mt-2 inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FF007A]/10 text-[#FF007A] border border-[#FF007A]/20">
                  🔴 CRITICAL FLOOD RESCUE
                </span>
              </div>

              <div className="absolute w-80 bg-slate-900 text-white rounded-3xl border border-slate-700 shadow-2xl p-4 transform rotate-6 z-20">
                <div className="flex items-center space-x-2 border-b border-slate-700 pb-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#0095F6] flex items-center justify-center text-white text-xs font-bold">🤝</div>
                  <div>
                    <p className="text-xs font-bold text-white">Helper Ravi</p>
                    <p className="text-[10px] text-blue-300">Boat Specialist • 1.2km away</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300">ETA: 8 minutes to location</p>
                <div className="mt-3 flex gap-2">
                  <span className="px-2.5 py-1 bg-[#0095F6] rounded-full text-[10px] font-bold text-white">94% Match</span>
                  <span className="px-2.5 py-1 bg-emerald-600 rounded-full text-[10px] font-bold text-white">Accepted</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-[#737373] font-medium">
            AI Disaster Response & Emergency Coordination System
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-5 p-8 sm:p-12 lg:p-14 flex flex-col justify-center max-w-[420px] w-full mx-auto">
          
          {/* Heading */}
          <h2 className="text-[20px] font-semibold text-[#000000] mb-6">
            {authMode === "LOGIN" ? "Log into Hopeforce" : "Sign up for Hopeforce"}
          </h2>

          {/* EXACT 3 ROLE SELECTION BUTTONS */}
          <div className="mb-5">
            <label className="block text-[11px] font-bold text-[#737373] uppercase tracking-wider mb-2">
              Select Login Role:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole("USER")}
                className={`py-2.5 px-1 rounded-xl text-xs font-bold transition border flex flex-col items-center justify-center gap-1 ${
                  selectedRole === "USER"
                    ? "bg-[#FF007A]/10 border-[#FF007A] text-[#FF007A] shadow-xs"
                    : "bg-[#FAFAFA] border-[#DBDBDB] text-[#262626] hover:bg-[#F4F4F4]"
                }`}
              >
                <User className="w-4 h-4 text-[#FF007A]" />
                <span>USER</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("COORDINATOR")}
                className={`py-2.5 px-1 rounded-xl text-xs font-bold transition border flex flex-col items-center justify-center gap-1 ${
                  selectedRole === "COORDINATOR"
                    ? "bg-[#0095F6]/10 border-[#0095F6] text-[#0095F6] shadow-xs"
                    : "bg-[#FAFAFA] border-[#DBDBDB] text-[#262626] hover:bg-[#F4F4F4]"
                }`}
              >
                <Compass className="w-4 h-4 text-[#0095F6]" />
                <span>COORDINATOR</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("ADMIN")}
                className={`py-2.5 px-1 rounded-xl text-xs font-bold transition border flex flex-col items-center justify-center gap-1 ${
                  selectedRole === "ADMIN"
                    ? "bg-amber-500/10 border-amber-500 text-amber-700 shadow-xs"
                    : "bg-[#FAFAFA] border-[#DBDBDB] text-[#262626] hover:bg-[#F4F4F4]"
                }`}
              >
                <Shield className="w-4 h-4 text-amber-700" />
                <span>ADMIN</span>
              </button>
            </div>
            {selectedRole === "USER" && (
              <p className="text-[10px] text-[#737373] mt-1.5 text-center font-medium">
                One account for <strong>🆘 Get Help</strong> & <strong>🤝 Help Others</strong>
              </p>
            )}
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {authMode === "SIGNUP" && (
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full bg-[#FFFFFF] border border-[#0095F6] focus:border-[#0095F6] focus:ring-2 focus:ring-[#0095F6]/20 rounded-xl px-4 py-3 text-[14px] text-[#000000] placeholder-[#737373] focus:outline-none transition"
                />
              </div>
            )}

            <div>
              <input
                type="text"
                placeholder={selectedRole === "ADMIN" ? "Officer Email or Username" : "Mobile number, username or email"}
                value={phoneOrEmail}
                onChange={e => setPhoneOrEmail(e.target.value)}
                required
                className="w-full bg-[#FFFFFF] border border-[#0095F6] focus:border-[#0095F6] focus:ring-2 focus:ring-[#0095F6]/20 rounded-xl px-4 py-3 text-[14px] text-[#000000] placeholder-[#737373] focus:outline-none transition shadow-xs"
              />
            </div>

            <div>
              <input
                type={selectedRole === "ADMIN" ? "password" : "text"}
                placeholder={selectedRole === "ADMIN" ? "Password" : "Password (or 6-digit OTP code: 123456)"}
                value={otpOrPassword}
                onChange={e => setOtpOrPassword(e.target.value)}
                required
                className="w-full bg-[#FFFFFF] border border-[#DBDBDB] focus:border-[#0095F6] focus:ring-2 focus:ring-[#0095F6]/20 rounded-xl px-4 py-3 text-[14px] text-[#000000] placeholder-[#737373] focus:outline-none transition"
              />
            </div>

            {selectedRole === "USER" && authMode === "SIGNUP" && (
              <div>
                <select
                  value={preferredLanguage}
                  onChange={e => setPreferredLanguage(e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-[#DBDBDB] rounded-xl px-3 py-2.5 text-[13px] text-[#000000] focus:outline-none focus:border-[#0095F6]"
                >
                  <option value="en">Language: English</option>
                  <option value="te">Language: Telugu (తెలుగు)</option>
                </select>
              </div>
            )}

            {/* Simple 1-2 Word Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#4CB5F9] hover:bg-[#0095F6] text-white font-bold text-[14px] rounded-2xl transition mt-2 shadow-xs"
            >
              {authMode === "LOGIN" ? "Log in" : "Sign up"}
            </button>
          </form>

          {/* Quick Demo Shortcuts */}
          <div className="mt-5 p-3 bg-[#FAFAFA] rounded-2xl border border-[#EFEFEF] text-center">
            <p className="text-[10px] font-bold text-[#737373] uppercase tracking-wider mb-2">
              1-Click Demo Logins:
            </p>
            <div className="flex justify-center gap-1.5">
              <button
                type="button"
                onClick={() => fillQuickDemo("USER")}
                className="px-3 py-1.5 bg-white border border-[#DBDBDB] rounded-xl text-xs font-bold text-[#FF007A] hover:bg-rose-50"
              >
                User
              </button>
              <button
                type="button"
                onClick={() => fillQuickDemo("COORDINATOR")}
                className="px-3 py-1.5 bg-white border border-[#DBDBDB] rounded-xl text-xs font-bold text-[#0095F6] hover:bg-blue-50"
              >
                Coordinator
              </button>
              <button
                type="button"
                onClick={() => fillQuickDemo("ADMIN")}
                className="px-3 py-1.5 bg-white border border-[#DBDBDB] rounded-xl text-xs font-bold text-amber-700 hover:bg-amber-50"
              >
                Admin
              </button>
            </div>
          </div>

          {/* Switcher */}
          <div className="mt-4 text-center">
            {authMode === "LOGIN" ? (
              <button
                type="button"
                onClick={() => setAuthMode("SIGNUP")}
                className="w-full py-3 border border-[#0095F6] text-[#0095F6] font-bold text-[14px] rounded-full hover:bg-blue-50 transition"
              >
                Create new account
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setAuthMode("LOGIN")}
                className="w-full py-3 border border-[#DBDBDB] text-[#000000] font-bold text-[14px] rounded-full hover:bg-[#F4F4F4] transition"
              >
                Back to Log in
              </button>
            )}
          </div>

          {/* Bottom Branding */}
          <div className="mt-6 text-center text-[14px] text-[#0095F6] font-semibold flex items-center justify-center gap-1">
            <span className="text-[18px]">∞</span>
            <span>Hopeforce</span>
          </div>

        </div>

      </div>

      {/* Footer */}
      <footer className="w-full border-t border-[#EFEFEF] py-4 px-6 text-[12px] text-[#737373] flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <span>About</span>
        <span>Emergency Help</span>
        <span>Shelters</span>
        <span>Food</span>
        <span>Hospitals</span>
        <span>Resources</span>
        <span>API</span>
        <span>Privacy</span>
        <span>Terms</span>
        <span>Hopeforce Verified</span>
      </footer>
    </div>
  );
}
