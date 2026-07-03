import { colors } from "@theme/colors";

export interface BloodRequest {
  id: string;
  bloodType: string;
  patientName: string;
  hospital: string;
  city: string;
  units: number;
  urgency: "critical" | "urgent" | "normal";
  time: string;
  distance: string;
}

export interface FilterState {
  urgency: string;
  sortBy: string;
  distance: string;
  bloodType: string;
}

export const URGENCY_CONFIG: Record<
  "critical" | "urgent" | "normal",
  { color: string; label: string }
> = {
  critical: { color: colors.danger, label: "Critical" },
  urgent: { color: colors.warning, label: "Urgent" },
  normal: { color: colors.success, label: "Normal" },
};

export const SORT_OPTIONS = ["Newest First", "Nearest First", "Most Units"];
export const URGENCY_OPTIONS = ["All", "Critical", "Urgent", "Normal"];
export const DISTANCE_OPTIONS = ["Any Distance", "< 2 km", "< 5 km", "< 10 km"];
export const BLOOD_OPTIONS = [
  "All",
  "A+",
  "A-",
  "B+",
  "B-",
  "O+",
  "O-",
  "AB+",
  "AB-",
];

export const DEFAULT_FILTERS: FilterState = {
  urgency: "All",
  sortBy: "Newest First",
  distance: "Any Distance",
  bloodType: "All",
};

export function countActiveFilters(f: FilterState): number {
  return (
    (f.urgency !== DEFAULT_FILTERS.urgency ? 1 : 0) +
    (f.sortBy !== DEFAULT_FILTERS.sortBy ? 1 : 0) +
    (f.distance !== DEFAULT_FILTERS.distance ? 1 : 0) +
    (f.bloodType !== DEFAULT_FILTERS.bloodType ? 1 : 0)
  );
}

export const MOCK_REQUESTS: BloodRequest[] = [
  {
    id: "1",
    bloodType: "B+",
    patientName: "Ahmed Khan",
    hospital: "Mayo Hospital",
    city: "Lahore",
    units: 3,
    urgency: "critical",
    time: "2h ago",
    distance: "3.2 km",
  },
  {
    id: "2",
    bloodType: "A-",
    patientName: "Sara Malik",
    hospital: "Jinnah Hospital",
    city: "Lahore",
    units: 2,
    urgency: "urgent",
    time: "4h ago",
    distance: "5.1 km",
  },
  {
    id: "3",
    bloodType: "O+",
    patientName: "Anonymous",
    hospital: "Services Hospital",
    city: "Lahore",
    units: 1,
    urgency: "normal",
    time: "6h ago",
    distance: "1.8 km",
  },
  {
    id: "4",
    bloodType: "AB-",
    patientName: "Bilal Raza",
    hospital: "Shaukat Khanum",
    city: "Lahore",
    units: 4,
    urgency: "critical",
    time: "30m ago",
    distance: "7.0 km",
  },
];
