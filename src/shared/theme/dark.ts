import { colors, withOpacity } from "./colors";

export const darkTheme = {
  mode: "dark",

  background: colors.black,
  card: colors.gray800,
  border: withOpacity(colors.white, 0.12),

  text: colors.textPrimaryDark,
  textSecondary: colors.textSecondaryDark,
  placeholder: withOpacity(colors.textPrimaryDark, 0.4),

  primary: colors.primaryDark,
  error: withOpacity(colors.danger, 0.85),
};
