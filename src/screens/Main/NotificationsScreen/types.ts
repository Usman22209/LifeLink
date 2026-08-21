export type AlertType =
  | "blood_request"
  | "urgent_request"
  | "donation_match"
  | "donation_received"
  | "chat_message"
  | "reminder"
  | "system"
  | "profile";

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  body: string;
  time: string;
  read: boolean;
  urgency?: "critical" | "urgent" | "normal";
  bloodType?: string;
  hospital?: string;
  patientName?: string;
  city?: string;
  requestId?: string;
  conversationId?: string;
  data?: Record<string, any>;
  createdAt?: string;
}

export const ALERT_TYPE_CONFIG: Record<
  string,
  { icon: string; iconLib: string; accent: string; bg: string; label: string }
> = {
  blood_request: {
    icon: "droplet",
    iconLib: "Feather",
    accent: "#E53935",
    bg: "rgba(229, 57, 53, 0.08)",
    label: "Blood Request",
  },
  urgent_request: {
    icon: "alert-circle",
    iconLib: "Feather",
    accent: "#E53935",
    bg: "rgba(229, 57, 53, 0.08)",
    label: "Emergency",
  },
  donation_match: {
    icon: "heart",
    iconLib: "Feather",
    accent: "#10B981",
    bg: "rgba(16, 185, 129, 0.08)",
    label: "Match & Donation",
  },
  donation_received: {
    icon: "award",
    iconLib: "Feather",
    accent: "#10B981",
    bg: "rgba(16, 185, 129, 0.08)",
    label: "Fulfilled",
  },
  chat_message: {
    icon: "message-square",
    iconLib: "Feather",
    accent: "#3B82F6",
    bg: "rgba(59, 130, 246, 0.08)",
    label: "Message",
  },
  reminder: {
    icon: "clock",
    iconLib: "Feather",
    accent: "#F59E0B",
    bg: "rgba(245, 158, 11, 0.08)",
    label: "Reminder",
  },
  system: {
    icon: "bell",
    iconLib: "Feather",
    accent: "#6366F1",
    bg: "rgba(99, 102, 241, 0.08)",
    label: "System",
  },
  profile: {
    icon: "shield",
    iconLib: "Feather",
    accent: "#8B5CF6",
    bg: "rgba(139, 92, 246, 0.08)",
    label: "Profile",
  },
};

export { MOCK_ALERTS } from "../../../shared/constants/mockData";

