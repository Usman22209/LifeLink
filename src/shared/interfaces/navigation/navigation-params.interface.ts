import { ROUTES } from "@utils/Routes";
import { BloodRequest } from "@screens/Main/FeedScreen/types";

export type UserStackParamList = {
  [ROUTES.AUTH_FLOW]: undefined;
  [ROUTES.MAIN_FLOW]: { screen?: string; params?: any } | undefined;
  [ROUTES.ONBOARDING]: undefined;
  [ROUTES.DONOR_QUESTIONNAIRE]?: { isEditing?: boolean; returnTo?: string };
  [ROUTES.REQUEST_DETAIL]: {
    request?: BloodRequest | any;
    requestId?: string;
    id?: string;
  };
  [ROUTES.EDIT_PROFILE]: { isEditing?: boolean };
  [ROUTES.CHAT]: {
    request?: BloodRequest | any;
    threadId?: string;
    participant?: any;
  };
  [ROUTES.NOTIFICATIONS]: undefined;
  [ROUTES.MY_DONATIONS]: undefined;
  [ROUTES.MY_REQUESTS]: undefined;
  [ROUTES.TRACK_REQUEST]: { requestId: string; request?: any };
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
