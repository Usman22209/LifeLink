import { useState, useEffect } from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import ENV from "@config/env";

export interface GoogleUser {
  user: {
    name?: string;
    email?: string;
    photo?: string;
  };
}

const useGoogleSignIn = () => {
  const { WEB_CLIENT_ID } = ENV;
  const [userInfo, setUserInfo] = useState<GoogleUser | null>(null);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
      offlineAccess: true,
    });
  }, [WEB_CLIENT_ID]);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      // Clear any previous sign-in session state so that Google always shows the account chooser modal
      try {
        await GoogleSignin.signOut();
      } catch (e) {
        // Safe to ignore if not already signed in
      }

      const user: any = await GoogleSignin.signIn();
      setUserInfo(user);

      return user;
    } catch (error: any) {
      console.error("❌ [GoogleSignin Error]:", error?.message || error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      try {
        await GoogleSignin.revokeAccess();
      } catch (e) {
        // Safe to ignore if access was already revoked
      }
      await GoogleSignin.signOut();
      setUserInfo(null);
    } catch (error) {
      console.error("Google Sign-Out Error:", error);
      throw error;
    }
  };

  return { userInfo, signIn, signOut };
};

export default useGoogleSignIn;
