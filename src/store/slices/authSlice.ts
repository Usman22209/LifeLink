import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { User, AuthState } from "@shared/interfaces/models/user.interface";

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        expiresAt: number;
        user: User;
      }>,
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.expiresAt = action.payload.expiresAt;
      state.user = action.payload.user;
    },
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.expiresAt = null;
      state.user = null;
    },
  },
});

export const { setAuth, logout, updateAccessToken } = authSlice.actions;
export const selectToken = (state: { auth: AuthState }) => state.auth.accessToken;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export default authSlice.reducer;
