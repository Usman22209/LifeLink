"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { api } from "@/lib/api";
import {
  Radio,
  Send,
  Smartphone,
  Droplet,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Users,
  BellRing,
} from "lucide-react";

export default function BroadcastPage() {
  const [title, setTitle] = useState("URGENT: Blood Donation Needed");
  const [message, setMessage] = useState(
    "Emergency whole blood units needed at hospital. If you are eligible, please tap to respond."
  );
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [sending, setSending] = useState(false);
  const [dispatchResult, setDispatchResult] = useState<{
    success: boolean;
    message: string;
    recipients?: number;
    city?: string;
    blood_group?: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      alert("Please fill in both headline and message body.");
      return;
    }
    setSending(true);
    setDispatchResult(null);
    setErrorMsg(null);

    try {
      const res = await api.sendBroadcast({
        title: title.trim(),
        message: message.trim(),
        city: selectedCity,
        blood_group: selectedGroup,
        urgency: "critical",
      });

      if (res.success) {
        setDispatchResult({
          success: true,
          message: res.data?.message || "Emergency broadcast dispatched successfully!",
          recipients: res.data?.recipients_count ?? 0,
          city: selectedCity === "all" ? "All Pakistan" : selectedCity,
          blood_group: selectedGroup === "all" ? "All Groups" : selectedGroup,
        });
      } else {
        setErrorMsg(res.error || "Failed to dispatch broadcast alert.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to connect to backend server.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header
        title="Broadcast Alerts"
        subtitle="Send emergency push notifications and in-app alerts directly to matching mobile donors"
      />

      <div className="p-8 max-w-5xl mx-auto w-full space-y-6">
        {/* Success / Feedback Banner */}
        {dispatchResult && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 shadow-xs flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm text-emerald-900">
                Broadcast Dispatched Successfully!
              </h3>
              <p className="text-xs text-emerald-700 mt-0.5">
                {dispatchResult.message}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-semibold">
                  <Users className="w-3.5 h-3.5" />
                  {dispatchResult.recipients} Mobile Donor{dispatchResult.recipients === 1 ? "" : "s"} Notified
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-800 font-medium">
                  <MapPin className="w-3.5 h-3.5" /> {dispatchResult.city}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-800 font-medium">
                  <Droplet className="w-3.5 h-3.5 text-[#E53935]" /> {dispatchResult.blood_group}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 shadow-xs flex items-center gap-3 text-red-700 text-xs">
            <AlertCircle className="w-5 h-5 text-[#E53935] shrink-0" />
            <span className="font-semibold">{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Composer Form (7 cols) */}
          <div className="md:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#E53935]" /> Compose Emergency Alert
              </h2>
              <span className="text-[11px] font-semibold text-slate-400">
                Push + In-App Notification
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Target City
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935]"
                >
                  <option value="all">All Pakistan</option>
                  <option value="Lahore">Lahore</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Islamabad">Islamabad / Rawalpindi</option>
                  <option value="Multan">Multan</option>
                  <option value="Faisalabad">Faisalabad</option>
                  <option value="Peshawar">Peshawar</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Blood Group
                </label>
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935]"
                >
                  <option value="all">All Blood Groups</option>
                  {["O-", "A-", "B-", "AB-", "O+", "A+", "B+", "AB+"].map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Alert Headline
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Alert title..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Message Body
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Emergency message..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935]"
              />
            </div>

            <button
              onClick={handleSend}
              disabled={sending}
              className="w-full py-2.5 rounded-xl bg-[#E53935] hover:bg-[#D32F2F] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              {sending ? "Dispatching Broadcast..." : "Dispatch Broadcast Now"}
            </button>
          </div>

          {/* Mobile Lock Screen Preview (5 cols) */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-4">
            <span className="text-xs font-semibold text-slate-500 mb-3 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-slate-400" /> Mobile Lock Screen Preview
            </span>

            <div className="w-68 rounded-3xl bg-slate-900 p-4 shadow-xl text-white space-y-3">
              <div className="w-16 h-3 bg-slate-800 rounded-full mx-auto" />
              <div className="text-center pt-1">
                <span className="text-2xl font-light tracking-tight">09:41</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700/50 space-y-1.5 shadow-lg">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-[#E53935] flex items-center justify-center">
                    <Droplet className="w-2.5 h-2.5 text-white fill-white" />
                  </div>
                  <span className="text-[11px] font-bold tracking-tight">LifeLink Alert</span>
                  <span className="text-[9px] text-slate-400 ml-auto">now</span>
                </div>
                <p className="text-xs font-bold line-clamp-1">{title || "Alert Title"}</p>
                <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                  {message || "Message body preview..."}
                </p>
              </div>
              <div className="w-16 h-1 bg-slate-700 rounded-full mx-auto mt-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
