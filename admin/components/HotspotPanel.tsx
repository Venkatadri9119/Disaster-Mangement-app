"use client";

import React from "react";
import { Flame, MapPin } from "lucide-react";

interface Hotspot {
  id: string;
  disaster_type: string;
  latitude: number;
  longitude: number;
  request_count: number;
  critical_count: number;
  ai_summary: string;
}

export function HotspotPanel({ hotspots }: { hotspots: Hotspot[] }) {
  return (
    <div className="bg-white rounded-2xl border border-[#EFEFEF] p-4 mb-6 shadow-sm">
      <div className="flex items-center space-x-2 mb-3">
        <div className="p-2 bg-amber-50 text-amber-600 rounded-xl border border-amber-200">
          <Flame className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h3 className="font-extrabold text-[#000000] text-sm">EMERGENCY CLUSTER HOTSPOTS</h3>
          <p className="text-xs text-[#737373]">Automated area risk analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hotspots.map(spot => (
          <div key={spot.id} className="bg-[#FAFAFA] border border-[#EFEFEF] rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase bg-rose-50 text-rose-600 px-2 py-0.5 rounded border border-rose-200">
                  {spot.disaster_type} Cluster
                </span>
                <span className="text-xs font-mono text-[#737373] flex items-center gap-1 font-semibold">
                  <MapPin className="w-3 h-3 text-rose-500" /> {spot.latitude.toFixed(3)}°, {spot.longitude.toFixed(3)}°
                </span>
              </div>
              <p className="text-xs font-bold text-[#000000] mt-2 leading-relaxed">{spot.ai_summary}</p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-[#EFEFEF] flex items-center justify-between text-xs">
              <span className="text-[#737373] font-medium">Total Requests: <strong className="text-[#000000]">{spot.request_count}</strong></span>
              <span className="text-rose-600 font-extrabold">Critical: {spot.critical_count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
