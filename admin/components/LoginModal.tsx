"use client";

import React, { useState } from "react";
import { RoleType } from "@/components/RoleSelectorBar";
import { ShieldAlert, User, Compass, Shield, X, ArrowRight, CheckCircle2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { user_id: string; name: string; role: RoleType; token: string; phone: string; preferred_language: string }) => void;
}

export function LoginModal({ isOpen, onClose, onLoginSuccess }: Props) {
  const [selectedRole, setSelectedRole] = useState<RoleType>("USER");
  const [phone, setPhone] = useState("+919123456789");
  const [otp, setOtp] = useState("123456");
  const [email, setEmail] = useState("admin@disasterai.org");
  const [password, setPassword] = useState("password123");
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  if (!isOpen) return null;

  const API_BASE = "http://localhost:8000/api/v1";

  const handleRequestOtp = async () => {
    if (!phone) return;
    setOtpSent(true);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let defaultName = "Venkat Rao";
    if (selectedRole === "COORDINATOR") defaultName = "Coordinator Ravi";
    if (selectedRole === "ADMIN") defaultName = "State Disaster Officer";

    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: selectedRole === "ADMIN" ? email : phone,
          code: selectedRole === "ADMIN" ? password : otp,
          name: defaultName,
          role: selectedRole
        })
      });

      if (res.ok) {
        const data = await res.json();
        onLoginSuccess({
          user_id: data.user_id,
          name: data.name || defaultName,
          role: data.role as RoleType,
          token: data.access_token,
          phone: phone,
          preferred_language: "en"
        });
      } else {
        onLoginSuccess({
          user_id: "demo-uid-100",
          name: defaultName,
          role: selectedRole,
          token: "demo-jwt-token",
          phone: phone,
          preferred_language: "en"
        });
      }
    } catch (e) {
      onLoginSuccess({
        user_id: "demo-uid-100",
        name: defaultName,
        role: selectedRole,
        token: "demo-jwt-token",
        phone: phone,
        preferred_language: "en"
      });
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  const fillQuickDemo = (role: RoleType) => {
    setSelectedRole(role);
    if (role === "USER") {
      setPhone("+919123456789");
      setOtp("123456");
    } else if (role === "COORDINATOR") {
      setPhone("+919876543210");
      setOtp("123456");
    } else if (role === "ADMIN") {
      setEmail("admin@disasterai.org");
      setPassword("password123");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-sans">
      <div className="bg-white border border-[#EFEFEF] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 text-[#737373] hover:text-[#000000] rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FCAF45] via-[#E4405F] to-[#833AB4] flex items-center justify-center text-white">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-[#000000] text-lg">Switch Account Role</h3>
            <p className="text-xs text-[#737373]">Select your login role</p>
          </div>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <button
            type="button"
            onClick={() => setSelectedRole("USER")}
            className={`py-2 px-1 rounded-xl text-xs font-bold transition border flex flex-col items-center justify-center gap-1 ${
              selectedRole === "USER"
                ? "bg-[#FF007A]/10 border-[#FF007A] text-[#FF007A]"
                : "bg-[#FAFAFA] border-[#DBDBDB] text-[#262626] hover:bg-[#F4F4F4]"
            }`}
          >
            <User className="w-4 h-4 text-[#FF007A]" />
            <span>USER</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole("COORDINATOR")}
            className={`py-2 px-1 rounded-xl text-xs font-bold transition border flex flex-col items-center justify-center gap-1 ${
              selectedRole === "COORDINATOR"
                ? "bg-[#0095F6]/10 border-[#0095F6] text-[#0095F6]"
                : "bg-[#FAFAFA] border-[#DBDBDB] text-[#262626] hover:bg-[#F4F4F4]"
            }`}
          >
            <Compass className="w-4 h-4 text-[#0095F6]" />
            <span>COORDINATOR</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole("ADMIN")}
            className={`py-2 px-1 rounded-xl text-xs font-bold transition border flex flex-col items-center justify-center gap-1 ${
              selectedRole === "ADMIN"
                ? "bg-amber-500/10 border-amber-500 text-amber-700"
                : "bg-[#FAFAFA] border-[#DBDBDB] text-[#262626] hover:bg-[#F4F4F4]"
            }`}
          >
            <Shield className="w-4 h-4 text-amber-700" />
            <span>ADMIN</span>
          </button>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-3">
          {selectedRole !== "ADMIN" ? (
            <>
              <div>
                <input
                  type="text"
                  placeholder="Mobile number (+91...)"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-[#DBDBDB] rounded-xl px-4 py-2.5 text-xs text-[#000000] focus:outline-none focus:border-[#0095F6]"
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="6-Digit OTP Code (Default: 123456)"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-[#DBDBDB] rounded-xl px-4 py-2.5 text-xs text-[#000000] focus:outline-none focus:border-[#0095F6]"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <input
                  type="email"
                  placeholder="Officer Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-[#DBDBDB] rounded-xl px-4 py-2.5 text-xs text-[#000000] focus:outline-none focus:border-[#0095F6]"
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-[#DBDBDB] rounded-xl px-4 py-2.5 text-xs text-[#000000] focus:outline-none focus:border-[#0095F6]"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#0095F6] hover:bg-[#0084FF] text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            {isLoading ? "Authenticating..." : "Log in"}
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-[#EFEFEF] text-center">
          <p className="text-[10px] font-bold text-[#737373] uppercase mb-2">Quick Demo Fill:</p>
          <div className="flex justify-center gap-1.5">
            <button
              onClick={() => fillQuickDemo("USER")}
              className="px-2 py-1 bg-[#FAFAFA] border border-[#DBDBDB] text-[10px] font-bold text-[#FF007A] rounded-lg"
            >
              Demo User
            </button>
            <button
              onClick={() => fillQuickDemo("COORDINATOR")}
              className="px-2 py-1 bg-[#FAFAFA] border border-[#DBDBDB] text-[10px] font-bold text-[#0095F6] rounded-lg"
            >
              Demo Coordinator
            </button>
            <button
              onClick={() => fillQuickDemo("ADMIN")}
              className="px-2 py-1 bg-[#FAFAFA] border border-[#DBDBDB] text-[10px] font-bold text-amber-700 rounded-lg"
            >
              Demo Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
