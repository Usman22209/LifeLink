import { ROUTES } from "@utils/Routes";

export type UserStackParamList = {
  [ROUTES.AUTH_FLOW]: undefined;
  [ROUTES.MAIN_FLOW]: undefined;
  [ROUTES.ONBOARDING]: undefined;
};

export type AuthStackParamList = {
  [ROUTES.WELCOME]: undefined;
  [ROUTES.LOGIN]: undefined;
  [ROUTES.SIGNUP]: undefined;
  [ROUTES.FORGOT_PASSWORD]: undefined;
  [ROUTES.RESET_PASSWORD]: {
    accessToken?: string;
    token?: string;
    access_token?: string;
  };
};

export type MainTabParamList = {
  [ROUTES.HOME]: undefined;
  [ROUTES.FEED]: undefined;
  [ROUTES.REQUEST]: undefined;
  [ROUTES.PROFILE]: undefined;
  [ROUTES.SETTINGS]: undefined;
};

/** @deprecated Use MainTabParamList instead */
export type MainStackParamList = MainTabParamList;
