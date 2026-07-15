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

export { MOCK_REQUESTS } from "../../../shared/constants/mockData";
