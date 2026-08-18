"use client";

import React, { useState } from "react";
import { Compass, Home, Package, Hospital, Users, AlertTriangle, MapPin, Plus, CheckCircle2, Navigation, LogOut, Radio } from "lucide-react";

interface Props {
  userSession?: { user_id: string; name: string };
  onLogout?: () => void;
}

export function CoordinatorPortal({ userSession, onLogout }: Props) {
  const [activeTab, setActiveTab] = useState<"EMERGENCIES" | "SHELTERS" | "FOOD" | "RESOURCES" | "HOSPITALS" | "PEOPLE">("SHELTERS");
  const [showAddModal, setShowAddModal] = useState(false);

  // Module 9: Shelters List State
  const [shelters, setShelters] = useState([
    {
      id: "SH-101",
      name: "Vijayawada Central Relief Shelter",
      location: "Krishna Riverbank Sector",
      capacity: 500,
      available: 380,
      food: "Yes (3 Meals/day)",
      water: "12,000 L Tank",
      medical: "Full First Aid Bay",
      facilities: "Power Generator, Sleeping Mats",
      contact: "+918662450001",
      status: "Open" as const,
      verified: true
    },
    {
      id: "SH-102",
      name: "Auto Nagar Safe Shelter",
      location: "Auto Nagar Sector 4",
      capacity: 300,
      available: 255,
      food: "Yes",
      water: "5,000 L",
      medical: "Basic First Aid",
      facilities: "Sleeping Mats",
      contact: "+918662450002",
      status: "Open" as const,
      verified: true
    }
  ]);

  // Module 10: Food Supplies State
  const [foodItems, setFoodItems] = useState([
    {
      id: "FD-101",
      food: "Rice & Dal Meal Packets",
      quantity: "2,450 packets",
      location: "Central Relief Depot",
      peopleServed: 1200,
      availableUntil: "Today 9:00 PM",
      pickupDelivery: "Pickup & Delivery",
      contact: "+919876543210",
      verified: true
    },
    {
      id: "FD-102",
      food: "Clean Drinking Water Bottles (2L)",
      quantity: "5,000 bottles",
      location: "Auto Nagar Hub",
      peopleServed: 2500,
      availableUntil: "Tomorrow 6:00 PM",
      pickupDelivery: "Delivery Only",
      contact: "+919876543211",
      verified: true
    }
  ]);

  // Module 11: Hospitals State
  const [hospitals, setHospitals] = useState([
    {
      id: "HOSP-101",
      name: "Vijayawada Government General Hospital",
      beds: "45 Beds Available",
      medical: "Trauma & ICU Active",
      services: "Ambulance, Blood Bank, Oxygen",
      contact: "+918662450099",
      verified: true
    },
    {
      id: "HOSP-102",
      name: "Emergency Relief Medical Camp",
      beds: "18 Cots Available",
      medical: "First Aid & Wound Dressing",
      services: "Mobile Clinic",
      contact: "+918662450088",
      verified: true
    }
  ]);

  // Form Inputs for Adding New Record
  const [newShelterName, setNewShelterName] = useState("");
  const [newShelterLocation, setNewShelterLocation] = useState("");
  const [newShelterCapacity, setNewShelterCapacity] = useState("400");
  const [newShelterContact, setNewShelterContact] = useState("+919876500000");

  const handleAddShelter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShelterName) return;

    setShelters(prev => [
      ...prev,
      {
        id: "SH-" + (100 + prev.length + 1),
        name: newShelterName,
        location: newShelterLocation || "Vijayawada Sector",
        capacity: parseInt(newShelterCapacity) || 300,
        available: parseInt(newShelterCapacity) || 300,
        food: "Yes",
        water: "Clean Water Available",
        medical: "First Aid Active",
        facilities: "Power, Beds",
        contact: newShelterContact,
        status: "Open",
        verified: false // Admin will verify (Requirement 10)
      }
    ]);

    setNewShelterName("");
    setNewShelterLocation("");
    setShowAddModal(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 font-sans">
      
      {/* Header Banner */}
      <div className="bg-white border border-[#EFEFEF] rounded-2xl p-4 mb-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-50 text-[#0095F6] rounded-xl border border-blue-200">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-[#0095F6] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 uppercase">
                🧭 COORDINATOR PORTAL
              </span>
              <span className="text-xs text-[#737373] font-medium">Real-Time Coordination</span>
            </div>
            <h2 className="font-extrabold text-[#000000] text-base mt-0.5">
              Welcome, {userSession?.name || "Coordinator Ravi"}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 bg-[#0095F6] hover:bg-[#0084FF] text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="p-1.5 bg-[#FAFAFA] hover:bg-[#F4F4F4] text-[#737373] rounded-xl border border-[#DBDBDB] transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4 text-rose-600" />
            </button>
          )}
        </div>
      </div>

      {/* Sub-Tabs (Requirement 7 & Simple 1-2 Word Buttons) */}
      <div className="flex bg-white p-1 rounded-2xl border border-[#EFEFEF] mb-6 overflow-x-auto shadow-xs">
        <button
          onClick={() => setActiveTab("SHELTERS")}
          className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl text-xs font-bold transition ${
            activeTab === "SHELTERS" ? "bg-[#0095F6] text-white shadow-xs" : "text-[#737373] hover:text-[#000000]"
          }`}
        >
          Shelters
        </button>

        <button
          onClick={() => setActiveTab("FOOD")}
          className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl text-xs font-bold transition ${
            activeTab === "FOOD" ? "bg-[#0095F6] text-white shadow-xs" : "text-[#737373] hover:text-[#000000]"
          }`}
        >
          Food
        </button>

        <button
          onClick={() => setActiveTab("RESOURCES")}
          className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl text-xs font-bold transition ${
            activeTab === "RESOURCES" ? "bg-[#0095F6] text-white shadow-xs" : "text-[#737373] hover:text-[#000000]"
          }`}
        >
          Resources
        </button>

        <button
          onClick={() => setActiveTab("HOSPITALS")}
          className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl text-xs font-bold transition ${
            activeTab === "HOSPITALS" ? "bg-[#0095F6] text-white shadow-xs" : "text-[#737373] hover:text-[#000000]"
          }`}
        >
          Hospitals
        </button>

        <button
          onClick={() => setActiveTab("PEOPLE")}
          className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl text-xs font-bold transition ${
            activeTab === "PEOPLE" ? "bg-[#0095F6] text-white shadow-xs" : "text-[#737373] hover:text-[#000000]"
          }`}
        >
          People
        </button>
      </div>

      {/* MODULE 9: SHELTER TAB */}
      {activeTab === "SHELTERS" && (
        <div className="bg-white border border-[#EFEFEF] rounded-2xl p-5 shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-extrabold text-[#000000] text-base">SAFE SHELTER MANAGEMENT (MODULE 9)</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1 bg-[#0095F6] text-white rounded-xl text-xs font-bold"
            >
              Add Shelter
            </button>
          </div>

          <div className="space-y-4">
            {shelters.map(s => (
              <div key={s.id} className="bg-[#FAFAFA] border border-[#EFEFEF] rounded-xl p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-[#000000] text-sm">{s.name}</h4>
                      {s.verified ? (
                        <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          ✓ Verified
                        </span>
                      ) : (
                        <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          Pending Verification
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#737373] mt-1 font-medium">{s.location} • Contact: {s.contact}</p>
                  </div>
                  <span className="text-xs font-extrabold text-[#0095F6] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                    {s.available} / {s.capacity} Available
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-xs text-[#262626] font-medium pt-2 border-t border-[#EFEFEF]">
                  <div>🍚 Food: <strong>{s.food}</strong></div>
                  <div>💧 Water: <strong>{s.water}</strong></div>
                  <div>🏥 Medical: <strong>{s.medical}</strong></div>
                  <div>⚡ Status: <strong>{s.status}</strong></div>
                </div>

                <div className="mt-3 flex justify-end gap-2">
                  <button className="px-3 py-1 bg-white border border-[#DBDBDB] rounded-lg text-xs font-bold text-[#000000] hover:bg-gray-100">
                    Update
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 10: FOOD TAB */}
      {activeTab === "FOOD" && (
        <div className="bg-white border border-[#EFEFEF] rounded-2xl p-5 shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-extrabold text-[#000000] text-base">FOOD & WATER DISTRIBUTION (MODULE 10)</h3>
            <button className="px-3 py-1 bg-[#0095F6] text-white rounded-xl text-xs font-bold">
              Add Food
            </button>
          </div>

          <div className="space-y-3">
            {foodItems.map(f => (
              <div key={f.id} className="bg-[#FAFAFA] border border-[#EFEFEF] rounded-xl p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-[#000000] text-sm">{f.food}</h4>
                      {f.verified && (
                        <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#737373] mt-1 font-medium">{f.location} • Available Until: {f.availableUntil}</p>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Quantity: {f.quantity}
                  </span>
                </div>

                <div className="mt-3 flex justify-between items-center text-xs text-[#737373] pt-2 border-t border-[#EFEFEF]">
                  <span>People Served: <strong className="text-[#000000]">{f.peopleServed}</strong></span>
                  <button className="px-3 py-1 bg-white border border-[#DBDBDB] rounded-lg text-xs font-bold text-[#000000]">
                    Update
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 11: HOSPITALS TAB */}
      {activeTab === "HOSPITALS" && (
        <div className="bg-white border border-[#EFEFEF] rounded-2xl p-5 shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-extrabold text-[#000000] text-base">HOSPITAL & MEDICAL SERVICES (MODULE 11)</h3>
            <button className="px-3 py-1 bg-[#0095F6] text-white rounded-xl text-xs font-bold">
              Add Hospital
            </button>
          </div>

          <div className="space-y-3">
            {hospitals.map(h => (
              <div key={h.id} className="bg-[#FAFAFA] border border-[#EFEFEF] rounded-xl p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-[#000000] text-sm">{h.name}</h4>
                      {h.verified && (
                        <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#737373] mt-1 font-medium">{h.medical} • Services: {h.services}</p>
                  </div>
                  <span className="text-xs font-extrabold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                    {h.beds}
                  </span>
                </div>

                <div className="mt-3 flex justify-between items-center text-xs text-[#737373] pt-2 border-t border-[#EFEFEF]">
                  <span>Emergency Contact: <strong className="text-[#000000]">{h.contact}</strong></span>
                  <button className="px-3 py-1 bg-white border border-[#DBDBDB] rounded-lg text-xs font-bold text-[#000000]">
                    Update
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 10: RESOURCES TAB */}
      {activeTab === "RESOURCES" && (
        <div className="bg-white border border-[#EFEFEF] rounded-2xl p-5 shadow-xs">
          <h3 className="font-extrabold text-[#000000] text-base mb-4">RESOURCES & EQUIPMENT (MODULE 10)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { type: "Inflatable Rescue Boats", qty: "24 units", loc: "Central Depot" },
              { type: "Diesel Power Generators", qty: "18 units", loc: "Auto Nagar Hub" },
              { type: "Emergency Tents", qty: "350 units", loc: "Vijayawada Sector" }
            ].map((r, i) => (
              <div key={i} className="bg-[#FAFAFA] border border-[#EFEFEF] rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[#000000] text-xs">{r.type}</h4>
                  <p className="text-[11px] text-[#737373]">{r.loc}</p>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  {r.qty}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PEOPLE TAB */}
      {activeTab === "PEOPLE" && (
        <div className="bg-white border border-[#EFEFEF] rounded-2xl p-5 shadow-xs">
          <h3 className="font-extrabold text-[#000000] text-base mb-4">VOLUNTEERS & PEOPLE MANAGEMENT</h3>
          <div className="space-y-3">
            {[
              { name: "Ravi Kumar", skill: "Boat Rescue Specialist", status: "Active (On Rescue Mission)" },
              { name: "Priya Sharma", skill: "First Aid Medical Specialist", status: "Available" }
            ].map((p, i) => (
              <div key={i} className="bg-[#FAFAFA] border border-[#EFEFEF] rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[#000000] text-xs">{p.name}</h4>
                  <p className="text-[11px] text-[#737373]">{p.skill}</p>
                </div>
                <span className="text-xs font-bold text-[#0095F6] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans">
          <div className="bg-white border border-[#EFEFEF] rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="font-extrabold text-[#000000] text-base mb-4">ADD NEW SHELTER</h3>
            <form onSubmit={handleAddShelter} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#737373]">Shelter Name</label>
                <input
                  type="text"
                  placeholder="e.g. Krishna Relief Safe Shelter"
                  value={newShelterName}
                  onChange={e => setNewShelterName(e.target.value)}
                  required
                  className="w-full bg-[#FAFAFA] border border-[#DBDBDB] rounded-xl px-3 py-2 text-[#000000] mt-1"
                />
              </div>

              <div>
                <label className="font-bold text-[#737373]">Location</label>
                <input
                  type="text"
                  placeholder="Sector / Address"
                  value={newShelterLocation}
                  onChange={e => setNewShelterLocation(e.target.value)}
                  required
                  className="w-full bg-[#FAFAFA] border border-[#DBDBDB] rounded-xl px-3 py-2 text-[#000000] mt-1"
                />
              </div>

              <div>
                <label className="font-bold text-[#737373]">Capacity</label>
                <input
                  type="number"
                  value={newShelterCapacity}
                  onChange={e => setNewShelterCapacity(e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-[#DBDBDB] rounded-xl px-3 py-2 text-[#000000] mt-1"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-[#FAFAFA] border border-[#DBDBDB] rounded-xl font-bold text-[#000000]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#0095F6] text-white rounded-xl font-bold"
                >
                  Save Shelter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
