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
  ActivityIndicator
} from 'react-native';
import CustomText from '../../components/reusable/CustomText';
import ImagePicker from 'react-native-image-crop-picker';
import BottomSheet from 'react-native-raw-bottom-sheet';
import {FetchIcon} from '../../assets/Icons/IconSvg';
import Toast from 'react-native-simple-toast';
import {useTranslation} from 'react-i18next';
import {udyamitaTheme} from '../../config/styles/udyamitaTheme';
import React, {useState, useEffect,useRef} from 'react';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import districts from '../../constants/Districts';
import {APP_GEO_KEY} from '@env';

// import CustomText from '../../components/reusable/CustomText';
const BeeRegisterMyApiary = ({
  navigation,
  apiaryDetails,
  setapiaryDetails,
  setAllowProceedToNextScreen,
  address,
  geoCoordinates,
  isEdit,
  userInfo,
  clickonnext
}) => {
  const {t} = useTranslation();
  const bottomSheetRef = useRef();
  const [edit, setedit] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null);
  const setupdateref = useRef(false)
  const [flag, setflag] = useState(false)
  const [errorlist, seterrorlist] = useState({
    address: false,
    apiaryImage: false,
    name:false
  })
  const location = useRef({
    latitude:'',
    longitude:''
  })
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
    function check() {
      const {_id, location, setupDate,apiaryImage} = apiaryDetails;
      if(!edit && clickonnext==0){
        return ;      
      }
        const e=errorlist
        // e.apiaryImage=apiaryImage==null
        e.address=apiaryDetails.address.length==0
        e.name=apiaryDetails.name.length==0
        console.log(e,edit);
          seterrorlist(e)       
       
  
        setTimeout(() => {
          setflag(!flag)
        }, 30);
    }
    check()
      
    
  }, [clickonnext,apiaryDetails])
  
  useEffect(() => {
    const {_id, location, name,address,apiaryImage} = apiaryDetails;
console.log('✌️apiaryDetails --->', apiaryDetails);
console.log('✌️apiaryImage --->', apiaryImage);
setSelectedImage(apiaryImage);
    const allowNext =  name && address ;

    setAllowProceedToNextScreen(allowNext);
  }, [
    apiaryDetails, address
  ]);
  const handleChooseFromLibrary = async () => {
    try { 
      if(!edit){
      setedit(!edit)
    }

      const ph = await ImagePicker.openPicker({
        // multiple: true,
        includeExif: true,
        includeBase64: true,
        width: 640,
        height: 480,
        mediaType: 'photo',
        compressImageMaxWidth: 640,
        compressImageMaxHeight: 480,
        compressImageQuality: 0.3,
        maxFiles: 40,
      });
      setSelectedImage(ph.path);
     
      setapiaryDetails({
        ...apiaryDetails,
        latitude: ph.exif.Latitude?ph.exif.Latitude :location.current.latitude,
        longitude: ph.exif.Longitude?ph.exif.Longitude:location.current.longitude,
        apiaryImage:ph.path,
        base64:ph.data
      });
      console.log("🚀 ~ handleChooseFromLibrary ~ ph:", ph)
      // if multiple images are selected
      for (let i = 0; i < ph.length; i++) {
        const image = ph[i];
        console.log(JSON.stringify(image.exif));
      }
      bottomSheetRef.current.close();
    } catch (error) {
      console.error('Error picking an image:', error);
    }
  };
  const handleTakePhoto = async () => {
    try {
      if(!edit){
        setedit(!edit)
      }
      const media = await ImagePicker.openCamera({
        includeExif: true,
        includeBase64: true,
        width: 640,
        height: 480,
        mediaType: 'photo',
        compressImageMaxWidth: 640,
        compressImageMaxHeight: 480,
        compressImageQuality: 0.3,
        maxFiles: 40,

        // multiple: true,
      });
  
      console.log("media.exif",JSON.stringify(media.exif), media.exif.Latitude);

      if (!media) {
        console.error('No media selected or an error occurred.');
        return;
      }
      setSelectedImage(media.path);
      setapiaryDetails({
        ...apiaryDetails,
        latitude: media.exif.Latitude?media.exif.Latitude:location.current.latitude,
        longitude: media.exif.Longitude?media.exif.Longitude:location.current.longitude,
        apiaryImage:media.path,
        base64:ph.data

      });
      if (bottomSheetRef.current) {
        bottomSheetRef.current.close();
      }

      bottomSheetRef.current.close();
    } catch (error) {
      console.error('Error taking a photo:', error);
    }
  };
  const RBSheetBottomOptionsComponent = () => {
    return (
      <React.Fragment>
        <TouchableOpacity
          style={{
            padding: 20,
            borderBottomWidth: 0.5,
            borderBottomColor: udyamitaTheme.borderStyleColor,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
              fontSize: udyamitaTheme.themeFontSizeButton,
              color: udyamitaTheme.textColor,
            }}>
            {t('addPhotos')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            borderBottomWidth: 0.5,
            borderBottomColor: udyamitaTheme.borderStyleColor,

            alignItems: 'center',
            height: 70,
            flexDirection: 'row',
          }}
          onPress={() => handleChooseFromLibrary()}>
          <Image
            source={require('../../assets/images/addmediaGreen.png')}
            style={{width: 31, height: 26, marginLeft: 60}}
          />
          <CustomText style={styles.text} type="btn">
            {t('chooseFromLibrary')}
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            alignItems: 'center',
            height: 70,
            borderBottomWidth: 0.5,
            borderBottomColor: udyamitaTheme.borderStyleColor,
            flexDirection: 'row',
          }}
          onPress={() => handleTakePhoto()}>
          <Image
            source={require('../../assets/images/CameraGreen.png')}
            style={{width: 31, height: 26, marginLeft: 60}}
          />
          <CustomText style={styles.text} type="btn">
            {t('takePhoto')}
          </CustomText>
        </TouchableOpacity>
      </React.Fragment>
    );
  };
 
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
          // setlocation(addressRes?.formatted_address);
          // setlatitude(addressRes?.geometry?.location?.lat)
          // setlongitude(addressRes?.geometry?.location?.lng)
          // setSelectedDistrict(city)
          // setSelectedState(state)
          setapiaryDetails({
            ...apiaryDetails,
            district: city,
            state,
            latitude: addressRes?.geometry?.location?.lat,
            longitude: addressRes?.geometry?.location?.lng,
            address:addressRes?.formatted_address

          });
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

  const apiaryNameSingle = (() => {    
        return `${userInfo?.name}`;
    
})();

  const apiaryNameCouple =
    userInfo?.primary_beekeeper === 'husband'
      ? `${userInfo?.user_husband_name} and ${userInfo?.user_wife_name}'s Apiary`
      : `${userInfo?.user_wife_name} and ${userInfo?.user_husband_name}'s Apiary`;


      const MIN_VALUE = 1;
const MAX_VALUE = 120;
const handleSetupDateChange = (val) => {
  // Parse the input value to an integer
  const setupDate = parseInt(val);

  // Check if the input value is within the allowed range
  if (setupDate >= MIN_VALUE && setupDate <= MAX_VALUE) {
    // Update the state if the value is valid
    setapiaryDetails({
      ...apiaryDetails,
      setupDate: setupDate.toString(),
    });
  } else {
    // Show a toast message for invalid values
    ToastAndroid.show(`Please enter a value between ${MIN_VALUE} and ${MAX_VALUE}`, ToastAndroid.SHORT);
  }
};
  return (
    <View>
      <View style={[styles.hiveDetailsSection, {marginTop: 10}]}>
        <View
          style={[styles.flexrow, {gap: 8, marginTop: 14, marginBottom: 6}]}>
          {apiaryDetails.name.length>0 && (
            <View
              style={{
                backgroundColor: '#028454',
                paddingHorizontal: 2,
                alignSelf: 'end',
                marginBottom: 10,
                paddingVertical: 3.5,
                borderRadius: 500,
                // marginTop: 10,
              }}>
              <Image
                style={{alignSelf: 'center'}}
                source={require('../../assets/images/white_tick.png')}
              />
            </View>
          )}

          <Text
            style={
              apiaryDetails.name.length==0
                ? styles.label
                : styles.correctlabel
            }>
            1. {t('enterYourFullName')}
          </Text>
        </View>
        <View style={{flexDirection: 'column'}}>
          <TextInput
            placeholder={t('enterYourFullName')}
            placeholderTextColor={udyamitaTheme.textColor}
            style={styles.textInputWrapNormal({greenborder:false})}
            value={
              apiaryDetails.name
            }
            onChangeText={val => {
              setapiaryDetails({
                ...apiaryDetails,
                name: val,
              });
            }}
          />
          
        </View>
      </View>
  
      {/* {address || apiaryDetails?.location?.address ? (
        <View style={[styles.hiveDetailsSection, {marginTop: 10}]}>
          <Text style={styles.label}>{t('location')}</Text>
          <Text>
            {apiaryDetails?.location?.address
              ? apiaryDetails?.location?.address
              : address}
          </Text>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('GeoLocationService', {
                apiaryDetails,
                setapiaryDetails,
                profileId: apiaryDetails?.id,
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
      {/* <View style={[styles.hiveDetailsSection, {marginTop: 10}]}>
        <View
          style={[styles.flexrow, {gap: 8, marginTop: 14, marginBottom: 6}]}>
          {selectedImage && (
            <View
              style={{
                backgroundColor: '#028454',
                paddingHorizontal: 2,
                alignSelf: 'end',
                marginBottom: 10,
                paddingVertical: 3.5,
                alignItems:'center',
                borderRadius: 500,
                // marginTop: 10,
              }}>
              <Image
                style={{alignSelf: 'center'}}
                source={require('../../assets/images/white_tick.png')}
              />
            </View>
          )}

          <Text style={!selectedImage ? styles.label : styles.correctlabel}>
            2. {t('uploadAPhotoofApiary')}
          </Text>
        </View>

        <View style={styles.addMediaContainer}>
          {selectedImage ? (
            <Image
              source={{
                uri: selectedImage
                  ? selectedImage.path
                    ? selectedImage.path
                    : selectedImage
                  : null,
              }}
              style={styles.selectedImage}
            />
          ) : (
            <View style={{flexDirection: 'column'}}>
             <TouchableOpacity
              style={[styles.button,{justifyContent:'center'}]}
              onPress={() => {bottomSheetRef.current.open()
                handleChooseFromLibrary()
              }

              }>
              <Text style={styles.uploadText}>+</Text>
              <Text style={styles.uploadText}>{t('uploadAPhoto')}</Text>
            </TouchableOpacity>
              {errorlist.apiaryImage && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingLeft: 5,
                    marginTop: 8,
                  }}>
                  <Image
                    style={{width: 12.86, height: 13}}
                    source={require('../../assets/images/error_alert.png')}
                  />
                  <Text style={styles.erroralert}>
                    {t('please')+' '+t('uploadAPhotoofApiary')}{' '}
                  </Text>
                </View>
              )}
            </View>
           
          )}

          {selectedImage && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => bottomSheetRef.current.open()}>
              <Image
                source={require('../../assets/images/EditGreen.png')}
                style={{width: 16, height: 17, marginRight: 5}}
              />
              <Text style={styles.editText}>{t('edit')}</Text>
            </TouchableOpacity>
          )}
        </View>
        <BottomSheet
          ref={bottomSheetRef}
          closeOnDragDown={true}
          closeOnPressMask={true}
          height={240}
          customStyles={{
            wrapper: {
              backgroundColor: 'rgba(0,0,0,0.5)',
            },
            draggableIcon: {
              backgroundColor: udyamitaTheme.borderStyleColor,
            },
            container: {
              borderTopLeftRadius: 40,
              borderTopRightRadius: 40,
              backgroundColor: '#fff',
            },
          }}>
          <RBSheetBottomOptionsComponent />
        </BottomSheet>
      </View> */}
      <View
          style={{
            backgroundColor: '#fff',
            paddingHorizontal: 20,
            paddingVertical: 15,
            marginTop: 15,
            marginBottom:50
          }}>
            <View style={{flexDirection:'row',alignItems:'center',gap:6}}>

             { apiaryDetails.address.length >0 && <View
              style={{
                backgroundColor: '#028454',
                paddingHorizontal: 2,
                alignSelf: 'end',
                marginBottom: 10,
                paddingVertical: 3.5,
                borderRadius: 500,
                // marginTop: 10,
              }}>
              <Image
                style={{alignSelf: 'center'}}
                source={require('../../assets/images/white_tick.png')}
              />
            </View>}
          <CustomText style={[apiaryDetails.address.length ==0 ? styles.label : styles.correctlabel]} type="mlabel">
           2. {t('myLocation')}
          </CustomText>
            </View>
          {apiaryDetails.address.length > 0 ? (
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
                setapiaryDetails({
                  ...apiaryDetails,
                  address:e 
                });
              }}
              value={apiaryDetails.address}
              style={{
                color: '#000000',
                fontWeight: '400',
                paddingLeft: 30,
                fontSize: 14,
                paddingRight:55
              }}
              placeholder={t('enterYourFullName')}
              placeholderTextColor="rgba(38, 38, 38, 0.5)"
              // placeholderStyle={styles.placeholderStyle(udyamitaTheme)}
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
    </View>
  );
};

export default BeeRegisterMyApiary;

const styles = StyleSheet.create({
  flexrow:{
    flexDirection: 'row',
    alignItems:'center'
  },
  hiveDetailsSection: {
    backgroundColor: '#fff',
    borderWidth: 0.5,

    borderColor: udyamitaTheme.borderStyleColor,
    padding: 20,
  },
  label: {
    color: udyamitaTheme.textColor,
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    fontSize: udyamitaTheme.themeFontSizeLabel,

    marginBottom: 10,
  },
  correctlabel: {
    color: '#028454',
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    fontSize: udyamitaTheme.themeFontSizeLabel,

    marginBottom: 10,
  },
  textInputWrap: {
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    width: '90%',
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
  },
  textInputWrapNormal : props=>({
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 0.8,
    borderColor: props. greenborder ? '#028454': props?.redborder ? '#FF0000' : udyamitaTheme.borderStyleColor,
    paddingLeft: 10,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    color: udyamitaTheme.textColor,
  }),
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
  textInputWrap2: {
    // height: 50,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: udyamitaTheme.borderStyleColor,
    flexDirection: 'row',
    marginTop: 15,
    backgroundColor: '#fff',
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
  erroralert:{
    color:'#FF0000',
    fontSize:12,
    fontWeight:'400',
    marginLeft:8,
  }
});
