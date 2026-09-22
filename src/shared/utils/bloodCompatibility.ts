/**
 * Blood Compatibility Engine
 * Implements standard international medical ABO and Rh (D) blood transfusion compatibility rules.
 */

export type BloodGroup =
  | "O-"
  | "O+"
  | "A-"
  | "A+"
  | "B-"
  | "B+"
  | "AB-"
  | "AB+";

export const ALL_BLOOD_GROUPS: BloodGroup[] = [
  "O-",
  "O+",
  "A-",
  "A+",
  "B-",
  "B+",
  "AB-",
  "AB+",
];

/**
 * Recipient Compatibility Map:
 * For each recipient blood group, lists all donor blood groups that can safely donate red blood cells.
 */
export const RECIPIENT_COMPATIBILITY_MAP: Record<BloodGroup, BloodGroup[]> = {
  // O- can only receive from O- (universal donor to others, but exclusive recipient)
  "O-": ["O-"],
  // O+ can receive from O- and O+
  "O+": ["O-", "O+"],
  // A- can receive from O- and A-
  "A-": ["O-", "A-"],
  // A+ can receive from O-, O+, A-, A+
  "A+": ["O-", "O+", "A-", "A+"],
  // B- can receive from O- and B-
  "B-": ["O-", "B-"],
  // B+ can receive from O-, O+, B-, B+
  "B+": ["O-", "O+", "B-", "B+"],
  // AB- can receive from O-, A-, B-, AB-
  "AB-": ["O-", "A-", "B-", "AB-"],
  // AB+ can receive from ALL blood groups (Universal Recipient)
  "AB+": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
};

/**
 * Donor Compatibility Map:
 * For each donor blood group, lists all recipient blood groups that can safely receive red blood cells.
 */
export const DONOR_COMPATIBILITY_MAP: Record<BloodGroup, BloodGroup[]> = {
  // O- can donate to everyone (Universal Donor)
  "O-": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
  // O+ can donate to all Rh positive types
  "O+": ["O+", "A+", "B+", "AB+"],
  // A- can donate to A-, A+, AB-, AB+
  "A-": ["A-", "A+", "AB-", "AB+"],
  // A+ can donate to A+ and AB+
  "A+": ["A+", "AB+"],
  // B- can donate to B-, B+, AB-, AB+
  "B-": ["B-", "B+", "AB-", "AB+"],
  // B+ can donate to B+ and AB+
  "B+": ["B+", "AB+"],
  // AB- can donate to AB- and AB+
  "AB-": ["AB-", "AB+"],
  // AB+ can only donate to AB+
  "AB+": ["AB+"],
};

/**
 * Normalizes blood group string input (e.g., "o+", " B + ", "ab-") to standard format.
 */
export const normalizeBloodGroup = (
  group?: string | null,
): BloodGroup | null => {
  if (!group) return null;
  const clean = group.toUpperCase().replace(/\s+/g, "").trim();
  if (ALL_BLOOD_GROUPS.includes(clean as BloodGroup)) {
    return clean as BloodGroup;
  }
  return null;
};

/**
 * Checks if a donor's blood can be safely transfused to a recipient.
 * If either blood group is unknown/missing, defaults to true to avoid blocking users without data.
 */
export const isBloodCompatible = (
  donorGroup?: string | null,
  recipientGroup?: string | null,
): boolean => {
  const donor = normalizeBloodGroup(donorGroup);
  const recipient = normalizeBloodGroup(recipientGroup);

  if (!donor || !recipient) {
    return true; // Unknown or unselected blood group, permissive fallback
  }

  const allowedDonors = RECIPIENT_COMPATIBILITY_MAP[recipient];
  return allowedDonors ? allowedDonors.includes(donor) : false;
};

/**
 * Returns list of compatible donor groups for a given patient/recipient.
 */
export const getCompatibleDonors = (
  recipientGroup?: string | null,
): BloodGroup[] => {
  const recipient = normalizeBloodGroup(recipientGroup);
  if (!recipient) return ALL_BLOOD_GROUPS;
  return RECIPIENT_COMPATIBILITY_MAP[recipient] || [];
};

/**
 * Returns list of recipient groups a donor can safely donate to.
 */
export const getCompatibleRecipients = (
  donorGroup?: string | null,
): BloodGroup[] => {
  const donor = normalizeBloodGroup(donorGroup);
  if (!donor) return ALL_BLOOD_GROUPS;
  return DONOR_COMPATIBILITY_MAP[donor] || [];
};

/**
 * Returns human-readable feedback explaining the compatibility status.
 */
export const getCompatibilityNotice = (
  donorGroup?: string | null,
  recipientGroup?: string | null,
  isUrdu: boolean = false,
): {
  isCompatible: boolean;
  title: string;
  message: string;
  badgeLabel: string;
} => {
  const donor = normalizeBloodGroup(donorGroup);
  const recipient = normalizeBloodGroup(recipientGroup);

  if (!donor || !recipient) {
    return {
      isCompatible: true,
      title: isUrdu ? "خون کی مطابقت" : "Blood Compatibility",
      message: isUrdu
        ? "مریض کی ضروریات کے مطابق خون کا عطیہ دیں۔"
        : "Please verify blood compatibility with the attending hospital staff before transfusion.",
      badgeLabel: isUrdu ? "معلومات" : "Info",
    };
  }

  const compatible = isBloodCompatible(donor, recipient);

  if (compatible) {
    const isExact = donor === recipient;
    return {
      isCompatible: true,
      title: isUrdu ? "خون کی مطابقت درست ہے ✓" : "Compatible Blood Match ✓",
      message: isUrdu
        ? isExact
          ? `آپ کا بلڈ گروپ (${donor}) مریض کے بلڈ گروپ (${recipient}) سے بالکل مطابقت رکھتا ہے۔ آپ محفوظ طریقے سے خون کا عطیہ دے سکتے ہیں۔`
          : `طبی اصولوں کے مطابق آپ کا بلڈ گروپ (${donor}) مریض (${recipient}) کے لیے محفوظ اور موزوں ہے۔`
        : isExact
          ? `Your blood group (${donor}) is an exact match for this patient (${recipient}). You can safely donate!`
          : `Your blood group (${donor}) is medically compatible for whole red cell transfusion to this patient (${recipient}).`,
      badgeLabel: isUrdu ? "موزوں ڈونر" : "Compatible Match",
    };
  }

  const allowedDonors = getCompatibleDonors(recipient).join(", ");
  return {
    isCompatible: false,
    title: isUrdu
      ? "بلڈ گروپ غیر مطابقت پذیر ہے ⚠️"
      : "Incompatible Blood Type ⚠️",
    message: isUrdu
      ? `آپ کا بلڈ گروپ (${donor}) اس مریض (${recipient}) کے ساتھ طبی لحاظ سے مطابقت نہیں رکھتا۔ اس مریض کو درج ذیل بلڈ گروپس درکار ہیں: ${allowedDonors}۔ تاہم، آپ اس ایمرجنسی کو اپنے دوستوں اور خاندان کے ساتھ شیئر کر کے جان بچانے میں مدد کر سکتے ہیں!`
      : `Your blood group (${donor}) cannot be safely transfused to this patient (${recipient}). This patient can only receive blood from: ${allowedDonors}. You can still save this patient's life by sharing this request with your network!`,
    badgeLabel: isUrdu ? "غیر مطابقت پذیر" : "Incompatible",
  };
};
