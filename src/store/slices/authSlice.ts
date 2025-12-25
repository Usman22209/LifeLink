import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { User, AuthState } from "@shared/interfaces/models/user.interface";

const initialState: AuthState = {
  token: null,
  sessionId: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{ token: string; sessionId?: string; user: User }>,
    ) => {
      state.token = action.payload.token;
      state.sessionId = action.payload.sessionId || null;
      state.user = action.payload.user;
    },
    updateToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.sessionId = null;
      state.user = null;
    },
  },
});

export const { setAuth, logout, updateToken } = authSlice.actions;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export default authSlice.reducer;
