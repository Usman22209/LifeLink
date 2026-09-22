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
      const wasOnboarded =
        Boolean(state.user?.is_onboarded) ||
        Boolean(state.user?.phone && (state.user?.blood_group || (state.user as any)?.blood_type));
      const isOnboarded =
        wasOnboarded ||
        incomingUser.is_onboarded ||
        Boolean(incomingUser.phone && (incomingUser.blood_group || (incomingUser as any)?.blood_type));

      state.user = {
        ...(state.user || {}),
        ...incomingUser,
        is_onboarded: isOnboarded,
      };
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (!action.payload) return;

      if (!state.user) {
        const incoming = action.payload as any;
        const isOnboarded =
          Boolean(incoming.is_onboarded) ||
          Boolean(incoming.phone && (incoming.blood_group || incoming.blood_type));
        state.user = {
          ...incoming,
          is_onboarded: isOnboarded,
        } as User;
        return;
      }

      const wasOnboarded =
        Boolean(state.user.is_onboarded) ||
        Boolean(state.user.phone && (state.user.blood_group || (state.user as any).blood_type));

      const incomingOnboarded = action.payload.is_onboarded;

      const finalIsOnboarded =
        wasOnboarded ||
        Boolean(incomingOnboarded) ||
        Boolean(
          (action.payload.phone || state.user.phone) &&
            (action.payload.blood_group || (action.payload as any).blood_type || state.user.blood_group),
        );

      // Cleanly filter out undefined or null keys so they do not overwrite existing valid persisted data
      const cleanedPayload: any = {};
      Object.entries(action.payload).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== "") {
          cleanedPayload[key] = val;
        }
      });

      // Preserve health screening eligibility and next_eligible_date when backend stats are received
      if (cleanedPayload.stats || state.user.stats) {
        cleanedPayload.stats = {
          ...(state.user.stats || {}),
          ...(cleanedPayload.stats || {}),
          is_eligible:
            cleanedPayload.stats?.is_eligible !== undefined
              ? cleanedPayload.stats.is_eligible
              : state.user.stats?.is_eligible,
          next_eligible_date:
            cleanedPayload.stats?.next_eligible_date !== undefined
              ? cleanedPayload.stats.next_eligible_date
              : state.user.stats?.next_eligible_date,
        };
      }

      state.user = {
        ...state.user,
        ...cleanedPayload,
        is_onboarded: finalIsOnboarded,
      };
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
