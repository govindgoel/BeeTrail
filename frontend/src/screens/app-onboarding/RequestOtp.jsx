/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Linking,
  Dimensions,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  BackHandler,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import {udyamitaTheme} from '../../config/styles/udyamitaTheme';
import {useTranslation} from 'react-i18next';
import axios from 'axios';
import {
  APP_API_USER_URL_SECOND,
  APP_API_MENTOR_VAlUECHAIN_SERVICES,
  APP_API_CATALOG_SERVICES,
} from '@env';
import {userContext} from '../../helpers/AuthContext';
// import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// import {ArrowLgIcon, BackIcon} from '../../assets/Icons/IconSvg';
// import OnboardingTemplate from '../templates/OnboardingTemplate';

import {PermissionsAndroid} from 'react-native';
import {getToken, getValueByKey, storeValueByKey} from '../../helpers/UserData';
import {
  AppWelcomeText,
  CoverImages,
  appWelcomeColor,
} from '../../config/app.config';
import CustomText from '../../components/reusable/CustomText';
import {useFocusEffect, useIsFocused, useRoute} from '@react-navigation/native';
import {getHash, requestHint} from 'react-native-otp-verify';

// const APP_API_USER_URL = "http://192.168.1.57:8088";

const RequestOtp = ({navigation}) => {

  const [mobileNumber, setMobileNumber] = useState('');
  const route=useRoute()
  const [language, setLanguage] = useState(route?.params);
  const [loading, setLoading] = useState(false);
  const [deviceFcmToken, setDeviceFcmToken] = useState('');
  const phoneno = /^[6-9]\d{9}$/;
  const hashFromMethod = useRef(null);
  const {t, i18n} = useTranslation();
  const context = useContext(userContext);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [isFocused, setIsFocused] = useState(false);
  const focused = useIsFocused();


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
  const url=`${APP_API_USER_URL_SECOND}otp/send-otp`


  const onButtonPress = () => {
    mobileNumber.length === 10
      ? requestLogin()
      : Toast.show('Please enter a valid Mobile Number', Toast.LONG);
  };

  useEffect(() => {
    getHash()
      .then(r => {
        console.log(r[0]);
        hashFromMethod.current = r[0];
      })
      .catch(console.log);

    requestHint()
      .then(e => {
        const regex = /(\d{10})$/;

        // Execute the regex on the input string
        const match = e.match(regex);
        setMobileNumber(match[1]);
        requestLogin(match[1]);
      })
      .catch(console.log);
  }, []);

  const requestLogin = async(mobileno = false) => {
  try {
      console.log('req login function called');
      const languageMapping = {
        en: "English",
        hi: "Hindi",
        kn: "Kannada",
        mr: "Marathi",
        bn: "Bengali",
        or: "Odia",
      };

      console.log(route?.params,url);
   
      if (mobileNumber.match(phoneno) || (mobileno && mobileno.match(phoneno))) {
        const data = {
          mobileNumber: mobileno ? mobileno : mobileNumber,
          userRole:route?.params?.role,
          // preferredLanguage:  languageMapping[language] || language,
          // firebaseToken: fireBaseToken,
          // hash: hashFromMethod.current,
        };
        console.log(data, 'body sending in otp');
        const config = {
          'Content-Type': 'application/json',
        };
        setLoading(true);
        axios
          .post(url, data, {headers: config})
          .then(response => {
            if (response.status == 200) {
              navigation.navigate('ConfirmOtp', {
                user: {mobileNumber: mobileno ? mobileno : mobileNumber,
                  userRole:route?.params?.role,
                  // preferredLanguage: language,
                  // firebaseToken: deviceFcmToken || '',
                  hash: hashFromMethod.current,
                },
                otp: response?.data?.otp,
              });
            }
            setLoading(false);
          })
          .catch(err => {
            setLoading(false);
            Toast.show('something went wrong' + JSON.stringify(err), Toast.SHORT);
            console.log(
              'errr',
             err
            );
          });
      } else {
        Toast.show('Please enter a valid Mobile Number', Toast.SHORT);
      }
  } catch (error) {
    console.log(error,'err in req login function');
  }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('LanguageSelection');
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
      return () => backHandler?.remove();
    }, [focused]),
  )
  const handleBlur = () => {
    setIsFocused(false);
  };

  const WelcomeToUdyamita = useCallback(
    () => (
      <>
        <Text>
          {t(AppWelcomeText)
            .split(' ')
            .map(word => (
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
    ),
    [AppWelcomeText],
  );

  return (
    // <OnboardingTemplate
    //   ChildrenComponent={ChildComponent}
    //   buttonOnpress={onButtonPress}
    //   buttonLoading={loading}
    //   buttonLabel={t('getOtp')}
    //   buttonDisabled={mobileNumber.length !== 10}
    // />
    <View
      style={{
        backgroundColor: udyamitaTheme.themeBgColor,
        // position: 'absolute',
        flex: 1,
        height: windowHeight,
      }}>
            <Text style={{margin:20}}>{url}</Text>

      <View style={{...styles.container, width: windowWidth}}>
        <CoverImages />
        <View style={styles.welcomeToUdyamitaContainer}>
          <WelcomeToUdyamita />
        </View>
        {/* <ChildComponent/> */}
        <View style={{flex: 1}}>
          <CustomText style={styles.Inputlabel} type="mlabel">
            {t('mobileNumberLabel')}
          </CustomText>
          <View
            style={[
              styles.textInputWrap,
              {
                borderColor: isFocused
                  ? udyamitaTheme.primaryColor
                  : udyamitaTheme.borderStyleColor,
              },
            ]}>
            <Text style={styles.nientyOne}> +91 </Text>
            <TextInput
              value={mobileNumber}
              style={styles.textInputStyle}
              placeholder={t('mobile')}
              placeholderTextColor="#d1d1d1"
              keyboardType="number-pad"
              onChangeText={text =>
                text.length < 11
                  ? setMobileNumber(text)
                  : Toast.show(t('validNumberToast'), Toast.SHORT)
              }
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </View>

          <View style={styles.tandCWrapper}>
            <View style={[ {
              flexDirection:'row',
              justifyContent:'center',
              alignItems:'center',
              flexWrap:'wrap',
              marginHorizontal:10
            }]}   >
              <CustomText
                  type="label"
                   
                  style={[{color:'#000000'}]}>
                  {t('TnC1')}
                </CustomText>  

              <TouchableOpacity
                 onPress={() => {
                  Linking.openURL('https://thehumblebee.co/policies/terms-of-service');
                }}>
                <CustomText
                  type="label"
                  style={[styles.tandCLink]}>
                  {' '}
                  {t('TnC2')}{' '}
                </CustomText>
              </TouchableOpacity>
              <CustomText
                  type="label"
                   
                  style={[{color:'#000000'}]}>
                  {t('TnC3')}
                </CustomText>  
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(
                    'https://thehumblebee.co/policies/privacy-policy',
                  );
                }}>
                 <CustomText
                  type="label"
                  
                  style={styles.tandCLink}>
                  {' '}
                  {t('TnC4')}
                </CustomText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.arrowButtonStyle,
          {
            backgroundColor:
              mobileNumber.length !== 10
                ? udyamitaTheme.disabledButtonColor
                : udyamitaTheme.primaryColor,
            position: 'fixed',
            bottom: 0,
            width: 0.9 * windowWidth,
          },
        ]}
        disabled={mobileNumber.length !== 10}
        onPress={() => onButtonPress()}>
        <Text style={styles.arrowButtonLabel}>{t('getOtp')}</Text>
        {loading ? (
          <ActivityIndicator
            size="small"
            animating={loading}
            color="white"
            style={{marginLeft: 10}}
          />
        ) : null}
      </TouchableOpacity>
    </View>
  );
 
  };

export default RequestOtp;

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  // },
  lableStyle: {
    marginBottom: 5,
    marginTop: 15,
    fontSize: udyamitaTheme.themeFontSizeButton,
  },
  textInputStyle: {
    height: 50,
    fontSize: udyamitaTheme.themeFontSizeButton,
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    paddingLeft: 10,
    alignSelf: 'center',

    letterSpacing: 1.5,
    width: '75%',
    color: 'black',
  },
  textInputWrap: {
    marginHorizontal: 20,
    marginBottom: 10,
    height: 50,
    borderRadius: 6,
    borderWidth: 1,
    // borderColor: udyamitaTheme.primaryColor,
    flexDirection: 'row',
    //flex:1,
  },
  Inputlabel: {
    fontSize: udyamitaTheme.themeFontSizeModalLabel,
    marginTop: 32,
    marginBottom: 16,
    // marginHorizontal: 75,
    textAlign: 'center',

    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color: udyamitaTheme.textColor,
  },
  tandCWrapper: {
    flexDirection: 'row',
    marginHorizontal: 25,
    marginVertical: 5,
    marginTop: 50,
    alignSelf: 'center',
  },
  tandCText: {
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    lineHeight: 20,
    textAlign: 'center',
    color: udyamitaTheme.textColor,
  },
  tandCLink: {
    color: udyamitaTheme.primaryColor,
    // textDecorationLine: 'underline',
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    fontSize: udyamitaTheme.themeFontSizeLabel,
  },
  nientyOne: {
    alignSelf: 'center',
    fontSize: udyamitaTheme.themeFontSizeButton,
    marginLeft: 5,
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    color: udyamitaTheme.textColor,
  },

  // arrowButtonStyle: {
  //  // margin: 10,
  //   backgroundColor: udyamitaTheme.primaryColor,
  //   width: '90%',
  //   height: 52,
  //   borderRadius: 5,
  //   alignSelf: 'center',
  //   //flexDirection: 'row',

  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  arrowButtonLabel: {
    color: 'white',
    fontSize: udyamitaTheme.themeFontSizeButton,
    alignSelf: 'center',
    marginLeft: 10,
    fontFamily: udyamitaTheme.mainThemeFontFamily,
  },

  // on Boarding template CSS
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
    marginBottom: 10,
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
    fontSize: 18,
    color: udyamitaTheme.textColor,
  },
});
