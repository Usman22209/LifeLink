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

export const MOCK_ALERTS: Alert[] = [
  {
    id: "1",
    type: "blood_request",
    title: "Urgent: B+ Blood Needed",
    body: "Mayo Hospital in Lahore urgently needs 3 units of B+ blood.",
    time: "2m ago",
    read: false,
    urgency: "critical",
    bloodType: "B+",
    hospital: "Mayo Hospital",
  },
  {
    id: "2",
    type: "donation_match",
    title: "You're a Match!",
    body: "A patient near you needs O+ blood. You last donated 4 months ago — you may be eligible.",
    time: "18m ago",
    read: false,
    bloodType: "O+",
  },
  {
    id: "3",
    type: "blood_request",
    title: "Urgent: A- Blood Needed",
    body: "Jinnah Hospital requires 2 units of A- blood for an emergency case.",
    time: "1h ago",
    read: false,
    urgency: "urgent",
    bloodType: "A-",
    hospital: "Jinnah Hospital",
  },
  {
    id: "4",
    type: "reminder",
    title: "You Can Donate Again",
    body: "It has been 90 days since your last donation. You are now eligible to donate blood.",
    time: "3h ago",
    read: true,
  },
  {
    id: "5",
    type: "donation_match",
    title: "Request Fulfilled",
    body: "The blood request you responded to at Services Hospital has been fulfilled. Thank you!",
    time: "Yesterday",
    read: true,
  },
  {
    id: "6",
    type: "system",
    title: "Profile Verified",
    body: "Your donor profile has been verified. You will now receive priority match alerts.",
    time: "2 days ago",
    read: true,
  },
];
