import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  Dimensions,
  BackHandler,
  FlatList
} from 'react-native';
import '../../constants/i18n/i18n';
import React, {useState, useContext, useEffect} from 'react';
import axios from 'axios';
// import analytics from '@react-native-firebase/analytics';

import {userContext} from '../../helpers/AuthContext';
import {udyamitaTheme} from '../../config/styles/udyamitaTheme';
import {languages} from '../../constants/Languages';
import {useTranslation} from 'react-i18next';
import CustomText from '../../components/reusable/CustomText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {setPrefLang} from '../../store/reducers/entrepreneurReducer';
import {APP_API_USER_URL} from '@env';
import OnboardingTemplate from '../templates/OnboardingTemplate';
import {getToken, getValueByKey, storeValueByKey} from '../../helpers/UserData';
import { appWelcomeColor } from '../../config/app.config';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import { winHeight } from '../../helpers/dimensions';

const LanguageSelection = ({navigation, route}) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  // const context = useContext(userContext);
  // const token = context.state.userToken;
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();
  const [currentLanguage, setLanguage] = useState('en');
  const isFocused = useIsFocused();
  const [exitApp, setExitApp] = useState(0)
  const changeLanguage = value => {
    i18n
      .changeLanguage(value)
      .then(() => {
      
        setLanguage(value);
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    const getPreferredLanguage = async () => {
      const preferredLanguage =
        (await getValueByKey('preferredLanguage')) || 'en';
      setSelectedLanguage(preferredLanguage);
    };
    getPreferredLanguage();
  }, []);

  const handleChange = (lang, code) => {
    changeLanguage(code);
    setSelectedLanguage(lang);
    // context.savePreferredLanguage(lang);
    dispatch(setPrefLang(code));
  };

  const data = {
    mobileNumber: route?.params?.user?.mobileNumber,
    preferredLanguage: selectedLanguage.toLowerCase(),
  };

  // const storeUser = async value => {
  //   const val = {
  //     message: value.message,
  //     token: value.userInfo.token,
  //     userInfo: value.userInfo,
  //   };
  //   try {
  //     const jsonValue = JSON.stringify(val);
  //     await AsyncStorage.setItem('userInfo', jsonValue);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  const updatePreferredLanguage = async () => {
    const token = await getToken();
    const config = {headers: {Authorization: 'Bearer ' + token}};
    // if (false) {
    //   axios
    //     .put(`${APP_API_USER_URL}/user/`, data, config)
    //     .then(response => {
    //       if (response.status == 200) {
    //         storeUser(response.data);
    //         console.log('response.data: ', response.data);
    //         context.saveUser(response.data.userInfo);
    //         if (response && response.data && response.data.token) {
    //           context.saveToken(response.data.token);
    //         }
    //         context.savePreferredLanguage(
    //           response.data.userInfo.preferredLanguage,
    //         );
    //         track(`Language Updated to ${selectedLanguage.toLowerCase()}`, {
    //           mobileNumber: route.params.user.mobileNumber,
    //         });
    //         // navigation.navigate('BottomTabs');
    //         navigation.navigate('DrawerTabs');
    //       }
    //     })
    //     .catch(err => console.log(err));
    // } else {
    storeValueByKey('preferredLanguage', currentLanguage);
    navigation.navigate('RoleSelection',{preferredLanguage:currentLanguage});
    // }
  };

  const ChildComponent = () => {
    return (
      <View style={{height:winHeight * 0.35}}>
        <CustomText style={styles.selectedLanguageText} type="mlabel">
          {t('selectLanguage')}
        </CustomText>
        <FlatList
          data={languages}
          renderItem={item =>
            (
              <TouchableOpacity
                key={item.item.code}
                style={
                  i18n.language == item.item.code
                    ? styles.languageCardSelected
                    : styles.languageCard
                }
                onPress={() => changeLanguage(item.item.code)}>
                <CustomText
                  style={
                    i18n.language == item.item.code
                      ? styles.languageTextSelected
                      : styles.languageText
                  }
                  type="btn">
                  {item.item.label}
                </CustomText>
              </TouchableOpacity>
            )}>
          <View style={styles.languageListWrap}>{languages.map}</View>
        </FlatList>
      </View>
    );
  };

  useEffect(() => {
    const onBackPress = () => {
      setTimeout(() => {
        setExitApp(0);
        console.log("EXIT APPP INSIDE TIMEOUT")
      }, 9000);
      if (exitApp === 0) {
        setExitApp(exitApp + 1);
      } else if (exitApp === 1) {
        setExitApp(0);
        BackHandler.exitApp();
      }
      return true;
    };
   
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );
    return () => backHandler.remove();
  },[exitApp]);
  // useFocusEffect(
  //   React.useCallback(() => {
       
      
      
  //   }, [isFocused]),
  // );
  return (
    <OnboardingTemplate
      ChildrenComponent={ChildComponent}
      buttonLabel={t('continue')}
      buttonOnpress={updatePreferredLanguage}
      buttonDisabled={!selectedLanguage}
      buttonLoading={false}
    />
  );
};

export default LanguageSelection;

const styles = StyleSheet.create({
  selectedLanguageText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color: udyamitaTheme.textColor,
    textAlign: 'center',
    marginTop: 24,
    fontSize: udyamitaTheme.themeFontSizeModalLabel,
  },

  text: {
    color: 'white',
    fontSize: 42,
    lineHeight: 84,
  
    textAlign: 'center',
    backgroundColor: '#000000c0',
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
  },

  title: {
    fontSize: udyamitaTheme.themeFontSizeBigHeader,
    alignSelf: 'center',
    fontFamily: udyamitaTheme.mainThemeFontFamily,
  },

  languageListWrap: {
    marginHorizontal: '5%',
    marginTop: 10,
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  languageCard: {
    height: 52,
    // width: 130,
    width: '90%',
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
    width: '90%',
    borderRadius: 10,
    alignSelf: 'center',
    borderColor: udyamitaTheme.primaryColor,
    borderWidth: 2,
    justifyContent: 'center',
    marginVertical: 5,
    // elevation: 8,
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
    color: udyamitaTheme.primaryColor,
  },
  logo: {
    width: 200,
    height: 80,
    alignSelf: 'center',
  },

  welcomeText: {
    textTransform: 'capitalize',
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    fontSize: udyamitaTheme.themeFontSizeModalLabel,
    color: udyamitaTheme.textColor,
  },
  udyamitaText: {
    textTransform: 'capitalize',
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    fontSize: udyamitaTheme.themeFontSizeModalLabel,
    color: udyamitaTheme.textColor
  },
});
