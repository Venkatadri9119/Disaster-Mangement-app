"use client";

import React, { useState, useEffect } from "react";
import { HeartHandshake, Navigation, MapPin, LogOut, ExternalLink } from "lucide-react";

interface Props {
  userSession?: { user_id: string; name: string };
  onLogout?: () => void;
}

export function VolunteerPortal({ userSession, onLogout }: Props) {
  const [isAvailable, setIsAvailable] = useState(true);
  const [activeMission, setActiveMission] = useState<{ id: string; status: string; title: string; address: string; lat: number; lon: number } | null>({
    id: "REQ-1001",
    status: "ON_THE_WAY",
    title: "Flood Rescue (5 People Trapped)",
    address: "House #12, Krishna Riverbank Colony, Vijayawada",
    lat: 16.5085,
    lon: 80.6420
  });

  const [nearbyRequests, setNearbyRequests] = useState([
    {
      id: "REQ-1001",
      disaster_type: "Flood Rescue",
      people: 5,
      medical: true,
      distance: "1.2 km away",
      match_score: "94%",
      address: "House #12, Krishna Riverbank Colony",
      priority: "CRITICAL",
      lat: 16.5085,
      lon: 80.6420
    },
    {
      id: "REQ-1002",
      disaster_type: "Building Collapse Debris",
      people: 3,
      medical: true,
      distance: "2.8 km away",
      match_score: "88%",
      address: "Plot 45, Near Old Bus Stand Road",
      priority: "CRITICAL",
      lat: 16.5160,
      lon: 80.6360
    },
    {
      id: "REQ-1003",
      disaster_type: "Cyclone Roof Damage",
      people: 2,
      medical: false,
      distance: "4.1 km away",
      match_score: "76%",
      address: "Auto Nagar Sector 4",
      priority: "HIGH",
      lat: 16.4960,
      lon: 80.6510
    }
  ]);

  const handleOpenNavigation = (lat: number, lon: number, addressText: string) => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&travelmode=driving`;
    window.open(googleMapsUrl, "_blank");
  };

  const handleAcceptMission = (req: typeof nearbyRequests[0]) => {
    setActiveMission({
      id: req.id,
      status: "ON_THE_WAY",
      title: req.disaster_type,
      address: req.address,
      lat: req.lat,
      lon: req.lon
    });
  };

  const handleAdvanceMission = async () => {
    if (!activeMission) return;
    let nextStatus = "REACHED";
    if (activeMission.status === "ON_THE_WAY") nextStatus = "REACHED";
    else if (activeMission.status === "REACHED") nextStatus = "HELP_COMPLETED";
    else if (activeMission.status === "HELP_COMPLETED") {
      setActiveMission(null);
      return;
    }

    try {
      await fetch(`http://localhost:8000/api/v1/emergencies/${activeMission.id}/status?status_str=${nextStatus}`, {
        method: "POST",
        headers: { "Authorization": "Bearer demo-token" }
      });
    } catch (e) {
      console.log("Status API error:", e);
    }
    setActiveMission(prev => prev ? { ...prev, status: nextStatus } : null);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Banner Header */}
      <div className="bg-white border border-[#EFEFEF] rounded-2xl p-4 mb-4 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-start space-x-3">
          <div className="p-2.5 bg-blue-50 text-[#0095F6] rounded-xl border border-blue-200">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-[#0095F6] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                ROLE 2: VOLUNTEER / NGO DISPATCH
              </span>
              <span className="text-xs text-[#737373]">Live Dispatch Connected</span>
            </div>
            <h2 className="font-extrabold text-[#000000] text-base mt-0.5">
              Welcome, {userSession?.name || "Volunteer Ravi"}
            </h2>
            <p className="text-xs text-[#737373]">Skills: Boat Operator, Flood Rescue, Medical First Aid</p>
          </div>
        </div>

        {/* Availability Toggle Switch */}
        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-3 bg-[#FAFAFA] px-4 py-2 rounded-xl border border-[#DBDBDB]">
            <span className={`text-xs font-extrabold ${isAvailable ? "text-emerald-600" : "text-[#737373]"}`}>
              {isAvailable ? "DUTY: AVAILABLE" : "DUTY: OFF DUTY"}
            </span>
            <button
              onClick={() => setIsAvailable(!isAvailable)}
              className={`w-12 h-6 rounded-full p-1 transition ${isAvailable ? "bg-emerald-500" : "bg-gray-300"}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition transform ${isAvailable ? "translate-x-6" : "translate-x-0"}`} />
            </button>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="p-2 bg-[#FAFAFA] hover:bg-[#F4F4F4] text-[#737373] rounded-xl border border-[#DBDBDB] transition"
              title="Logout & Change Role"
            >
              <LogOut className="w-4 h-4 text-rose-600" />
            </button>
          )}
        </div>
      </div>

      {/* Active Mission Card */}
      {activeMission && (
        <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 mb-6 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
            <span className="text-xs font-extrabold text-[#0095F6] uppercase tracking-wider bg-white px-2.5 py-1 rounded-full border border-blue-200">
              ACTIVE MISSION ({activeMission.id})
            </span>
            <span className="text-xs font-bold text-white bg-[#0095F6] px-3 py-1 rounded-full shadow-sm">
              Status: {activeMission.status}
            </span>
          </div>

          <h3 className="font-extrabold text-[#000000] text-lg">{activeMission.title}</h3>
          <p className="text-xs text-[#737373] font-semibold flex items-center gap-1 mt-1">
            <MapPin className="w-4 h-4 text-rose-500" /> {activeMission.address}
          </p>

          <div className="mt-4 pt-3 border-t border-blue-200 flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleOpenNavigation(activeMission.lat, activeMission.lon, activeMission.address)}
              className="flex-1 py-2.5 bg-[#0095F6] hover:bg-[#0084FF] text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              <span>Open Turn-by-Turn GPS Navigation</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleAdvanceMission}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm transition"
            >
              {activeMission.status === "ON_THE_WAY" && "Mark Reached Location"}
              {activeMission.status === "REACHED" && "Mark Help Completed"}
              {activeMission.status === "HELP_COMPLETED" && "Resolve Mission"}
            </button>
          </div>
        </div>
      )}

      {/* Emergency Requests Feed */}
      <div className="bg-white border border-[#EFEFEF] rounded-2xl p-5 shadow-sm">
        <h3 className="font-extrabold text-[#000000] text-base mb-3">CRITICAL NEARBY EMERGENCY DISPATCH FEED</h3>

        <div className="space-y-4">
          {nearbyRequests.map(req => {
            const isAccepted = activeMission?.id === req.id;

            return (
              <div key={req.id} className="bg-[#FAFAFA] border border-[#EFEFEF] rounded-xl p-4 hover:border-[#0095F6]/40 transition">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md border ${
                      req.priority === "CRITICAL" ? "bg-rose-50 text-rose-600 border-rose-200 font-extrabold" : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}>
                      🔴 {req.priority} • {req.disaster_type}
                    </span>
                    {req.medical && (
                      <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-md border border-rose-200">
                        🏥 Medical Assistance
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-extrabold text-[#0095F6] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    Match Score: {req.match_score}
                  </span>
                </div>

                <h4 className="font-bold text-[#000000] text-sm mt-1">{req.people} People Trapped • {req.distance}</h4>
                <p className="text-xs text-[#737373] font-medium mt-0.5">{req.address}</p>

                <div className="mt-4 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenNavigation(req.lat, req.lon, req.address)}
                    className="px-3 py-2 bg-white hover:bg-gray-100 text-[#000000] border border-[#DBDBDB] rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm"
                  >
                    <Navigation className="w-3.5 h-3.5 text-[#0095F6]" />
                    <span>Navigate</span>
                  </button>

                  <button
                    disabled={isAccepted}
                    onClick={() => handleAcceptMission(req)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                      isAccepted
                        ? "bg-emerald-600 text-white cursor-default"
                        : "bg-[#0095F6] hover:bg-[#0084FF] text-white"
                    }`}
                  >
                    {isAccepted ? "Mission Accepted" : "Accept Emergency Request"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
