"use client";

import React, { useState, useEffect } from "react";
import { RoleType } from "@/components/RoleSelectorBar";
import { LandingLoginPage } from "@/components/LandingLoginPage";
import { UserPortal } from "@/components/UserPortal";
import { CoordinatorPortal } from "@/components/CoordinatorPortal";
import { AdminPortal } from "@/components/AdminPortal";
import { Navbar } from "@/components/Navbar";
import { MetricsOverview } from "@/components/MetricsOverview";
import { AIAlertBanner } from "@/components/AIAlertBanner";
import { LiveMap } from "@/components/LiveMap";
import { RequestTable } from "@/components/RequestTable";
import { HotspotPanel } from "@/components/HotspotPanel";
import { ResourceShelterGrid } from "@/components/ResourceShelterGrid";
import { LogOut, UserCheck } from "lucide-react";

export default function AppMainPage() {
  const [currentUser, setCurrentUser] = useState<{
    user_id: string;
    name: string;
    role: RoleType;
    token: string;
    phone: string;
    preferred_language: string;
  } | null>(null);

  const [metrics, setMetrics] = useState({
    total_emergencies: 18,
    critical_emergencies: 6,
    high_emergencies: 8,
    normal_emergencies: 4,
    resolved_emergencies: 12,
    active_volunteers: 10,
    shelter_total_capacity: 1200,
    shelter_current_occupancy: 375,
    shelter_occupancy_rate: 31.2,
    avg_response_time_minutes: 8.4
  });

  const [aiAlert, setAiAlert] = useState({
    title: "AI Detected 6 Critical Emergency Requests in Flood Sector",
    summary: "High density of trapped citizens near Krishna Riverbank. 4 mother & infant medical requests require immediate boat dispatch.",
    recommended_action: "Dispatch Helper Ravi (1.2km) and Boat Unit 4 to Krishna Riverbank Colony."
  });

  const [requests, setRequests] = useState([
    {
      id: "REQ-101",
      citizen_name: "Venkat Rao",
      citizen_phone: "+919123456789",
      disaster_type: "flood",
      people_count: 5,
      medical_need: true,
      evacuation_required: true,
      priority: "CRITICAL" as const,
      status: "Assigned",
      address_text: "House #12, Krishna Riverbank Colony, Vijayawada",
      created_at: new Date().toISOString()
    },
    {
      id: "REQ-102",
      citizen_name: "Anitha Chary",
      citizen_phone: "+919123456788",
      disaster_type: "building_collapse",
      people_count: 3,
      medical_need: true,
      evacuation_required: true,
      priority: "CRITICAL" as const,
      status: "New",
      address_text: "Plot 45, Near Old Bus Stand, Vijayawada",
      created_at: new Date().toISOString()
    },
    {
      id: "REQ-103",
      citizen_name: "Srinivas Raju",
      citizen_phone: "+919123456787",
      disaster_type: "cyclone",
      people_count: 2,
      medical_need: false,
      evacuation_required: false,
      priority: "NORMAL" as const,
      status: "Assigned",
      address_text: "Sector 4, Auto Nagar",
      created_at: new Date().toISOString()
    }
  ]);

  const [hotspots] = useState([
    {
      id: "hotspot-1",
      disaster_type: "flood",
      latitude: 16.5090,
      longitude: 80.6400,
      request_count: 12,
      critical_count: 8,
      ai_summary: "High priority flood cluster near Krishna Riverbank. Heavy inundation affecting 150+ households."
    }
  ]);

  // Connect to FastAPI Backend Admin Dashboard endpoint on load
  useEffect(() => {
    if (currentUser?.role === "ADMIN") {
      const fetchAdminStats = async () => {
        try {
          const res = await fetch("http://localhost:8000/api/v1/admin/dashboard");
          if (res.ok) {
            const data = await res.json();
            if (data.metrics) setMetrics(data.metrics);
            if (data.ai_alert) setAiAlert(data.ai_alert);
          }
        } catch (e) {
          console.log("Admin stats API fallback:", e);
        }
      };
      fetchAdminStats();
    }
  }, [currentUser]);

  const handleOverridePriority = (id: string, newPriority: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, priority: newPriority as any } : r));
  };

  const handleAssignVolunteer = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "Assigned" } : r));
  };

  const handleResolveRequest = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "Done" } : r));
    setMetrics(prev => ({
      ...prev,
      critical_emergencies: Math.max(0, prev.critical_emergencies - 1),
      resolved_emergencies: prev.resolved_emergencies + 1
    }));
  };

  // 1. Starts on Landing Login Page
  if (!currentUser) {
    return <LandingLoginPage onLoginSuccess={user => setCurrentUser(user)} />;
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-12 font-sans">
      {/* Top Session Bar */}
      <div className="bg-[#FAFAFA] border-b border-[#EFEFEF] px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <UserCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-[#737373] font-medium">Logged in: <strong className="text-[#000000]">{currentUser.name}</strong></span>
          <span className="bg-emerald-50 text-emerald-700 font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200">
            {currentUser.role} ROLE
          </span>
        </div>
        <button
          onClick={() => setCurrentUser(null)}
          className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-bold px-2.5 py-1 bg-white rounded-xl border border-[#DBDBDB] transition shadow-xs"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Switch Role / Logout</span>
        </button>
      </div>

      {/* Role 1: User View (Get Help & Help Others) */}
      {currentUser.role === "USER" && (
        <UserPortal userSession={currentUser} onLogout={() => setCurrentUser(null)} />
      )}

      {/* Role 2: Coordinator View (Shelters, Food, Resources, Hospitals, People) */}
      {currentUser.role === "COORDINATOR" && (
        <CoordinatorPortal userSession={currentUser} onLogout={() => setCurrentUser(null)} />
      )}

      {/* Role 3: Admin View (Verification, Users, Coordinators, Analytics, Control) */}
      {currentUser.role === "ADMIN" && (
        <>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
            <AdminPortal userSession={currentUser} onLogout={() => setCurrentUser(null)} />
            <MetricsOverview metrics={metrics} />
            <AIAlertBanner alert={aiAlert} onViewCritical={() => {}} />
            <LiveMap />
            <RequestTable
              requests={requests}
              onOverridePriority={handleOverridePriority}
              onAssignVolunteer={handleAssignVolunteer}
              onResolveRequest={handleResolveRequest}
            />
            <HotspotPanel hotspots={hotspots} />
            <ResourceShelterGrid />
          </main>
        </>
      )}
    </div>
  );
}
