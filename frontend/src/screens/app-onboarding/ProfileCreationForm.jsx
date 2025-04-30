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
  ActivityIndicator,
  PermissionsAndroid,
} from 'react-native';
import {APP_API_USER_URL,APP_GEO_KEY} from '@env';
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
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const GenderCard = ({item, onSelect, isSelected}) => {
  const cardStyle = isSelected
    ? [styles.genderCard, {backgroundColor: udyamitaTheme.primaryColor}]
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

const ProfileCreationForm = ({navigation, route}) => {
  const [value, setValue] = useState('');
  const [primaryBeekeeper, setPrimaryBeekeeper] = useState(null);
  const [modalContent, setModalContent] = useState(false);
  const ref = useBlurOnFulfill({value, cellCount: 6});
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [isUserMember, setIsUserMember] = useState(false);
  const [loading, setloading] = useState(false)
  const [name, setName] = useState('');
  const [locationLoader, setlocationLoader] = useState(false)
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedAge, setSelectedAge] = useState(null);
  const currTheme = useDynamicTheme();
  const [actLangTheme, setActLangTheme] = useState(udyamitaTheme);
  const [wifeName, setWifeName] = useState(null);
  const [husbandName, setHusbandName] = useState(null);
  const {t, i18n} = useTranslation();
  const [location, setlocation] = useState('');
  const [latitude, setlatitude] = useState('');
  const [longitude, setlongitude] = useState();
  const [selectedrole, setselectedrole] = useState({});
  const [user, setuser] = useState(false);
  const {title = t('editProfile')} = route?.params || {};
  const PAGE_ACTION =
    title === t('createYourAccount') ? 'CREATION' : 'UPDATION';

  useEffect(() => {
    // console.log(route?.params, 'farrr');
    if (route?.params?.locationNav) {
      const alldata = route?.params;
      console.log(route?.params);
      setlocation(alldata?.address);
      setlatitude(alldata?.geoCoordinates?.latitude);
      setlongitude(alldata?.geoCoordinates?.longitude);
      setSelectedGender(alldata?.statedata?.selectedGender);
      setName(alldata?.statedata?.name);
      setPrimaryBeekeeper(alldata?.statedata?.primaryBeekeeper);
      setHusbandName(alldata?.statedata?.husbandName);
      setWifeName(alldata?.statedata?.wifeName);
      setselectedrole(route?.params?.data);
    } else {
      setselectedrole(route?.params?.role);
      // console.log(route?.params?.data?.role);
    }
  }, [route?.params]);
  useEffect(() => {
    Geocoder.init(APP_GEO_KEY);
  }, []);

  const hasLocationPermission = async () => {

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
    setlocationLoader(true)
    const hasPermission = await hasLocationPermission();
    console.log(hasPermission);
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
        setlocationLoader(false)
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
  const getAddress = async (lat, lng) => {
    Geocoder.from({
      lat,
      lng,
    })
      .then(json => {
        let addressRes = json.results[0];
        const lang = 'en';
        console.log('🚀 ~ getAddress ~ addressRes:', addressRes);
       
          //   setEditedAddress(addressRes?.formatted_address);
          const addressParts = addressRes?.formatted_address.split(',');
          const city = addressParts[1].trim();
          const state = addressParts[2].trim().split(' ')[0];

          // setfarmdetails({
          //   ...farmdetails,
          //   addressLine: addressRes?.formatted_address,
          //   address: {
          //     district: city,
          //     state: state,
          //     location: {
          //       latitude: addressRes?.geometry?.location?.lat,
          //       longitude: addressRes?.geometry?.location?.lng,
          //     },
          //   },
          // });
          setlocation(addressRes?.formatted_address);
          setlatitude(addressRes?.geometry?.location?.lat)
          setlongitude(addressRes?.geometry?.location?.lng)
          setSelectedDistrict(city)
          setSelectedState(state)

          console.log(
            '🚀 ~ getAddress ~ addressRes?.formatted_address:',
            addressRes?.geometry?.location,
            city,
            state,
          );
          setlocationLoader(false)

          // setLocationFetched(true);
      
      })
      .catch(error => {
        setlocationLoader(false)
        console.warn(error);
        ToastAndroid.show(
          'Please enter your address manually!',
          ToastAndroid.LONG,
        );
      });
  };
  

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
    {
      id: 'couple',
      label: t('couple'),
      imageSource: require('../../assets/images/Couple_icon.png'),
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
        setuser(userInfo?.userInfo);
        if (userInfo?.userInfo?.userRole == 'farmer') {
          setselectedrole({
            role: 'Farmer',
          });
        }
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
              fulladdress,
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
            if (fulladdress) {
              setlocation(fulladdress);
            }
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
      setloading(false)
    }, []),
  );
  const onGoBack = data => {
    if (data?.locationNav) {
      const alldata = data;
      console.log(data, 'asd');
      setlocation(alldata?.address);
      setlatitude(alldata?.geoCoordinates?.latitude);
      setlongitude(alldata?.geoCoordinates?.longitude);
      setSelectedGender(alldata?.statedata?.selectedGender);
      setName(alldata?.statedata?.name);
      setPrimaryBeekeeper(alldata?.statedata?.primaryBeekeeper);
      setHusbandName(alldata?.statedata?.husbandName);
      setWifeName(alldata?.statedata?.wifeName);
      setselectedrole(data?.data);
    }
  };
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
        console.log(userInfo,reqBody);
        storeUser(userInfo);
        // const userInfoDoc = userInfo.userInfo;
        console.log('fvfv');
        if(PAGE_ACTION=='CREATION'){
          navigation.navigate('DrawerTabs')
        }
        else{
          navigation.goBack();
        }
      })
      .catch(err => {
        setloading(false)
        console.log('Error while updating enterprise:', err);
      });
  };
  const handleButtonPress = async () => {
    const addressParts = location.split(',');
    const city = addressParts[1].trim();
    const state = addressParts[2].trim().split(' ')[0];
    console.log(selectedrole);
    setloading(true)
    const reqBody = {
      name: selectedGender === 'couple' ? '' : name,
     
        userRole: selectedrole == 'farmer' || selectedrole == 'Farmer'?'farmer':'beekeeper',
        fulladdress: location,
        location: {
          latitude,
          longitude,
        },
      gender: selectedGender,
      
        // operatingEnterpriseSince: selectedYear,
        state:   selectedState,
        district:  selectedDistrict,
        // pincode: value,
     
      preferredLanguage: (await getValueByKey('preferredLanguage')) || 'en',
      isCouple: selectedGender === 'couple' || false,
      primary_beekeeper: primaryBeekeeper,
      user_wife_name: selectedGender === 'couple' ? wifeName : '',
      user_husband_name: selectedGender === 'couple' ? husbandName : '',
    };
    console.log('sacdac',PAGE_ACTION,reqBody);
    updateUserProfile(reqBody);

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
    if (user) {
      navigation.goBack();
    } else {
      navigation.navigate('RoleSelection');
    }
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
          {t('selectIdentity')}
        </CustomText>
        <View style={{alignItems: 'center'}}>
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
        {selectedGender === 'couple' ? (
          <>
            <Text style={styles.label}>
              {t('whoWillBeThePrimaryBeekeeper')}
            </Text>
            <RadioForm animation={true}>
              <View style={styles.radioButtonsRow}>
                {radioOptions.map((option, index) => (
                  <RadioButton labelHorizontal={true} key={index}>
                    <RadioButtonInput
                      obj={option}
                      index={index}
                      isSelected={primaryBeekeeper === option.value}
                      onPress={() => handleSelect(option.value)}
                      borderWidth={1}
                      buttonInnerColor={
                        primaryBeekeeper === option.value
                          ? udyamitaTheme.primaryColor
                          : '#e74c3c'
                      }
                      buttonOuterColor={
                        primaryBeekeeper === option.value
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
                      onPress={() => handleSelect(option.value)}
                      labelHorizontal={true}
                      labelStyle={{
                        color:
                          primaryBeekeeper === option.value
                            ? udyamitaTheme.primaryColor
                            : '#000',
                        fontSize: udyamitaTheme.themeFontSizeLabel,
                        fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
                      }}
                      labelWrapStyle={{
                        marginLeft: 5,
                        marginRight: 20,
                      }}
                    />
                  </RadioButton>
                ))}
              </View>
            </RadioForm>

            <Text style={styles.label}>{t('enterWifeFullName')}</Text>
            <View style={styles.textInputWrap}>
              <TextInput
                placeholder={t('enterWifeFullName')}
                placeholderTextColor={udyamitaTheme.textColor}
                placeholderStyle={styles.placeholderStyle(actLangTheme)}
                style={styles.textInputStyle(actLangTheme)}
                value={wifeName}
                onChangeText={e => {
                  setWifeName(e);
                }}
              />
            </View>
            <Text style={styles.label}>{t('enterHusbandFullName')}</Text>
            <View style={styles.textInputWrap}>
              <TextInput
                placeholder={t('enterHusbandFullName')}
                placeholderTextColor={udyamitaTheme.textColor}
                placeholderStyle={styles.placeholderStyle(actLangTheme)}
                style={styles.textInputStyle(actLangTheme)}
                // value={beekeeperDetails.husbandName}
                // onChangeText={e => {
                value={husbandName}
                onChangeText={e => {
                  setHusbandName(e);
                }}
                // setBeekeeperDetails({...beekeeperDetails, husbandName: e});
                // }}
              />
            </View>
          </>
        ) : (
          <>
            <CustomText style={styles.label} type="label">
              {t('enterYourFullName')}
            </CustomText>
            <View style={styles.textInputWrap}>
              <TextInput
                onChangeText={e => {
                  setName(e);
                }}
                value={name}
                style={styles.textInputStyle(actLangTheme)}
                placeholder={t('enterYourFullName')}
                placeholderTextColor="rgba(38, 38, 38, 0.5)"
                placeholderStyle={styles.placeholderStyle(actLangTheme)}
              />
            </View>
          </>
        )}
        
        <View
          style={{
            // backgroundColor: '#fff',
            // paddingHorizontal: 20,
            // paddingVertical: 15,
            marginTop: 15,
          }}>
          <CustomText style={[styles.label]} type="mlabel">
            {t('myLocation')}
          </CustomText>
          {location.length > 0 ? (
            <View
            style={[
              styles.textInputWrap2,
              {
                marginTop: 10,
                paddingHorizontal: 10,
                paddingVertical: 5,
                position: 'relative',
              },
            ]}>
            <TextInput
              onChangeText={e => {
                setlocation(e)
              }}
              value={location}
              style={{
                color: '#000000',
                fontWeight: '400',
                paddingLeft: 30,
                fontSize: 14,
                paddingRight:55
              }}
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
                right: 0,
                borderWidth:0.5,
                borderColor:'#028454',
                height:50,
                justifyContent:'center',
                alignItems:'center',
                width:48,
                borderRadius: 5,
              }}>
              <Image
                style={{width: 24, height: 24}}
                source={require('../../assets/images/green_pen.png')}
              />
            </TouchableOpacity>
            <Image
              style={{
                width: 19.26,
                height: 23.53,
                position: 'absolute',
                left: 10,
                top: '40%',
                bottom: '50%',
              }}
              source={require('../../assets/images/grey_mappointer.png')}
            />
          </View>)
          :
          <View
          style={{ }}>
          <TouchableOpacity
            onPress={() => {
              if(!locationLoader){
                getLocation();
              }
            }}
            style={[
              styles.textInputWrap2,
              {
                paddingHorizontal: 15,
                borderWidth: 1.2,
                borderColor: '#028454',
                justifyContent: 'center',
                // marginHorizontal: 20,
                backgroundColor: '#fff',
                paddingHorizontal: 15,
                flexDirection: 'row',
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
              {t('fetchMyLocation')}
            </CustomText>
           {locationLoader &&  <ActivityIndicator size="small"
            animating={locationLoader}
            color="#028454"
            style={{marginleft: 10}} />}
          </TouchableOpacity>
        </View>
        }
        </View>
     
      </ScrollView>

      {isUserMember ? (
        <TouchableOpacity
          style={[
            styles.arrowButtonStyle,
            {
              backgroundColor:
                name && selectedGender
                  ? udyamitaTheme.primaryColor
                  : udyamitaTheme.disabledButtonColor,
              position: 'fixed',
              bottom: 0,
              width: 0.9 * windowWidth,
            },
          ]}
          disabled={loading || !(name && selectedGender)}
          onPress={()=>{if(!loading){
            handleButtonPress()
          }}}>
                       
          {loading ? (
          <ActivityIndicator
            size="small"
            animating={loading}
            color="white"
            style={{marginRight: 10}}
          />
        ) : <CustomText style={styles.arrowButtonLabel} type="btn">
        {PAGE_ACTION === 'CREATION'
          ? t('completeRegistration')
          : t('saveProfile')}
      </CustomText>}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[
            styles.arrowButtonStyle,
            {
              backgroundColor: (
                selectedrole?.role == 'Farmer' || user?.userRole == 'farmer'
                  ? selectedGender &&
                    location &&
                    ((selectedGender === 'couple' &&
                      husbandName &&
                      wifeName &&
                      primaryBeekeeper) ||
                      (selectedGender !== 'couple' && name && selectedGender))
                  : (selectedGender === 'couple' &&
                      husbandName &&
                      wifeName &&
                      primaryBeekeeper &&
                      selectedDistrict &&
                      selectedState ) ||
                    (selectedGender !== 'couple' &&
                      name &&
                      selectedGender &&
                      selectedDistrict &&
                      selectedState 
                      )
              )
                ? udyamitaTheme.primaryColor
                : udyamitaTheme.disabledButtonColor,
              position: 'fixed',
              bottom: 0,
              width: 0.9 * windowWidth,
            },
          ]}
          disabled={
            !(selectedrole?.role == 'Farmer'
              ? selectedGender &&
                location &&
                (selectedGender === 'couple' ? husbandName && wifeName : name)
              : selectedGender &&
                selectedDistrict &&
                selectedState &&
                (selectedGender === 'couple' ? husbandName && wifeName : name))
          }
          onPress={()=>{if(!loading){
            handleButtonPress()
          }}}>
          {loading ? (
          <ActivityIndicator
            size="small"
            animating={loading}
            color="white"
            style={{marginRight: 10}}
          />
        ) :  <CustomText style={styles.arrowButtonLabel} type="btn">
            {PAGE_ACTION === 'CREATION'
              ? t('completeRegistration')
              : t('saveProfile')}
          </CustomText>
          }
        </TouchableOpacity>
      )}

      {modalContent ? (
        <CustomModal
          title={modalContent?.title || ''}
          options={modalContent?.options || ''}
          requestClose={() => {
            setModalContent(false);
          }}
          visible={modalContent !== false}
          selectedOption={modalContent?.selectedOption}
          setSelectedOption={modalContent?.setSelectedOption}
        />
      ) : null}
      
    </View>
  );
};

export default ProfileCreationForm;

const styles = StyleSheet.create({
  dropdownBoxText: props => ({
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    color: props ? '#000000' : 'rgba(38, 38, 38, 0.5)',
  }),
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
    color: udyamitaTheme.textColor,
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    marginTop: 10,
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
    color: '#000000',
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
    marginTop: 15,
    backgroundColor: '#fff',
  },
  textInputWrap2: {
    // height: 50,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: udyamitaTheme.borderStyleColor,
    flexDirection: 'row',
    marginTop: 15,
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
    width: 64,
    height: 64,
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
