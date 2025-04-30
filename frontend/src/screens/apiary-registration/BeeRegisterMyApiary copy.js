import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {FetchIcon} from '../../components/IconSvgs';
import {winHeight} from '../../helpers/dimensions';
import {useTranslation} from 'react-i18next';
import { getUser,getToken } from '../../helpers/UserData';
import {
  PrimaryButton,
  PrimaryInput,
  LabelText,
  ButtonText,
  PrimaryMargin,
} from '../../components/reusable/UIComponentsBeeApp';
import Geocoder from 'react-native-geocoding';
import {udyamitaTheme} from '../../config/styles/udyamitaTheme';
import {useSelector, useDispatch} from 'react-redux';
import {setApiaryObject} from '../../store/reducers/beeReducer';
import {saveLocalApiaryDetails} from '../../store/services/bee-services';
import CustomText from '../../components/reusable/CustomText';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
export default function BeeRegistryMyApiary({
  navigation,
  setCurrPg,
  setApiaryObj,
  apiaryObj,
  userName,
  isEdit,
  address,
  editApiary,
  geoCoordinates,
}) {

  const {t} = useTranslation();
  const dispatch = useDispatch();
  const apiaryObject = useSelector(state => state.bee.apiaryObject);
  const [userInfo, setUserInfo] = useState(false);
  useFocusEffect(
    React.useCallback(() => {
      const getUserInfo = async () => {
        const user = await getUser();
        const token = await getToken();
        if (user && user.userInfo) {
          
          setUserInfo(user.userInfo);
          console.log("🚀 ~ getUserInfo ~ user.userInfo:", user.userInfo)
        }
      };
      getUserInfo();
    }, []),
  );

  const INITIAL_DETAILS1 = {
    name: `${editApiary?.name}`,
    days: apiaryObj?.days,
    location: {
      address: address,
      geoCoordinates: {
        latitude: geoCoordinates?.latitude,
        longitude: geoCoordinates?.longitude,
      },
    },
  };
  const [details1, setDetails1] = useState(INITIAL_DETAILS1);
  useEffect(() => {
    Geocoder.init('AIzaSyBg4tz2fOqTqAny-Hph8blHRP9YeRTuIDg');
  }, []);
  useEffect(() => {
    if (apiaryObj) {
      setDetails1(prevState => {
        return {
          ...prevState,
          name: `${userInfo?.name}'s apiary`,
          days: apiaryObj?.days,
          location: {
            address: address || address,
            geoCoordinates: {
              latitude: geoCoordinates?.latitude || geoCoordinates?.latitude,
              longitude: geoCoordinates?.longitude || geoCoordinates?.longitude,
            },
          },
        };
      });
    }
  }, [userInfo, apiaryObject, address,geoCoordinates]);


  



useEffect(() => {
 
  let tObj = { ...apiaryObj, name: `${details1.name}'s apiary`, location:details1?.location };
  dispatch(setApiaryObject(tObj));
  dispatch(saveLocalApiaryDetails({ dispatch: dispatch, apiaryObj: tObj }));


}, [userInfo]);




  return (
    <>
      <ScrollView
        contentContainerStyle={{paddingTop: 20, backgroundColor: udyamitaTheme.themeBgColor}}>
        <View style={styles.root}>
          <PrimaryInput
            label={t('nameOfApiary')}
            placeholder={t('nameOfApiary')}
            editable={false}
            value={details1?.name}
            defaultValue={details1?.name}
            onChangeText={text => {
              setDetails1(prevState => {
                return {
                  ...prevState,
                  name: text,
                };
              });

              let tObj = {};
              tObj = {
                ...apiaryObj,
                name: text,
              };
              dispatch(setApiaryObject(tObj));
              dispatch(
                saveLocalApiaryDetails({dispatch: dispatch, apiaryObj: tObj}),
              );
            }}
          />
          <LabelText>{t('daysSinceApiary')}</LabelText>
          <PrimaryInput
            activeOutlineColor={details1?.days > 120 || details1?.days<1 ? 'red': '#FEC251'}
            label={details1?.days > 120 || details1?.days<1 ? t('enterValidDays') :t('enterNumDays') }
            placeholder={t('enterNumDays')}
            value={details1?.days?.toString()}
            keyboardType="numeric"
            onChangeText={text => {
              setDetails1(prevState => {
                return {
                  ...prevState,
                  days: text,
                };
              });

              setApiaryObj(prevState => {
                return {
                  ...prevState,
                  days: text,
                };
              });
              let tObj = {};
              tObj = {
                ...apiaryObj,
                name: details1?.name,
                days: text,
              };
              dispatch(setApiaryObject(tObj));
              dispatch(
                saveLocalApiaryDetails({dispatch: dispatch, apiaryObj: tObj}),
              );
            }}
          />
          {/* {apiaryObject?.location?.address || !address ? null :    <TouchableOpacity
            onPress={() => {
              navigation.navigate('GeoLocationService');
            }}
            style={styles.fetchBtn}>
            <FetchIcon />
            <CustomText style={styles.fetchTxt} type='label'>{t('fetchMyLocation')}</CustomText>
          </TouchableOpacity>} */}
       
          <PrimaryMargin mt={10} />
          {(apiaryObj?.location?.address || address)  ? (
            <>
              <LabelText>{t('apiaryLocation')}</LabelText>
              <CustomText
                style={{fontFamily: udyamitaTheme.mainThemeFontFamily}}>
                {address ? address :apiaryObj?.location?.address}
              </CustomText>
            </>
          ):null}
            {apiaryObject?.location?.address  || address?  <TouchableOpacity
            onPress={() => {
              navigation.navigate('GeoLocationService',{apiaryObject,isEdit,editApiary});
            }}
            style={styles.fetchBtn}>
            <FetchIcon />
            <CustomText style={styles.fetchTxt} type='label'>{t('editLocation')}</CustomText>
          </TouchableOpacity>: <TouchableOpacity
            onPress={() => {
              navigation.navigate('GeoLocationService');
            }}
            style={styles.fetchBtn}>
            <FetchIcon />
            <CustomText style={styles.fetchTxt} type='label'>{t('fetchMyLocation')}</CustomText>
          </TouchableOpacity>}
       
        </View>
      </ScrollView>

      <View style={styles.staticBtm}>
        <PrimaryButton
          onPress={() => {
            let today = new Date();

            if(isEdit){
              setApiaryObj(prevState => {
                return {
                  ...prevState,
                  name: details1?.name,
                  days: details1?.days,
                  setupDate: apiaryObj?.days === details1?.days  ? editApiary?.setupDate : new Date(
                    today.setDate(new Date(today).getDate() - details1?.days),
                  ),
                };
              });
              let tObj = {};
              tObj = {
                ...apiaryObj,
                name: details1?.name,
                days: details1?.days,
                setupDate: apiaryObj.days === details1?.days  ? editApiary?.setupDate : new Date(
                  today.setDate(new Date(today).getDate() - details1?.days),
                ),
              };
              dispatch(setApiaryObject(tObj));
              dispatch(
                saveLocalApiaryDetails({dispatch: dispatch, apiaryObj: tObj}),
              );
              setCurrPg(2);
            } else {

            
            setApiaryObj(prevState => {
              return {
                ...prevState,
                name: details1?.name,
                days: details1?.days,
                setupDate: new Date(
                  today.setDate(new Date(today).getDate() - details1?.days),
                ),
              };
            });
            let tObj = {};
            tObj = {
              ...apiaryObj,
              name: details1?.name,
              days: details1?.days,
              setupDate: new Date(
                today.setDate(new Date(today).getDate() - details1?.days),
              ),
            };
            dispatch(setApiaryObject(tObj));
            dispatch(
              saveLocalApiaryDetails({dispatch: dispatch, apiaryObj: tObj}),
            );
            setCurrPg(2);}
          }}
          disabled={!(details1?.days > 0 && details1?.days < 200 && details1?.location?.address)}

          >
          <ButtonText>{t('next')}</ButtonText>
        </PrimaryButton>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 20,
    minHeight: winHeight - 180,

    position: 'relative',
  },
  staticBtm: {
    position: 'absolute',
    bottom: 0,
    padding: 20,
    minWidth: '100%',
  },
  dateBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: '100%',
  },
  dropDate: {
    marginRight: 10,
  },
  fetchBtn: {
    minHeight: 52,
    backgroundColor: udyamitaTheme.themeBgColor,
    justifyContent: 'center',
    textAlign: 'center',
    borderRadius: 12,
    borderColor: udyamitaTheme.beeAppColor,
    borderWidth: 1.2,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 28,
  },
  fetchTxt: {
    color: udyamitaTheme.beeAppColor,
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    fontSize: udyamitaTheme.themeFontSizeLabel,
   
    lineHeight: 24,
    marginLeft: 10,
  },
  drop1: {
    marginBottom: 16,
  },
  drop2: {
    marginBottom: 16,
  },
});
