import { ROUTES } from "@utils/Routes";
import { BloodRequest } from "@screens/Main/FeedScreen/types";

export type UserStackParamList = {
  [ROUTES.AUTH_FLOW]: undefined;
  [ROUTES.MAIN_FLOW]: undefined;
  [ROUTES.ONBOARDING]: undefined;
  [ROUTES.REQUEST_DETAIL]: { request: BloodRequest };
  [ROUTES.EDIT_PROFILE]: { isEditing?: boolean };
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
  [ROUTES.NOTIFICATIONS]: undefined;
  [ROUTES.PROFILE]: undefined;
  [ROUTES.SETTINGS]: undefined;
};

/** @deprecated Use MainTabParamList instead */
export type MainStackParamList = MainTabParamList;
