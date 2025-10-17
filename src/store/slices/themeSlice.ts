import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ThemeMode = "light" | "dark";

interface ThemeState {
  mode: ThemeMode;
  isLightMode: boolean;
}

const initialState: ThemeState = {
  mode: "light",
  isLightMode: true,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme(state) {
      const newMode = state.mode === "light" ? "dark" : "light";
      state.mode = newMode;
      state.isLightMode = newMode === "light";
    },
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.mode = action.payload;
      state.isLightMode = action.payload === "light";
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
