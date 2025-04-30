import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  PermissionsAndroid,
  ToastAndroid,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import CustomText from '../../components/reusable/CustomText';
import ImagePicker from 'react-native-image-crop-picker';
import BottomSheet from 'react-native-raw-bottom-sheet';
import {FetchIcon} from '../../assets/Icons/IconSvg';
import Toast from 'react-native-simple-toast';
import {useTranslation} from 'react-i18next';
import {udyamitaTheme} from '../../config/styles/udyamitaTheme';
import React, {useState, useEffect, useRef} from 'react';
import Geocoder from 'react-native-geocoding';
import {useFocusEffect} from '@react-navigation/native';
// import CustomText from '../../components/reusable/CustomText';
const Farmregistry_farmdetail = ({
  navigation,
  farmdetails,
  setfarmdetails,
  setAllowProceedToNextScreen,
  address,
  geoCoordinates,
  isEdit,
  userInfo,
}) => {
  const {t} = useTranslation();
  const bottomSheetRef = useRef();
  const [actLangTheme, setActLangTheme] = useState(udyamitaTheme);
  const [location, setLocation] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [locationLoader, setlocationLoader] = useState(false)
  // const [userInfo, setUserInfo] = useState(false);
  // useFocusEffect(
  //   React.useCallback(() => {
  //     const getUserInfo = async () => {
  //       const user = await getUser();
  //       if (user && user.userInfo) {
  //         setUserInfo(user.userInfo);
  //       }
  //     };
  //     getUserInfo();
  //   }, []),
  // );

  useEffect(() => {
    Geocoder.init('AIzaSyBg4tz2fOqTqAny-Hph8blHRP9YeRTuIDg');
  }, []);

  useEffect(() => {
    const {addressLine, farmsize, totalbeebox} = farmdetails;
    const allowNext =
      addressLine?.length > 0 &&
      parseInt(farmsize) > 0 &&
      parseInt(totalbeebox) > 0;
    console.log(allowNext);

    setAllowProceedToNextScreen(allowNext);
  }, [farmdetails, address]);

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
    setlocationLoader(true)
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
  const getAddress = async (lat, lng) => {
    Geocoder.from({
      lat,
      lng,
    })
      .then(json => {
        let addressRes = json.results[0];
        const lang = 'en';
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

              setLocationFetched(true);
            })
            .catch(error => {
              console.log('azure transliteration err', error);
            });
        } else {
          //   setEditedAddress(addressRes?.formatted_address);
          const addressParts = addressRes?.formatted_address.split(',');
          const city = addressParts[1].trim();
          const state = addressParts[2].trim().split(' ')[0];

          setfarmdetails({
            ...farmdetails,
            addressLine: addressRes?.formatted_address,
            address: {
              district: city,
              state: state,
              location: {
                latitude: addressRes?.geometry?.location?.lat,
                longitude: addressRes?.geometry?.location?.lng,
              },
            },
          });
          // setLocation(addressRes?.formatted_address);
          console.log(
            '🚀 ~ getAddress ~ addressRes?.formatted_address:',
            addressRes?.geometry?.location,
            city,
            state,
          );
          setlocationLoader(false);
        }
      })
      .catch(error => {
        console.warn(error);
        ToastAndroid.show(
          'Please enter your address manually!',
          ToastAndroid.LONG,
        );
      });
  };

  const apiaryNameSingle = (() => {
    console.log(userInfo?.name,'asv');
    if(userInfo?.name ==undefined ){
      return ''
    }
    const names = userInfo?.name?.split(' and ') ?? [];
    if (names.length > 1) {
      return `${names[0].split(' ')[0]} and ${names[1].split(' ')[0]}'s Apiary`;
    } else {
      return `${userInfo?.name}'s Apiary`;
    }
  })();

  const apiaryNameCouple =
    userInfo?.primary_beekeeper === 'husband'
      ? `${userInfo?.user_husband_name} and ${userInfo?.user_wife_name}'s Apiary`
      : `${userInfo?.user_wife_name} and ${userInfo?.user_husband_name}'s Apiary`;

  const MIN_VALUE = 1;
  const MAX_VALUE = 120;
  const handleSetupDateChange = val => {
    // Parse the input value to an integer
    const setupDate = parseInt(val);

    // Check if the input value is within the allowed range
    if (setupDate >= MIN_VALUE && setupDate <= MAX_VALUE) {
      // Update the state if the value is valid
      setfarmdetails({
        ...farmdetails,
        setupDate: setupDate.toString(),
      });
    } else {
      // Show a toast message for invalid values
      ToastAndroid.show(
        `Please enter a value between ${MIN_VALUE} and ${MAX_VALUE}`,
        ToastAndroid.SHORT,
      );
    }
  };
  return (
    <View>

<View style={{flexDirection: 'column',paddingHorizontal:20, marginVertical:10,
                  paddingVertical:20,
                  backgroundColor:'#fff',
                  borderColor: udyamitaTheme.borderStyleColor,
  borderWidth:0.5
                  }}>
        <Text
            style={
             [ !(userInfo?.identity === 'couple'
                ? apiaryNameCouple?.length > 0
                : apiaryNameSingle?.length > 0)
                ? styles.label
                : styles.correctlabel,{
                  marginBottom:10,
                }]
            }>
            1. {t('enterYourFullName')}
          </Text>
          <TextInput
            placeholder={t('enterYourFullName')}
            placeholderTextColor={udyamitaTheme.textColor}
            style={styles.textInputWrapNormal2({greenborder:false})}
            value={
              farmdetails.name
            }
            onChangeText={val => {
              setfarmdetails({...farmdetails, name: val});

            }}
          />
          
        </View>

      {farmdetails?.addressLine?.length > 0 ? (
        <View
          style={{
            backgroundColor:'#fff',
                  borderColor: udyamitaTheme.borderStyleColor,
  borderWidth:0.5,
            paddingHorizontal: 20,
            paddingVertical: 15,
            marginTop: 15,
          }}>
          <CustomText style={[styles.label]} type="mlabel">
            {t('whereAreYouLocated')}
          </CustomText>

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
                setfarmdetails({...farmdetails, addressLine: e});
              }}
              value={farmdetails?.addressLine}
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
                style={{width: 19.26, height: 23.53}}
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
          </View>
        </View>
      ) : (
        <>
         <View
          style={{
            backgroundColor: '#fff',
            paddingHorizontal: 10,
            paddingVertical: 15,
            backgroundColor:'#fff',
                  borderColor: udyamitaTheme.borderStyleColor,
  borderWidth:0.5
            // marginTop: 15,
          }}>

        <CustomText style={[styles.label,{paddingHorizontal: 10,}]} type="mlabel">
            {t('whereAreYouLocated')}
          </CustomText>
          

        <View
          style={{backgroundColor: '#fff',}}>
          <TouchableOpacity
            onPress={() => {
              getLocation();
            }}
            style={[
              styles.textInputWrap2,
              {
                // paddingHorizontal: 15,
                borderWidth: 1.2,
                borderColor: '#028454',
                justifyContent: 'center',
                marginHorizontal: 10,
                backgroundColor: '#fff',
                paddingHorizontal: 10,
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
              Fetch my location
            </CustomText>
            {locationLoader &&  <ActivityIndicator size="small"
            animating={locationLoader}
            color="#028454"
            style={{marginleft: 10}} />}
          </TouchableOpacity>
        </View>
        </View>
        </>
      )}
      <View style={[styles.hiveDetailsSection, {marginTop: 10}]}>
        <Text style={styles.label}>Specify your Farm Size (in acres)</Text>
        <View style={{position: 'relative', marginTop: 15, zIndex: 1}}>
          {/* <Text style={{position:'absolute',top:-7,paddingHorizontal:5,backgroundColor:'#fff',zIndex:3,left:10,fontSize:8,fontWeight:'400'}}>Farm Size</Text>  */}
          <TextInput
            placeholder={'Farm Size'}
            placeholderTextColor={udyamitaTheme.textColor}
            style={styles.textInputWrapNormal}
            keyboardType="number-pad"
            value={farmdetails?.farmsize}
            onChangeText={val => {
              // Check if the entered value is a number

              setfarmdetails({
                ...farmdetails,
                farmsize: val,
              });
            }}
            // onChangeText={val => {
            //   setfarmdetails({
            //     ...farmdetails,
            //     setupDate: val,
            //   });
            // }}
          />
          <View
            style={{
              position: 'absolute',
              right: 0,
              backgroundColor: '#FAFAFA',
              borderWidth: 0.5,
              borderColor: udyamitaTheme.borderStyleColor,
              borderRadius: 5,
              padding: 14.5,
            }}>
            <CustomText style={{fontWeight: '600'}}>acres</CustomText>
          </View>
        </View>
      </View>
      <View
        style={[styles.hiveDetailsSection, {marginTop: 10, marginBottom: 20}]}>
        <Text style={styles.label}>How many bee boxes can your farm host?</Text>
        <View style={{position: 'relative', marginTop: 15}}>
          {/* <Text style={{position:'absolute',top:-7,backgroundColor:'#fff',zIndex:3,left:10,fontSize:8,fontWeight:'400',paddingHorizontal:5}}>Number of Beeboxes</Text>  */}

          <TextInput
            placeholder={'Number of Boxes'}
            placeholderTextColor={udyamitaTheme.textColor}
            style={styles.textInputWrapNormal}
            keyboardType="number-pad"
            value={farmdetails?.totalbeebox}
            onChangeText={val => {
              // Check if the entered value is a number

              setfarmdetails({
                ...farmdetails,
                totalbeebox: val,
              });
            }}
            
          />
          <View
            style={{
              position: 'absolute',
              right: 0,
              backgroundColor: '#FAFAFA',
              borderWidth: 0.5,
              borderColor: udyamitaTheme.borderStyleColor,
              borderRadius: 5,
              padding: 14.5,
            }}>
            <CustomText style={{fontWeight: '600'}}>Boxes</CustomText>
          </View>
        </View>
      </View>
      {/* {address || farmdetails?.location?.address ? (
        <View style={[styles.hiveDetailsSection, {marginTop: 10}]}>
          <Text style={styles.label}>{t('location')}</Text>
          <Text>
            {farmdetails?.location?.address
              ? farmdetails?.location?.address
              : address}
          </Text>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('GeoLocationService', {
                farmdetails,
                setfarmdetails,
                profileId: farmdetails?.id,
                isEdit,
                
              });
            }}
            style={styles.fetchBtn}>
            <FetchIcon />
            <Text style={styles.fetchTxt}>{t('editLocation')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('GeoLocationService');
          }}
          style={styles.fetchBtn}>
          <FetchIcon />
          <Text style={styles.fetchTxt}>{t('fetchLocation')}</Text>
        </TouchableOpacity>
      )} */}
    </View>
  );
};

export default Farmregistry_farmdetail;

const styles = StyleSheet.create({
  hiveDetailsSection: {
    backgroundColor: '#fff',
    borderWidth: 0.5,

    borderColor: udyamitaTheme.borderStyleColor,
    padding: 20,
  },
  placeholderStyle: props => ({
    fontFamily: udyamitaTheme.mainThemeFontFamily,
  }),
  label: {
    color: udyamitaTheme.textColor,
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    fontSize: udyamitaTheme.themeFontSizeLabel,

    marginBottom: 10,
  },
  textInputWrapNormal2 : props=>({
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 0.8,
    borderColor: props. greenborder ? '#028454': props?.redborder ? '#FF0000' : udyamitaTheme.borderStyleColor,
    paddingLeft: 10,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    color: udyamitaTheme.textColor,
  }),
  label: {
    color: '#262626',
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    fontSize: udyamitaTheme.themeFontSizeLabel,
  },
  textInputWrap2: {
    // height: 50,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: udyamitaTheme.borderStyleColor,
    flexDirection: 'row',
    marginTop: 10,
    backgroundColor: '#fff',
  },
  textInputWrap: {
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    width: '90%',
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
  },
  textInputWrapNormal: {
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: udyamitaTheme.borderStyleColor,
    paddingLeft: 10,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    color: udyamitaTheme.textColor,
  },
  fetchBtn: {
    height: 52,
    backgroundColor: '#fff',
    justifyContent: 'center',
    textAlign: 'center',
    borderRadius: 6,
    borderColor: udyamitaTheme.beeAppColor,
    borderWidth: 1.2,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    marginBottom: 20,
  },
  fetchTxt: {
    color: udyamitaTheme.beeAppColor,
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    fontSize: udyamitaTheme.themeFontSizeLabel,

    lineHeight: 24,
    marginLeft: 10,
  },
  greenBtn: {
    backgroundColor: udyamitaTheme.beeAppColor,
    height: 52,
    margin: 20,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  greenBtnText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    color: '#fff',
    fontSize: udyamitaTheme.themeFontSizeLabel,
  },
  editText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    color: udyamitaTheme.beeAppColor,
    fontSize: udyamitaTheme.themeFontSizeLabel,
  },
  editButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: udyamitaTheme.beeAppColor,
  },
  uploadText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    color: udyamitaTheme.beeAppColor,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    marginLeft: 10,
  },
  selectedImage: {
    width: '100%',
    height: 258,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  addMediaContainer: {
    backgroundColor: 'rgba(203, 203, 203, 0.1)',
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: udyamitaTheme.borderStyleColor,
    borderRadius: 10,
    marginTop: 10,
    minHeight: 258,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#E6F3EE',
    //width: 155,
    height: 43,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 6,
    padding: 10,
  },
  text: {
    textAlign: 'center',
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    fontSize: udyamitaTheme.themeFontSizeButton,
    // marginLeft: 10,
    marginLeft: 30,
    color: udyamitaTheme.textColor,
  },
});
