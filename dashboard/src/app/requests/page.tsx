"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { BloodBadge } from "@/components/BloodBadge";
import { StatusPill } from "@/components/StatusPill";
import { api } from "@/lib/api";
import { Search, MapPin, Building2, Phone, X } from "lucide-react";

export default function BloodRequestsPage() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [selectedUrgency, setSelectedUrgency] = useState("all");
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    const res = await api.getFeed({
      blood_group: selectedGroup,
      urgency: selectedUrgency,
      search: search.trim() || undefined,
      limit: 50,
    });

    if (res.success && res.data) {
      const list = res.data.requests || res.data || [];
      setRequests(Array.isArray(list) ? list : []);
    } else {
      setRequests([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, [selectedGroup, selectedUrgency]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRequests();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title="Blood Requests"
        subtitle="Manage and view live blood requests from the backend database"
        onRefresh={fetchRequests}
        isRefreshing={loading}
      />

      <div className="p-8 max-w-6xl mx-auto w-full space-y-6">
        {/* Search & Filters Bar */}
        <div className="app-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patient, hospital, city..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#E53935]"
            />
          </form>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Blood Group */}
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#E53935]"
            >
              <option value="all">All Blood Groups</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>

            {/* Urgency */}
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#E53935]"
            >
              <option value="all">All Urgencies</option>
              <option value="critical">Critical</option>
              <option value="urgent">Urgent</option>
              <option value="normal">Normal</option>
            </select>
          </div>
        </div>

        {/* Requests Table */}
        <div className="app-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Group</th>
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">Hospital</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Units Needed</th>
                  <th className="py-3 px-4">Urgency</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      Loading blood requests...
                    </td>
                  </tr>
                ) : requests.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      No blood requests match your selected filters.
                    </td>
                  </tr>
                ) : (
                  requests.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className="hover:bg-slate-50/60 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4">
                        <BloodBadge bloodGroup={item.blood_group || item.bloodType || "O+"} size="sm" />
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {item.patient_name || item.patientName || "Patient"}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {item.hospital_name || item.hospital || "Hospital"}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {item.city_id || item.city || "Pakistan"}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {item.units_required || item.units || 1} units
                      </td>
                      <td className="py-3 px-4">
                        <StatusPill status={item.urgency || "normal"} type="urgency" />
                      </td>
                      <td className="py-3 px-4">
                        <StatusPill status={item.status || "open"} type="status" />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem(item);
                          }}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium text-[11px] transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white max-w-md w-full rounded-2xl border border-slate-200 shadow-xl p-6 relative space-y-5">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <BloodBadge bloodGroup={selectedItem.blood_group || selectedItem.bloodType || "O+"} size="md" />
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  {selectedItem.patient_name || selectedItem.patientName || "Patient"}
                </h3>
                <p className="text-xs text-slate-500">{selectedItem.hospital_name || selectedItem.hospital}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl space-y-2.5 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-400">City:</span>
                <span className="font-semibold">{selectedItem.city_id || selectedItem.city || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Contact Number:</span>
                <span className="font-semibold">{selectedItem.contact_number || selectedItem.requester?.phone || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Units Required:</span>
                <span className="font-semibold">{selectedItem.units_required || selectedItem.units || 1} units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Urgency:</span>
                <StatusPill status={selectedItem.urgency || "normal"} type="urgency" />
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <StatusPill status={selectedItem.status || "open"} type="status" />
              </div>
            </div>

            {selectedItem.case_description && (
              <div className="text-xs text-slate-600 space-y-1">
                <span className="font-semibold text-slate-800 block">Case Description:</span>
                <p className="leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedItem.case_description}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
