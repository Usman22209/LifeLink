export const colors = {
  primary: "#FF0000",
  darkPrimary: "#CC0000",
  secondary: "#E5E5E5",
  textPrimary: "#333333",
  textSecondary: "#666666",
  success: "#27AE60",
  danger: "#E74C3C",
  warning: "#F39C12",
  info: "#2980B9",
  white: "#FFFFFF",
  black: "#000000",
  gray100: "#F5F5F5",
  gray300: "#CCCCCC",
  gray600: "#666666",
  gray800: "#222222",
};
export function withOpacity(color: string, alpha: number = 1): string {
  if (color.startsWith("#")) {
    let hex = color.replace(/^#/, "");

    if (hex.length === 3) {
      hex = hex
        .split("")
        .map(c => c + c)
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
