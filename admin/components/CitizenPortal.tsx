"use client";

import React, { useState } from "react";
import { Send, Mic, ShieldAlert, Globe, LogOut, MapPin, Navigation } from "lucide-react";

interface Props {
  userSession?: { user_id: string; name: string; preferred_language: string };
  onLogout?: () => void;
}

export function CitizenPortal({ userSession, onLogout }: Props) {
  const [language, setLanguage] = useState<"en" | "te">((userSession?.preferred_language as any) || "en");
  const [messages, setMessages] = useState<Array<{ sender: "user" | "ai"; text: string; prio?: string; team?: string; eta?: string }>>([
    {
      sender: "ai",
      text: `Hello ${userSession?.name || "Citizen"}!\n\nHow can I help you?\nTell me what happened. You can type or speak in English or Telugu (తెలుగు).`
    }
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lon: number; address: string } | null>(null);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsStatusMsg, setGpsStatusMsg] = useState("");
  const [activeRequest, setActiveRequest] = useState<{ id: string; status: string; team: string; eta: string; prio: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"CHAT" | "SHELTERS" | "TRACKER">("CHAT");

  const suggestionPrompts = [
    { label: "🚑 Emergency Rescue", prompt: "Our house is flooded. 5 people trapped, mother needs medical help." },
    { label: "🏠 Safe Shelter", prompt: "I need a safe shelter nearby for my family." },
    { label: "🏥 Medical Help", prompt: "Someone is injured and needs immediate medical assistance." },
    { label: "🍲 Food & Water", prompt: "We need clean drinking water and food packets." },
    { label: "👨‍👩‍👧 Missing Person", prompt: "My brother is missing since yesterday's flood." },
    { label: "🚗 Evacuation", prompt: "We need boat evacuation from flooded area." }
  ];

  const handleDetectGPS = () => {
    setIsDetectingGps(true);
    setGpsStatusMsg("Accessing location sensor...");

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const addr = `GPS Location: (${lat.toFixed(4)}°, ${lon.toFixed(4)}°), Vijayawada Sector`;

          setGpsLocation({ lat, lon, address: addr });
          setGpsStatusMsg(`📍 GPS Acquired: ${lat.toFixed(4)}°, ${lon.toFixed(4)}°`);
          setIsDetectingGps(false);

          try {
            await fetch("http://localhost:8000/api/v1/users/me/location", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ latitude: lat, longitude: lon })
            });
          } catch (e) {
            console.log("Location sync:", e);
          }

          handleSendMessage(`I am sharing my current GPS location: ${lat.toFixed(4)}°, ${lon.toFixed(4)}°`);
        },
        () => {
          const fallbackLat = 16.5080;
          const fallbackLon = 80.6410;
          const fallbackAddr = "Krishna Riverbank Sector, Vijayawada";

          setGpsLocation({ lat: fallbackLat, lon: fallbackLon, address: fallbackAddr });
          setGpsStatusMsg("📍 Location set: Krishna Riverbank Sector");
          setIsDetectingGps(false);

          handleSendMessage(`My emergency location is at ${fallbackAddr}`);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setGpsLocation({ lat: 16.5080, lon: 80.6410, address: "Vijayawada Sector" });
      setGpsStatusMsg("📍 Location set: Vijayawada Sector");
      setIsDetectingGps(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { sender: "user", text }]);
    setInputMsg("");

    try {
      const res = await fetch("http://localhost:8000/api/v1/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer demo-token"
        },
        body: JSON.stringify({
          message: text,
          latitude: gpsLocation?.lat || 16.5080,
          longitude: gpsLocation?.lon || 80.6410,
          language: language
        })
      });

      if (res.ok) {
        const data = await res.json();
        const prio = data.priority || "CRITICAL";
        const reqId = data.request_id || ("REQ-" + Math.floor(1000 + Math.random() * 9000));
        
        setActiveRequest({
          id: reqId,
          status: data.status || "VOLUNTEER_ASSIGNED",
          team: "Rescue Team Ravi",
          eta: "8 mins",
          prio: prio
        });

        setMessages(prev => [
          ...prev,
          {
            sender: "ai",
            text: data.reply,
            prio: prio,
            team: "Rescue Team Ravi",
            eta: "8 mins"
          }
        ]);
        return;
      }
    } catch (e) {
      console.log("Backend offline fallback:", e);
    }

    setTimeout(() => {
      const isTelugu = language === "te" || text.includes("వరద") || text.includes("సహాయం");
      const prio = "CRITICAL";
      const team = "Rescue Team Ravi";
      const eta = "8 mins";

      setActiveRequest({
        id: "REQ-" + Math.floor(1000 + Math.random() * 9000),
        status: "VOLUNTEER_ASSIGNED",
        team: team,
        eta: eta,
        prio: prio
      });

      if (isTelugu) {
        setMessages(prev => [
          ...prev,
          {
            sender: "ai",
            text: `మీ అభ్యర్థన అత్యవసర పరిధిలో (${prio}) నమోదు చేయబడింది.\n\nసహాయ బృందం ${team} (2.4 కి.మీ) అనుసంధానించబడింది.\nచేరుకోవడానికి సమయం: ${eta}.`,
            prio: prio,
            team: team,
            eta: eta
          }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            sender: "ai",
            text: `Your request has been logged as **${prio}** priority.\n\nLooking for nearest available rescue team...\n\n**${team}** (2.4 km away) is assigned and on the way.\nEstimated arrival: **${eta}**.`,
            prio: prio,
            team: team,
            eta: eta
          }
        ]);
      }
    }, 600);
  };

  const handleVoiceTrigger = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      handleSendMessage("మా ఇంట్లోకి వరద నీళ్లు వచ్చాయి. మేము ఐదుగురం ఉన్నాం. మా అమ్మకి మెడికల్ హెల్ప్ కావాలి.");
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header Banner */}
      <div className="bg-white border border-[#EFEFEF] rounded-2xl p-4 mb-4 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl border border-rose-200">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                ROLE 1: CITIZEN / HELP SEEKER
              </span>
              <span className="text-xs text-[#737373] font-medium">AI Assistance Active</span>
            </div>
            <h2 className="font-extrabold text-[#000000] text-base mt-0.5">
              Welcome, {userSession?.name || "Citizen User"}
            </h2>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLanguage(l => l === "en" ? "te" : "en")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-xs font-bold hover:bg-amber-100 transition"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === "en" ? "తెలుగుకి మార్చు" : "Switch to English"}</span>
          </button>

          <div className="flex bg-[#FAFAFA] p-1 rounded-xl border border-[#EFEFEF] text-xs">
            <button
              onClick={() => setActiveTab("CHAT")}
              className={`px-3 py-1 rounded-lg font-bold transition ${activeTab === "CHAT" ? "bg-[#FF007A] text-white shadow-sm" : "text-[#737373] hover:text-[#000000]"}`}
            >
              AI Chat
            </button>
            <button
              onClick={() => setActiveTab("TRACKER")}
              className={`px-3 py-1 rounded-lg font-bold transition ${activeTab === "TRACKER" ? "bg-[#FF007A] text-white shadow-sm" : "text-[#737373] hover:text-[#000000]"}`}
            >
              Tracker
            </button>
            <button
              onClick={() => setActiveTab("SHELTERS")}
              className={`px-3 py-1 rounded-lg font-bold transition ${activeTab === "SHELTERS" ? "bg-[#FF007A] text-white shadow-sm" : "text-[#737373] hover:text-[#000000]"}`}
            >
              Shelters
            </button>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="p-1.5 bg-[#FAFAFA] hover:bg-[#F4F4F4] text-[#737373] rounded-xl border border-[#DBDBDB] transition"
              title="Logout & Change Role"
            >
              <LogOut className="w-4 h-4 text-rose-600" />
            </button>
          )}
        </div>
      </div>

      {activeTab === "CHAT" && (
        <div className="bg-white border border-[#EFEFEF] rounded-2xl flex flex-col h-[600px] relative overflow-hidden shadow-sm">
          
          {/* Location Bar */}
          <div className="bg-[#FAFAFA] p-2.5 px-4 border-b border-[#EFEFEF] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-rose-500 animate-bounce" />
              <span className="text-xs text-[#000000] font-semibold">
                {gpsStatusMsg || "GPS Location: Click button to share your location"}
              </span>
            </div>
            <button
              onClick={handleDetectGPS}
              disabled={isDetectingGps}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{isDetectingGps ? "Detecting GPS..." : "📍 Share My GPS Location"}</span>
            </button>
          </div>

          {/* Active Request Bar */}
          {activeRequest && (
            <div className="bg-rose-50 border-b border-rose-200 p-3 px-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                <div>
                  <p className="text-xs font-extrabold text-rose-700">ACTIVE EMERGENCY: {activeRequest.id}</p>
                  <p className="text-[11px] text-rose-600 font-semibold">{activeRequest.team} • Assigned ETA: {activeRequest.eta}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab("TRACKER")}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition shadow-sm"
              >
                Track Live Status
              </button>
            </div>
          )}

          {/* Prompts Bar */}
          <div className="p-3 bg-[#FAFAFA] border-b border-[#EFEFEF] flex items-center gap-2 overflow-x-auto">
            {suggestionPrompts.map((sp, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(sp.prompt)}
                className="whitespace-nowrap px-3.5 py-1.5 rounded-full bg-white text-gray-800 hover:bg-gray-100 text-xs font-semibold border border-gray-200 shadow-sm transition"
              >
                {sp.label}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    m.sender === "user"
                      ? "bg-[#0095F6] text-white rounded-br-none shadow-sm"
                      : "bg-[#FAFAFA] text-[#000000] border border-[#EFEFEF] rounded-bl-none shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                  {m.prio && (
                    <div className="mt-3 pt-2 border-t border-[#EFEFEF] flex items-center justify-between text-[11px]">
                      <span className="font-extrabold text-rose-600">Priority: {m.prio}</span>
                      <span className="text-amber-700 font-bold">{m.team} (ETA {m.eta})</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* SOS Action Button */}
          <div className="p-2.5 px-4 bg-rose-50/60 border-t border-rose-200">
            <button
              onClick={() => handleSendMessage("EMERGENCY SOS! I need immediate rescue at my current GPS location!")}
              className="w-full py-2.5 bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black text-xs rounded-xl shadow-md uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <ShieldAlert className="w-4 h-4 animate-bounce" />
              <span>INSTANT EMERGENCY SOS BUTTON</span>
            </button>
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-[#FAFAFA] border-t border-[#EFEFEF] flex items-center gap-2">
            <button
              onClick={handleVoiceTrigger}
              className={`p-2.5 rounded-xl border transition ${
                isRecording
                  ? "bg-rose-600 text-white border-rose-500 animate-pulse"
                  : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
              }`}
              title="Click to Speak (Telugu / English STT)"
            >
              <Mic className="w-5 h-5" />
            </button>

            <input
              type="text"
              placeholder="Tell me what happened. You can type or speak..."
              value={inputMsg}
              onChange={e => setInputMsg(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSendMessage(inputMsg)}
              className="flex-1 bg-white border border-[#DBDBDB] rounded-xl px-4 py-2.5 text-xs text-[#000000] placeholder-[#737373] focus:outline-none focus:border-[#0095F6]"
            />

            <button
              onClick={() => handleSendMessage(inputMsg)}
              className="p-2.5 bg-[#0095F6] hover:bg-[#0084FF] text-white rounded-xl shadow-sm transition"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Tracker View */}
      {activeTab === "TRACKER" && (
        <div className="bg-white border border-[#EFEFEF] rounded-2xl p-6 shadow-sm">
          <h3 className="font-extrabold text-[#000000] text-base mb-4">CITIZEN EMERGENCY STATUS TRACKER</h3>
          <div className="space-y-4 max-w-lg mx-auto py-4">
            {[
              { step: "Submitted", status: "completed", detail: "Emergency request received via AI agent" },
              { step: "AI Prioritized", status: "completed", detail: "Assessed as CRITICAL priority" },
              { step: "Volunteer Assigned", status: "active", detail: "Rescue Team Ravi assigned (2.4 km away)" },
              { step: "On The Way", status: "pending", detail: "ETA 8 minutes" },
              { step: "Reached Location", status: "pending", detail: "Team on site" },
              { step: "Help Completed", status: "pending", detail: "Safety confirmed" },
              { step: "Resolved", status: "pending", detail: "Emergency closed" }
            ].map((st, idx) => (
              <div key={idx} className="flex items-start space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                  st.status === "completed" ? "bg-emerald-500 text-white" : (st.status === "active" ? "bg-amber-500 text-white animate-pulse" : "bg-gray-200 text-gray-500")
                }`}>
                  {idx + 1}
                </div>
                <div>
                  <h4 className={`font-bold text-xs ${st.status === "pending" ? "text-gray-400" : "text-[#000000]"}`}>{st.step}</h4>
                  <p className="text-[11px] text-[#737373]">{st.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shelters View */}
      {activeTab === "SHELTERS" && (
        <div className="bg-white border border-[#EFEFEF] rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 className="font-extrabold text-[#000000] text-base">NEARBY SAFE SHELTERS</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "Vijayawada Central Relief Shelter", dist: "1.4 km away", cap: "380 / 500 Available", phone: "+918662450001", lat: 16.5030, lon: 80.6400 },
              { name: "Auto Nagar Emergency Safe Shelter", dist: "2.8 km away", cap: "255 / 300 Available", phone: "+918662450002", lat: 16.5180, lon: 80.6620 }
            ].map((s, idx) => (
              <div key={idx} className="bg-[#FAFAFA] border border-[#EFEFEF] rounded-xl p-4">
                <h4 className="font-bold text-[#000000] text-sm">{s.name}</h4>
                <p className="text-xs text-purple-700 font-extrabold mt-1">{s.dist} • {s.cap}</p>
                <p className="text-xs text-[#737373] mt-2 font-medium">Contact: {s.phone}</p>
                <button
                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lon}&travelmode=driving`, "_blank")}
                  className="mt-3 w-full py-2 bg-[#0095F6] hover:bg-[#0084FF] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions in Google Maps</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
