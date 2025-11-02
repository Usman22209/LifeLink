import { colors, withOpacity } from "./colors";

export const darkTheme = {
  mode: "dark",
  background: colors.black,
  text: colors.white,
  textSecondary: withOpacity(colors.white, 0.7),
  card: colors.gray800,
  border: colors.gray600,
  primary: colors.darkPrimary,
  placeholder: withOpacity(colors.white, 0.4),
};
