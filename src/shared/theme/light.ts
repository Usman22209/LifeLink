import { colors, withOpacity } from "./colors";

export const lightTheme = {
  mode: "light",
  background: colors.white,
  text: colors.textPrimary,
  textSecondary: colors.textSecondary,
  card: colors.gray100,
  border: colors.gray300,
  primary: colors.primary,
  placeholder: withOpacity(colors.textSecondary, 0.6),
  error: colors.danger,
};
