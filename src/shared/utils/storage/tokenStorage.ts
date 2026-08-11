import * as Keychain from "react-native-keychain";

const REFRESH_TOKEN_KEY = "refresh_token";

export const tokenStorage = {
  /**
   * Stores the refresh token securely in the Keychain.
   */
  setRefreshToken: async (token: string) => {
    try {
      await Keychain.setGenericPassword(REFRESH_TOKEN_KEY, token, {
        service: REFRESH_TOKEN_KEY,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });
    } catch (error) {
      console.error("Error storing refresh token in Keychain:", error);
    }
  },

  /**
   * Retrieves the refresh token from the Keychain.
   */
  getRefreshToken: async (): Promise<string | null> => {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: REFRESH_TOKEN_KEY,
      });
      if (credentials) {
        return credentials.password;
      }
      return null;
    } catch (error) {
      console.error("Error retrieving refresh token from Keychain:", error);
      return null;
    }
  },

  /**
   * Removes the refresh token from the Keychain.
   */
  clearToken: async () => {
    try {
      await Keychain.resetGenericPassword({
        service: REFRESH_TOKEN_KEY,
      });
    } catch (error) {
      console.error("Error clearing refresh token from Keychain:", error);
    }
  },

  /**
   * Stores the push notification device token in Keychain.
   */
  setDeviceToken: async (token: string) => {
    try {
      await Keychain.setGenericPassword("device_push_token", token, {
        service: "device_push_token",
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });
      console.log("📱 [tokenStorage] Saved device_token:", token);
    } catch (error) {
      console.error("Error storing device token:", error);
    }
  },

  /**
   * Retrieves stored push notification device token.
   */
  getDeviceToken: async (): Promise<string | null> => {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: "device_push_token",
      });
      return credentials ? credentials.password : null;
    } catch (error) {
      return null;
    }
  },
};
