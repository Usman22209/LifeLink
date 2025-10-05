import {useEffect, useState} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

type User = FirebaseAuthTypes.User | null;

const useEmail = () => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(authUser => {
      setUser(authUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (
    email: string,
    password: string,
  ): Promise<FirebaseAuthTypes.User> => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      return userCredential.user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const signIn = async (
    email: string,
    password: string,
  ): Promise<FirebaseAuthTypes.User> => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      return userCredential.user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await auth().signOut();
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      await auth().sendPasswordResetEmail(email);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  return {user, loading, signUp, signIn, signOut, resetPassword};
};

export default useEmail;
