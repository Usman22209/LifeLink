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

      const rawNonce =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

      const user: any = await GoogleSignin.signIn({ nonce: rawNonce } as any);
      setUserInfo(user);

      return {
        ...user,
        rawNonce,
      };
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
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
