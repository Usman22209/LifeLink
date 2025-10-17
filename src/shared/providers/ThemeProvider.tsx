import React, { createContext, useMemo } from "react";
import { useSelector } from "react-redux";
import { themes } from "@theme/index";
import { RootState } from "@store/store";

export const ThemeContext = createContext(themes.light);

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const theme = useMemo(() => (mode === "dark" ? themes.dark : themes.light), [mode]);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
