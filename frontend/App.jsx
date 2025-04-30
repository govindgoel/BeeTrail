
import React, { useRef, useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {API_APP_FIELD_URL} from '@env';
import StackNavigator from './src/navigation/StackNavigator';
import { useNetInfo } from '@react-native-community/netinfo';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import analytics, {setUserId} from '@react-native-firebase/analytics';
import UserProvider from './src/helpers/AuthContext';
import DrawerTabs from './src/navigation/DrawerTabs';
import OnBoardingStack from './src/navigation/OnBoardingStack';

function App() {
  // const {isConnected} = useNetInfo();
  const [updating, setupdating] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState(false);
  const [showdownloadtext, setshowdownloadtext] = useState(false);
  const [showrestarttext, setshowrestarttext] = useState(false);
  const [DownloadProgress, setDownloadProgress] = useState(0);
  const currentSpan = useRef(null);
  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      card: 'white',
    },
  };
  // useEffect(() => {
  //   if (loggedInUserId && isConnected) {
  //     syncAllInfoWhileOnline(loggedInUserId);
  //   }
  // }, [loggedInUserId, isConnected]);


  const routeNameRef = React.useRef();
  const navigationRef = React.useRef();
  return (
    <>
    <NavigationContainer
      ref={navigationRef}
      onReady={ async() => {
        const _loggedInUserId = (await getUser())?.userInfo;
        setLoggedInUserId(_loggedInUserId);
        routeNameRef.current = navigationRef.current.getCurrentRoute()?.name;
        setCurrentScreenName(navigationRef?.current?.getCurrentRoute()?.name);
      }}
      onStateChange={async () => {
         
        const previousRouteName = routeNameRef?.current;
        const currentRouteName =
          navigationRef?.current?.getCurrentRoute()?.name;
          await analytics().logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName,
          });
        if (previousRouteName !== currentRouteName) {
          setCurrentScreenName(navigationRef?.current?.getCurrentRoute()?.name);
        }
        routeNameRef.current = currentRouteName;
      }}
      >
         <UserProvider>
      <OnBoardingStack/>
         </UserProvider>
    </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
