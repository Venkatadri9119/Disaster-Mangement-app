"use client";

import React, { useState } from "react";
import { Shield, CheckCircle2, XCircle, AlertTriangle, Users, Compass, BarChart3, Settings as SettingsIcon, FileText, Database, ShieldAlert } from "lucide-react";

interface Props {
  userSession?: { user_id: string; name: string };
  onLogout?: () => void;
}

export function AdminPortal({ userSession, onLogout }: Props) {
  const [activeTab, setActiveTab] = useState<"VERIFY" | "USERS" | "COORDINATORS" | "ALERTS" | "REPORTS" | "ANALYTICS" | "SETTINGS" | "ADVANCED">("VERIFY");

  // Verification List State (Requirement 10)
  const [verificationQueue, setVerificationQueue] = useState<Array<{
    id: string;
    type: string;
    title: string;
    submittedBy: string;
    details: string;
    status: "Pending" | "Approved" | "Rejected";
  }>>([
    {
      id: "V-101",
      type: "Shelter",
      title: "Kanaka Durga Shelter Center",
      submittedBy: "Coordinator Ravi",
      details: "Capacity: 400 • Food: Yes • Water: Yes • Contact: +918662450003",
      status: "Pending"
    },
    {
      id: "V-102",
      type: "Food Supply",
      title: "500 Emergency Ration Packets",
      submittedBy: "Coordinator Priya",
      details: "Quantity: 500 kits • Location: Auto Nagar Hub • Contact: +919876543211",
      status: "Pending"
    },
    {
      id: "V-103",
      type: "Hospital",
      title: "Emergency Relief Medical Camp",
      submittedBy: "Coordinator Ravi",
      details: "18 Cots Available • Mobile Clinic Active",
      status: "Pending"
    }
  ]);

  const handleVerifyItem = (id: string, action: "Approved" | "Rejected") => {
    setVerificationQueue(prev => prev.map(item => item.id === id ? { ...item, status: action } : item));
  };

  return (
    <div className="max-w-6xl mx-auto p-4 font-sans">
      
      {/* Banner Header */}
      <div className="bg-white border border-[#EFEFEF] rounded-2xl p-4 mb-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl border border-amber-200">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 uppercase">
                🛡️ ADMIN PORTAL
              </span>
              <span className="text-xs text-[#737373] font-medium">System Control & Verification</span>
            </div>
            <h2 className="font-extrabold text-[#000000] text-base mt-0.5">
              Welcome, {userSession?.name || "State Disaster Officer"}
            </h2>
          </div>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className="px-3 py-1.5 bg-[#FAFAFA] hover:bg-[#F4F4F4] text-rose-600 font-bold rounded-xl text-xs border border-[#DBDBDB] transition"
          >
            Logout
          </button>
        )}
      </div>

      {/* Sub-Tabs (Requirement 14 & Simple 1-2 Word Buttons) */}
      <div className="flex bg-white p-1 rounded-2xl border border-[#EFEFEF] mb-6 overflow-x-auto shadow-xs">
        <button
          onClick={() => setActiveTab("VERIFY")}
          className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
            activeTab === "VERIFY" ? "bg-amber-500 text-white shadow-xs" : "text-[#737373] hover:text-[#000000]"
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Verify</span>
        </button>

        <button
          onClick={() => setActiveTab("USERS")}
          className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
            activeTab === "USERS" ? "bg-amber-500 text-white shadow-xs" : "text-[#737373] hover:text-[#000000]"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Users</span>
        </button>

        <button
          onClick={() => setActiveTab("COORDINATORS")}
          className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
            activeTab === "COORDINATORS" ? "bg-amber-500 text-white shadow-xs" : "text-[#737373] hover:text-[#000000]"
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Coordinators</span>
        </button>

        <button
          onClick={() => setActiveTab("ALERTS")}
          className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
            activeTab === "ALERTS" ? "bg-amber-500 text-white shadow-xs" : "text-[#737373] hover:text-[#000000]"
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Alerts</span>
        </button>

        <button
          onClick={() => setActiveTab("REPORTS")}
          className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
            activeTab === "REPORTS" ? "bg-amber-500 text-white shadow-xs" : "text-[#737373] hover:text-[#000000]"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Reports</span>
        </button>

        <button
          onClick={() => setActiveTab("ANALYTICS")}
          className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
            activeTab === "ANALYTICS" ? "bg-amber-500 text-white shadow-xs" : "text-[#737373] hover:text-[#000000]"
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab("ADVANCED")}
          className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
            activeTab === "ADVANCED" ? "bg-amber-500 text-white shadow-xs" : "text-[#737373] hover:text-[#000000]"
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Advanced</span>
        </button>
      </div>

      {/* REQUIREMENT 10: ADMIN VERIFICATION TAB */}
      {activeTab === "VERIFY" && (
        <div className="bg-white border border-[#EFEFEF] rounded-2xl p-5 shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-extrabold text-[#000000] text-base">COORDINATOR VERIFICATION QUEUE (REQUIREMENT 10)</h3>
              <p className="text-xs text-[#737373]">Verify coordinator additions before public publishing</p>
            </div>
            <span className="text-xs font-bold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full border border-amber-200">
              {verificationQueue.filter(v => v.status === "Pending").length} Pending
            </span>
          </div>

          <div className="space-y-3">
            {verificationQueue.map(item => (
              <div key={item.id} className="bg-[#FAFAFA] border border-[#EFEFEF] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200">
                      {item.type}
                    </span>
                    <h4 className="font-bold text-[#000000] text-sm">{item.title}</h4>
                  </div>
                  <p className="text-xs text-[#737373] mt-1 font-medium">{item.details}</p>
                  <p className="text-[11px] text-[#737373] mt-0.5">Submitted by: <strong>{item.submittedBy}</strong></p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {item.status === "Pending" ? (
                    <>
                      <button
                        onClick={() => handleVerifyItem(item.id, "Approved")}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verify</span>
                      </button>

                      <button
                        onClick={() => handleVerifyItem(item.id, "Rejected")}
                        className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </>
                  ) : (
                    <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                      item.status === "Approved" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-rose-50 text-rose-600 border-rose-200"
                    }`}>
                      {item.status === "Approved" ? "✓ Verified & Public" : "✕ Rejected"}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === "USERS" && (
        <div className="bg-white border border-[#EFEFEF] rounded-2xl p-5 shadow-xs">
          <h3 className="font-extrabold text-[#000000] text-base mb-4">USER MANAGEMENT (MODULE 14)</h3>
          <div className="space-y-3">
            {[
              { name: "Venkat Rao", phone: "+919123456789", role: "User", status: "Active" },
              { name: "Anitha Chary", phone: "+919123456788", role: "User", status: "Active" }
            ].map((u, i) => (
              <div key={i} className="bg-[#FAFAFA] border border-[#EFEFEF] rounded-xl p-3.5 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-[#000000] text-sm">{u.name}</h4>
                  <p className="text-[#737373]">{u.phone} • Role: {u.role}</p>
                </div>
                <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {u.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* COORDINATORS TAB */}
      {activeTab === "COORDINATORS" && (
        <div className="bg-white border border-[#EFEFEF] rounded-2xl p-5 shadow-xs">
          <h3 className="font-extrabold text-[#000000] text-base mb-4">COORDINATOR MANAGEMENT</h3>
          <div className="space-y-3">
            {[
              { name: "Ravi Kumar", sector: "Krishna Riverbank Sector", verified: true },
              { name: "Priya Sharma", sector: "Auto Nagar Sector", verified: true }
            ].map((c, i) => (
              <div key={i} className="bg-[#FAFAFA] border border-[#EFEFEF] rounded-xl p-3.5 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-[#000000] text-sm">{c.name}</h4>
                  <p className="text-[#737373]">Assigned Sector: {c.sector}</p>
                </div>
                <span className="text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  ✓ Verified Coordinator
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADVANCED TAB (MODULE 15: Donations, Offline Mode, Prediction, Forecast, Audit Logs) */}
      {activeTab === "ADVANCED" && (
        <div className="bg-white border border-[#EFEFEF] rounded-2xl p-5 shadow-xs">
          <h3 className="font-extrabold text-[#000000] text-base mb-4">MODULE 15 — ADVANCED SYSTEM CAPABILITIES</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {[
              { title: "💰 Donations Engine", status: "Ready for Integration", detail: "Direct relief fund distribution to verified shelters" },
              { title: "📡 Offline P2P Mesh Mode", status: "Ready for Integration", detail: "Bluetooth & Local WiFi mesh networking without internet" },
              { title: "🔮 AI Flood Prediction", status: "Active Engine", detail: "Predicts river overflow 6 hours in advance" },
              { title: "📦 Resource Forecast", status: "Active Engine", detail: "Automated supply restocking recommendations" },
              { title: "📜 System Audit Logs", status: "Recording Active", detail: "Cryptographic log trail of all coordinator actions" }
            ].map((adv, i) => (
              <div key={i} className="bg-[#FAFAFA] border border-[#EFEFEF] rounded-xl p-4">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-[#000000] text-sm">{adv.title}</h4>
                  <span className="text-[10px] font-bold text-[#0095F6] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {adv.status}
                  </span>
                </div>
                <p className="text-[#737373] mt-1 font-medium">{adv.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
