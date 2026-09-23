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
  urgency: "critical" | "high" | "urgent" | "normal";
  time: string;
  time_left?: string;
  required_date?: string;
  is_expired?: boolean;
  distance: string;
  latitude?: number;
  longitude?: number;
  requester_id?: string;
  hide_phone_number?: boolean;
  contact_number?: string;
  requester?: any;
}

export interface FilterState {
  timeGap: string;
  sortBy: string;
  distance: string;
  bloodType: string;
}

export const URGENCY_CONFIG: Record<string, { color: string; label: string }> =
  {
    critical: { color: colors.danger, label: "Critical" },
    emergency: { color: colors.danger, label: "Critical" },
    urgent: { color: colors.warning, label: "High" },
    high: { color: colors.warning, label: "High" },
    medium: { color: colors.info, label: "Normal" },
    normal: { color: colors.info, label: "Normal" },
    low: { color: colors.info, label: "Normal" },
  };

export const SORT_OPTIONS = [
  "Newest First",
  "Closing Soonest",
  "Nearest First",
  "Most Units",
];

export const TIME_GAP_OPTIONS = [
  "Any Time",
  "Within 6 Hours",
  "Within 12 Hours",
  "Within 24 Hours",
  "Within 3 Days",
  "Within 7 Days",
  "Within 1 Month",
];

export const DISTANCE_OPTIONS = [
  "Any Distance",
  "< 5 km",
  "< 15 km",
  "< 50 km",
  "< 100 km",
];
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
  timeGap: "Any Time",
  sortBy: "Newest First",
  distance: "Any Distance",
  bloodType: "All",
};

export function countActiveFilters(f: FilterState): number {
  return (
    (f.timeGap !== DEFAULT_FILTERS.timeGap ? 1 : 0) +
    (f.sortBy !== DEFAULT_FILTERS.sortBy ? 1 : 0) +
    (f.distance !== DEFAULT_FILTERS.distance ? 1 : 0) +
    (f.bloodType !== DEFAULT_FILTERS.bloodType ? 1 : 0)
  );
}

export { MOCK_REQUESTS } from "../../../shared/constants/mockData";
