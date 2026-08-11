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

      const user: any = await GoogleSignin.signIn();
      setUserInfo(user);

      const idToken = user?.data?.idToken || user?.idToken;

      console.log("🔍 [GoogleSignin Debug] Native response received:", {
        hasData: !!user?.data,
        hasIdToken: !!idToken,
        idTokenPreview: idToken ? `${idToken.substring(0, 30)}...` : "NONE",
      });

      return user;
    } catch (error: any) {
      console.error("❌ [GoogleSignin Error]:", error?.message || error);
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
