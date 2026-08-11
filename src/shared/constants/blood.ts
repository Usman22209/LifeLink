import { UrgencyLevel } from "../interfaces/models/blood-request.interface";
import { colors } from "../theme/colors";

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export interface UrgencyLevelItem {
  value: UrgencyLevel;
  label: string;
  color: string;
  icon: string;
}

export const getUrgencyLevels = (
  t: (key: string) => string,
): UrgencyLevelItem[] => [
  {
    value: UrgencyLevel.NORMAL,
    label: t("requestForm.urgencyNormal") || "Normal",
    color: colors.success,
    icon: "check-circle",
  },
  {
    value: UrgencyLevel.HIGH,
    label: t("requestForm.urgencyHigh") || "Urgent",
    color: colors.warning,
    icon: "alert-circle",
  },
  {
    value: UrgencyLevel.CRITICAL,
    label: t("requestForm.urgencyCritical") || "Critical",
    color: colors.error,
    icon: "alert-triangle",
  },
];
