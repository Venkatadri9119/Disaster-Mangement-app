"use client";

import React from "react";
import { AlertCircle, ShieldAlert, Users, Home, Clock } from "lucide-react";

interface MetricsData {
  total_emergencies: number;
  critical_emergencies: number;
  high_emergencies: number;
  normal_emergencies: number;
  resolved_emergencies: number;
  active_volunteers: number;
  shelter_total_capacity: number;
  shelter_current_occupancy: number;
  shelter_occupancy_rate: number;
  avg_response_time_minutes: number;
}

export function MetricsOverview({ metrics }: { metrics: MetricsData }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {/* 1. Total Emergencies */}
      <div className="bg-white rounded-2xl p-4 border border-[#EFEFEF] shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-bold text-[#737373] uppercase tracking-wider">Total Requests</p>
            <h4 className="text-2xl font-extrabold text-[#000000] mt-1">{metrics.total_emergencies}</h4>
          </div>
          <div className="p-2.5 rounded-xl bg-gray-100 text-gray-700">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-[11px] text-emerald-600 font-bold">
          <span>{metrics.resolved_emergencies} resolved</span>
          <span className="text-gray-300">•</span>
          <span className="text-[#737373]">100% real-time</span>
        </div>
      </div>

      {/* 2. Critical Emergencies */}
      <div className="bg-rose-50/60 rounded-2xl p-4 border border-rose-200 shadow-sm relative overflow-hidden pulse-critical">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-extrabold text-rose-600 uppercase tracking-wider">🔴 Critical Priority</p>
            <h4 className="text-2xl font-extrabold text-rose-700 mt-1">{metrics.critical_emergencies}</h4>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 border border-rose-200">
            <ShieldAlert className="w-5 h-5 animate-bounce" />
          </div>
        </div>
        <div className="mt-3 text-[11px] text-rose-600 font-bold">
          Requires immediate boat/medical dispatch
        </div>
      </div>

      {/* 3. Active Volunteers */}
      <div className="bg-white rounded-2xl p-4 border border-[#EFEFEF] shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-bold text-[#737373] uppercase tracking-wider">Active Volunteers</p>
            <h4 className="text-2xl font-extrabold text-[#0095F6] mt-1">{metrics.active_volunteers}</h4>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-50 text-[#0095F6]">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 text-[11px] text-[#0095F6] font-bold">
          Ready in high-risk disaster sectors
        </div>
      </div>

      {/* 4. Shelter Occupancy */}
      <div className="bg-white rounded-2xl p-4 border border-[#EFEFEF] shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-bold text-[#737373] uppercase tracking-wider">Shelter Occupancy</p>
            <h4 className="text-2xl font-extrabold text-purple-600 mt-1">
              {metrics.shelter_occupancy_rate}%
            </h4>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
            <Home className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 text-[11px] text-[#737373] font-semibold">
          {metrics.shelter_current_occupancy} / {metrics.shelter_total_capacity} beds filled
        </div>
      </div>

      {/* 5. Response Time */}
      <div className="bg-white rounded-2xl p-4 border border-[#EFEFEF] shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-bold text-[#737373] uppercase tracking-wider">Avg Response Time</p>
            <h4 className="text-2xl font-extrabold text-amber-600 mt-1">
              {metrics.avg_response_time_minutes}m
            </h4>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 text-[11px] text-emerald-600 font-bold">
          ⚡ 68% faster than manual call centers
        </div>
      </div>
    </div>
  );
}
