import React, {useEffect, useState} from 'react';
import {
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
  TextInput,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import {
  PrimaryButton,
  ButtonText,
  PrimaryMargin,
  LabelText,
} from '../../components/reusable/UIComponentsBeeApp';
import MapView from './MapView';
import appConfig from '../../../app.config'; // update app config
// import appConfig from '../../../app.json';
import {udyamitaTheme} from '../../config/styles/udyamitaTheme';
import {useTranslation} from 'react-i18next';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {transliterationScriptsMap} from './DataApiaryRegistration';

export default function GeoLocationService({navigation, route}) {
  const [forceLocation, setForceLocation] = useState(true);
  const [highAccuracy, setHighAccuracy] = useState(true);
  const [locationDialog, setLocationDialog] = useState(true);
  const [useLocationManager, setUseLocationManager] = useState(true);
  //const [formattedAddress, setEditedAddress] = useState('');
  const [locationFetched, setLocationFetched] = useState(false);
  const [editedAddress, setEditedAddress] = useState('');

  const [location, setLocation] = useState(null);
  const [heading, setHeading] = useState(0);
  const {t} = useTranslation();
  const lang = useSelector(state => state?.entrepreneur?.prefLang);

  const hasPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    };
    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
      return true;
    }

    if (status === 'denied') {
      Alert.alert('Location permission denied');
    }

    if (status === 'disabled') {
      Alert.alert(
        `Turn on Location Services to allow "${appConfig.displayName}" to determine your location.`,
        '',
        [
          {text: 'Go to Settings', onPress: openSetting},
          {text: "Don't Use Location", onPress: () => {}},
        ],
      );
    }

    return false;
  };

  const hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await hasPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
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

  useEffect(() => {
    getLocation();
  }, []);

  const getAddress = async (lat, lng) => {
    setLocation({longitude: lng, latitude: lat});
    Geocoder.from({
      lat,
      lng,
    })
      .then(json => {
        let addressRes = json.results[0];
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
          setEditedAddress(addressRes?.formatted_address);

          console.log(
            '🚀 ~ getAddress ~ addressRes?.formatted_address:',
            addressRes?.formatted_address,
          );
          setLocationFetched(true);
        }
      })
      .catch(error => {
        console.warn(error);
        setLocationFetched(true);
        ToastAndroid.show(
          'Please enter your address manually!',
          ToastAndroid.LONG,
        );
      });
  };
  const getLocation = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        console.log('🚀 ~ getLocation ~ position:', position);
        // setLocation(position);

        setHeading(position?.coords?.heading);
        getAddress(position?.coords?.latitude, position?.coords?.longitude);
      },
      error => {
        console.error('Error getting location:', error);
        Alert.alert(`Code ${error.code}`, error.message);
        setLocation(null);
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
        forceLocationManager: useLocationManager,
        showLocationDialog: locationDialog,
      },
    );
  };

  // const getLocation = async () => {
  //   const hasPermission = await hasLocationPermission();

  //   if (!hasPermission) {
  //     return;
  //   }

  //   // Geolocation.getCurrentPosition(
  //   //   position => {
  //   //     setLocation(position);

  //   //     getAddress(position?.coords?.latitude, position?.coords?.longitude);

  //   //   },
  //   //   error => {
  //   //     Alert.alert(`Code ${error.code}`, error.message);
  //   //     setLocation(null);
  //   //   },
  //   //   {
  //   //     accuracy: {
  //   //       android: 'high',
  //   //       ios: 'best',
  //   //     },
  //   //     enableHighAccuracy: highAccuracy,
  //   //     timeout: 15000,
  //   //     maximumAge: 10000,
  //   //     distanceFilter: 0,
  //   //     forceRequestLocation: forceLocation,
  //   //     forceLocationManager: useLocationManager,
  //   //     showLocationDialog: locationDialog,
  //   //   },
  //   // );

  // };

  const confirmLocation = () => {
    if (route?.params?.migration) {
      navigation.navigate('MigrationForm', {
        locationNav: true,
        geoCoordinates: {
          latitude: location?.latitude,
          longitude: location?.longitude,
        },
        address: editedAddress,
      });
    } else if (route?.params?.beemitra) {
      // Handle the case when beemitra is true
      navigation.navigate('AddBeeMitra', {
        locationNav: route?.params?.profileId ? true : false,
        geoCoordinates: {
          latitude: location?.latitude,
          longitude: location?.longitude,
        },
        profileId: route?.params?.profileId,
        address: editedAddress,
      });
    } else {
      navigation.navigate('BeeLandingPageScreen', {
        locationNav: route?.params?.isEdit ? true : false,
        geoCoordinates: {
          latitude: location?.latitude,
          longitude: location?.longitude,
        },
        address: editedAddress,
        profileId: route?.params?.profileId,
      
      });
    }
  };
  // useEffect(()=>{
  //   if(route?.params?.isEdit){
  //     setLocation({latitude:route?.params?.editApiary?.location.geoCoordinates.latitude,
  //                  longitude:route?.params?.editApiary?.location?.geoCoordinates?.longitude});
  //     setEditedAddress(route?.params?.editApiary?.location?.address);
  //   }

  // },[route?.params?.isEdit]);

  return (
    <View style={styles.mainContainer}>
      <MapView
        coords={location || null}
        getAddress={getAddress}
        locationFetched={locationFetched}
        getLocation={getLocation}
        heading={heading}
      />

      <View style={styles.buttonContainer}>
        <LabelText>{t('yourLocation')}: </LabelText>
        {editedAddress ? (
          <TextInput
            style={styles.addressTextInput}
            placeholder={t('yourLocation')}
            placeholderTextColor={udyamitaTheme.textColor}
            value={editedAddress}
            onChangeText={text => setEditedAddress(text)}
            //defaultValue={formattedAddress}
          />
        ) : null}

        <PrimaryMargin mt={10} />
        <PrimaryButton
          onPress={locationFetched ? confirmLocation : getLocation}>
          <ButtonText>
            {locationFetched ? t('confirmLocation') : t('getLocation')}
          </ButtonText>
        </PrimaryButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  contentContainer: {
    padding: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
  },
  result: {
    borderWidth: 1,
    borderColor: '#666',
    width: '100%',
    padding: 10,
  },
  buttonContainer: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    padding: 20,
    minWidth: '100%',
    backgroundColor: 'white',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 12,
    width: '100%',
  },
  addressTextInput: {
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: udyamitaTheme.borderStyleColor,
    padding: 10,
    fontSize: udyamitaTheme.themeFontSizeLabel,
  },
});
