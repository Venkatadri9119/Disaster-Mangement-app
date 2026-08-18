"use client";

import React, { useState } from "react";
import { Search, CheckCircle } from "lucide-react";

interface RequestItem {
  id: string;
  citizen_name: string;
  citizen_phone: string;
  disaster_type: string;
  people_count: number;
  medical_need: boolean;
  evacuation_required: boolean;
  priority: "CRITICAL" | "HIGH" | "NORMAL";
  status: string;
  address_text: string;
  flagged_fraud?: boolean;
  created_at: string;
}

interface Props {
  requests: RequestItem[];
  onOverridePriority: (id: string, newPriority: string) => void;
  onAssignVolunteer: (id: string) => void;
  onResolveRequest: (id: string) => void;
}

export function RequestTable({ requests, onOverridePriority, onAssignVolunteer, onResolveRequest }: Props) {
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null);

  const filtered = requests.filter(r => {
    const matchesSearch = r.citizen_name.toLowerCase().includes(search.toLowerCase()) || r.disaster_type.toLowerCase().includes(search.toLowerCase()) || r.address_text.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = priorityFilter === "ALL" || r.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="bg-white rounded-2xl border border-[#EFEFEF] p-4 mb-6 shadow-sm">
      {/* Table Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="font-extrabold text-[#000000] text-base">EMERGENCY DISPATCH & TRIAGE TABLE</h3>
          <p className="text-xs text-[#737373]">Review priority extractions, override triage, or assign rescue units</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#737373] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search emergency or location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-[#FAFAFA] border border-[#DBDBDB] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#000000] placeholder-[#737373] focus:outline-none focus:border-[#0095F6] w-60"
            />
          </div>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="bg-[#FAFAFA] border border-[#DBDBDB] rounded-xl px-3 py-1.5 text-xs text-[#000000] focus:outline-none focus:border-[#0095F6]"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">🔴 CRITICAL</option>
            <option value="HIGH">🟠 HIGH</option>
            <option value="NORMAL">🟢 NORMAL</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-[#262626]">
          <thead className="bg-[#FAFAFA] text-[#737373] uppercase font-bold border-b border-[#EFEFEF]">
            <tr>
              <th className="p-3">Priority</th>
              <th className="p-3">Citizen & Phone</th>
              <th className="p-3">Disaster Type</th>
              <th className="p-3">People Affected</th>
              <th className="p-3">Medical / Evac</th>
              <th className="p-3">Location & Address</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFEFEF]">
            {filtered.map(req => {
              let badgeColor = "bg-emerald-50 text-emerald-600 border-emerald-200";
              if (req.priority === "CRITICAL") badgeColor = "bg-rose-50 text-rose-600 border-rose-200 font-extrabold animate-pulse";
              else if (req.priority === "HIGH") badgeColor = "bg-amber-50 text-amber-700 border-amber-200 font-extrabold";

              return (
                <tr key={req.id} className="hover:bg-[#FAFAFA] transition">
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-md font-bold border ${badgeColor}`}>
                      {req.priority === "CRITICAL" && "🔴 "}
                      {req.priority === "HIGH" && "🟠 "}
                      {req.priority === "NORMAL" && "🟢 "}
                      {req.priority}
                    </span>
                  </td>
                  <td className="p-3">
                    <p className="font-bold text-[#000000]">{req.citizen_name}</p>
                    <p className="text-[11px] text-[#737373]">{req.citizen_phone}</p>
                  </td>
                  <td className="p-3 capitalize font-semibold text-[#000000]">{req.disaster_type}</td>
                  <td className="p-3 font-bold text-[#000000]">{req.people_count} people</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      {req.medical_need && <span className="bg-rose-50 text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded border border-rose-200">🏥 Medical</span>}
                      {req.evacuation_required && <span className="bg-blue-50 text-[#0095F6] text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200">⛵ Evac</span>}
                    </div>
                  </td>
                  <td className="p-3 max-w-xs truncate text-[#737373] font-medium">{req.address_text}</td>
                  <td className="p-3">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#FAFAFA] text-[#000000] border border-[#DBDBDB]">
                      {req.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onAssignVolunteer(req.id)}
                        className="px-3 py-1 bg-[#0095F6] hover:bg-[#0084FF] text-white rounded-lg text-[11px] font-bold transition shadow-sm"
                      >
                        Assign Unit
                      </button>

                      <button
                        onClick={() => setSelectedRequest(req)}
                        className="px-2.5 py-1 bg-[#FAFAFA] hover:bg-[#F4F4F4] text-[#000000] border border-[#DBDBDB] rounded-lg text-[11px] font-bold transition"
                      >
                        Override
                      </button>

                      <button
                        onClick={() => onResolveRequest(req.id)}
                        className="p-1 text-emerald-600 hover:text-emerald-500 transition"
                        title="Mark Resolved"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Priority Override Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-[#EFEFEF] rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="font-extrabold text-[#000000] text-base">ADMIN PRIORITY OVERRIDE</h3>
            <p className="text-xs text-[#737373] mt-1">
              Request ID: <span className="font-mono text-[#000000] font-bold">{selectedRequest.id.substring(0, 8)}</span>
            </p>
            <div className="my-4 space-y-2">
              <p className="text-xs text-[#000000] font-bold">Select New Priority Level:</p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    onOverridePriority(selectedRequest.id, "CRITICAL");
                    setSelectedRequest(null);
                  }}
                  className="py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-300 rounded-xl font-bold text-xs"
                >
                  🔴 CRITICAL
                </button>
                <button
                  onClick={() => {
                    onOverridePriority(selectedRequest.id, "HIGH");
                    setSelectedRequest(null);
                  }}
                  className="py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-300 rounded-xl font-bold text-xs"
                >
                  🟠 HIGH
                </button>
                <button
                  onClick={() => {
                    onOverridePriority(selectedRequest.id, "NORMAL");
                    setSelectedRequest(null);
                  }}
                  className="py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-300 rounded-xl font-bold text-xs"
                >
                  🟢 NORMAL
                </button>
              </div>
            </div>
            <button
              onClick={() => setSelectedRequest(null)}
              className="w-full py-2.5 bg-[#FAFAFA] text-[#000000] border border-[#DBDBDB] rounded-xl text-xs font-bold hover:bg-[#F4F4F4] transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
