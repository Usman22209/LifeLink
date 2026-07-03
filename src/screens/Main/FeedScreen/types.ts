import { colors } from "@theme/colors";

export interface BloodRequest {
  id: string;
  bloodType: string;
  patientName: string;
  hospital: string;
  city: string;
  state?: string;
  patientImage?: string;
  units: number;
  urgency: "critical" | "urgent" | "normal";
  time: string;
  distance: string;
  latitude?: number;
  longitude?: number;
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
    state: "Punjab",
    patientImage:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
    units: 3,
    urgency: "critical",
    time: "2h ago",
    distance: "3.2 km",
    latitude: 31.5723,
    longitude: 74.3213,
  },
  {
    id: "2",
    bloodType: "A-",
    patientName: "Sara Malik",
    hospital: "Jinnah Hospital",
    city: "Lahore",
    state: "Punjab",
    patientImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    units: 2,
    urgency: "urgent",
    time: "4h ago",
    distance: "5.1 km",
    latitude: 31.4806,
    longitude: 74.303,
  },
  {
    id: "3",
    bloodType: "O+",
    patientName: "Anonymous",
    hospital: "Services Hospital",
    city: "Lahore",
    state: "Punjab",
    patientImage:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop",
    units: 1,
    urgency: "normal",
    time: "6h ago",
    distance: "1.8 km",
    latitude: 31.5428,
    longitude: 74.3364,
  },
  {
    id: "4",
    bloodType: "AB-",
    patientName: "Bilal Raza",
    hospital: "Shaukat Khanum",
    city: "Lahore",
    state: "Punjab",
    patientImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    units: 4,
    urgency: "critical",
    time: "30m ago",
    distance: "7.0 km",
    latitude: 31.4285,
    longitude: 74.2796,
  },
];
