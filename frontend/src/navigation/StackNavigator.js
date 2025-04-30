import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SplashScreen} from '../screens/app-onboarding/SplashScreen';
import {Text} from 'react-native';
import { Signin } from '../screens/app-onboarding/Signin';
import RequestOtp from '../screens/app-onboarding/RequestOtp';
import ConfirmOtp from '../screens/app-onboarding/ConfirmOtp';
import RoleSelection from '../screens/app-onboarding/RoleSelection';
import ProfileCreationForm from '../screens/app-onboarding/ProfileCreationForm';
import Farmer_Createaccount from '../screens/Farmer/Farmer_createaccount';
import Listfarm_form from '../screens/Farmer/ListFarm_form';
import Farmer_dashboard from '../screens/Farmer/Farmer_dashboard';
import LanguageSelection from '../screens/app-onboarding/LanguageSelection';
import FarmListing from '../screens/apiary-migration/FarmListing';
import MigrationForm from '../screens/apiary-migration/MigrationForm';
import FarmDetails from '../screens/apiary-migration/FarmDetails';
import ReserveFarm from '../screens/apiary-migration/ReserveFarm';
import PastMigrationDetailsCard from '../components/apiary-migration/partials/PastMigrationDetailsCard';
import FarmReserveSuccess from '../components/apiary-migration/reusable/FarmReserveSuccess';
import MigrationHomeScreen from '../screens/apiary-migration/MigrationHomeScreen';
import FarmerPastMigration from '../screens/Farmer/FarmerPastMigration';
import BeeLandingPageScreen from '../screens/apiary-registration/BeeLandingPageScreen';
import Migration_dashboard from '../screens/apiary-migration/Migration_dashboard';
import BeekeeperPastMigration from '../screens/apiary-migration/BeekeeperPastMigration';

const Stack = createNativeStackNavigator();
export default function StackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Migration_dashboard" 
      screenOptions={{headerShown: false}}>
      {/* <Stack.Screen name="Splashscreen" component={SplashScreen} /> */}
      <Stack.Screen name="RequestOtp" component={RequestOtp} />
      <Stack.Screen name="ConfirmOtp" component={ConfirmOtp} />
      <Stack.Screen name="RoleSelection" component={RoleSelection} />
      <Stack.Screen
          name="beekeeperProfile"
          component={BeeLandingPageScreen}
        />

      <Stack.Screen name="LanguageSelection" component={LanguageSelection} />

      {/* Farmer */}
      <Stack.Screen name="Farmercreate_account" component={Farmer_Createaccount} />
        <Stack.Screen name="Listfarm_form" component={Listfarm_form} />
        <Stack.Screen name="Farmer_dashboard" component={Farmer_dashboard} />
        <Stack.Screen name="FarmerPastMigration" component={FarmerPastMigration} />

         {/* Migration */}
         <Stack.Screen name="FarmListing" component={FarmListing} />
        <Stack.Screen name="MigrationForm" component={MigrationForm} />
        <Stack.Screen name="FarmDetails" component={FarmDetails} />
        <Stack.Screen name="ReserveFarm" component={ReserveFarm} />
        <Stack.Screen name="PastMigrationBeekeeper" component={BeekeeperPastMigration} />
        <Stack.Screen
          name="FarmReserveSuccess"
          component={FarmReserveSuccess}
        />
        <Stack.Screen
          name="MigrationHomeScreen"
          component={MigrationHomeScreen}
        />
        <Stack.Screen name="Migration_dashboard" component={Migration_dashboard} />

    </Stack.Navigator>
  );
}
