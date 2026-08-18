import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, AuthState } from "@shared/interfaces/models/user.interface";
import { RootState } from "@store/store";

const initialState: AuthState = {
  accessToken: null,
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
        expiresAt?: number;
        user: User;
      }>,
    ) => {
      state.accessToken = action.payload.accessToken;
      state.expiresAt = action.payload.expiresAt || null;
      const incomingUser = action.payload.user;
      const isOnboarded =
        incomingUser.is_onboarded ||
        Boolean(incomingUser.phone && incomingUser.blood_group);

      state.user = {
        ...incomingUser,
        is_onboarded: isOnboarded,
      };
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        const wasOnboarded =
          Boolean(state.user.is_onboarded) ||
          Boolean(state.user.phone && state.user.blood_group);

        const incomingOnboarded = action.payload.is_onboarded;

        const finalIsOnboarded =
          wasOnboarded ||
          Boolean(incomingOnboarded) ||
          Boolean(
            (action.payload.phone || state.user.phone) &&
              (action.payload.blood_group || state.user.blood_group),
          );

        state.user = {
          ...state.user,
          ...action.payload,
          is_onboarded: finalIsOnboarded,
        };
      }
    },
    logout: (state) => {
      state.accessToken = null;
      state.expiresAt = null;
      state.user = null;
    },
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
  },
});

export const { setAuth, logout, updateUser, updateAccessToken } =
  authSlice.actions;
export const selectToken = (state: RootState) => state.auth.accessToken;
export const selectUser = (state: RootState) => state.auth.user;
export default authSlice.reducer;
