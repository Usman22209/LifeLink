import { colors, withOpacity } from "./colors";

export const lightTheme = {
  mode: "light",

  background: colors.white,
  card: colors.gray100,
  border: colors.gray300,

  text: colors.textPrimary,
  textSecondary: colors.textSecondary,
  placeholder: withOpacity(colors.textSecondary, 0.6),

  primary: colors.primary,
  error: colors.danger,
};
