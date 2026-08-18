"use client";

import React, { useState } from "react";
import { Navigation } from "lucide-react";

interface MapMarker {
  id: string;
  type: "EMERGENCY" | "HELPER" | "SHELTER" | "FOOD" | "HOSPITAL" | "RESOURCE";
  title: string;
  lat: number;
  lon: number;
  subtitle: string;
}

const SAMPLE_MARKERS: MapMarker[] = [
  { id: "1", type: "EMERGENCY", title: "Flood (5 People Trapped)", lat: 16.5085, lon: 80.6420, subtitle: "Krishna Riverbank Colony (Mother injured)" },
  { id: "2", type: "EMERGENCY", title: "Building Collapse", lat: 16.5160, lon: 80.6360, subtitle: "3 citizens under wall debris" },
  { id: "3", type: "HELPER", title: "Helper Ravi (Boat Specialist)", lat: 16.5062, lon: 80.6480, subtitle: "Boat Rescue • 1.2km away" },
  { id: "4", type: "HELPER", title: "Helper Priya (First Aid)", lat: 16.5120, lon: 80.6320, subtitle: "Medical Responder • Available" },
  { id: "5", type: "SHELTER", title: "Vijayawada Central Shelter", lat: 16.5030, lon: 80.6400, subtitle: "380 Available Beds • ✓ Verified" },
  { id: "6", type: "FOOD", title: "Central Food Ration Depot", lat: 16.5100, lon: 80.6550, subtitle: "2,450 Meal Packets • ✓ Verified" },
  { id: "7", type: "HOSPITAL", title: "General Hospital Trauma Bay", lat: 16.4980, lon: 80.6380, subtitle: "45 Beds • ICU Active • ✓ Verified" },
  { id: "8", type: "RESOURCE", title: "Supply Equipment Depot", lat: 16.5180, lon: 80.6620, subtitle: "24 Rescue Boats • 18 Generators" }
];

export function LiveMap({ markers = SAMPLE_MARKERS }: { markers?: MapMarker[] }) {
  const [filter, setFilter] = useState<string>("ALL");
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(markers[0] || null);

  const filtered = markers.filter(m => {
    if (filter === "ALL") return true;
    return m.type === filter;
  });

  return (
    <div className="bg-white rounded-2xl border border-[#EFEFEF] p-4 mb-6 shadow-xs relative flex flex-col h-[540px] font-sans">
      {/* Header & 1-2 Word Simple Filter Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
          <h3 className="font-extrabold text-[#000000] text-sm">LIVE MAP (MODULE 12)</h3>
        </div>

        {/* Simple 1-2 Word Layer Filters (Requirement 11 & 12) */}
        <div className="flex items-center gap-1 bg-[#FAFAFA] p-1 rounded-xl border border-[#EFEFEF] text-xs overflow-x-auto">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-2.5 py-1 rounded-lg font-bold transition ${filter === "ALL" ? "bg-[#0095F6] text-white shadow-xs" : "text-[#737373] hover:text-[#000000]"}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("EMERGENCY")}
            className={`px-2.5 py-1 rounded-lg font-bold transition ${filter === "EMERGENCY" ? "bg-rose-600 text-white shadow-xs" : "text-rose-600 hover:bg-rose-50"}`}
          >
            🔴 Emergency
          </button>
          <button
            onClick={() => setFilter("HELPER")}
            className={`px-2.5 py-1 rounded-lg font-bold transition ${filter === "HELPER" ? "bg-emerald-600 text-white shadow-xs" : "text-emerald-600 hover:bg-emerald-50"}`}
          >
            🟢 Helper
          </button>
          <button
            onClick={() => setFilter("SHELTER")}
            className={`px-2.5 py-1 rounded-lg font-bold transition ${filter === "SHELTER" ? "bg-purple-600 text-white shadow-xs" : "text-purple-600 hover:bg-purple-50"}`}
          >
            🏠 Shelter
          </button>
          <button
            onClick={() => setFilter("FOOD")}
            className={`px-2.5 py-1 rounded-lg font-bold transition ${filter === "FOOD" ? "bg-amber-600 text-white shadow-xs" : "text-amber-600 hover:bg-amber-50"}`}
          >
            🍚 Food
          </button>
          <button
            onClick={() => setFilter("HOSPITAL")}
            className={`px-2.5 py-1 rounded-lg font-bold transition ${filter === "HOSPITAL" ? "bg-blue-600 text-white shadow-xs" : "text-blue-600 hover:bg-blue-50"}`}
          >
            🏥 Hospital
          </button>
          <button
            onClick={() => setFilter("RESOURCE")}
            className={`px-2.5 py-1 rounded-lg font-bold transition ${filter === "RESOURCE" ? "bg-indigo-600 text-white shadow-xs" : "text-indigo-600 hover:bg-indigo-50"}`}
          >
            📦 Resource
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 bg-slate-900 rounded-xl border border-slate-800 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />

        {/* Interactive Markers */}
        <div className="relative w-full h-full p-8 flex flex-wrap items-center justify-around">
          {filtered.map((marker) => {
            const isSelected = selectedMarker?.id === marker.id;
            let icon = "🔴";
            let bgColor = "bg-rose-500 shadow-lg shadow-rose-600/50";

            if (marker.type === "HELPER") {
              icon = "🟢";
              bgColor = "bg-emerald-500 shadow-lg shadow-emerald-600/50";
            } else if (marker.type === "SHELTER") {
              icon = "🏠";
              bgColor = "bg-purple-500 shadow-lg shadow-purple-600/50";
            } else if (marker.type === "FOOD") {
              icon = "🍚";
              bgColor = "bg-amber-500 shadow-lg shadow-amber-600/50";
            } else if (marker.type === "HOSPITAL") {
              icon = "🏥";
              bgColor = "bg-blue-500 shadow-lg shadow-blue-600/50";
            } else if (marker.type === "RESOURCE") {
              icon = "📦";
              bgColor = "bg-indigo-500 shadow-lg shadow-indigo-600/50";
            }

            return (
              <button
                key={marker.id}
                onClick={() => setSelectedMarker(marker)}
                className={`relative group transform hover:scale-125 transition duration-200 m-3 ${isSelected ? "scale-125 z-30" : "z-10"}`}
              >
                <div className={`w-8 h-8 rounded-full ${bgColor} border-2 border-white flex items-center justify-center text-white font-bold text-xs shadow-md`}>
                  {icon}
                </div>

                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 hidden group-hover:block bg-white border border-[#EFEFEF] p-2.5 rounded-xl text-left shadow-2xl z-40">
                  <p className="text-[11px] font-bold text-[#000000]">{marker.title}</p>
                  <p className="text-[10px] text-[#737373]">{marker.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Marker Card */}
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
              <button
                onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedMarker.lat},${selectedMarker.lon}&travelmode=driving`, "_blank")}
                className="w-full py-2 bg-[#0095F6] hover:bg-[#0084FF] text-white rounded-xl text-[11px] font-bold shadow-xs transition flex items-center justify-center gap-1"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Directions</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
