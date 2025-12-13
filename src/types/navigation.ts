import { ROUTES } from "@utils/Routes";

export type UserStackParamList = {
  [ROUTES.AUTH_FLOW]: undefined;
  [ROUTES.MAIN_FLOW]: undefined;
};

export type AuthStackParamList = {
  [ROUTES.LOGIN]: undefined;
  [ROUTES.SIGNUP]: undefined;
  [ROUTES.FORGOT_PASSWORD]: undefined;
};

export type MainStackParamList = {
  [ROUTES.HOME]: undefined;
  [ROUTES.PROFILE]: undefined;
  [ROUTES.SETTINGS]: undefined;
};
