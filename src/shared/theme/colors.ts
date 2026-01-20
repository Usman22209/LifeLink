export const colors = {
  /* ===== COMMON TOKENS ===== */
  background: "#FFFFFF",
  card: "#F5F5F7",
  border: "#D1D1D6",
  text: "#1C1C1E",
  textSecondary: "#6E6E73",
  error: "#FF5C5C",
  placeholder: "rgba(110, 110, 115, 0.6)",

  /* ===== BRAND RED ===== */
  primary: "#E53935", // Light mode primary (softer, premium red)
  primaryDark: "#bc2929", // Dark mode primary (brighter, readable)
  primaryMuted: "#B71C1C", // Pressed / disabled states

  /* ===== BACKGROUNDS ===== */
  white: "#FFFFFF",
  black: "#0F0F0F", // Not pure black (reduces eye strain)

  /* ===== SURFACES ===== */
  gray100: "#F5F5F7",
  gray300: "#D1D1D6",
  gray600: "#636366",
  gray800: "#1C1C1E",

  /* ===== STATES ===== */
  success: "#2ECC71",
  danger: "#FF5C5C", // Coral red (visible on dark)
  warning: "#F5A623",
  info: "#4A90E2",
};

export function withOpacity(color: string, alpha: number = 1): string {
  if (color.startsWith("#")) {
    let hex = color.replace(/^#/, "");

    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    }

    if (hex.length === 8) {
      hex = hex.slice(0, 6);
    }

    if (hex.length !== 6) {
      throw new Error(`Invalid hex color: ${color}`);
    }

    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  if (color.startsWith("rgb")) {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (!match) throw new Error(`Invalid rgb(a) color: ${color}`);
    const [, r, g, b] = match;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  throw new Error(`Unsupported color format: ${color}`);
}
