import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import moment from 'moment';
import {getValueByKey, getUser, getToken, storeUser} from '../../helpers/UserData';
import {udyamitaTheme} from '../../config/styles/udyamitaTheme';
import CustomHeaderBee from '../../components/CustomHeaderBee';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {APP_API_MENTOR_VAlUECHAIN_SERVICES,APP_API_USER_URL_SECOND} from '@env';
import axios from 'axios';
import BeeRegisterMyApiary from './BeeRegisterMyApiary';
import BeeRegisterMyHives from './BeeRegisterMyHives';
import BeeRegisterMyBees from './BeeRegisterMyBees';
import {useFocusEffect} from '@react-navigation/native';
import {useNetInfo} from '@react-native-community/netinfo';
import { useRef } from 'react';
import Geocoder from 'react-native-geocoding';
import Geolocation from 'react-native-geolocation-service';
import { err } from 'react-native-svg/lib/typescript/xml';
import districts from '../../constants/Districts';
const apiaryCreationScreens = [
  BeeRegisterMyApiary,
  BeeRegisterMyHives,
  BeeRegisterMyBees,
];
const BeeLandingPageScreen = ({navigation, route}) => {
  const {isConnected} = useNetInfo();
  const [userInfo, setUserInfo] = useState(false);
  const {t} = useTranslation();
  const isEdit = !!route?.params?.editApiary || route?.params?.locationNav;
  const [editprofile, seteditprofile] = useState(false)
  const [currPg, setCurrPg] = useState(0);
  const [loading, setLoading] = useState(false);
  const {address, geoCoordinates} = isEdit
    ? route?.params?.editApiary?.location || route?.params
    : route?.params || '';
  const [clickonnext, setclickonnext] = useState(0)

  const profileId = route?.params?.editApiary?._id || route?.params?.profileId;
  const location = useRef({
    latitude:'',
    longitude:''
  })
  const ApiaryCreationScreens = apiaryCreationScreens[currPg];
  const INITIAL_BEEKEEPER_DETAILS = {
    name: '',

    location: '',

    numberOfHivesWithBroodOnly: '',
    numberOfHivesWithBroodAndSuper: '',
    frameCountPerChamber: '',
    typeOfBees: '',

    environmentType: '',
    totalChamberCount: '',
    isCouple: false,
    latitude: null,
    district:'',
    state:'',
    address:'',
    longitude: null,
    apiaryImage:null,
  };
  useFocusEffect(
    React.useCallback(() => {
      const getUserInfo = async () => {
        const user = await getUser();
        const token = await getToken();
        if (user && user.userInfo) {
          setUserInfo(user.userInfo);
        }
      };
      getUserInfo();
    }, []),
  );

  const syncdata = async () => {
    let user = await getUser();
    user = user.userInfo;
  
    console.log(user);
  
    setapiaryDetails(prev => ({
      ...prev,
      name: user.name || '',
      location: user.fulladdress || '',
      numberOfHivesWithBroodOnly: user.numberOfHivesWithBroodOnly?.toString() || '',
      numberOfHivesWithBroodAndSuper: user.numberOfHivesWithBroodAndSuper?.toString() || '',
      frameCountPerChamber: user.frameCountPerChamber?.toString() || '',
      typeOfBees: user.typeOfBees || '',
      environmentType: 'Forest Area (Plains)', // Assuming this isn't provided, so left blank
      latitude: user.location?.latitude || null,
      longitude: user.location?.longitude || null,
      district: user.district || '',
      state: user.state || '',
      address: user.fulladdress || ''
    }));
    seteditprofile(true)
  };
  useEffect(() => {
    if(route.params?.title){

    }
    else{
      syncdata()
    }
  }, [])
  
  useEffect(() => {
    const requestLocationPermission = async () => {
       try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'This app needs access to your location.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Location permission granted');
            // Fetch the location here
            
              // const ss = await new Promise((resolve, reject) => {
              //   Geolocation.getCurrentPosition(
              //     position => {
              //       resolve(position);
              //     },
              //     error => {
              //       reject(error);
              //     },
              //     { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
              //   );
              // });
              // console.log(ss);
              // ll=ss
              // location.current.latitude = ss.coords.latitude;
              // location.current.longitude = ss.coords.longitude;
           
          } else {
            console.log('Location permission denied');
            Alert.alert(
              'Permission Denied',
              'Location permission is required to access your location.'
            );
          }
        } catch (err) {
          console.warn(err);
        }
    };

    requestLocationPermission();
  }, []);
 
  const [allowProceedToNextScreen, setAllowProceedToNextScreen] =
    useState(false);
  const [apiaryDetails, setapiaryDetails] = useState(
 INITIAL_BEEKEEPER_DETAILS,
  );
  const handleBack = () => {
    if (currPg > 0) {
      setCurrPg(currPg - 1);
      setLoading(false);
    } else {
      Alert.alert(
        `${t('holdOn')}`,
        `${t('areYouSureYouWantToGoBack')}`,
        [
          {
            text: `${t('cancel')}`,
            onPress: () => null,
            style: 'cancel',
          },
          {
            text: `${t('yes')}`,
            onPress: () => navigation.goBack(),
          },
        ],
        {cancelable: true},
      );
      setLoading(false);
    }
  };
  const handleNext = async () => {
    if (currPg < apiaryCreationScreens.length - 1) {
      setCurrPg(currPg + 1);
      setclickonnext(0)
    } else {
      handleSubmit();
    }
  };

  

  const handleSubmit = async () => {
    console.log(apiaryDetails);
      handleOnlineFormSubmit();
  };
  const updateUserProfile = async reqBody => {
    try {
      const url=`${APP_API_USER_URL_SECOND}beekeeper/register`
      const token = await getToken();
      const config = {headers: {Authorization: 'Bearer ' + token}};
      await axios
        .post(url, reqBody, config)
        .then(data => {
          const userInfo = JSON.parse(JSON.stringify(data.data));
          console.log(userInfo,reqBody);
          storeUser({userInfo:userInfo});
          // const userInfoDoc = userInfo.userInfo;
          // console.log(isEdit,'fvfv');
          if(!editprofile){
            navigation.navigate('DrawerTabs')
          }
          else{
            navigation.goBack();
          }
        })
        .catch(err => {
          console.log('Error while updating enterprise:', err);
        });
    } catch (error) {
      console.log(error,'updating user');
    }
  };
  
  const handleOnlineFormSubmit = async () => {
   try {
    const user=await getUser()
     console.log('asf',user);
     const lng=(await getValueByKey('preferredLanguage'))
    const reqBody = {
      beekeeper_id:user.userInfo.id || user.userInfo.beekeeper_id,
     name: apiaryDetails.name,
    
       userRole: 'beekeeper',
       fulladdress: apiaryDetails.address,
       location: {
         latitude:apiaryDetails.latitude,
         longitude:apiaryDetails.longitude,
       },
      state:   apiaryDetails.state,
       district:  apiaryDetails.district,
       numberOfHivesWithBroodOnly: apiaryDetails.numberOfHivesWithBroodOnly,
       numberOfHivesWithBroodAndSuper: apiaryDetails.numberOfHivesWithBroodAndSuper,
       frameCountPerChamber: apiaryDetails.frameCountPerChamber,
       typeOfBees:apiaryDetails.typeOfBees,
     preferredLanguage:  lng|| 'en',
      };
      user.userInfo.name=apiaryDetails.name
      
      console.log(reqBody,user,'hjv  bn');
      // storeUser(user)
    updateUserProfile(reqBody)
   } catch (error) {
    console.log(error);
   }
  };

  useEffect(() => {
    const backAction = () => {
      handleBack();

      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [currPg, navigation, t]);
  const handleBackToListScreen = () => {
    Alert.alert(
      `${t('holdOn')}`,
      `${t('areYouSureYouWantToGoBack')}`,
      [
        {
          text: `${t('cancel')}`,
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: `${t('yes')}`,
          onPress: () => navigation.goBack(),
        },
      ],
      {cancelable: true},
    );
  };
  return (
    <>
      <View style={styles.container}>
        <CustomHeaderBee
          navigation={navigation}
          title={editprofile ?  t('editProfile') : t('createYourAccount')}
          stepNo={currPg + 1}
          setCurrPg={setCurrPg}
          handleBack={handleBack}
        />
        <ScrollView style={styles.section} showsVerticalScrollIndicator={false}>
          <ApiaryCreationScreens
            clickonnext={clickonnext}
            setCurrPg={setCurrPg}
            isEdit={editprofile}
            apiaryDetails={apiaryDetails}
            setapiaryDetails={setapiaryDetails}
            setAllowProceedToNextScreen={setAllowProceedToNextScreen}
            navigation={navigation}
            address={address}
            geoCoordinates={geoCoordinates}
            userInfo={userInfo}
          />
        </ScrollView>
      </View>
      <TouchableOpacity
        style={{
          ...styles.nextButton,
          
        }}
        onPress={()=>{
          console.log(allowProceedToNextScreen);
          if(allowProceedToNextScreen)
            {
              handleNext()   
            }   
          else{
            setclickonnext(clickonnext+1)
          }      
        }}
        // disabled={!allowProceedToNextScreen || loading}
        >
        {loading ? (
          <ActivityIndicator size={40} color="#fff" />
        ) : (
          <Text
            style={{
              color: 'white',
              fontSize: udyamitaTheme.themeFontSizeLabel,
              fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
            }}>
            {currPg === apiaryCreationScreens.length - 1
              ? editprofile
                ? t('saveChanges')
                : t('completeRegistration')
              : t('next')}{' '}
          </Text>
        )}
      </TouchableOpacity>
    </>
  );
};

export default BeeLandingPageScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: udyamitaTheme.themeBgColor,
    flex: 1,
  },
  section: {
    // marginLeft: 20,
    // marginRight: 20,
    //marginTop: 8,
    marginBottom: 60,

    //height:'auto',
    flex: 1,
  },

  nextButton: {
    backgroundColor: udyamitaTheme.beeAppColor,
    width: '90%',
    height: 52,
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 20,
  },
});
