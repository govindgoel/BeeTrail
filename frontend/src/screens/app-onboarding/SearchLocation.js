import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  BackHandler,
  Text,
  Dimensions,
  Image,
  TextInput,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';

import Toast from 'react-native-simple-toast';
import Geolocation from 'react-native-geolocation-service';

import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Geocoder from 'react-native-geocoding';
import MapView, {Callout, Marker} from 'react-native-maps';
import {useNavigation} from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import CustomText from '../../components/reusable/CustomText';
import { BackIcon } from '../../components/IconSvgs';
import { udyamitaTheme } from '../../config/styles/udyamitaTheme';
import {APP_GEO_KEY} from '@env'

const GOOGLE_API_KEY = APP_GEO_KEY;
const {width, height} = Dimensions.get('window');

const AddressDisplay = ({address}) => {
  console.log(address,'addressjj');
  if (!address) return <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',width:'80%'}}>
    <ActivityIndicator size={30} color={udyamitaTheme.beeAppColor}/>
    </View> ;
  // Split the address into parts
  const parts = address.split(',');

  const street = parts.slice(0, 2).join(', ').trim(); // First two parts as street
  const stateCountry = parts.slice(-2).join(', ').trim(); // Last two parts as state & country

  return (
    <View style={{flexDirection: 'column', gap: 4}}>
      <Text style={{fontSize: 16, fontWeight: '600'}}>{street}</Text>
      <Text style={{fontSize: 14, fontWeight: '400'}}>{stateCountry}</Text>
    </View>
  );
};
export const SearchLocation = ({addressConfirm}) => {
  const {t}=useTranslation()
  const [searchText, setSearchText] = useState('');
  const [buzzData, setBuzzData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locationCoordinates, setLocationCoordinates] = useState({
    lat: null,
    lng: null,
  });
  const [currentAddress, setCurrentAddress] = useState('');
  const [loadingCoordiantes, setloadingCoordiantes] = useState(false);
  const [showCalloutCounter, setshowCalloutCounter] = useState(0)
  const navigation = useNavigation();
  const onBackPress = () => {
    navigation.goBack();
  };
  const markerRef = useRef()

  useEffect(() => {
    const interval = setInterval(() => {
      if (markerRef.current && showCalloutCounter<=3) {
        console.log('✅ Showing Callout');
        markerRef.current.showCallout();
        setshowCalloutCounter(showCalloutCounter+1)
        clearInterval(interval); // Stop checking after success
      }
    }, 500); // Check every 500ms until marker is available
  
    return () => clearInterval(interval); // Cleanup on unmount
  }, [locationCoordinates]);

  const getAddress = async (lat, lng) => {
    Geocoder.from({
      lat,
      lng,
    })
      .then(json => {
        let addressRes = json.results[0];
        console.log('🚀 ~ getAddress ~ addressRes:', addressRes);

        setCurrentAddress(addressRes?.formatted_address);

        console.log(
          '🚀 ~ getAddress ~ addressRes?.formatted_address:',
          addressRes?.formatted_address,
        );
        //   setLocationFetched(true);
      })
      .catch(error => {
        console.warn(error);
        Toast.show(
          'Please enter your address manually!',
        );
      });
  };

  const fetchLocationData = async () => {
    try {
      setloadingCoordiantes(true);
      const hasPermission = await requestLocationPermission();
      console.log(hasPermission);
      if (hasPermission) {
        try {
          console.log('enter');
          const ss = await new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(
              position => {
                resolve(position);
              },
              error => {
                reject(error);
              },
              {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 10000,
                forceRequestLocation: true,
              },
            );
          });
          console.log(ss, 'cordinates of location');

          setLocationCoordinates(prev => ({
            lat: ss.coords.latitude,
            lng: ss.coords.longitude,
          }));
          getAddress(ss.coords.latitude, ss.coords.longitude);
          setloadingCoordiantes(false);
        } catch (error) {
          setloadingCoordiantes(false);
          console.log('Error getting location:', error.code, error.message);
          Toast.show(JSON.stringify(error));
        }
      }
    } catch (error) {
      console.log(error);
      setloadingCoordiantes(false);
      Toast.show(JSON.stringify(error));
    }
  };

  useEffect(() => {
    Geocoder.init('AIzaSyBg4tz2fOqTqAny-Hph8blHRP9YeRTuIDg');
    fetchLocationData();
  }, []);

  return (
    <>
      <View style={[styles.mainContainer]}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            // width: '60%',
            //flexWrap: 'wrap',
          }}>
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <BackIcon />
          </TouchableOpacity>

          <View>
            <CustomText
              ellipsizeMode="tail"
              numberOdLines={1}
              style={styles.title}
              type="mlabel">
              {t('buzztrack')}
            </CustomText>
          </View>
        </View>
        <View style={{marginVertical: 8, position: 'relative'}}>
          {/* <TextInput
            placeholderTextColor={'#262626'}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#CBCBCB',
              color: '#262626',
              fontSize: 12,
              fontWeight: '400',
            }}
            placeholder={'Search for street name or area'}
            value={searchText}
            onChangeText={text => setSearchText(text)}
          /> */}
          <GooglePlacesAutocomplete
            fetchDetails={true} // Ensures details like lat/lng are retrieved
            enableHighAccuracyLocation={true}
            placeholder="Search for a location"
            minLength={2}
            autoFocus={false}
            returnKeyType={'search'}
            autoFillOnNotFound={false}
            enablePoweredByContainer={false}
            textInputProps={{
              onChangeText: text => console.log(text, 'Input text'),
            }}
            onPress={(data, details = null) => {
              console.log(
                data.description,
                details.geometry.location.lng,
                details.geometry.location.lat,
                'onPress action',
              );
              setCurrentAddress(data.description);
              setLocationCoordinates({
                lat: details.geometry.location.lat,
                lng: details.geometry.location.lng,
              });
            }}
            query={{
              key: GOOGLE_API_KEY,
              language: 'en',
              components: 'country:IN',
            }}
            debounce={200}
            // debug={true} // Log errors irn console
            styles={{
              textInput: {
                backgroundColor: 'white',
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#CBCBCB',
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 12,
                fontWeight: '400',
              },
              listView: {
                position: 'absolute',
                marginTop: 44,
                backgroundColor: 'white',
                borderBottomEndRadius: 15,
                elevation: 2,
              },
            }}
          />

          <View
            style={{
              position: 'absolute',
              backgroundColor: 'white',
              right: 15,
              top: 10,
            }}>
            <Image
              style={{width: 24, height: 24}}
              source={require('../../assets/images/SearchGreen.png')}
            />
          </View>
        </View>
      </View>

      <View style={styles.map}>
        <MapView
          mapType="standard" // Ensures normal map with properly colored roads
          style={styles.map}
          region={{
            latitude: locationCoordinates.lat || 20.5937, // Default to India's center
            longitude: locationCoordinates.lng || 78.9629,
            latitudeDelta: locationCoordinates.lat ? 0.01 : 25, // Adjust zoom
            longitudeDelta: locationCoordinates.lng ? 0.01 : 25,
          }}
          onRegionChangeComplete={region => {
            if (!locationCoordinates.lat) {
              setLocationCoordinates({
                lat: region.latitude,
                lng: region.longitude,
              });
            }
          }}
          onPress={e => {
            const { latitude, longitude } = e.nativeEvent.coordinate;
            setLocationCoordinates({ lat: latitude, lng: longitude });
            getAddress(latitude, longitude); // optional, if you're reverse geocoding
            // console.log('ascacs',latitude,longitude,e.nativeEvent);
          }}>
          {locationCoordinates.lat && locationCoordinates.lng && (
            <Marker
            ref={markerRef}
              draggable
              coordinate={{
                latitude: locationCoordinates.lat,
                longitude: locationCoordinates.lng,
              }}
              //   image={require('../../assets/images/UserLocationMarker.png')}
              onDragEnd={e => {
                const {latitude, longitude} = e.nativeEvent.coordinate;
                setLocationCoordinates({lat: latitude, lng: longitude});
                getAddress(latitude, longitude);
                console.log(latitude, longitude, 'drag end');
              }}
              >
              <View
                style={{
                  width: 40,
                  height: 60,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../../assets/images/UserLocationMarker.png')}
                  style={{width: '100%', height: '100%'}} // Scale up
                  resizeMode="contain"
                />
              </View>
              <Callout style={{width:280}} tooltip>
            <View style={{
              backgroundColor: '#262626',
              padding: 14,
              width:280,
              borderRadius: 10,
              alignItems: 'center',
              textAlign:'center',
              elevation: 5,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 5,
            }}>
              <Text style={{ fontWeight: 'bold',fontSize:14,color:'#FFFFFF' }}>{t('Pincurrentlocations')} </Text>
              <Text style={{ fontWeight: 'bold',fontSize:14,color:'#FFFFFF',opacity:0.2,textAlign:'center' }}>{t('Movepinlocation')} </Text>
            </View>
          </Callout>
            </Marker>
          )}
        </MapView>
      </View>

      <View style={[styles.footer]}>
        <View
          style={[
            styles.flexrow,
            {
              paddingHorizontal: 20,
              justifyContent: 'flex-start',
              width: '100%',
            },
          ]}>
          <Image
            style={{width: 32, height: 32}}
            source={require('../../assets/images/LocationBlack.png')}
          />
          <AddressDisplay address={currentAddress} />
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: udyamitaTheme.beeAppColor,
            borderRadius: 8,
            paddingHorizontal: 16,
            paddingVertical: 12,
            width: '85%',
            marginTop: 16,
            marginBottom: 20,
            justifyContent: 'center',
          }}
          onPress={() => {
            if(currentAddress && locationCoordinates.lat && locationCoordinates.lng){
              addressConfirm( {
                currentAddress: currentAddress,
                locationCoordinates: locationCoordinates,
              });
            }
            else{
              Toast.show(t('SelectLocationFirst'))
            }
            
          }}>
          <CustomText
            style={{
              fontSize: 14,
              fontWeight: '500',
              color: '#FFFFFF',
              textAlign: 'center',
            }}>
            {t('Confirmlocationhives')}
          </CustomText>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 10,
    position: 'absolute',
    top: 0,
    // marginBottom: 16,
    elevation: 10,
    backgroundColor: udyamitaTheme.themeBgColor,
    // justifyContent: 'center',
    //marginBottom: 16,
    //alignItems:'center'
    zIndex: 2,
    width: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    //alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: udyamitaTheme.textColor,
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    fontSize: udyamitaTheme.themeFontSizeModalLabel,
    //marginLeft: 10,
  },
  backButton: {
    // position: 'absolute',
    //left: 10,
    width: 36,
    height: 36,
    marginRight: 10,
    //backgroundColor:'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#333',
  },
  headerBackButton: {
    width: 20,
    height: 20,
    tintColor: '#333',
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  imageContainer: {
    height: 200,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  map: {
    height: height,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'white',
    width: '100%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
    paddingTop: 20,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    elevation: 10,
  },
  flexrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
});
