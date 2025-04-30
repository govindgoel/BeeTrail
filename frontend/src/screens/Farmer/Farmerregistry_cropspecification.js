import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
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
import {Modal, Portal} from 'react-native-paper';
const Farmerregistry_cropspecification = ({
  farmdetails,
  setshowcropselection,
  setfarmdetails,
  setAllowProceedToNextScreen,
  noofcropsoption,
  setnoofcropsoption,
}) => {
  const [apiaries, setApiaries] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selected, setselected] = useState(-1);
  const [choosefarmmethod, setchoosefarmmethod] = useState(false);
  const [choosedfarmmethod, setchoosedfarmmethod] = useState('');
  const [numberOfBeeBoxes, setNumberOfBeeBoxes] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [migration, setMigration] = useState(false);
  const [selecflower, setselecflower] = useState(false);
  const [selectedflower, setselectedflower] = useState([]);
  const {t} = useTranslation();
  const farmmethod = ['Organic', 'Micro Farming', 'ZNBF Farming', 'Other'];

  useFocusEffect(
    React.useCallback(() => {
      setMigration(true);
    }, []),
  );

  const handleBackPress = () => {
    navigation.goBack();
  };
  const handleDateChange = date => {
    if (date) {
      console.log((moment(date).format('DD MMMM YYYY')));
      setSelectedDate(date);
      setfarmdetails({...farmdetails, bloomingdate: date});
      setShowCalendar(!showCalendar);
    } else {
      // Handle invalid date or other conditions
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setMonth(maxDate.getMonth() + 5);
  maxDate.setHours(23, 59, 59, 999);
  useEffect(() => {
    Geocoder.init('AIzaSyBg4tz2fOqTqAny-Hph8blHRP9YeRTuIDg');
  }, []);

  useEffect(() => {
    const {bloomingcrop, bloomingdate, farming_method,organic} = farmdetails;

    const allowNext =
      farming_method?.length > 0 &&
      bloomingdate !== '' &&
      bloomingcrop?.length > 0 &&
      noofcropsoption !== -1&&
      organic!==-1
    console.log(farmdetails.organic);

    setAllowProceedToNextScreen(allowNext);
  }, [farmdetails]);

  useEffect(() => {
    console.log(noofcropsoption);
    if (noofcropsoption == 0 && farmdetails.bloomingcrop?.length > 0) {
      setfarmdetails({
        ...farmdetails,
        bloomingcrop: farmdetails.bloomingcrop.slice(0, 1),
      });
    }
  }, [noofcropsoption]);

  return (
    <>
      <ScrollView style={{marginTop: 0}} showsVerticalScrollIndicator={false}>
        <View style={[styles.questioncontainer]}>
          <CustomText
            style={{
              color: '#262626',
              fontFamily: udyamitaTheme.mainThemeFontFamily,
              fontSize: udyamitaTheme.themeFontSizeLabel,
              fontWeight: '400',
            }}
            type="mlabel">
            How many nectar rich crop/crops are in bloom right now?
          </CustomText>
          <CustomText
            style={{fontWeight: '400', color: '#262626', marginBottom: 10}}
            type="sh">
            Select One
          </CustomText>
          <View
            style={[
              styles.flexrow,
              {
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              },
            ]}>
            <View
              style={[
                styles.flexrow,
                styles.gap,
                {flexDirection: 'row', marginTop: 10, alignItems: 'center'},
              ]}>
              <TouchableOpacity
                onPress={() => setnoofcropsoption(0)}
                style={[
                  styles.dot,
                  {
                    borderWidth: 1,
                    borderColor:
                      noofcropsoption == 0
                        ? '#028454'
                        : udyamitaTheme.borderStyleColor,
                  },
                ]}>
                <View
                  style={{
                    position: 'absolute',
                    top: 2,
                    left: 2,
                    backgroundColor: noofcropsoption == 0 ? '#028454' : null,
                    width: 18,
                    height: 18,
                    borderRadius: 500,
                  }}
                />
              </TouchableOpacity>
              <CustomText style={styles.optionlabel} type="label">
                Single Variety
              </CustomText>
            </View>

            <View
              style={[
                styles.flexrow,
                styles.gap,
                {
                  flexDirection: 'row',
                  marginTop: 10,
                  alignItems: 'center',
                  marginRight: 30,
                },
              ]}>
              <TouchableOpacity
                onPress={() => setnoofcropsoption(1)}
                style={[
                  styles.dot,
                  {
                    borderWidth: 1,
                    borderColor:
                      noofcropsoption == 1
                        ? '#028454'
                        : udyamitaTheme.borderStyleColor,
                  },
                ]}>
                <View
                  style={{
                    position: 'absolute',
                    top: 2,
                    left: 2,
                    backgroundColor: noofcropsoption == 1 ? '#028454' : null,
                    width: 18,
                    height: 18,
                    borderRadius: 500,
                  }}
                />
              </TouchableOpacity>
              <CustomText style={styles.optionlabel} type="label">
                Multiple Varieties
              </CustomText>
            </View>
          </View>
        </View>

        {noofcropsoption !== -1 && (
          <View
            style={{
              backgroundColor: '#fff',
              borderTopWidth: 0.5,
              borderBottomWidth: 0.5,
              borderColor: '#CBCBCB',
              flexDirection: 'column',
              paddingHorizontal: 20,
              paddingVertical: 15,
              marginTop: 15,
            }}>
            <View style={{flexDirection: 'column'}}>
              <CustomText
                style={{
                  color: '#262626',
                  fontFamily: udyamitaTheme.mainThemeFontFamily,
                  fontSize: udyamitaTheme.themeFontSizeLabel,
                  fontWeight: '400',
                }}
                type="mlabel">
                Which crop/crops are in the blooming stage right now?
              </CustomText>
              <CustomText
                style={{fontWeight: '400', color: '#262626'}}
                type="sh">
                Include crops with nectar content only
              </CustomText>
            </View>
            {farmdetails?.bloomingcrop?.map((it, id) => {
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
            {noofcropsoption == 0 &&
            farmdetails.bloomingcrop?.length == 1 ? null : (
              <View
                style={[
                  styles.textInputWrapNormal,
                  {position: 'relative', marginTop: 15},
                ]}>
                {/* <Text style={{position:'absolute',top:-7,paddingHorizontal:5,backgroundColor:'#fff',zIndex:3,left:10,fontSize:8,fontWeight:'400'}}>Blooming Crop</Text>  */}

                <CustomText style={[styles.label]} type="label">
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
                    setshowcropselection(true);
                  }}>
                  <Image
                    source={require('../../assets/images/Plus_icon.png')}
                    style={{width: 24, height: 24}}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        <View style={[styles.questioncontainer]}>
          <CustomText style={styles.label} type="mlabel">
            When does Blooming Season begin?
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
              style={[styles.calenderBtn, {position: 'relative'}]}
              onPress={() => setShowCalendar(!showCalendar)}>
              {/* <Text style={{position:'absolute',top:-7,paddingHorizontal:5,backgroundColor:'#fff',zIndex:3,left:6,fontSize:8,fontWeight:'400'}}>Blooming Date</Text>  */}
              <CustomText style={styles.calenderBtnText} type="label">
                {farmdetails?.bloomingdate
                  ? moment(farmdetails.bloomingdate).format('DD MMMM YYYY')
                  : 'Blooming Date'}
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
          <CustomText
            style={{
              color: '#262626',
              fontFamily: udyamitaTheme.mainThemeFontFamily,
              fontSize: udyamitaTheme.themeFontSizeLabel,
              fontWeight: '400',
              marginBottom: 10,
            }}
            type="mlabel">
            Type of Farming
          </CustomText>

          <View
            style={[
              styles.flexrow,
              {
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              },
            ]}>
            <View
              style={[
                styles.flexrow,
                styles.gap,
                {flexDirection: 'row', marginTop: 10, alignItems: 'center'},
              ]}>
              <TouchableOpacity
                onPress={() => setfarmdetails({...farmdetails, organic: true})}
                style={[
                  styles.dot,
                  {
                    borderWidth: 1,
                    borderColor:
                      farmdetails.organic == true
                        ? '#028454'
                        : udyamitaTheme.borderStyleColor,
                  },
                ]}>
                <View
                  style={{
                    position: 'absolute',
                    top: 2,
                    left: 2,
                    backgroundColor:
                      farmdetails.organic == true ? '#028454' : null,
                    width: 18,
                    height: 18,
                    borderRadius: 500,
                  }}
                />
              </TouchableOpacity>
              <CustomText style={styles.optionlabel} type="label">
                Organic
              </CustomText>
            </View>

            <View
              style={[
                styles.flexrow,
                styles.gap,
                {
                  flexDirection: 'row',
                  marginTop: 10,
                  alignItems: 'center',
                  marginRight: 30,
                },
              ]}>
              <TouchableOpacity
                onPress={() => setfarmdetails({...farmdetails, organic: false})}
                style={[
                  styles.dot,
                  {
                    borderWidth: 1,
                    borderColor:
                      farmdetails.organic == false
                        ? '#028454'
                        : udyamitaTheme.borderStyleColor,
                  },
                ]}>
                <View
                  style={{
                    position: 'absolute',
                    top: 2,
                    left: 2,
                    backgroundColor:
                      farmdetails.organic == false ? '#028454' : null,
                    width: 18,
                    height: 18,
                    borderRadius: 500,
                  }}
                />
              </TouchableOpacity>
              <CustomText style={styles.optionlabel} type="label">
                Inorganic
              </CustomText>
            </View>
          </View>
        </View>
        <View style={[styles.questioncontainer, {marginBottom: 40}]}>
          <CustomText style={styles.label} type="mlabel">
            Which Farming Method do you use?
          </CustomText>
          <View style={{position: 'relative'}}>
            {/* <Text style={{position:'absolute',top:-7,paddingHorizontal:5,backgroundColor:'#fff',zIndex:3,left:10,fontSize:8,fontWeight:'400'}}>Farming Method</Text>  */}

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setchoosefarmmethod(true)}
              style={{
                borderWidth: 0.5,
                borderColor: '#CBCBCB',
                paddingHorizontal: 10,
                paddingVertical: 15,
                borderRadius: 8,
              }}>
              <CustomText style={{color: '#262626', fontWeight: '400'}}>
                {farmdetails?.farming_method?.length > 0
                  ? farmdetails?.farming_method
                  : 'Farming Method'}
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {choosefarmmethod && (
        <Portal>
          <Modal
            visible={choosefarmmethod}
            onDismiss={() => setchoosefarmmethod(false)}
            contentContainerStyle={{
              backgroundColor: 'white',
              marginHorizontal: 24,
              borderRadius: 6,
              paddingVertical: 20,
              justifyContent: 'flex-start',
              minHeight: 155,
            }}>
            <View
              style={{flexDirection: 'column', justifyContent: 'flex-start'}}>
              <CustomText
                style={{
                  fontWeight: '600',
                  color: '#262626',
                  paddingHorizontal: 20,
                  borderBottomWidth: 0.5,
                  borderColor: '#CBCBCB',
                  paddingBottom: 10,
                }}
                type="h">
                Select a Farming Method
              </CustomText>
              {farmmethod.map((it, id) => {
                return (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 15,
                      paddingHorizontal: 20,
                      borderBottomWidth: 0.5,
                      paddingVertical: 15,
                      borderColor:
                        selected == 3 && id == 3 ? '#FFFFFF' : '#CBCBCB',
                    }}>
                    <TouchableOpacity
                      onPress={() => setselected(id)}
                      style={[
                        styles.dot,
                        {
                          borderWidth: 1,
                          borderColor:
                            selected == id
                              ? '#028454'
                              : udyamitaTheme.borderStyleColor,
                        },
                      ]}>
                      <View
                        style={{
                          position: 'absolute',
                          top: 2,
                          left: 2,
                          backgroundColor: selected == id ? '#028454' : null,
                          width: 18,
                          height: 18,
                          borderRadius: 5000,
                        }}
                      />
                    </TouchableOpacity>

                    <CustomText
                      style={{fontWeight: '400', color: '#262626'}}
                      type="mlabel">
                      {it}
                    </CustomText>
                  </View>
                );
              })}
              {selected == 3 && (
                <>
                  <TextInput
                    placeholder={'Farming Method'}
                    placeholderTextColor={udyamitaTheme.textColor}
                    style={[
                      styles.textInputWrapNormal,
                      {marginHorizontal: 25, marginBottom: 10},
                    ]}
                    value={farmdetails?.farming_method}
                    onChangeText={val => {
                      setfarmdetails({
                        ...farmdetails,
                        farming_method: val,
                      });
                    }}
                  />
                </>
              )}
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  if (selected != 3) {
                    setfarmdetails({
                      ...farmdetails,
                      farming_method: farmmethod[selected],
                    });
                  }
                  setchoosedfarmmethod(farmmethod[selected]);
                  setchoosefarmmethod(false);
                }}
                style={{
                  marginHorizontal: 20,
                  paddingVertical: 20,
                  textAlign: 'center',
                  marginTop: 15,
                  borderColor: '#028454',
                  borderWidth: 1.2,
                  borderRadius: 8,
                  justifyContent: 'center',
                  alignContent: 'center',
                }}>
                <CustomText
                  style={{
                    textAlign: 'center',
                    color: '#028454',
                    fontWeight: '600',
                  }}
                  type="h">
                  Select
                </CustomText>
              </TouchableOpacity>
            </View>
          </Modal>
        </Portal>
      )}
    </>
  );
};

export default Farmerregistry_cropspecification;

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
