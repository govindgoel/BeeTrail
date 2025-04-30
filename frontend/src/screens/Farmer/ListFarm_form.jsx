/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
  Alert,
} from 'react-native';
import moment from 'moment';
import {getValueByKey, getUser, getToken, storeUser} from '../../helpers/UserData';
import {udyamitaTheme} from '../../config/styles/udyamitaTheme';
import CustomHeaderBee from '../../components/CustomHeaderBee';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {APP_API_USER_URL_SECOND} from '@env';
import axios from 'axios';
import Farmregistry_farmdetail from './Farmregistry_farmdetail';
import Farmerregistry_cropspecification from './Farmerregistry_cropspecification';
import Farmregistry_addphotos from './Farmregistry_addphotos';
import {useFocusEffect} from '@react-navigation/native';
import {useNetInfo} from '@react-native-community/netinfo';
// import {useRealm, Realm} from '@realm/react';
import CustomHeaderfarmer from '../../components/CustomHeaderfarmer';
import SelectCrops from '../../components/harvest/partials/SelectCrops2';
const farmcreationscreens = [
  Farmregistry_farmdetail,
  Farmerregistry_cropspecification,
  Farmregistry_addphotos,
];
// const RealmBSONObjectId = Realm.BSON.ObjectId;
const Listfarm_form = ({navigation, route}) => {
  // const realm = useRealm();
  const {isConnected} = useNetInfo();
  const [userInfo, setUserInfo] = useState(false);
  const {t} = useTranslation();
  const isEdit = !!route?.params?.editfarm || route?.params?.locationNav;
  const [showcropselection, setshowcropselection] = useState(false);
  const [currPg, setCurrPg] = useState(0);
  const [loading, setLoading] = useState(false);
  const {address, geoCoordinates} = isEdit
    ? route?.params?.editfarm?.location || route?.params
    : route?.params || '';

  const profileId = route?.params?.editfarm?._id || route?.params?.profileId;
  const [noofcropsoption, setnoofcropsoption] = useState(-1);
  const ApiaryCreationScreens = farmcreationscreens[currPg];
  const INITIAL_Farm_DETAILS = {
    name: '',
    organic: -1,
    addressLine: '',
    address: {
      district: '',
      state:'',
      location: {
        latitude: '',
        longitude: '',
      },
    },
    totalbeebox: '',
    farmsize: '',
    farming_method: '',
    bloomingdate: '',
    profilepicture: [],
    bloomingcrop: [],
    distance: '',
  };
  useFocusEffect(
    React.useCallback(() => {
      const getUserInfo = async () => {
        const user = await getUser();
        const token = await getToken();
        if (user && user.userInfo) {
          setUserInfo(user.userInfo);
        }
        if(user.userInfo.name){
        setfarmdetails(prev=>({
          ...prev,
          name:user.userInfo.name
        }))
      }
      };
      getUserInfo();
    }, []),
  );
  const [allowProceedToNextScreen, setAllowProceedToNextScreen] =
    useState(false);
  const [farmdetails, setfarmdetails] = useState(
    isEdit
      ? {
          id: route?.params?.editfarm?._id,
          name: route?.params?.editfarm?.name,
          organic: route?.params?.editfarm?.organic,
          addressLine: route?.params?.editfarm?.addressLine,
          address: route?.params?.editfarm?.address,
          totalbeebox: route?.params?.editfarm?.totalbeebox,
          farmsize: route?.params?.editfarm?.farmsize,
          farming_method: route?.params?.editfarm?.farming_method,
          bloomingdate: route?.params?.editfarm?.bloomingdate,
          profilepicture: route?.params?.editfarm?.profilepicture,
          bloomingcrop: route?.params?.editfarm?.bloomingcrop.map,
          distance: route?.params?.editfarm?.distance,
        }
      : INITIAL_Farm_DETAILS,
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
    if (currPg < farmcreationscreens.length - 1) {
      setCurrPg(currPg + 1);
    } else {
      handleSubmit();
    }
  };

  const updateUserProfile = async reqBody => {
    try {
      let url=`${APP_API_USER_URL_SECOND}farmer/register-farm`
      const token = await getToken();
      const config = {headers: {Authorization: 'Bearer ' + token}};
      await axios
        .post(url, reqBody, config)
        .then(data => {
          const userInfo = JSON.parse(JSON.stringify(data.data));
          console.log(userInfo,reqBody,'famr list');
          // storeUser(userInfo);
          // const userInfoDoc = userInfo.userInfo;
          console.log(isEdit,'fvfv');
          if(!isEdit){
            navigation.navigate('DrawerTabs')
          }
          else{
            navigation.goBack();
          }
        })
        .catch(error => {
          console.log('Error while updating enterprise:',error.message,error.response);
        });
    } catch (error) {
      console.log(error,'updating user',error.message,error.response);
    }
  };
  
  const handleOnlineFormSubmit = async () => {
   try {
     console.log('asf');
     const lng=(await getValueByKey('preferredLanguage'))
     let date=moment(farmdetails.bloomingdate).format('YYYY MM DD')

const dateString = '29 April 2025';

// Use moment to parse the string with the correct format
const momentDate = moment(dateString, 'DD MMMM YYYY');

// Convert the moment object to a native JavaScript Date object
const newDate = momentDate.toDate();

console.log(newDate);
    
    const user=await getUser()

    const reqBody = {
     name: farmdetails.name,
     farmer_id: user.userInfo.id,
       userRole: 'farmer',
       fulladdress: farmdetails.addressLine,
       location: farmdetails.address.location,
      state:   farmdetails.address.state,
       district:  farmdetails.address.district,
       total_beebox: farmdetails.totalbeebox,
       farm_size: farmdetails.farmsize,
       farming_method: farmdetails.farming_method,
       blooming_start_date: moment(farmdetails.bloomingdate).format('YYYY-MM-DD'),
       organic: farmdetails.organic,
       preferredLanguage:await getValueByKey('preferredLanguage'),
       profilepicture: farmdetails.profilepicture.map(it=>it.data),
    blooming_crops: farmdetails.bloomingcrop.map(it=>it.name),
     preferredLanguage:  lng|| 'en',
    };
      console.log(reqBody,date,'hjv  bn');
      user.userInfo.name=farmdetails.name
      console.log(user);
      await storeUser(user)
    updateUserProfile(reqBody)
   } catch (error) {
    console.log(error);
   }
  };

  const handleSubmit = async () => {
    console.log(farmdetails,moment(farmdetails.bloomingdate).format('DD MMMM YYYY'));
    handleOnlineFormSubmit();
    
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

  return showcropselection ? (
    <SelectCrops
      farmdetails={farmdetails}
      setfarmdetails={setfarmdetails}
      setshowcropselection={setshowcropselection}
      farmer={true}
    />
  ) : (
    <>
      <View style={styles.container}>
        <CustomHeaderfarmer
          navigation={navigation}
          title={isEdit ? t('editProfile') : t('createYourAccount')}
          stepNo={currPg + 1}
          setCurrPg={setCurrPg}
          handleBack={handleBack}
        />
        <ScrollView style={styles.section} showsVerticalScrollIndicator={false}>
          <ApiaryCreationScreens
            setnoofcropsoption={setnoofcropsoption}
            noofcropsoption={noofcropsoption}
            setCurrPg={setCurrPg}
            isEdit={isEdit}
            farmdetails={farmdetails}
            setfarmdetails={setfarmdetails}
            setAllowProceedToNextScreen={setAllowProceedToNextScreen}
            navigation={navigation}
            address={address}
            geoCoordinates={geoCoordinates}
            userInfo={userInfo}
            setshowcropselection={setshowcropselection}
          />
        </ScrollView>
      </View>
      <TouchableOpacity
        style={{
          ...styles.nextButton,
          ...(!allowProceedToNextScreen || loading
            ? {backgroundColor: udyamitaTheme.beeAppDisabledColor}
            : {}),
        }}
        onPress={handleNext}
        disabled={!allowProceedToNextScreen || loading}>
        {loading ? (
          <ActivityIndicator size={40} color="#fff" />
        ) : (
          <Text
            style={{
              color: 'white',
              fontSize: udyamitaTheme.themeFontSizeLabel,
              fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
            }}>
            {currPg === farmcreationscreens.length - 1
              ? isEdit
                ? t('saveChanges')
                : t('completeRegistration')
              : t('next')}{' '}
          </Text>
        )}
      </TouchableOpacity>
    </>
  );
};

export default Listfarm_form;

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
