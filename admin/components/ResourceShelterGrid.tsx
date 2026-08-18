"use client";

import React from "react";
import { Home, Package, Phone } from "lucide-react";

export function ResourceShelterGrid() {
  const shelters = [
    { name: "Vijayawada Central Relief Shelter", capacity: 500, occupancy: 120, phone: "+918662450001", facilities: ["Food", "Water", "Medical Bay", "Power Generator"] },
    { name: "Auto Nagar Emergency Safe Shelter", capacity: 300, occupancy: 45, phone: "+918662450002", facilities: ["Food", "Sleeping Mats", "First Aid"] },
    { name: "Kanaka Durga Shelter Center", capacity: 400, occupancy: 210, phone: "+918662450003", facilities: ["Food", "Clean Water", "Infant Care"] }
  ];

  const resources = [
    { type: "Food Kits", quantity: "2,450", unit: "kits", status: "AVAILABLE" },
    { type: "Clean Drinking Water", quantity: "14,200", unit: "liters", status: "AVAILABLE" },
    { type: "Medical First Aid Boxes", quantity: "380", unit: "boxes", status: "LOW" },
    { type: "Inflatable Rescue Boats", quantity: "24", unit: "units", status: "AVAILABLE" },
    { type: "Diesel Power Generators", quantity: "18", unit: "units", status: "AVAILABLE" }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Shelters Grid */}
      <div className="bg-white rounded-2xl border border-[#EFEFEF] p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl border border-purple-200">
              <Home className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-[#000000] text-sm">SAFE SHELTER CAPACITY TRACKER</h3>
          </div>
          <span className="text-xs text-purple-700 font-bold bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
            3 Active Shelters
          </span>
        </div>

        <div className="space-y-3">
          {shelters.map((s, idx) => {
            const pct = Math.round((s.occupancy / s.capacity) * 100);
            return (
              <div key={idx} className="bg-[#FAFAFA] border border-[#EFEFEF] rounded-xl p-3.5">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-[#000000] text-xs">{s.name}</h4>
                    <p className="text-[11px] text-[#737373] flex items-center gap-1 mt-0.5 font-medium">
                      <Phone className="w-3 h-3 text-purple-600" /> {s.phone}
                    </p>
                  </div>
                  <span className="text-xs font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                    {pct}% Occupied
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden my-2.5">
                  <div className="bg-purple-600 h-full rounded-full" style={{ width: `${pct}%` }} />
                </div>

                <div className="flex justify-between items-center text-[10px] text-[#737373]">
                  <span>Available Beds: <strong className="text-[#000000]">{s.capacity - s.occupancy}</strong></span>
                  <div className="flex gap-1">
                    {s.facilities.map((f, fi) => (
                      <span key={fi} className="bg-white text-gray-700 px-2 py-0.5 rounded border border-gray-200 font-medium">{f}</span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resource Supplies Grid */}
      <div className="bg-white rounded-2xl border border-[#EFEFEF] p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl border border-amber-200">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-[#000000] text-sm">EMERGENCY RESOURCE INVENTORY</h3>
          </div>
          <span className="text-xs text-amber-700 font-bold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            Stock Operational
          </span>
        </div>

        <div className="space-y-2.5">
          {resources.map((r, idx) => (
            <div key={idx} className="bg-[#FAFAFA] border border-[#EFEFEF] rounded-xl p-3 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-[#000000] text-xs">{r.type}</h4>
                <p className="text-[11px] text-[#737373] font-medium">Available: <span className="font-bold text-[#000000]">{r.quantity} {r.unit}</span></p>
              </div>
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                r.status === "AVAILABLE" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
              }`}>
                {r.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
