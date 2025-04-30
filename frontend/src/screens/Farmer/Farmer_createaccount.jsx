/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  PermissionsAndroid,
  ToastAndroid,
  Platform,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import {APP_API_USER_URL} from '@env';
import {
  APP_NAME,
  BEEKIND_APP_NAME,
  BusinessIdeaValue,
} from '../../config/app.config';
import CustomModal from '../../components/reusable/generic/CustomModal';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import axios from 'axios';
import CustomDropdown from '../../components/reusable/generic/CustomDropdown';
import CustomText from '../../components/reusable/CustomText';
import {udyamitaTheme} from '../../config/styles/udyamitaTheme';
import CustomHeader from '../../components/reusable/generic/CustomHeader';
import AuthContext from '../../helpers/AuthContext';
import {useTranslation} from 'react-i18next';
import {
  getToken,
  getUser,
  getValueByKey,
  storeUser,
} from '../../helpers/UserData';
import {useFocusEffect} from '@react-navigation/native';
import {useDynamicTheme} from '../../helpers/hooks/useDynamicTheme';
import {
  IndianStates,
  fetchDistrictsByStateName,
} from '../../constants/StateDistrictData';
import MapView from 'react-native-maps';
import {Marker} from 'react-native-svg';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const GenderCard = ({item, onSelect, isSelected}) => {
  const cardStyle = isSelected
    ? [styles.genderCard, {backgroundColor: '#028454'}]
    : styles.genderCard;
  const labelStyle = isSelected
    ? [styles.genderLabel, {color: 'white'}]
    : styles.genderLabel;

  return (
    <TouchableOpacity onPress={() => onSelect(item.id)}>
      <View style={cardStyle}>
        <Image source={item.imageSource} style={styles.genderImage} />

        <CustomText style={labelStyle} type="label">
          {item.label}
        </CustomText>
      </View>
    </TouchableOpacity>
  );
};

const Farmer_Createaccount = ({navigation, route}) => {
  const [value, setValue] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [primaryBeekeeper, setPrimaryBeekeeper] = useState(null);
  const [modalContent, setModalContent] = useState(false);
  const ref = useBlurOnFulfill({value, cellCount: 6});
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [isUserMember, setIsUserMember] = useState(false);
  const [name, setName] = useState('');
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedAge, setSelectedAge] = useState(null);
  const currTheme = useDynamicTheme();
  const [actLangTheme, setActLangTheme] = useState(udyamitaTheme);
  const [wifeName, setWifeName] = useState(null);
  const [husbandName, setHusbandName] = useState(null);
  const {t, i18n} = useTranslation();
  const {title = t('createYourAccount')} = route?.params || {};
  //   const [farmLocation, setFarmLocation] = useState({
  //     latitude: 0,
  //     longitude: 0,
  //     latitudeDelta: 0.0922,
  //     longitudeDelta: 0.0421,
  //   });
  const [location, setLocation] = useState('');

  const PAGE_ACTION =
    title === t('createYourAccount') ? 'CREATION' : 'UPDATION';

  const genders = [
    {
      id: 'male',
      label: t('male'),
      imageSource: require('../../assets/images/Male2.png'),
    },
    {
      id: 'female',
      label: t('female'),
      imageSource: require('../../assets/images/Female2.png'),
    },
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    {length: currentYear - 2000 + 1},
    (_, i) => currentYear - i,
  );

  useFocusEffect(
    React.useCallback(() => {
      const getUserData = async () => {
        const userInfo = await getUser();
        if (userInfo) {
          if (userInfo.userInfo.userType === 'team-member') {
            setIsUserMember(true);
            const {
              name: existingName,
              gender: existingGender,
              age: existingAge,
            } = userInfo.userInfo;

            if (existingName) {
              setName(existingName);
            }
            if (existingGender) {
              setSelectedGender(existingGender);
            }
            if (existingAge) {
              setSelectedAge(existingAge);
            }
          } else {
            const {
              name: existingName,
              address: {
                state: existingState,
                district: existingDistrict,
                pincode: existingPincode,
              },
              gender: existingGender,
              user_husband_name,
              primary_beekeeper,
              user_wife_name,
              operatingEnterpriseSince: existingOperatingEnterpriseSince,
            } = userInfo.userInfo;

            if (existingName) {
              setName(existingName);
            }
            if (primary_beekeeper) {
              setPrimaryBeekeeper(primary_beekeeper);
            }
            if (user_husband_name) {
              setHusbandName(user_husband_name);
            }
            if (user_wife_name) {
              setWifeName(user_wife_name);
            }
            if (existingState) {
              setSelectedState(existingState);
              fetchDistrictsByState(existingState);
            }
            if (existingDistrict) {
              setSelectedDistrict(existingDistrict);
            }
            if (existingPincode) {
              setValue(existingPincode);
            }
            if (existingOperatingEnterpriseSince) {
              setSelectedYear(existingOperatingEnterpriseSince);
            }
            if (existingGender) {
              setSelectedGender(existingGender);
            }
          }
        }
      };
      if (PAGE_ACTION === 'UPDATION') {
        getUserData();
      }
    }, []),
  );
  const handleSelect = val => {
    setPrimaryBeekeeper(val);
  };

  const handleGenderSelect = selectedGender => {
    setSelectedGender(selectedGender);
    setWifeName('');
    setHusbandName('');
    setPrimaryBeekeeper(null);
    setName('');
  };
  const handleYearSelect = year => {
    // Handle the selected year here
    setSelectedYear(year);
  };

  const updateUserProfile = async reqBody => {
    const token = await getToken();
    const config = {headers: {Authorization: 'Bearer ' + token}};
    await axios
      .put(`${APP_API_USER_URL}/user/profile`, reqBody, config)
      .then(data => {
        const userInfo = JSON.parse(JSON.stringify(data.data));
        storeUser(userInfo);
        // const userInfoDoc = userInfo.userInfo;

        navigation.goBack();
      })
      .catch(err => {
        console.log('Error while updating enterprise:', err);
      });
  };
  const handleButtonPress = async () => {
    const reqBody = {
      name: selectedGender === 'couple' ? '' : name,

      gender: selectedGender,
      operatingEnterpriseSince: selectedYear,
      state: selectedState,
      district: selectedDistrict,
      pincode: value,
      preferredLanguage: (await getValueByKey('preferredLanguage')) || 'en',
      age: selectedAge,
      isCouple: selectedGender === 'couple' || false,
      primary_beekeeper: primaryBeekeeper,
      user_wife_name: selectedGender === 'couple' ? wifeName : '',
      user_husband_name: selectedGender === 'couple' ? husbandName : '',
    };
    if (APP_NAME === BEEKIND_APP_NAME) {
      reqBody.businessIdea = BusinessIdeaValue;
    }
    if (PAGE_ACTION === 'CREATION') {
      navigation.navigate('ProfileLoader', {
        firstText: `${t('justAFewMoments')} ${name}`,
        secondText: t('preparingDashboard'),
        loader: true,
        PAGE_ACTION,
        // LOADER_ACTION: 'UPDATE_USER_PROFILE',
        reqBody,
      });
    } else {
      updateUserProfile(reqBody);
    }
  };

  const fetchStates = () => {
    const _states = IndianStates;
    setStates(
      _states?.reduce((total, currVal, currIndex, arr) => {
        return [...total, {label: currVal?.name, value: currVal?.name}];
      }, []),
    );
  };

  const fetchDistrictsByState = state => {
    const _districts = fetchDistrictsByStateName(state);
    setDistricts(
      _districts.reduce((total, currVal, currIndex, arr) => {
        return [...total, {label: currVal?.name, value: currVal?.name}];
      }, []),
    );
  };

  useEffect(() => {
    fetchStates();
  }, []);

  useEffect(() => {
    if (currTheme) {
      setActLangTheme(currTheme);
    }
  }, [currTheme]);

  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const radioOptions = [
    {
      label: t('husband'),
      value: 'husband',
    },
    {
      label: t('wife'),
      value: 'wife',
    },
  ];
  const updateModalContent = val => {
    const mmm = modalContent;
    modalContent.selectedOption = val;
    setModalContent(mmm);
  };
  const handleBackPress = () => {
    navigation.goBack();
  };

  const hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await hasPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
      console.log('true');
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      getLocation();
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }

    return false;
  };

  const getLocation = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        console.log('🚀 ~ getLocation ~ position:', position.coords.latitude);
        // setLocation(position);
        getAddress(position.coords.latitude, position.coords.longitude);
      },
      error => {
        console.error('Error getting location:', error);
        Alert.alert(`Code ${error.code}`, error.message);
      },
      {
        // accuracy: {
        //   android: 'high',
        //   ios: 'best',
        // },
        // enableHighAccuracy: highAccuracy,
        timeout: 20000,
        // maximumAge: 30000,
        distanceFilter: 0,
        // forceRequestLocation: forceLocation,
        forceLocationManager: true,
        showLocationDialog: true,
      },
    );
  };
  useEffect(() => {
    Geocoder.init('AIzaSyBg4tz2fOqTqAny-Hph8blHRP9YeRTuIDg');
  }, []);

  const getAddress = async (lat, lng) => {
    Geocoder.from({
      lat,
      lng,
    })
      .then(json => {
        let addressRes = json.results[0];
        const lang = i18n.language;
        console.log('🚀 ~ getAddress ~ addressRes:', addressRes);
        if (false && lang !== 'en') {
          let reqObj = {};
          reqObj.text = addressRes?.formatted_address;
          reqObj.script = 'Latn';
          let data = [];
          data.push(reqObj);

          let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `https://api.cognitive.microsofttranslator.com/transliterate?api-version=3.0&language=${
              lang === 'tl' ? 'te' : lang
            }&fromScript=Latn&toScript=${transliterationScriptsMap.get(lang)}`,
            headers: {
              'Content-type': 'application/json',
              'Ocp-Apim-Subscription-Key': 'c60c40633cae420dae7df665abe235da',
              'Ocp-Apim-Subscription-Region': 'centralindia',
              'X-ClientTraceId': '1bf75bc8-4269-11ee-be56-0242ac120002',
            },
            data: data,
          };

          axios
            .request(config)
            .then(response => {
              setEditedAddress(response?.data[0]?.text);

              // setLocationFetched(true);
            })
            .catch(error => {
              console.log('azure transliteration err', error);
            });
        } else {
          //   setEditedAddress(addressRes?.formatted_address);
          setLocation(addressRes?.formatted_address);
          console.log(
            '🚀 ~ getAddress ~ addressRes?.formatted_address:',
            addressRes?.formatted_address,
          );
          // setLocationFetched(true);
        }
      })
      .catch(error => {
        console.warn(error);
        // setLocationFetched(true);
        ToastAndroid.show(
          'Please enter your address manually!',
          ToastAndroid.LONG,
        );
      });
  };
  return (
    <View style={{flex: 1, backgroundColor: udyamitaTheme.themeBgColor}}>
      <CustomHeader
        title={title}
        showBackIcon={true}
        onBackPress={handleBackPress}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        //style={styles.container}
        contentContainerStyle={{
          flexGrow: 1,

          backgroundColor: udyamitaTheme.themeBgColor,
          paddingLeft: 20,
          paddingRight: 20,
        }}>
        <CustomText style={styles.label} type="label">
          {t('enterYourFullName')}
        </CustomText>
        <View style={styles.textInputWrap}>
          <TextInput
            onChangeText={e => {
              setName(e);
            }}
            value={name}
            style={{color: '#000000', fontWeight: '400', fontSize: 14}}
            placeholder={t('enterYourFullName')}
            placeholderTextColor="rgba(38, 38, 38, 0.5)"
            placeholderStyle={styles.placeholderStyle(actLangTheme)}
          />
        </View>
        <CustomText style={[styles.label, {marginTop: 20}]} type="label">
          {t('selectIdentity')}
        </CustomText>
        <View style={{alignItems: 'center', marginBottom: 20}}>
          <FlatList
            data={genders}
            renderItem={({item}) => (
              <GenderCard
                item={item}
                onSelect={handleGenderSelect}
                isSelected={item.id === selectedGender}
              />
            )}
            keyExtractor={item => item.id}
            horizontal
          />
        </View>

        {location.length > 0 ? (
          <>
            <CustomText style={[styles.label,{marginTop:15}]} type="label">
              My Location
            </CustomText>
             
            <View
              style={[
                styles.textInputWrap,
                {marginTop:20,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  position: 'relative',
                },
              ]}><CustomText style={[styles.label,{position:'absolute',top:-12,paddingHorizontal:10,fontWeight:'400'}]} type="mh">
              Location
           </CustomText>
              <TextInput
                onChangeText={e => {
                  setLocation(e);
                }}
                value={location}
                style={{color: '#000000', fontWeight: '400', fontSize: 14}}
                placeholder={t('enterYourFullName')}
                placeholderTextColor="rgba(38, 38, 38, 0.5)"
                placeholderStyle={styles.placeholderStyle(actLangTheme)}
              />
              <TouchableOpacity
                onPress={() => {
                  getLocation();
                }}
                style={{
                  position: 'absolute',
                  right: 15,
                  top: '40%',
                  bottom: '50%',
                }}>
                <Image
                  style={{width: 18.5, height: 18.5}}
                  source={require('../../assets/images/green_pen.png')}
                />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <TouchableOpacity
            onPress={() => {
              getLocation();
            }}
            style={[
              styles.textInputWrap,
              {
                paddingHorizontal: 15,
                borderWidth: 1.2,
                borderColor: '#028454',
                justifyContent: 'center',
                height: 52,
                gap: 15,
                alignItems: 'center',
              },
            ]}>
            <Image
              style={{width: 15.5, height: 15.5}}
              source={require('../../assets/images/greenmark.png')}
            />
            <CustomText style={{color: '#028454', fontWeight: '600'}} type="h">
              Fetch my location
            </CustomText>
          </TouchableOpacity>
        )}
      </ScrollView>
      <TouchableOpacity
        style={[
          styles.searchBtn,
          false && {
            backgroundColor: udyamitaTheme.beeAppDisabledColor,
          },
        ]}
        onPress={() => console.log('completeRegistration')}
        disabled={false}>
        <CustomText style={styles.searchBtnText} type="btn">
          {t('completeRegistration')}
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

export default Farmer_Createaccount;

const styles = StyleSheet.create({
  searchBtn: {
    width: '90%',

    height: 52,
    backgroundColor: udyamitaTheme.beeAppColor,
    borderRadius: 6,
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBtnText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    color: '#fff',
    fontSize: udyamitaTheme.themeFontSizeButton,
  },
  dropdownBoxText: {
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    color: 'rgba(38, 38, 38, 0.5)',
  },
  dropdownBox: {
    width: '100%',
    borderWidth: 0.5,
    borderColor: udyamitaTheme.borderStyleColor,
    height: 48,
    borderRadius: 6,
    //justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fff',
    marginTop: 5,
  },
  label: {
    color: '#262626',
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    fontSize: udyamitaTheme.themeFontSizeLabel,
  },
  textInputStyle: props => ({
    //height: 50,
    fontSize: props?.themeFontSizeLabel,
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    paddingLeft: 10,
    alignSelf: 'center',
    // letterSpacing: 1.5,
    width: '75%',
    textTransform: 'capitalize',
    color: 'rgba(38, 38, 38, 0.5)',
  }),
  placeholderStyle: props => ({
    fontFamily: udyamitaTheme.mainThemeFontFamily,
  }),
  textInputWrap: {
    // height: 50,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: udyamitaTheme.borderStyleColor,
    flexDirection: 'row',
    marginTop: 10,
    backgroundColor: '#fff',
  },
  genderCard: {
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 10,
    borderWidth: 0.5,
    borderColor: udyamitaTheme.borderStyleColor,
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
    backgroundColor: '#fff',
  },
  genderImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  genderLabel: {
    color: udyamitaTheme.textColor,
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    paddingTop: 8,
  },
  yearPicker: {
    height: 50,
    borderWidth: 1,
    borderColor: 'black',
    marginTop: 15,
    backgroundColor: '#fff',
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
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
  codeFieldRoot: {
    marginTop: 10,
    // marginHorizontal: '10%',
    marginRight: 90,
    marginBottom: 15,
  },
  cell: {
    width: 30,
    height: 30,
    lineHeight: 30,
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: 'grey',
    textAlign: 'center',
    color: 'black',
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    backgroundColor: '#fff',
  },
  focusCell: {
    borderColor: udyamitaTheme.primaryColor,
  },
  radioButtonsRow: {
    flexDirection: 'row',
    marginTop: 10,
    // alignItems: 'center',
  },
});
