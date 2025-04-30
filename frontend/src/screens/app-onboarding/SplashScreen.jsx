import React, { useEffect } from 'react'
import {
    Image,
    View,
    StatusBar,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    PermissionsAndroid,
  } from 'react-native';
import { clearAsyncStorage, getUser, storeUser, storeValueByKey } from '../../helpers/UserData'
import { useNavigation } from '@react-navigation/native';
import {APP_API_LIBRARY_URL} from '@env';
import VersionNumber from 'react-native-version-number';
import axios from 'axios';
import { BeekindSplashScreenImage } from '../../config/app.config';
import { udyamitaTheme } from '../../config/styles/udyamitaTheme';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { useTranslation } from 'react-i18next';

export const SplashScreen = () => {
  const {t, i18n} = useTranslation();
    const navigation=useNavigation()
    const checkUser= async()=>{
     try {
       const user= await getUser()
       let PROFILE_STAGE='COMPLETE'
       console.log(user,user?.userInfo?.userRole?.length==0,user?.userInfo?.userRole);
 
       if (
         user && user?.userInfo
       ) {
         if(user && user?.userInfo && user?.userInfo?.name && user?.userInfo?.userRole?.length>0){
           PROFILE_STAGE='COMPLETE'
        }else if(user?.userInfo?.userRole && user?.userInfo?.userRole?.length>0){
          PROFILE_STAGE='PROFILE_CREATION'
      }else {
        PROFILE_STAGE='ROLE_SELECTION'
        } 
       }
       else{
         PROFILE_STAGE='REQUEST_OTP'
       }
      
      
   
         console.log('profile:  ============== >>>>> ', PROFILE_STAGE);
         switch (PROFILE_STAGE) {
           case 'COMPLETE':
             // console.log("inside")
             navigation.navigate('DrawerTabs');
             break;
           case 'PROFILE_CREATION':
            if(user?.userInfo?.userRole=='farmer'){
              navigation.navigate('Listfarm_form', {
                title: t('createYourAccount'),
              });
            }else{
              navigation.navigate('BeeLandingPageScreen', {
                title: t('createYourAccount'),
              });
            }
             break;
           case 'ROLE_SELECTION':
             console.log('role selected');
            navigation.navigate('RoleSelection', {
              title: t('createYourAccount'),
            });
             break;
           case 'REQUEST_OTP':
             // for first time user
             navigation.navigate('LanguageSelection');
             // navigation.navigate('RequestOtp');
             break;
         }
     } catch (error) {
      console.log('err in check user', error);
     }
      }

    async function onDisplayNotification(notificationData) {
      try {
       // console.log(notificationData.notification);
       askForNotificationPermissions()
        // Create a channel (required for Android)
        const channelId = await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
        });
    
        // Display a notification
        await notifee.displayNotification({
          title: 'aasffsas asf a sf',
          body: 'notificationData.notification.body', 
          android: {
            channelId,
            pressAction: {
              id: 'default',
            },
            smallIcon:'ic_launcher2',
           //  largeIcon: require('./src/assets/images/Carrot.png'),
             // Set color of icon (Optional, defaults to white)
             color: '#DE8726',
          },
        });
        console.log('send notification');
      } catch (error) {
         console.log(error,'err in sending notification in foreground notifee');
      }
     }
     const askForNotificationPermissions = () => {
      try {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        ).then(_type => {
          if (_type === 'granted') {
            console.log('Notification permission granted');
          }
        });
      } catch (error) {
        console.log('err in post notification permission',error);
      }
    };

    useEffect(() => {
      checkUser()
      
      // onDisplayNotification()
    }, []);



    return (
      <View
        style={{
          justifyContent: 'center',
          backgroundColor: 'white',
          flex: 1,
          alignItems: 'center',
        }}>
        {/* <Image
          source={require('../../assets/images/BeeKindlogo_Onboarding.png')}
          style={{width: 250, height: 100, alignSelf: 'center', margin: 10,resizeMode:'contain'}}
        /> */}
       <BeekindSplashScreenImage />
        <ActivityIndicator color={udyamitaTheme.primaryColor} />
      </View>
    );
}
