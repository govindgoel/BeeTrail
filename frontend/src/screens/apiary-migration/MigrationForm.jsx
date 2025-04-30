import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment';
import MapView, {Marker} from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import Geocoding from 'react-native-geocoding';
import axios from 'axios';
import {APP_API_MENTOR_VAlUECHAIN_SERVICES} from '@env';
import {getToken} from '../../helpers/UserData';
import {udyamitaTheme} from '../../config/styles/udyamitaTheme';
import CustomHeader from '../../components/reusable/generic/CustomHeader';
import {useTranslation} from 'react-i18next';
import CalendarPicker from 'react-native-calendar-picker';
import CustomText from '../../components/reusable/CustomText';
import Selectdistance from '../../components/apiary-migration/reusable/Filter_distance';
import Filter_distance from '../../components/apiary-migration/reusable/Filter_distance';
import SelectCrops from '../../components/harvest/partials/SelectCrops2';
const MigrationForm = ({navigation, route}) => {
  const [farmLocation, setFarmLocation] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [apiaries, setApiaries] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);

  const initialLocation = route?.params?.address
    ? route?.params?.address
    : apiaries[0]?.location?.address;
  const [location, setLocation] = useState(initialLocation);

  const [numberOfBeeBoxes, setNumberOfBeeBoxes] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [migration, setMigration] = useState(false);
  const [cropoption, setcropoption] = useState(-1);
  const [selecflower, setselecflower] = useState(false);
  const [selectedflower, setselectedflower] = useState([]);
  const {t} = useTranslation();
  const getApiaries = async () => {
    const token = await getToken();

    const config = {headers: {Authorization: 'Bearer ' + token}};
    // Todo realmlocal

    await axios
      .get(`${APP_API_MENTOR_VAlUECHAIN_SERVICES}/beekeeping/apiaries`, config)
      .then(response => {
        if (response.status === 200) {
          setApiaries(response?.data?.apiaries || []);
        }
      })
      .catch(err => console.log('error in getting apiaries:', err));
  };

  useFocusEffect(
    React.useCallback(() => {
      getApiaries();
      setMigration(true);
    }, []),
  );

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await Geocoding.from(apiaries[0]?.location?.address);

        if (response.results.length > 0) {
          const {lat, lng} = response.results[0].geometry.location;

          setFarmLocation({
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        } else {
          // Handle case where no results were found
          console.warn('No results found for the provided location:', location);
          // You may set a default location or provide feedback to the user
        }
      } catch (error) {
        console.error('Error fetching location:', error.message);
      }
    };

    fetchLocation();
  }, [location, apiaries[0]?.location?.address]);
  const handleBackPress = () => {
    navigation.goBack();
  };
  const handleDateChange = date => {
    if (date) {
      setSelectedDate(date);

      setShowCalendar(!showCalendar);
    } else {
      // Handle invalid date or other conditions
    }
  };
  useEffect(() => {
    // Check input validity and update the button state
    const isValidInput = selectedDate && numberOfBeeBoxes.trim() !== '';
    setIsButtonDisabled(!isValidInput);
  }, [selectedDate, numberOfBeeBoxes]);
  const handleSearchBtnPress = () => {
    navigation.navigate('FarmListing');
  };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setMonth(maxDate.getMonth() + 5);
  maxDate.setHours(23, 59, 59, 999);
  useEffect(() => {
    Geocoder.init('AIzaSyBg4tz2fOqTqAny-Hph8blHRP9YeRTuIDg');
  }, []);

  const formatDate = date => {
    if (date) {
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      });
    }
    return t('arrivalDate'); // Replace with your default CustomText for arrivalDate
  };
  return selecflower ? (
    <SelectCrops
      setselecflower={setselecflower}
      setSelectedCrop2={setselectedflower}
      selectedCrop2={selectedflower}
    />
  ) : (
    <View style={styles.mainContainer}>
      <CustomHeader
        showBackIcon={true}
        onBackPress={handleBackPress}
        title={'Book a Farm'}
        navigation={navigation}
      />
      <ScrollView style={{marginTop: 0}} showsVerticalScrollIndicator={false}>
        {/* <CustomText style={styles.label} type="label">
          {t('whereAreYouLocated')}
        </CustomText>
        <MapView
          style={{height: 180, marginVertical: 10}}
          region={farmLocation}>
          <Marker
            coordinate={farmLocation}
            title={apiaries[0]?.location?.address}
          />
        </MapView> */}
        {/* <TouchableOpacity
          style={{
            flexDirection: 'row',

            borderWidth: 0.5,
            borderColor: udyamitaTheme.borderStyleColor,
            borderRadius: 6,
            paddingLeft: 10,
            alignItems: 'center',
            backgroundColor: '#fff',
          }}>
          <Image
            source={require('../../assets/images/Location.png')}
            style={{width: 24, height: 24, resizeMode: 'contain'}}
          />
          <TextInput
            //placeholder={location}
            placeholder={
              route?.params?.address
                ? route?.params?.address
                : apiaries[0]?.location?.address
            }
            placeholderTextColor={udyamitaTheme.textColor}
            multiline
            style={styles.textInputWrap}
            value={location}
            onChangeText={CustomText => setLocation(CustomText)}
          />

          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 10,
              flexDirection: 'column',
              alignItems: 'center',
            }}
            onPress={() => {
              navigation.navigate('GeoLocationService', {migration});
            }}>
            <Image
              source={require('../../assets/images/EditGreen.png')}
              style={{width: 22, height: 22}}
            />
            <CustomText
              style={[
                styles.label,
                {
                  color: udyamitaTheme.beeAppColor,
                  fontSize: udyamitaTheme.themeFontSizeCardMiniLabel,
                  marginTop: 0,
                },
              ]}
              type="ml">
              {t('change')}
            </CustomText>
          </TouchableOpacity>
        </TouchableOpacity> */}
        <View style={[styles.questioncontainer]}>
          <CustomText style={styles.label} type="mh">
            1. {t('WhenAreYouPlanningToMigrate')}
          </CustomText>
          <TouchableOpacity
            style={{
              flexDirection: 'row',

              borderWidth: 0.5,
              borderColor: udyamitaTheme.borderStyleColor,
              borderRadius: 6,
              paddingLeft: 10,
              alignItems: 'center',
              backgroundColor: '#fff',
            }}
            onPress={() => setShowCalendar(!showCalendar)}>
            <TouchableOpacity
              style={styles.calenderBtn}
              onPress={() => setShowCalendar(!showCalendar)}>
              <CustomText style={styles.calenderBtnText} type="label">
                {selectedDate
                  ? moment(selectedDate).format('DD MMMM YYYY')
                  : t('arrivalDate')}
              </CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                position: 'absolute',
                right: 0,
                borderWidth: 0.5,
                borderColor: '#028454',
                padding: 12,
                borderRadius: 5,
              }}
              onPress={() => setShowCalendar(!showCalendar)}>
              <Image
                source={require('../../assets/images/Calendar.png')}
                style={{width: 24, height: 24}}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
        {showCalendar && (
          <View
            style={{
              width: 1280,
              alignSelf: 'center',
              backgroundColor: '#FFFFFF',
              margin: 20,
            }}>
            <CalendarPicker
              onDateChange={date => handleDateChange(date)}
              selectedDayColor={udyamitaTheme.beeAppColor}
              selectedDayTextColor="#fff"
              maxDate={maxDate}
              restrictMonthNavigation={true}
              minDate={today}
            />
          </View>
        )}
        <View style={[styles.questioncontainer]}>
          <CustomText style={styles.label} type="mh">
            2. Specify distance from your farm
          </CustomText>
          <Filter_distance />
        </View>
        <View style={[styles.questioncontainer]}>
          <CustomText style={styles.label} type="mh">
            3. Select Crop
          </CustomText>
          <View style={[styles.flexcol, styles.gap, {marginTop: 10}]}>
            <TouchableOpacity
              onPress={() => setcropoption(0)}
              style={[
                styles.dot,
                {
                  borderWidth: 1,
                  borderColor:
                    cropoption == 0
                      ? '#028454'
                      : udyamitaTheme.borderStyleColor,
                },
              ]}>
              <View
                style={{
                  position: 'absolute',
                  top: 2,
                  left: 2,
                  backgroundColor: cropoption == 0 ? '#028454' : null,
                  width: 18,
                  height: 18,
                  borderRadius: 500,
                }}
              />
            </TouchableOpacity>
            <CustomText style={styles.optionlabel} type="label">
              Any flower will do, I'm flexible.
            </CustomText>
          </View>

          <View style={[styles.flexcol, styles.gap, {marginTop: 10}]}>
            <TouchableOpacity
              onPress={() => setcropoption(1)}
              style={[
                styles.dot,
                {
                  borderWidth: 1,
                  borderColor:
                    cropoption == 1
                      ? '#028454'
                      : udyamitaTheme.borderStyleColor,
                },
              ]}>
              <View
                style={{
                  position: 'absolute',
                  top: 2,
                  left: 2,
                  backgroundColor: cropoption == 1 ? '#028454' : null,
                  width: 18,
                  height: 18,
                  borderRadius: 500,
                }}
              />
            </TouchableOpacity>
            <CustomText style={styles.optionlabel} type="label">
              I am looking for specific flowers.
            </CustomText>
          </View>
          {cropoption == 1 && (
            <>
              {selectedflower?.map((it, id) => {
                return (
                  <View
                    style={[
                      styles.textInputWrapNormal,
                      {position: 'relative', marginTop: 15},
                    ]}>
                    <CustomText style={styles.label} type="label">
                      {it.name}
                    </CustomText>

                    <TouchableOpacity
                      style={{
                        position: 'absolute',
                        right: 0,
                        borderWidth: 0.5,
                        borderColor: '#028454',
                        padding: 14.5,
                        borderRadius: 5,
                      }}
                      onPress={() => {
                        setselecflower(true);
                      }}>
                      <Image
                        source={require('../../assets/images/green_pen.png')}
                        style={{width: 16.5, height: 17.25}}
                      />
                    </TouchableOpacity>
                  </View>
                );
              })}

              <View
                style={[
                  styles.textInputWrapNormal,
                  {position: 'relative', marginTop: 15},
                ]}>
                <CustomText style={styles.label} type="label">
                  Select a flower
                </CustomText>

                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    right: 0,
                    borderWidth: 0.5,
                    borderColor: '#028454',
                    padding: 12,
                    borderRadius: 5,
                  }}
                  onPress={() => {
                    setselecflower(true);
                  }}>
                  <Image
                    source={require('../../assets/images/Plus_icon.png')}
                    style={{width: 24, height: 24}}
                  />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        <View style={[styles.questioncontainer]}>
          <CustomText style={styles.label} type="mh">
            4. {t('howManyBeeBoxes')}
          </CustomText>
          <View style={{position: 'relative'}}>
            <TextInput
              placeholder={t('numberOfBeeBoxes')}
              placeholderTextColor={udyamitaTheme.textColor}
              style={styles.textInputWrapNormal}
              value={numberOfBeeBoxes}
              onChangeText={CustomText => setNumberOfBeeBoxes(CustomText)}
              keyboardType="number-pad"
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
              }}
              onPress={() => setShowCalendar(!showCalendar)}>
              <CustomText style={{fontWeight: '600'}}>boxes</CustomText>
            </View>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        style={[
          styles.searchBtn,
          isButtonDisabled && {
            backgroundColor: udyamitaTheme.beeAppDisabledColor,
          },
        ]}
        onPress={handleSearchBtnPress}
        disabled={isButtonDisabled}>
        <CustomText style={styles.searchBtnText} type="btn">
          {t('searchForFarms')}
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

export default MigrationForm;

const styles = StyleSheet.create({
  flexcol: {
    flexDirection: 'row',
    alignContent: 'center',
  },
  gap: {
    gap: 15,
  },
  mainContainer: {
    backgroundColor: udyamitaTheme.themeBgColor,
    flex: 1,
  },
  dot: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: 24,
    height: 24,
    borderRadius: 500,
  },
  searchBtn: {
    width: '90%',
    height: 52,
    backgroundColor: udyamitaTheme.beeAppColor,
    borderRadius: 6,
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questioncontainer: {
    backgroundColor: 'white',
    flexDirection: 'column',
    marginTop: 15,
    paddingTop: 10,
    paddingHorizontal: 25,
    paddingBottom: 15,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#CBCBCB',
  },
  searchBtnText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    color: '#fff',
    fontSize: udyamitaTheme.themeFontSizeButton,
  },
  textInputWrap: {
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    width: '90%',
    fontSize: udyamitaTheme.themeFontSizeLabel,
  },
  textInputWrapNormal: {
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 0.5,
    height: 49,
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    borderColor: udyamitaTheme.borderStyleColor,
    paddingLeft: 10,
    fontSize: udyamitaTheme.themeFontSizeLabel,
  },
  label: {
    color: '#262626',
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    fontWeight: '400',
    marginTop: 0,
    marginBottom: 10,
  },
  optionlabel: {
    fontWeight: '400',
    color: '#262626',
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    fontSize: udyamitaTheme.themeFontSizeLabel,
  },
  calenderBtn: {
    height: 49,
    justifyContent: 'center',
  },
  calenderBtnText: {
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    color: udyamitaTheme.textColor,
    fontSize: udyamitaTheme.themeFontSizeLabel,
  },
});
