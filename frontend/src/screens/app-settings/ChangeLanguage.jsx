import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import CustomHeader from '../../components/reusable/generic/CustomHeader';
import {udyamitaTheme} from '../../config/styles/udyamitaTheme';
import {useTranslation} from 'react-i18next';
import {APP_API_USER_URL} from '@env';

import {
  storeValueByKey,
  storeUser,
  getToken,
  getValueByKey,
  getUser,
} from '../../helpers/UserData';
import axios from 'axios';
import {useDispatch} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {setPrefLang} from '../../store/reducers/entrepreneurReducer';
import CustomText from '../../components/reusable/CustomText';
import { useNetInfo } from '@react-native-community/netinfo';
import { LogFirebaseEvents } from '../../helpers/LogFireBaseEvents';

const ChangeLanguage = ({navigation}) => {
  const dispatch = useDispatch();
  const {isConnected} = useNetInfo();
  const {t, i18n} = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const getLanguage = async () => {
        const lang = await getValueByKey('preferredLanguage');

        setSelectedLanguage(lang || 'en');
      };
      getLanguage();
    }, []),
  );

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleLanguageSelect = language => {
    setSelectedLanguage(language);
    // changeLanguage(language);
  };

  const languageOptions = [
    {label: 'English', value: 'en'},
    {label: 'हिन्दी', value: 'hi'},
    {label: 'ಕನ್ನಡ', value: 'kn'},
    {label: 'मराठी', value: 'mr'},
    {label:'ଓଡିଆ', value:'or'},
    {label:'বাংলা', value:'bn'},

  ];

  const changeLanguage = value => {
    i18n
      .changeLanguage(value)
      .then(() => {
        // setSelectedLanguage(value);
      })
      .catch(err => console.log(err));
  };

  const updatePreferredLanguage = async () => {
    const token = await getValueByKey('token');
    const config = {headers: {Authorization: 'Bearer ' + token}};
    setLoading(true);
    axios
      .put(
        `${APP_API_USER_URL}/user/profile`,
        {preferredLanguage: selectedLanguage},
        config,
      )
      .then(async(response) => {
        if (response.status === 200) {
          storeUser(response.data);
          storeValueByKey('preferredLanguage', selectedLanguage);
          if (response.data && response.data.token) {
            setLoading(false);
            storeValueByKey('token', response.data.token);
            navigation.goBack();
          }
        }
      })
      .catch(err => {
        setLoading(false);
        ToastAndroid.showWithGravity(
          t('somethingWrong'),
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        console.log('ERROR IN CHANGE LANGUAGE', err.response.data);
      });
  };

  const confirmLanguageChange = async() => {
   let existingObject =await getUser()
      existingObject=existingObject.userInfo
      existingObject.preferredLanguage=selectedLanguage
      await storeUser({userInfo:existingObject})
      storeValueByKey('preferredLanguage', selectedLanguage);
      storeValueByKey('preferredLanguageChange', `true`);
      setLoading(false)
      navigation.goBack();
   

    changeLanguage(selectedLanguage);
  };

  return (
    <View style={{flex: 1}}>
      <CustomHeader
        title={t('changeYourLanguage')}
        navigation={navigation}
        showBackIcon={true}
        onBackPress={handleBackPress}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <View
          style={{
            marginTop: 20,
            marginLeft: 20,
            marginRight: 20,
            borderRadius: 10,
          }}>
          <RadioForm animation={true}>
            {languageOptions.map((option, index) => (
              <TouchableOpacity
                style={{
                  borderWidth: selectedLanguage === option.value ? 1 : 0.5,
                  borderColor:
                    selectedLanguage === option.value
                      ? udyamitaTheme.primaryColor
                      : udyamitaTheme.borderStyleColor,
                  borderRadius: 10,
                  height: 56,
                  justifyContent: 'center',
                  backgroundColor: '#fff',
                  marginBottom: 15,
                }}
                onPress={() => handleLanguageSelect(option.value)}
                key={index}>
                <RadioButton labelHorizontal={true}>
                  {/* Radio button input */}
                  <RadioButtonInput
                    obj={option}
                    index={index}
                    isSelected={selectedLanguage === option.value}
                    onPress={() => handleLanguageSelect(option.value)}
                    borderWidth={1}
                    buttonInnerColor={
                      selectedLanguage === option.value
                        ? udyamitaTheme.primaryColor
                        : '#e74c3c'
                    }
                    buttonOuterColor={
                      selectedLanguage === option.value
                        ? udyamitaTheme.primaryColor
                        : udyamitaTheme.borderStyleColor
                    }
                    buttonSize={9}
                    buttonOuterSize={20}
                    buttonWrapStyle={{marginLeft: 10}}
                  />
                  {/* Radio button label */}
                  <RadioButtonLabel
                    obj={option}
                    index={index}
                    onPress={() => handleLanguageSelect(option.value)}
                    labelHorizontal={true}
                    labelStyle={{
                      color:
                        selectedLanguage === option.value
                          ? udyamitaTheme.primaryColor
                          : '#000',
                      fontSize: udyamitaTheme.themeFontSizeLabel,
                      fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
                    }}
                    labelWrapStyle={{
                      marginLeft: 10,
                    }}
                  />
                </RadioButton>
              </TouchableOpacity>
            ))}
          </RadioForm>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.arrowButtonStyle,
          {
            backgroundColor: loading
              ? udyamitaTheme.disabledButtonColor
              : udyamitaTheme.primaryColor,
          },
        ]}
        onPress={confirmLanguageChange}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" size={40} />
        ) : (
          <CustomText style={styles.arrowButtonLabel} type="btn">
            {t('confirmLanguage')}
          </CustomText>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ChangeLanguage;

const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingRight: 20,
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
});
