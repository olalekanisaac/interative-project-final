import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import OnboardingScreen from '../Screen/OnboardingScreen';
import WelcomeScreen from '../page/WelcomeScreen';
import SignIn from '../page/SignIn';
import SignUp from '../page/SignUp';
import BodyPic from '../app/BodyPic';
import LevelSelectionScreen from '../page/LevelSelectionScreen';
import ChooseInterestsScreen from '../page/ChooseInterestsScreen';
import RecordingScreen from '../Screen/RecordingScreen';
import TabHolder from '../Screen/TabHolder';
import ProfileScreen from '../Screen/ProfileScreen';
import FeedbackScreen from '../Screen/FeedbackScreen';
import LibraryScreen from '../Screen/LibraryScreen';

const Stack = createNativeStackNavigator();
const Appnavigate = () => {
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="OnboardingScreen">
      <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
      <Stack.Screen name="LevelSelectionScreen" component={LevelSelectionScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ChooseInterestsScreen" component={ChooseInterestsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="TabHolder" component={TabHolder} options={{ headerShown: false }} />
      <Stack.Screen name="RecordingScreen" component={RecordingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="FeedbackScreen" component={FeedbackScreen} options={{ headerShown: false }} />
      <Stack.Screen name="LibraryScreen" component={LibraryScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />

      
      <Stack.Screen name="BodyPic" component={BodyPic} options={{ headerShown: false }} />

    </Stack.Navigator>
    </NavigationContainer>
      );
};

export default Appnavigate;
