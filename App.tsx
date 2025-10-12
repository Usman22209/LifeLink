import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

interface GoogleUser {
  user: {
    name?: string;
    email?: string;
    photo?: string;
  };
}

const GoogleLoginScreen = () => {
  const [userInfo, setUserInfo] = useState<GoogleUser | null>(null);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '287582920955-nrn1ujvecn6pc6vh4c98vdl8cjpvpt4h.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const user = await GoogleSignin.signIn();
      console.log('Google User:', user);
      setUserInfo(user);
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      setUserInfo(null);
    } catch (error) {
      console.error('Google Sign-Out Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      {userInfo ? (
        <>
          {userInfo.user?.photo && (
            <Image source={{ uri: userInfo.user.photo }} style={styles.image} />
          )}
          <Text style={styles.text}>Welcome, {userInfo.user?.name || 'User'}</Text>
          <Text style={styles.email}>{userInfo.user?.email}</Text>
          <Button title="Logout" onPress={signOut} />
        </>
      ) : (
        <Button title="Sign in with Google" onPress={signIn} />
      )}
    </View>
  );
};

export default GoogleLoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 20,
  },
});
