"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { api } from "@/lib/api";
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  User,
  Droplet,
  X,
  ShieldCheck,
  Ban,
  UserX,
  FileWarning,
} from "lucide-react";

interface ReportItem {
  id: string;
  reporter_id?: string;
  target_type: "request" | "user";
  target_id: string;
  reason: string;
  description?: string;
  category?: string;
  priority?: "low" | "medium" | "high" | "urgent";
  status: "pending" | "reviewed" | "resolved" | "dismissed";
  action_taken?: string;
  admin_notes?: string;
  created_at: string;
  reporter?: {
    id?: string;
    full_name?: string;
    phone?: string;
    profile_image?: string;
  };
  target?: {
    id?: string;
    full_name?: string;
    phone?: string;
    blood_group?: string;
    patient_name?: string;
    hospital_name?: string;
    city_id?: string;
    city?: string;
    urgency?: string;
  };
}

interface ReportStats {
  total_reports: number;
  pending_reports: number;
  reviewed_reports: number;
  resolved_reports: number;
  dismissed_reports: number;
  request_reports: number;
  user_reports: number;
  urgent_pending_reports: number;
}

export default function SupportAndModerationPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [stats, setStats] = useState<ReportStats>({
    total_reports: 0,
    pending_reports: 0,
    reviewed_reports: 0,
    resolved_reports: 0,
    dismissed_reports: 0,
    request_reports: 0,
    user_reports: 0,
    urgent_pending_reports: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [targetFilter, setTargetFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Action Modal State
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [actionType, setActionType] = useState<string>("user_suspended");
  const [adminNotes, setAdminNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const fetchReportsAndStats = async () => {
    setIsRefreshing(true);
    try {
      const [reportsRes, statsRes] = await Promise.all([
        api.getReports({
          status: statusFilter,
          target_type: targetFilter,
          search: searchQuery.trim() || undefined,
        }),
        api.getReportStats(),
      ]);

      if (reportsRes.success && reportsRes.data) {
        const list = reportsRes.data.reports || reportsRes.data;
        setReports(Array.isArray(list) ? list : []);
      }

      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      }
    } catch (err) {
      console.error("Failed to load reports:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchReportsAndStats();
  }, [statusFilter, targetFilter]);

  const handleApplyAction = async () => {
    if (!selectedReport) return;
    setIsSubmitting(true);
    try {
      const res = await api.takeReportAction(selectedReport.id, {
        action_taken: actionType,
        admin_notes: adminNotes || undefined,
        status: actionType === "dismissed" ? "dismissed" : "resolved",
      });

      if (res.success) {
        setActionNotice("Disciplinary action applied successfully!");
        setTimeout(() => {
          setSelectedReport(null);
          setActionNotice(null);
          setAdminNotes("");
          fetchReportsAndStats();
        }, 1200);
      } else {
        alert(res.error || "Failed to enforce moderation action.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredReports = reports.filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchReason = item.reason?.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      const matchReporter = item.reporter?.full_name?.toLowerCase().includes(q);
      const matchUser = item.target?.full_name?.toLowerCase().includes(q);
      const matchPatient = item.target?.patient_name?.toLowerCase().includes(q);
      const matchHospital = item.target?.hospital_name?.toLowerCase().includes(q);
      if (
        !matchReason &&
        !matchDesc &&
        !matchReporter &&
        !matchUser &&
        !matchPatient &&
        !matchHospital
      ) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header
        title="Reports & Moderation Center"
        subtitle="Review incident reports, take disciplinary actions on users, and moderate blood requests"
        onRefresh={fetchReportsAndStats}
        isRefreshing={isRefreshing}
      />

      <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* KPI Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" /> Pending Review
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 mt-2">
              {stats.pending_reports}
            </div>
            <p className="text-xs text-slate-500 mt-1">Requires immediate review</p>
          </div>

          <div className="bg-white border border-amber-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Urgent Pending
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 mt-2">
              {stats.urgent_pending_reports}
            </div>
            <p className="text-xs text-slate-500 mt-1">High-priority or fraud complaints</p>
          </div>

          <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Resolved & Penalized
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 mt-2">
              {stats.resolved_reports}
            </div>
            <p className="text-xs text-slate-500 mt-1">Banned, suspended, or cancelled</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Total Incident Reports
              </span>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 mt-2">
              {stats.total_reports}
            </div>
            <p className="text-xs text-slate-500 mt-1">All-time mobile community reports</p>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {["all", "pending", "reviewed", "resolved", "dismissed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  statusFilter === tab
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Target & Search */}
          <div className="flex items-center gap-3">
            <select
              value={targetFilter}
              onChange={(e) => setTargetFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-medium outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            >
              <option value="all">All Targets</option>
              <option value="user">Reported Users</option>
              <option value="request">Reported Requests</option>
            </select>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search reason, user, patient..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-700 placeholder-slate-400 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 w-64"
              />
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-bold">
                <th className="p-4">Reported Target</th>
                <th className="p-4">Reason & Description</th>
                <th className="p-4">Reporter</th>
                <th className="p-4">Priority & Status</th>
                <th className="p-4">Action Taken</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center p-12 text-slate-500">
                    <div className="inline-block w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin mb-2" />
                    <p>Loading reports...</p>
                  </td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-16 text-slate-400">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2 opacity-80" />
                    <p className="font-bold text-slate-700 text-sm">All clear!</p>
                    <p className="text-xs text-slate-500 mt-0.5">No reports in this queue.</p>
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/75 transition-colors">
                    {/* Target */}
                    <td className="p-4">
                      {report.target_type === "user" ? (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold shrink-0">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">
                              {report.target?.full_name || "User Account"}
                            </div>
                            <div className="text-slate-400 text-[11px]">
                              {report.target?.phone || report.target_id.slice(0, 12)}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-[#E53935] shrink-0">
                            <Droplet className="w-4 h-4 fill-[#E53935]" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              {report.target?.patient_name || "Blood Request"}
                              {report.target?.blood_group && (
                                <span className="bg-red-100 text-[#E53935] px-1.5 py-0.5 rounded text-[10px] font-extrabold">
                                  {report.target.blood_group}
                                </span>
                              )}
                            </div>
                            <div className="text-slate-400 text-[11px] truncate max-w-[140px]">
                              {report.target?.hospital_name || report.target_id.slice(0, 12)}
                            </div>
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Category & Reason */}
                    <td className="p-4 max-w-xs">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 uppercase tracking-wider">
                          {report.category || (report.target_type === "user" ? "User Concern" : "Request Concern")}
                        </span>
                        {report.priority && (
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                              report.priority === "urgent"
                                ? "bg-red-100 text-red-700"
                                : report.priority === "high"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {report.priority}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-900 font-semibold">{report.reason}</p>
                      {report.description && (
                        <p className="text-slate-500 text-[11px] mt-0.5 line-clamp-2">
                          {report.description}
                        </p>
                      )}
                    </td>

                    {/* Reporter */}
                    <td className="p-4">
                      <div className="text-slate-900 font-semibold">
                        {report.reporter?.full_name || "Community Member"}
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        {report.reporter?.phone || "-"}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold capitalize ${
                          report.status === "pending"
                            ? "bg-red-50 text-red-600 border border-red-200"
                            : report.status === "reviewed"
                            ? "bg-amber-50 text-amber-600 border border-amber-200"
                            : report.status === "resolved"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                      >
                        {report.status}
                      </span>
                    </td>

                    {/* Action Taken */}
                    <td className="p-4">
                      {report.action_taken && report.action_taken !== "none" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {report.action_taken === "user_banned" ? (
                            <>
                              <Ban className="w-3 h-3 text-red-600" /> Banned
                            </>
                          ) : report.action_taken === "user_suspended" ? (
                            <>
                              <UserX className="w-3 h-3 text-amber-600" /> Suspended
                            </>
                          ) : report.action_taken === "request_cancelled" ? (
                            <>
                              <FileWarning className="w-3 h-3 text-red-600" /> Cancelled
                            </>
                          ) : (
                            report.action_taken
                          )}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Pending action</span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="p-4 text-slate-500 whitespace-nowrap">
                      {new Date(report.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    {/* Action Button */}
                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedReport(report);
                          setActionType(
                            report.target_type === "user"
                              ? "user_suspended"
                              : "request_cancelled"
                          );
                          setAdminNotes("");
                        }}
                        className="bg-[#E53935] hover:bg-red-700 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors shadow-sm"
                      >
                        Moderate
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Moderation Action Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#E53935]" />
                Enforce Disciplinary Action
              </h3>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Card */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
              <span className="text-slate-400 font-bold uppercase text-[10px]">
                Reported Incident:
              </span>
              <p className="font-extrabold text-slate-900 text-sm mt-0.5">
                {selectedReport.target_type === "user"
                  ? `User: ${selectedReport.target?.full_name || selectedReport.target_id}`
                  : `Request: ${selectedReport.target?.patient_name || selectedReport.target_id}`}
              </p>
              <p className="text-red-600 mt-1 font-semibold italic">"{selectedReport.reason}"</p>
              {selectedReport.description && (
                <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
                  {selectedReport.description}
                </p>
              )}
            </div>

            {/* Action Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Select Moderation Action
              </label>
              <select
                value={actionType}
                onChange={(e) => setActionType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-semibold outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              >
                {selectedReport.target_type === "user" ? (
                  <>
                    <option value="user_suspended">
                      ⏸️ Suspend User Account (Temporarily disable profile)
                    </option>
                    <option value="user_banned">
                      🚫 Ban User Account (Permanent ban & cancel open requests)
                    </option>
                    <option value="warning_issued">
                      ⚠️ Issue Disciplinary Warning Notice
                    </option>
                    <option value="dismissed">
                      ❌ Dismiss Report (False or invalid claim)
                    </option>
                  </>
                ) : (
                  <>
                    <option value="request_cancelled">
                      🛑 Cancel & Take Down Blood Request
                    </option>
                    <option value="warning_issued">
                      ⚠️ Issue Warning to Requester
                    </option>
                    <option value="dismissed">
                      ❌ Dismiss Report (Legitimate request)
                    </option>
                  </>
                )}
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Internal Admin Audit Log / Notes
              </label>
              <textarea
                rows={3}
                placeholder="Explain reason for taking this action (stored for compliance)..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>

            {actionNotice && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs p-2.5 rounded-xl text-center font-bold">
                {actionNotice}
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={isSubmitting}
                onClick={handleApplyAction}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#E53935] hover:bg-red-700 text-white shadow-sm transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Applying..." : "Confirm & Apply Action"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
