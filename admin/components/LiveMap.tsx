"use client";

import React, { useState } from "react";
import { Navigation } from "lucide-react";

interface MapMarker {
  id: string;
  type: "CRITICAL" | "HIGH" | "NORMAL" | "VOLUNTEER" | "SHELTER" | "RESOURCE";
  title: string;
  lat: number;
  lon: number;
  subtitle: string;
}

const SAMPLE_MARKERS: MapMarker[] = [
  { id: "1", type: "CRITICAL", title: "5 Trapped - Flood Inundation", lat: 16.5085, lon: 80.6420, subtitle: "Krishna Riverbank Colony (Mother needs medical)" },
  { id: "2", type: "CRITICAL", title: "Building Collapse Debris", lat: 16.5160, lon: 80.6360, subtitle: "3 citizens trapped under wall debris" },
  { id: "3", type: "HIGH", title: "Cyclone Wind Roof Damage", lat: 16.4960, lon: 80.6510, subtitle: "Tarpaulin supplies requested" },
  { id: "4", type: "VOLUNTEER", title: "Rescue Team Ravi", lat: 16.5062, lon: 80.6480, subtitle: "Boat Rescue Specialist • 1.2km away" },
  { id: "5", type: "VOLUNTEER", title: "Medical Response Unit Priya", lat: 16.5120, lon: 80.6320, subtitle: "First Aid Certified • Available" },
  { id: "6", type: "SHELTER", title: "Vijayawada Central Relief Center", lat: 16.5030, lon: 80.6400, subtitle: "120/500 Occupancy • Medical Bay Active" },
  { id: "7", type: "RESOURCE", title: "Auto Nagar Supply Depot", lat: 16.5180, lon: 80.6620, subtitle: "250 Food Kits • 1,200L Clean Water" }
];

export function LiveMap({ markers = SAMPLE_MARKERS }: { markers?: MapMarker[] }) {
  const [filter, setFilter] = useState<string>("ALL");
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(markers[0] || null);

  const filtered = markers.filter(m => {
    if (filter === "ALL") return true;
    if (filter === "CRITICAL") return m.type === "CRITICAL";
    if (filter === "VOLUNTEERS") return m.type === "VOLUNTEER";
    if (filter === "SHELTERS") return m.type === "SHELTER";
    return true;
  });

  return (
    <div className="bg-white rounded-2xl border border-[#EFEFEF] p-4 mb-6 shadow-sm relative flex flex-col h-[520px]">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
          <h3 className="font-extrabold text-[#000000] text-sm">LIVE EMERGENCY GEOSPATIAL MAP</h3>
          <span className="text-xs text-[#737373] font-semibold">Vijayawada Disaster Sector</span>
        </div>

        {/* Filter Toggles */}
        <div className="flex items-center gap-1 bg-[#FAFAFA] p-1 rounded-xl border border-[#EFEFEF] text-xs">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1 rounded-lg font-bold transition ${filter === "ALL" ? "bg-[#0095F6] text-white shadow-sm" : "text-[#737373] hover:text-[#000000]"}`}
          >
            All Layers ({markers.length})
          </button>
          <button
            onClick={() => setFilter("CRITICAL")}
            className={`px-3 py-1 rounded-lg font-bold transition ${filter === "CRITICAL" ? "bg-rose-600 text-white shadow-sm" : "text-rose-600 hover:bg-rose-50"}`}
          >
            🔴 Critical
          </button>
          <button
            onClick={() => setFilter("VOLUNTEERS")}
            className={`px-3 py-1 rounded-lg font-bold transition ${filter === "VOLUNTEERS" ? "bg-blue-600 text-white shadow-sm" : "text-blue-600 hover:bg-blue-50"}`}
          >
            🔵 Rescue Units
          </button>
          <button
            onClick={() => setFilter("SHELTERS")}
            className={`px-3 py-1 rounded-lg font-bold transition ${filter === "SHELTERS" ? "bg-purple-600 text-white shadow-sm" : "text-purple-600 hover:bg-purple-50"}`}
          >
            🏠 Shelters
          </button>
        </div>
      </div>

      {/* Map Canvas Container */}
      <div className="flex-1 bg-slate-900 rounded-xl border border-slate-800 relative overflow-hidden flex items-center justify-center">
        {/* Dark Grid Background simulating Map Canvas */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />

        {/* Spatial Hotspot Wave Animation */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-rose-600/10 border border-rose-500/30 animate-pulse flex items-center justify-center">
          <span className="text-[10px] text-rose-300 font-extrabold bg-slate-950/90 px-2.5 py-0.5 rounded-full border border-rose-500/40">
            FLOOD RISK CLUSTER (1.5km)
          </span>
        </div>

        {/* Map Markers Placement */}
        <div className="relative w-full h-full p-8 flex flex-wrap items-center justify-around">
          {filtered.map((marker) => {
            const isSelected = selectedMarker?.id === marker.id;
            let bgColor = "bg-emerald-500";
            let borderColor = "border-emerald-400";

            if (marker.type === "CRITICAL") {
              bgColor = "bg-rose-500 shadow-lg shadow-rose-600/50";
              borderColor = "border-rose-400";
            } else if (marker.type === "HIGH") {
              bgColor = "bg-amber-500";
              borderColor = "border-amber-400";
            } else if (marker.type === "VOLUNTEER") {
              bgColor = "bg-[#0095F6] shadow-lg shadow-blue-600/50";
              borderColor = "border-blue-400";
            } else if (marker.type === "SHELTER") {
              bgColor = "bg-purple-500 shadow-lg shadow-purple-600/50";
              borderColor = "border-purple-400";
            }

            return (
              <button
                key={marker.id}
                onClick={() => setSelectedMarker(marker)}
                className={`relative group transform hover:scale-125 transition duration-200 m-4 ${isSelected ? "scale-125 z-30" : "z-10"}`}
              >
                <div className={`w-8 h-8 rounded-full ${bgColor} border-2 ${borderColor} flex items-center justify-center text-white font-bold text-xs shadow-md`}>
                  {marker.type === "CRITICAL" && "🔴"}
                  {marker.type === "HIGH" && "🟠"}
                  {marker.type === "NORMAL" && "🟢"}
                  {marker.type === "VOLUNTEER" && "⛵"}
                  {marker.type === "SHELTER" && "🏠"}
                  {marker.type === "RESOURCE" && "📦"}
                </div>

                {/* Marker Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 hidden group-hover:block bg-white border border-[#EFEFEF] p-2.5 rounded-xl text-left shadow-2xl z-40">
                  <p className="text-[11px] font-bold text-[#000000]">{marker.title}</p>
                  <p className="text-[10px] text-[#737373]">{marker.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Marker Detail Card */}
        {selectedMarker && (
          <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-80 bg-white/95 backdrop-blur border border-[#EFEFEF] rounded-2xl p-4 shadow-2xl z-40">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0095F6] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {selectedMarker.type}
                </span>
                <h4 className="font-bold text-[#000000] text-xs mt-1.5">{selectedMarker.title}</h4>
                <p className="text-[11px] text-[#737373]">{selectedMarker.subtitle}</p>
              </div>
              <button
                onClick={() => setSelectedMarker(null)}
                className="text-[#737373] hover:text-[#000000] text-xs font-bold px-2 py-0.5 bg-[#FAFAFA] rounded-lg border border-[#EFEFEF]"
              >
                ✕
              </button>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <button className="flex-1 py-2 bg-[#0095F6] hover:bg-[#0084FF] text-white rounded-xl text-[11px] font-bold shadow-sm transition">
                Dispatch Volunteer
              </button>
              <button
                onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedMarker.lat},${selectedMarker.lon}&travelmode=driving`, "_blank")}
                className="py-2 px-3 bg-[#FAFAFA] hover:bg-[#F4F4F4] text-[#000000] border border-[#DBDBDB] rounded-xl text-[11px] font-bold transition flex items-center gap-1"
              >
                <Navigation className="w-3.5 h-3.5 text-[#0095F6]" />
                <span>Directions</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
