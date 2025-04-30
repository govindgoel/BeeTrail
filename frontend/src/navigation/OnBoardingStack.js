import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import ConfirmOtp from '../screens/app-onboarding/ConfirmOtp';
import LanguageSelection from '../screens/app-onboarding/LanguageSelection';
import RequestOtp from '../screens/app-onboarding/RequestOtp';
import ProfileCreationForm from '../screens/app-onboarding/ProfileCreationForm';
import DrawerTabs from './DrawerTabs';
import RoleSelection from '../screens/app-onboarding/RoleSelection';
import { SplashScreen } from '../screens/app-onboarding/SplashScreen';
import BeeLandingPageScreen from '../screens/apiary-registration/BeeLandingPageScreen';
import Listfarm_form from '../screens/Farmer/ListFarm_form';

const Stack = createNativeStackNavigator();

export default function OnBoardingStack() {
  return (
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="DrawerTabs" component={DrawerTabs} />
        <Stack.Screen name="ConfirmOtp" component={ConfirmOtp} />
        <Stack.Screen name="LanguageSelection" component={LanguageSelection} />
        <Stack.Screen name="RequestOtp" component={RequestOtp} />
        <Stack.Screen
          name="BeeLandingPageScreen"
          component={BeeLandingPageScreen}
        />
        <Stack.Screen
          name="Listfarm_form"
          component={Listfarm_form}
        />
        <Stack.Screen name="RoleSelection" component={RoleSelection} />
      </Stack.Navigator>
  );
}
