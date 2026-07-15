export const ROUTES = {
  // Root Flow
  AUTH_FLOW: "AuthFlow",
  MAIN_FLOW: "MainFlow",
  ONBOARDING: "Onboarding",

  // Auth
  WELCOME: "Welcome",
  LOGIN: "Login",
  SIGNUP: "Signup",
  FORGOT_PASSWORD: "ForgotPassword",
  RESET_PASSWORD: "ResetPassword",

  // Main (Tab Navigation)
  HOME: "Home",
  FEED: "Feed",
  REQUEST: "Request",
  NOTIFICATIONS: "Notifications",
  PROFILE: "Profile",
  SETTINGS: "Settings",

  // Details
  REQUEST_DETAIL: "RequestDetail",

  // Profile
  EDIT_PROFILE: "EditProfile",

  // Chat
  CHAT: "Chat",
  CHATS_LIST: "ChatsList",
  MY_DONATIONS: "MyDonations",
  HELP_SUPPORT: "HelpSupport",
  PRIVACY_POLICY: "PrivacyPolicy",
} as const;
