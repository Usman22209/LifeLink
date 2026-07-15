export type AlertType =
  | "blood_request"
  | "donation_match"
  | "reminder"
  | "system";

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
}

export const ALERT_TYPE_CONFIG: Record<
  AlertType,
  { icon: string; iconLib: string; accent: string }
> = {
  blood_request: { icon: "droplet", iconLib: "Feather", accent: "#E53935" },
  donation_match: { icon: "heart", iconLib: "Feather", accent: "#2ECC71" },
  reminder: { icon: "clock", iconLib: "Feather", accent: "#F5A623" },
  system: { icon: "bell", iconLib: "Feather", accent: "#4A90E2" },
};

export { MOCK_ALERTS } from "../../../shared/constants/mockData";
