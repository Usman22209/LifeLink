import { ROUTES } from "@utils/Routes";
import { BloodRequest } from "@screens/Main/FeedScreen/types";

export type UserStackParamList = {
  [ROUTES.AUTH_FLOW]: undefined;
  [ROUTES.MAIN_FLOW]: undefined;
  [ROUTES.ONBOARDING]: undefined;
  [ROUTES.REQUEST_DETAIL]: { request: BloodRequest };
  [ROUTES.EDIT_PROFILE]: { isEditing?: boolean };
  [ROUTES.CHAT]: { request: BloodRequest };
  [ROUTES.NOTIFICATIONS]: undefined;
  [ROUTES.MY_DONATIONS]: undefined;
  [ROUTES.HELP_SUPPORT]: undefined;
  [ROUTES.PRIVACY_POLICY]: undefined;
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
  [ROUTES.CHATS_LIST]: undefined;
  [ROUTES.PROFILE]: undefined;
  [ROUTES.SETTINGS]: undefined;
};

/** @deprecated Use MainTabParamList instead */
export type MainStackParamList = MainTabParamList;
