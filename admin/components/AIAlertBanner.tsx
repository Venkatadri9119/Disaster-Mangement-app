"use client";

import React from "react";
import { Cpu, ArrowRight, Zap } from "lucide-react";

interface AIAlert {
  title: string;
  summary: string;
  recommended_action: string;
}

export function AIAlertBanner({ alert, onViewCritical }: { alert: AIAlert; onViewCritical: () => void }) {
  return (
    <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 rounded-2xl p-5 mb-6 text-white shadow-lg relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="p-3 bg-white/20 text-white rounded-xl backdrop-blur-md shrink-0">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded text-white backdrop-blur-md">
                AUTOMATED AI AGENT ALERT
              </span>
              <span className="text-xs text-white/80 font-medium">Confidence: 96.4%</span>
            </div>
            <h3 className="font-extrabold text-white text-base mt-1">{alert.title}</h3>
            <p className="text-xs text-white/90 mt-0.5">{alert.summary}</p>
            <p className="text-xs text-amber-100 font-bold mt-1.5 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-200" /> Recommendation: {alert.recommended_action}
            </p>
          </div>
        </div>

        <button
          onClick={onViewCritical}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-rose-600 font-bold text-xs shadow-md hover:bg-rose-50 transition shrink-0 self-end md:self-auto"
        >
          <span>View Critical Requests</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
