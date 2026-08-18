"use client";

import React, { useState } from "react";
import { Send, Mic, ShieldAlert, Globe, LogOut, MapPin, Navigation, Camera, User, HeartHandshake, CheckCircle2, ChevronRight, Sparkles, Image as ImageIcon, Bell } from "lucide-react";
import { LiveMap } from "@/components/LiveMap";

interface Props {
  userSession?: { user_id: string; name: string; preferred_language: string; phone?: string };
  onLogout?: () => void;
}

export function UserPortal({ userSession, onLogout }: Props) {
  // Mode: HELP vs HELP_OTHERS (Switchable anytime)
  const [userMode, setUserMode] = useState<"HELP" | "HELP_OTHERS">("HELP");
  const [language, setLanguage] = useState<"en" | "te">((userSession?.preferred_language as any) || "en");
  
  // Get Help Flow State
  const [selectedEmergency, setSelectedEmergency] = useState<string | null>(null);
  const [inputMsg, setInputMsg] = useState("");
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [aiVisionResult, setAiVisionResult] = useState<string | null>(null);
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lon: number; address: string } | null>(null);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsStatusMsg, setGpsStatusMsg] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // User Profile State (Module 2)
  const [userProfile, setUserProfile] = useState({
    name: userSession?.name || "Venkat Rao",
    phone: userSession?.phone || "+919123456789",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    language: "Telugu / English",
    location: "Krishna Riverbank Sector, Vijayawada",
    skills: "Boat Rescue, First Aid",
    vehicle: "Rescue Boat (4 Person)",
    availability: "Available",
    emergencyContact: "+919876543210 (Brother)",
    assistanceNeeds: "Flood Shelter & Medical Kits"
  });

  // Messages Chat (Module 4 AI Assistant & Module 5 AI Triage)
  const [messages, setMessages] = useState<Array<{ sender: "user" | "ai"; text: string; prio?: string; team?: string; eta?: string }>>([
    {
      sender: "ai",
      text: `Hello ${userSession?.name || "User"}!\n\nWhat happened? You can talk or type in English, Telugu (తెలుగు), or mixed.`
    }
  ]);

  // Active Emergency Request Tracking
  const [activeRequest, setActiveRequest] = useState<{
    id: string;
    emergency: string;
    status: "New" | "Assigned" | "Moving" | "Arrived" | "Done";
    helper: string;
    eta: string;
    people: number;
    prio: string;
  } | null>(null);

  // Help Others Flow (Module 7 & Flow 5)
  const [nearbyRequests, setNearbyRequests] = useState<Array<{
    id: string;
    emergency: string;
    people: number;
    prio: string;
    distance: string;
    skill: string;
    eta: string;
    address: string;
    status: "New" | "Assigned" | "Moving" | "Arrived" | "Done";
  }>>([
    {
      id: "REQ-1001",
      emergency: "Flood",
      people: 5,
      prio: "CRITICAL",
      distance: "1.2 km",
      skill: "Boat Rescue",
      eta: "8 min",
      address: "House #12, Krishna Riverbank Colony",
      status: "New"
    },
    {
      id: "REQ-1002",
      emergency: "Building Collapse",
      people: 3,
      prio: "CRITICAL",
      distance: "2.8 km",
      skill: "Medical First Aid",
      eta: "14 min",
      address: "Plot 45, Near Old Bus Stand",
      status: "New"
    },
    {
      id: "REQ-1003",
      emergency: "Cyclone",
      people: 2,
      prio: "HIGH",
      distance: "4.1 km",
      skill: "Roof Clearance",
      eta: "18 min",
      address: "Auto Nagar Sector 4",
      status: "New"
    }
  ]);

  const emergencyOptions = [
    { label: "Flood", icon: "🌊" },
    { label: "Fire", icon: "🔥" },
    { label: "Medical", icon: "🏥" },
    { label: "Trapped", icon: "🏚️" },
    { label: "Food", icon: "🍚" },
    { label: "Water", icon: "💧" },
    { label: "Other", icon: "🚨" }
  ];

  // GPS Location Detection
  const handleDetectGPS = () => {
    setIsDetectingGps(true);
    setGpsStatusMsg("Detecting GPS...");

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const addr = `GPS: (${lat.toFixed(4)}°, ${lon.toFixed(4)}°), Vijayawada Sector`;
          setGpsLocation({ lat, lon, address: addr });
          setGpsStatusMsg(`📍 GPS: ${lat.toFixed(4)}°, ${lon.toFixed(4)}°`);
          setIsDetectingGps(false);
        },
        () => {
          const fallbackAddr = "Krishna Riverbank Sector (16.5080°, 80.6410°)";
          setGpsLocation({ lat: 16.5080, lon: 80.6410, address: fallbackAddr });
          setGpsStatusMsg("📍 Location: Krishna Riverbank Sector");
          setIsDetectingGps(false);
        },
        { enableHighAccuracy: true, timeout: 4000 }
      );
    } else {
      setGpsLocation({ lat: 16.5080, lon: 80.6410, address: "Vijayawada Sector" });
      setGpsStatusMsg("📍 Location: Vijayawada Sector");
      setIsDetectingGps(false);
    }
  };

  // Simulated AI Vision Photo Upload (Module 6)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUploadedPhoto(url);
    setAiVisionResult("🔍 AI Vision: High Flood Water Level (1.5m) Detected • Critical Structural Hazard");
  };

  // Send Emergency Request
  const handleSendMessage = async (text: string) => {
    if (!text.trim() && !selectedEmergency && !uploadedPhoto) return;

    const fullMsg = text || (selectedEmergency ? `${selectedEmergency} Emergency Rescue needed!` : "Emergency SOS");
    setMessages(prev => [...prev, { sender: "user", text: fullMsg }]);
    setInputMsg("");

    setTimeout(() => {
      const isTelugu = text.includes("వరద") || text.includes("vachindi") || text.includes("members");
      const reqId = "REQ-" + Math.floor(1000 + Math.random() * 9000);
      const prio = "CRITICAL";

      setActiveRequest({
        id: reqId,
        emergency: selectedEmergency || "Flood",
        status: "Assigned",
        helper: "Helper Ravi (Boat Specialist)",
        eta: "8 min",
        people: 5,
        prio: prio
      });

      if (isTelugu) {
        setMessages(prev => [
          ...prev,
          {
            sender: "ai",
            text: `మీ అభ్యర్థన **${prio}** priority కింద నమోదు చేయబడింది.\n\nAI extraction:\n• **Emergency**: ${selectedEmergency || "Flood"}\n• **Status**: Assigned\n• **Helper**: Helper Ravi (2.4 km away)\n• **ETA**: 8 min`,
            prio: prio,
            team: "Helper Ravi",
            eta: "8 min"
          }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            sender: "ai",
            text: `Your request has been logged as **${prio}** priority.\n\n**AI Triage Extraction:**\n• **Emergency**: ${selectedEmergency || "Flood"}\n• **Status**: Assigned\n• **Helper**: Helper Ravi (Boat Specialist)\n• **ETA**: 8 min`,
            prio: prio,
            team: "Helper Ravi",
            eta: "8 min"
          }
        ]);
      }
    }, 600);
  };

  // Voice Input Simulator (Talk)
  const handleVoiceTrigger = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      handleSendMessage("Flood vachindi, maa intlo 5 members unnaru, okariki injury ayyindi.");
    }, 1200);
  };

  // Helper Flow Actions
  const handleHelperAction = (reqId: string, nextStatus: "Assigned" | "Moving" | "Arrived" | "Done") => {
    setNearbyRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: nextStatus } : r));
  };

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-4 font-sans">
      
      {/* Role Banner & Profile Shortcut */}
      <div className="bg-white border border-[#EFEFEF] rounded-2xl p-4 mb-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[#FF007A]/10 border border-[#FF007A]/20 flex items-center justify-center text-[#FF007A]">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold text-[#FF007A] bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 uppercase">
                👤 USER PORTAL
              </span>
              <span className="text-xs text-[#737373] font-medium">One Account</span>
            </div>
            <h2 className="font-extrabold text-[#000000] text-base mt-0.5">
              Welcome, {userProfile.name}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="px-3 py-1.5 bg-[#FAFAFA] hover:bg-[#F4F4F4] text-[#000000] border border-[#DBDBDB] rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <User className="w-3.5 h-3.5 text-[#0095F6]" />
            <span>Profile</span>
          </button>

          <button
            onClick={() => setLanguage(l => l === "en" ? "te" : "en")}
            className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-xs font-bold hover:bg-amber-100 transition"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === "en" ? "తెలుగు" : "English"}</span>
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="p-1.5 bg-[#FAFAFA] hover:bg-[#F4F4F4] text-[#737373] rounded-xl border border-[#DBDBDB] transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4 text-rose-600" />
            </button>
          )}
        </div>
      </div>

      {/* USER EXPERIENCE MODE CHOICE CARD */}
      <div className="bg-gradient-to-r from-rose-50 to-blue-50 border border-[#EFEFEF] rounded-2xl p-4 mb-4 text-center shadow-xs">
        <h3 className="font-extrabold text-[#000000] text-sm mb-3">What do you want to do?</h3>
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
          <button
            onClick={() => setUserMode("HELP")}
            className={`py-3 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 border shadow-xs ${
              userMode === "HELP"
                ? "bg-[#FF007A] text-white border-[#FF007A]"
                : "bg-white text-[#000000] border-[#DBDBDB] hover:bg-rose-50"
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>🆘 Help</span>
          </button>

          <button
            onClick={() => setUserMode("HELP_OTHERS")}
            className={`py-3 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 border shadow-xs ${
              userMode === "HELP_OTHERS"
                ? "bg-[#0095F6] text-white border-[#0095F6]"
                : "bg-white text-[#000000] border-[#DBDBDB] hover:bg-blue-50"
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>🤝 Help Others</span>
          </button>
        </div>
        <p className="text-[10px] text-[#737373] mt-2 font-medium">You can switch modes anytime without logging out.</p>
      </div>

      {/* USER PROFILE MODAL */}
      {showProfile && (
        <div className="bg-white border border-[#EFEFEF] rounded-2xl p-5 mb-4 shadow-md">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-extrabold text-[#000000] text-sm flex items-center gap-2">
              <User className="w-4 h-4 text-[#0095F6]" /> USER PROFILE (MODULE 2)
            </h3>
            <button onClick={() => setShowProfile(false)} className="text-xs font-bold text-[#737373]">✕</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[10px] font-bold text-[#737373] uppercase">Name</label>
              <input
                type="text"
                value={userProfile.name}
                onChange={e => setUserProfile({ ...userProfile, name: e.target.value })}
                className="w-full bg-[#FAFAFA] border border-[#DBDBDB] rounded-xl px-3 py-2 text-[#000000] font-bold mt-1"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#737373] uppercase">Phone</label>
              <input
                type="text"
                value={userProfile.phone}
                onChange={e => setUserProfile({ ...userProfile, phone: e.target.value })}
                className="w-full bg-[#FAFAFA] border border-[#DBDBDB] rounded-xl px-3 py-2 text-[#000000] font-bold mt-1"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#737373] uppercase">Skills</label>
              <input
                type="text"
                value={userProfile.skills}
                onChange={e => setUserProfile({ ...userProfile, skills: e.target.value })}
                className="w-full bg-[#FAFAFA] border border-[#DBDBDB] rounded-xl px-3 py-2 text-[#000000] font-bold mt-1"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#737373] uppercase">Vehicle</label>
              <input
                type="text"
                value={userProfile.vehicle}
                onChange={e => setUserProfile({ ...userProfile, vehicle: e.target.value })}
                className="w-full bg-[#FAFAFA] border border-[#DBDBDB] rounded-xl px-3 py-2 text-[#000000] font-bold mt-1"
              />
            </div>
          </div>
          <button
            onClick={() => setShowProfile(false)}
            className="mt-4 w-full py-2 bg-[#0095F6] text-white font-bold rounded-xl text-xs"
          >
            Save Profile
          </button>
        </div>
      )}

      {/* MODE 1: GET HELP FLOW */}
      {userMode === "HELP" && (
        <div className="bg-white border border-[#EFEFEF] rounded-2xl flex flex-col h-[620px] relative overflow-hidden shadow-xs">
          
          {/* Location Bar */}
          <div className="bg-[#FAFAFA] p-2.5 px-4 border-b border-[#EFEFEF] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-rose-500 animate-bounce" />
              <span className="text-xs text-[#000000] font-semibold">
                {gpsStatusMsg || (gpsLocation ? gpsLocation.address : "Location: Click button to acquire GPS")}
              </span>
            </div>
            <button
              onClick={handleDetectGPS}
              disabled={isDetectingGps}
              className="px-3 py-1.5 bg-white hover:bg-gray-100 text-[#000000] border border-[#DBDBDB] rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <Navigation className="w-3.5 h-3.5 text-[#0095F6]" />
              <span>Location</span>
            </button>
          </div>

          {/* Active Request Tracker Bar */}
          {activeRequest && (
            <div className="bg-rose-50 border-b border-rose-200 p-3 px-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold bg-rose-600 text-white px-2 py-0.5 rounded-full uppercase">
                  Status: {activeRequest.status}
                </span>
                <p className="text-xs font-extrabold text-[#000000] mt-1">{activeRequest.id} • {activeRequest.emergency}</p>
                <p className="text-[11px] text-[#737373] font-semibold">{activeRequest.helper} • ETA: {activeRequest.eta}</p>
              </div>

              <div className="flex gap-1">
                {["New", "Assigned", "Moving", "Arrived", "Done"].map((st) => (
                  <span
                    key={st}
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                      activeRequest.status === st ? "bg-rose-600 text-white border-rose-600 animate-pulse" : "bg-white text-gray-400 border-gray-200"
                    }`}
                  >
                    {st}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Select Emergency Options */}
          <div className="p-2.5 bg-[#FAFAFA] border-b border-[#EFEFEF] flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] font-bold text-[#737373] uppercase shrink-0">Emergency:</span>
            {emergencyOptions.map(opt => (
              <button
                key={opt.label}
                onClick={() => setSelectedEmergency(opt.label)}
                className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-bold border transition ${
                  selectedEmergency === opt.label
                    ? "bg-[#FF007A] text-white border-[#FF007A] shadow-xs"
                    : "bg-white text-gray-800 border-gray-200 hover:bg-gray-100"
                }`}
              >
                {opt.icon} {opt.label}
              </button>
            ))}
          </div>

          {/* AI Vision Result */}
          {uploadedPhoto && (
            <div className="p-3 bg-amber-50 border-b border-amber-200 flex items-center gap-3">
              <img src={uploadedPhoto} alt="Emergency photo" className="w-12 h-12 rounded-xl object-cover border border-amber-300" />
              <div>
                <p className="text-xs font-bold text-amber-900">{aiVisionResult}</p>
                <p className="text-[10px] text-amber-700">Photo attached to AI Triage engine</p>
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    m.sender === "user"
                      ? "bg-[#0095F6] text-white rounded-br-none shadow-xs"
                      : "bg-[#FAFAFA] text-[#000000] border border-[#EFEFEF] rounded-bl-none shadow-xs"
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                  {m.prio && (
                    <div className="mt-3 pt-2 border-t border-[#EFEFEF] flex items-center justify-between text-[11px]">
                      <span className="font-extrabold text-rose-600">Priority: {m.prio}</span>
                      <span className="text-blue-700 font-bold">{m.team} (ETA {m.eta})</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Emergency SOS Button */}
          <div className="p-2 bg-rose-50 border-t border-rose-200">
            <button
              onClick={() => handleSendMessage("EMERGENCY SOS! Rescue needed immediately at current location!")}
              className="w-full py-2.5 bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black text-xs rounded-xl shadow-md uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <ShieldAlert className="w-4 h-4 animate-bounce" />
              <span>Help</span>
            </button>
          </div>

          {/* Controls Bar */}
          <div className="p-3 bg-[#FAFAFA] border-t border-[#EFEFEF] flex items-center gap-2">
            
            <button
              onClick={handleVoiceTrigger}
              className={`px-3 py-2.5 rounded-xl border font-bold text-xs transition flex items-center gap-1 ${
                isRecording
                  ? "bg-rose-600 text-white border-rose-500 animate-pulse"
                  : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
              }`}
              title="Speak in Telugu or English"
            >
              <Mic className="w-4 h-4" />
              <span>Talk</span>
            </button>

            <label className="px-3 py-2.5 bg-white border border-[#DBDBDB] rounded-xl text-xs font-bold text-[#000000] hover:bg-gray-100 cursor-pointer flex items-center gap-1 shadow-xs">
              <Camera className="w-4 h-4 text-purple-600" />
              <span>Photo</span>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>

            <input
              type="text"
              placeholder="Tell me what happened..."
              value={inputMsg}
              onChange={e => setInputMsg(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSendMessage(inputMsg)}
              className="flex-1 bg-white border border-[#DBDBDB] rounded-xl px-4 py-2 text-xs text-[#000000] placeholder-[#737373] focus:outline-none focus:border-[#0095F6]"
            />

            <button
              onClick={() => handleSendMessage(inputMsg)}
              className="px-4 py-2.5 bg-[#0095F6] hover:bg-[#0084FF] text-white rounded-xl font-bold text-xs shadow-xs transition flex items-center gap-1"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </div>
        </div>
      )}

      {/* MODE 2: HELP OTHERS FLOW WITH LIVE MAP INCLUDED */}
      {userMode === "HELP_OTHERS" && (
        <div className="space-y-6">
          
          {/* LIVE MAP INTEGRATED IN HELP OTHERS MODE (Module 12 & Requirement 11) */}
          <LiveMap />

          {/* NEARBY EMERGENCY REQUESTS LIST */}
          <div className="bg-white border border-[#EFEFEF] rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-[#000000] text-base">NEARBY EMERGENCY REQUESTS</h3>
                <p className="text-xs text-[#737373]">Select a request on the map or feed to respond</p>
              </div>

              <button
                onClick={() => setNearbyRequests([...nearbyRequests])}
                className="px-3 py-1.5 bg-blue-50 text-[#0095F6] rounded-xl text-xs font-bold border border-blue-200 hover:bg-blue-100 transition"
              >
                Nearby
              </button>
            </div>

            <div className="space-y-4">
              {nearbyRequests.map(req => (
                <div key={req.id} className="bg-[#FAFAFA] border border-[#EFEFEF] rounded-xl p-4 hover:border-[#0095F6]/40 transition">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md border ${
                      req.prio === "CRITICAL" ? "bg-rose-50 text-rose-600 border-rose-200" : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}>
                      🔴 {req.prio} • {req.emergency}
                    </span>
                    <span className="text-xs font-bold text-[#0095F6] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                      Status: {req.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-[#000000] text-sm mt-1">{req.people} People Trapped • {req.distance} away</h4>
                  <p className="text-xs text-[#737373] mt-0.5 font-medium">{req.address}</p>
                  <p className="text-xs text-purple-700 font-bold mt-1">Required Skill: {req.skill} • Estimated Arrival: {req.eta}</p>

                  <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
                    <button
                      onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=16.5085,80.6420&travelmode=driving`, "_blank")}
                      className="px-3 py-2 bg-white hover:bg-gray-100 text-[#000000] border border-[#DBDBDB] rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
                    >
                      <Navigation className="w-3.5 h-3.5 text-[#0095F6]" />
                      <span>Directions</span>
                    </button>

                    {req.status === "New" && (
                      <button
                        onClick={() => handleHelperAction(req.id, "Assigned")}
                        className="px-4 py-2 bg-[#0095F6] hover:bg-[#0084FF] text-white rounded-xl text-xs font-bold shadow-xs transition"
                      >
                        Respond
                      </button>
                    )}

                    {req.status === "Assigned" && (
                      <button
                        onClick={() => handleHelperAction(req.id, "Moving")}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-xs transition"
                      >
                        Accept & Start
                      </button>
                    )}

                    {req.status === "Moving" && (
                      <button
                        onClick={() => handleHelperAction(req.id, "Arrived")}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-xs transition"
                      >
                        Arrived
                      </button>
                    )}

                    {req.status === "Arrived" && (
                      <button
                        onClick={() => handleHelperAction(req.id, "Done")}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs transition"
                      >
                        Complete / Done
                      </button>
                    )}

                    {req.status === "Done" && (
                      <span className="text-xs font-extrabold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Rescue Completed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
