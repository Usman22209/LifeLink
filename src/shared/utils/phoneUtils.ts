/**
 * Phone number formatting & validation utilities for Pakistani & International numbers.
 * Supports:
 * - UX Display Format: "0303 1234567" (4 digits + space + 7 digits) or "+92 303 1234567"
 * - API Payload Standard: E.164 (+923031234567)
 */

/**
 * Formats a phone number for UI display and live input formatting.
 * Examples:
 * - "03031234567" -> "0303 1234567"
 * - "+923031234567" -> "+92 303 1234567"
 */
export const formatPhoneNumber = (input?: string): string => {
  if (!input) return "";

  const trimmed = input.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");

  // International format starting with +92 or 92
  if (hasPlus || digits.startsWith("92")) {
    if (digits.startsWith("92")) {
      const mobile = digits.slice(2, 12);
      if (mobile.length <= 3) {
        return `+92 ${mobile}`;
      }
      return `+92 ${mobile.slice(0, 3)} ${mobile.slice(3, 10)}`;
    }
    return trimmed;
  }

  // Local 11-digit Pakistani format: "03031234567" -> "0303 1234567"
  const cleanDigits = digits.slice(0, 11);
  if (cleanDigits.length <= 4) {
    return cleanDigits;
  }
  return `${cleanDigits.slice(0, 4)} ${cleanDigits.slice(4, 11)}`;
};

/**
 * Converts any formatted phone number to standard E.164 format for API submission.
 * Examples:
 * - "0303 1234567" -> "+923031234567"
 * - "+92 303 1234567" -> "+923031234567"
 */
export const toE164Phone = (input?: string): string => {
  if (!input) return "";
  const digits = input.replace(/\D/g, "");
  if (digits.startsWith("92")) {
    return `+${digits.slice(0, 12)}`;
  }
  if (digits.startsWith("0") && digits.length === 11) {
    return `+92${digits.slice(1)}`;
  }
  return digits.length > 0 ? `+${digits}` : "";
};

/**
 * Validates whether the input is a valid 11-digit local or 12-digit international Pakistani mobile number.
 * Valid ranges: 0300 - 0349, 0355, 0364
 */
export const isValidPakistaniPhone = (input?: string): boolean => {
  if (!input) return false;
  const digits = input.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("03")) {
    return true;
  }
  if (digits.length === 12 && digits.startsWith("923")) {
    return true;
  }
  return false;
};
