/* eslint-disable react-hooks/exhaustive-deps */
import React, {useContext, useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import {APP_API_USER_URL_SECOND} from '@env';
import Toast from 'react-native-simple-toast';
// import RNOtpVerify from 'react-native-otp-verify';
// import analytics from '@react-native-firebase/analytics';
import CustomText from '../../components/reusable/CustomText';
import {udyamitaTheme} from '../../config/styles/udyamitaTheme';
import {storeUser, storeValueByKey} from '../../helpers/UserData';
import {AppWelcomeText, CoverImages, appWelcomeColor} from '../../config/app.config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setUserRole} from '../../store/reducers/userRoleReducer';
import {
  getHash, requestHint,
  startOtpListener,
  useOtpVerify,
} from 'react-native-otp-verify';
import sendLog from '../../helpers/SyncLogs';
import fcmessaging from '@react-native-firebase/messaging';
import { useTranslation } from 'react-i18next';

const CELL_COUNT = 4;


// const APP_API_USER_URL = "http://192.168.1.57:8088";

const ConfirmOtp = ({ navigation, route }) => {
  const TIMER_VALUE = 60;
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const ref = useBlurOnFulfill({value, cellCount: 6});
  const [timerCount, setTimer] = useState(TIMER_VALUE);
  const [leadId, setLeadId] = useState(null);
  const [userRegistered, setUserRegistered] = useState(false);
  const [name, setName] = useState('');
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const {t, i18n} = useTranslation();
  const [hashFromMethod, setHashFromMethod] = useState("");
  const [otpFromMethod, setOtpFromMethod] = useState("");
  const [hint, setHint] = useState("");

  useEffect(() => {
    if (timerCount == 0) {
      return;
    }
    let interval = setInterval(() => {
      setTimer(lastTimerCount => {
        lastTimerCount <= 1 && clearInterval(interval);
        return lastTimerCount - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // useEffect(() => {
  //   getHash().then((r)=>{
  //     console.log(r);   
  //     setHashFromMethod(r)
    
  // }).catch(console.log);
  //   // requestHint().then(setHint).catch(console.log);
  //   startOtpListener((data) =>{
  //     console.log(data);
  //     const otpRegex = /(\d{4})/; // This regex matches any 4 consecutive digits
  // const match = data.match(otpRegex); // Using match method to find the regex match
  
  // if (match && value=='') {
  // console.log(match[1]); 
  // setValue(match[1])
  // verifyOTP(match[1])
  // }
  //       });
  // }, []);
  const data = {
    otp: value,
    userRole:route.params.user.userRole,
    mobileNumber: route.params.user.mobileNumber,
    preferredLanguage: 'en',
  };

  const verifyOTP = async(otp=false) => {
    const url=`${APP_API_USER_URL_SECOND}otp/verify-otp`

    setLoading(true);
    data.otp='132459'
    console.log(data);
    axios
      .post(url, data)
      .then(async response => {

        if (response.status === 200) {
          console.log("🚀 ~ verifyOTP ~ response.data:", response.data)
          if (response.data && response.data) {
            
            storeUser({
              userInfo:response.data.data
              
            });
            await storeValueByKey('token', response.data.data.id);
          }
          let user =response.data.data
          let PROFILE_STAGE='COMPLETE'
          console.log(user,'user info',user?.userRole=='farmer',user?.userRole);
          if (
            user
          ) {
            console.log('navigate to drawertabs');
            if(user && user?.name && user?.userRole?.length>0){
              PROFILE_STAGE='COMPLETE'
            }else if(user?.userRole && user?.userRole?.length>0){
              PROFILE_STAGE='PROFILE_CREATION'
           }
          }
         
         
      
            console.log('profile:  ============== >>>>> ', PROFILE_STAGE);
            switch (PROFILE_STAGE) {
              case 'COMPLETE':
                navigation.navigate('DrawerTabs');
                break;
              case 'PROFILE_CREATION':
                if(user?.userRole=='farmer'){
                  navigation.navigate('Listfarm_form', {
                    title: t('createYourAccount'),
                  });
                }else{
                  navigation.navigate('BeeLandingPageScreen', {
                    title: t('createYourAccount'),
                  });
                }
                break;
            }
        }
      })
      .catch(err => {
        console.log('err in otp', err);
        Toast.show(`You have filled wrong OTP`, Toast.LONG)
        setLoading(false);
      });
  };

  const resendOtp = () => {
    // console.log( route.params.user);
    const body={
      mobileNumber: route.params.user.mobileNumber,
        // preferredLanguage: route.params.user.preferredLanguage,
        // firebaseToken: route.params.user.firebaseToken,
        // hash:route.params.user.hash
        userRole:route.params.user.userRole
    }
    // console.log(body);
    axios
      .post(`${APP_API_USER_URL_SECOND}otp/send-otp`, body)
      .then(
        response =>
        {
          console.log(response.status);
          if(response.status === 200 ){
          setTimer(TIMER_VALUE)
          Toast.show(`Otp resend request sent`, Toast.LONG)
        }
        }
      )
      .catch(err => {
        if(err.response.data.errorMessage){
          Toast.show(err.response.data.errorMessage, Toast.LONG)
        }
        console.log(err?.response?.data);
      }
    )
  };

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const WelcomeToUdyamita = useCallback(() => (
    <>
       <Text>
          {t(AppWelcomeText).split(' ').map(word => (
            <CustomText
              style={
                word === t('udyamita') || word === t('beeKind')
                  ? styles.udyamitaText
                  : styles.welcomeText
              }
              type="mlabel">{`${word} `}</CustomText>
          ))}
        </Text>
    </>
  ),[AppWelcomeText] );
  return (
    // <OnboardingTemplate
    //   ChildrenComponent={ChildComponent}
    //   buttonLabel={t('verifyOtp')}
    //   buttonOnpress={verifyOTP}
    //   loading={loading}
    //   buttonDisabled={value.length !== 4}
    // />
    <View
      style={{
        backgroundColor: udyamitaTheme.themeBgColor,
        position: 'absolute',
        flex: 1,
        height: windowHeight,
      }}>
      <View style={{...styles.container, width: windowWidth}}>
        <CoverImages />
        <View style={styles.welcomeToUdyamitaContainer}>
          <WelcomeToUdyamita />
        </View>
        {/* {ChildrenComponent ? <ChildrenComponent/>  : null} */}
        <ScrollView>
          <CustomText style={[styles.label]} type="mlabel">
            {t('otpSentToNumber').replace(
              'replaceNumber',
              route.params.user.mobileNumber,
            )}
          </CustomText>
          <CodeField
            ref={ref}
            {...props}
            value={value}
            onChangeText={setValue}
            cellCount={6}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({index, symbol, isFocused}) => (
              <CustomText
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}
                
                >
                {symbol || (isFocused ? <Cursor /> : null)}
              </CustomText>
            )}
          />
          <View style={{alignSelf: 'center'}}>
            {timerCount ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 20,
                }}>
                {/* <TouchableOpacity onPress={() => resendOtp()}> */}
                <CustomText style={[styles.labelGrey]} type='label'>
                  {t('didntReceiveAnOtp')}{' '}
                </CustomText>
                {/* </TouchableOpacity> */}
                {/* <TouchableOpacity onPress={() => resendOtp()}> */}
                  <CustomText
                    style={[
                      styles.labelGrey,
                      {textDecorationLine: 'underline'},
                    ]} type='label'>
                    {t('resendOtp').replace('replaceSeconds', timerCount)}
                  </CustomText>
                {/* </TouchableOpacity> */}
              </View>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  // marginTop: 20,
                }}>
                <CustomText style={[styles.label]} type='label'>{t('didntReceiveAnOtp')} </CustomText>
                <TouchableOpacity onPress={() => resendOtp()}>
                  <CustomText
                    style={[
                      styles.label,
                      {
                        color: udyamitaTheme.primaryColor,
                        textDecorationLine: 'underline',
                      },
                    ]} type='label'>
                    {/* {t('resendOtp').replace('replaceSeconds', timerCount)} */}
                    {t('resendNow')}
                  </CustomText>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <Text
            style={{
              textAlign: 'center',
              color: '#000',
              fontFamily: udyamitaTheme.mainThemeFontFamily,
            }}>
            {t('or')}
          </Text>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}>
          <CustomText type='label'
            style={styles.changeNumberText}>
            {t('changeNumber')}
          </CustomText>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <TouchableOpacity
        style={[
          styles.arrowButtonStyle,
          {
            backgroundColor:
              value.length !== 6
                ? udyamitaTheme.disabledButtonColor
                : udyamitaTheme.primaryColor,
            position: 'fixed',
            bottom: 0,
            width: 0.9 * windowWidth,
          },
        ]}
        disabled={value.length !== 6}
        onPress={() => verifyOTP()}>
        <Text style={styles.arrowButtonLabel}>{t('verifyOtp')}</Text>
        {loading ? (
          <ActivityIndicator
            size="small"
            animating={loading}
            color="white"
            style={{marginRight: 10}}
          />
        ) : null}
      </TouchableOpacity>
    </View>
  );
};

export default ConfirmOtp;

const styles = StyleSheet.create({
  label: {
    fontSize: udyamitaTheme.themeFontSizeLabel,
    marginTop: 32,
    marginBottom: 10,
    alignSelf: 'center',
    color: udyamitaTheme.textColor,
    textAlign: 'center',
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
  },
  labelGrey: {
    fontSize: udyamitaTheme.themeFontSizeLabel,
    marginTop: 10,
    marginBottom: 10,

    alignSelf: 'center',
    color: udyamitaTheme.textColor,
    textAlign: 'center',
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
  },
  otpInput: {
    height: 50,
    width: 50,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'grey',
    margin: 15,
    fontSize: udyamitaTheme.themeFontSizeHeader,
    textAlign: 'center',
  },
  root: {
    flex: 1,
    padding: 20,
  },
  wrap: {
    flexDirection: 'row',
    margin: 10,
    position: 'absolute',
    top: 0,
  },
  codeFieldRoot: {
    marginHorizontal: '10%',
    marginTop: 12
  },
  cell: {
    width: 50,
    height: 50,
    lineHeight: 50,  //todo
    fontSize: udyamitaTheme.themeFontSizeBigHeader,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'grey',
    textAlign: 'center',
    color: 'black',
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    display: "flex",
    flexDirection: 'column',
    justifyContent: "center"
  },
  focusCell: {
    borderColor: udyamitaTheme.primaryColor,
  },

  buttonText: {
    fontSize: udyamitaTheme.themeFontSizeHeader,
    alignSelf: 'center',
    color: 'white',
    letterSpacing: 1,
  },
  changeNumberText: {
    top: 10,
    alignSelf: 'center',
    fontSize: udyamitaTheme.themeFontSizeLabel,
    color: udyamitaTheme.primaryColor,
    // fontWeight: 'bold',
    textDecorationLine: 'underline',
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    marginBottom: 55,
  },

  verifyOTPText: {
    fontSize: udyamitaTheme.themeFontSizeHeader,
    marginLeft: 20,
    fontFamily: udyamitaTheme.mainThemeFontFamily,
  },
  yourOTPText: {
    alignSelf: 'center',
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    marginTop: 5,
  },
  arrowButtonStyle: {
    margin: 10,
    backgroundColor: udyamitaTheme.primaryColor,
    width: '90%',
    height: 52,
    borderRadius: 5,
    alignSelf: 'center',
    flexDirection: 'row',

    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowButtonLabel: {
    color: 'white',
    fontSize: udyamitaTheme.themeFontSizeButton,
    alignSelf: 'center',
    marginLeft: 10,
    fontFamily: udyamitaTheme.mainThemeFontFamily,
  },
  // onboarding
  welcomeToUdyamitaContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -2,
    flexDirection: 'row',
    // marginTop:30,
  },
  container: {
    flex: 1,
    // backgroundColor: 'white',

    position: 'relative',
    bottom: 0,
    backgroundColor: '#FFF',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 42,
    lineHeight: 84,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#000000c0',
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
  },
  dropDown: {
    height: 30,
    backgroundColor: '#f7f7f7',
    minWidth: 110,
    justifyContent: 'center',
    paddingHorizontal: 5,
    borderWidth: 1.2,
    borderColor: udyamitaTheme.primaryColor,
    borderRadius: 5,
  },
  dropDownText: {
    fontSize: udyamitaTheme.themeFontSizeButton,
    alignSelf: 'center',
    textTransform: 'capitalize',
    fontWeight: 'bold',
  },
  buttonStyle: {
    position: 'absolute',
    bottom: 5,
    margin: 10,
    backgroundColor: udyamitaTheme.primaryColor,
    width: '80%',
    height: 45,
    borderRadius: 25,
    alignSelf: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    elevation: 5,
  },

  title: {
    fontSize: udyamitaTheme.themeFontSizeBigHeader,
    alignSelf: 'center',
    fontFamily: udyamitaTheme.mainThemeFontFamily,
  },

  languageListWrap: {
    marginHorizontal: '5%',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  languageCard: {
    height: 52,
    // width: 130,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    marginVertical: 5,
    borderWidth: 1,
    borderColor: udyamitaTheme.borderStyleColor,
    // elevation: 8,
  },
  languageCardSelected: {
    height: 52,
    // width: 140,
    width: '100%',
    borderRadius: 10,
    alignSelf: 'center',
    borderColor: udyamitaTheme.primaryColor,
    borderWidth: 2,
    justifyContent: 'center',
    marginVertical: 5,
    elevation: 8,
    backgroundColor: 'white',
  },
  languageText: {
    alignSelf: 'center',
    fontSize: udyamitaTheme.themeFontSizeButton,
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color: udyamitaTheme.textColor,
  },
  languageTextSelected: {
    alignSelf: 'center',
    fontSize: udyamitaTheme.themeFontSizeButton,
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color: udyamitaTheme.textColor,
  },
  logo: {
    width: 200,
    height: 79,
    alignSelf: 'center',
    resizeMode: 'contain',
    marginTop: -25,
  },

  modalContainer: {
    backgroundColor: 'white',
  },
  arrowButtonStyle: {
    backgroundColor: udyamitaTheme.primaryColor,
    width: '90%',
    height: 52,
    borderRadius: 5,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    marginBottom: 35,
    flexDirection: 'row',
  },
  arrowButtonLabel: {
    color: 'white',
    fontSize: udyamitaTheme.themeFontSizeButton,
    alignSelf: 'center',
    marginLeft: 10,
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
  },
  welcomeText: {
    // textTransform: 'capitalize',
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    fontSize: udyamitaTheme.themeFontSizeModalLabel,
    color: udyamitaTheme.textColor,
  },
  udyamitaText: {
    // textTransform: 'capitalize',
    // fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    fontSize: udyamitaTheme.themeFontSizeModalLabel,
    color: udyamitaTheme.textColor
  },
});
