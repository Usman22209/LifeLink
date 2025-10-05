import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import HomeScreen from 'screens/Home';
import VideoPlayerScreen from 'screens/common/VideoPlayer/VideoScreen';
export type RootStackParamList = {
  Home: undefined;
  VideoPlayer: {videoUrl: string};
};

const Stack = createStackNavigator<RootStackParamList>();

const Navigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
    </Stack.Navigator>
  );
};

export default Navigation;
