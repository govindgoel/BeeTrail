import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Dimensions, Alert} from 'react-native';
import RNMapView, {Circle, Marker} from 'react-native-maps';
import {udyamitaTheme} from '../../config/styles/udyamitaTheme';

const MapView = ({coords, getAddress, locationFetched, getLocation,heading}) => {
  const mapRef = useRef(null);
  const screen = Dimensions.get('window');
  const ASPECT_RATIO = screen.width / screen.height;
  const LATITUDE_DELTA = 0.01;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


  const [region, setRegion] = useState({
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
    latitude: 17.385,
    longitude: 78.4867,
  });


  useEffect(() => {
    if (!!coords && mapRef.current) {
      setRegion(prevState => {
        return {
          ...prevState,
          latitude: coords?.latitude,
          longitude: coords?.longitude,
        };
      });
      mapRef.current.animateCamera({
        center: {
          latitude: coords.latitude,
          longitude: coords.longitude,
        },
        pitch: 0,
        heading: 0,
        altitude: 1000,
        zoom: 16,
      });
    }
  }, [coords]);

  const onRegionChange = (regions, isGesture) => {
    if (locationFetched) {
      if (isGesture?.isGesture) {
        setRegion(regions);
        mapRef.current.animateCamera({
          center: {
            latitude: regions.latitude,
            longitude: regions.longitude,
          },
        });
        getAddress(regions?.latitude, regions?.longitude);
      }
    } else {
      getLocation();
    }
  };

  return (
    <View style={styles.container}>
      <RNMapView
        ref={mapRef}
        initialCamera={{
          altitude: 15000,
          center: {
            latitude: 20.7603,
            longitude: 78.4125,
          },
          heading: 0,
          pitch: 0,
          zoom: 11,
        }}
        loadingEnabled
        loadingBackgroundColor="white"
        style={StyleSheet.absoluteFillObject}
        // initialRegion={region}
        onRegionChangeComplete={onRegionChange}
        // region={region}
        rotateEnabled={false}>
        {!!coords && (
          <>
            <Marker
              anchor={{x: 0.5, y: 0.6}}
              coordinate={{
                latitude: region.latitude,
                longitude: region.longitude,
              }}
              flat
              style={{
                ...(heading !== -1 && {
                  transform: [
                    {
                      rotate: `${heading}deg`,
                    },
                  ],
                }),
              }}>
             
              <View style={styles.dotContainer}>
                <View style={[styles.arrow]} />
                <View style={styles.dot} />
              </View>
            </Marker>
            <Circle
              center={{
                latitude: region.latitude,
                longitude: region.longitude,
              }}
              radius={coords.accuracy}
              strokeColor="rgba(0, 150, 255, 0.5)"
              fillColor="rgba(0, 150, 255, 0.5)"
            />
          </>
        )}
      </RNMapView>
    </View>
  );
};

export default MapView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dotContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    backgroundColor: udyamitaTheme?.beeAppColor,
    width: 24,
    height: 24,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 12,
    shadowColor: 'black',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 1.5,
    elevation: 4,
  },
  arrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: udyamitaTheme?.beeAppColor,
  },
});
