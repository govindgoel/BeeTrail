import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { udyamitaTheme } from '../../config/styles/udyamitaTheme';
import { AirbnbRating } from 'react-native-ratings';
import { BackIcon } from '../../assets/Icons/IconSvg';
import CustomText from '../../components/reusable/CustomText';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import { APP_API_USER_URL_SECOND } from '@env'
import { getUser } from '../../helpers/UserData';
import axios from 'axios';
import FarmReserveSuccess from '../../components/apiary-migration/reusable/FarmReserveSuccess';

const ReserveFarm = ({ navigation, route }) => {
  const { t } = useTranslation();
  const handleBackPress = () => {
    navigation.goBack();
  };
  const [showCalendar, setShowCalendar] = useState(false)
  const [showCalendar2, setShowCalendar2] = useState(false)
  const [arrivingDate, setarrivingDate] = useState('')
  const [noOfbeeboxes, setnoOfbeeboxes] = useState('')
  const [showsuccess, setshowsuccess] = useState(false)
  const handleDateChange = (no, date) => {
    if (no == 0) {
      setarrivingDate(date);
      setShowCalendar(false)
    }
    else {
      setShowCalendar2(false)
      setdepartureDate(date);
    }

  };

  const makereq = async () => {
    if (!arrivingDate || !noOfbeeboxes) {
      Toast.show('Arriving Date and No of Bee Boxes is required')
      return
    }
    if(noOfbeeboxes>route.params.farmData.total_beebox){
      Toast.show('No of Bee Boxes cannot be greater than farm total Accomodate bee boxes')
      return

    }
    const arDate = moment(arrivingDate).format('YYYY-MM-DD');

    let ardate = moment(arDate, 'YYYY-MM-DD').toDate();
    ardate = ardate.toISOString()
    try { 
    console.log("Arrival Date:", route.params.farmData);
    const user = await getUser()
    
      const body = {
        "farm_id": route.params.farmData._id,
        "beekeeper_id": user.userInfo.beekeeper_id,
        "pollination_window_start": ardate,
        "bee_box_count": noOfbeeboxes,
        "is_active": true
      }
      let url = `${APP_API_USER_URL_SECOND}matchmaking/request`
      console.log(body, url);
      const res = await axios.post(url,body)
      console.log(res.data);
      setshowsuccess(true)
      setTimeout(() => {
        navigation.navigate('Migration_dashboard')
      }, 2500);
    } catch (error) {
      console.log(error, 'while fetching booking');
    }

  }
  function daysFromBlooming(bloomingDateStr, arrivalDateStr) {
    const bloomingDate = new Date(bloomingDateStr);
    const arrivalDate = new Date(arrivalDateStr);

    // Calculate difference in milliseconds
    const diffInMs = bloomingDate - arrivalDate;

    // Convert milliseconds to days
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    return diffInDays;
  }
  return (
    showsuccess?
    <FarmReserveSuccess/>
    :
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.row} onPress={handleBackPress}>
          <BackIcon />
          <CustomText style={styles.heading} type='mlabel'>{t('requestToBook')}</CustomText>
        </TouchableOpacity>
        <View style={[styles.row, { marginTop: 15 }]}>
          <Image
            source={{ uri: route?.params?.farmData?.farm_photos[0] || 'https://cff2.earth.com/uploads/2023/05/16064103/Farms-scaled.jpg' }}
            style={styles.farmImg}
          />
          <View style={{ marginLeft: 15 }}>
            <CustomText style={styles.farmName} ellipsizeMode="tail" type='label'>
              {route?.params?.farmData?.name}
            </CustomText>
            <CustomText style={styles.cropTextStyle} type='sh'>
                {t('beeBoxes')} : {route?.params.farmData?.total_beebox}
              </CustomText>
            <View style={styles.row}>
              <CustomText style={styles.cropTextStyle} type='sh'>
                {route?.params?.farmData?.averageRating}
              </CustomText>
              <AirbnbRating
                count={1}
                reviews={['Terrible', 'Bad', 'OK', 'Good', 'Excellent']}
                defaultRating={route?.params?.farmData?.averageRating || 1}
                size={11}
                showRating={false}
                //starContainerStyle={styles.starContainer}
                halfStar={true}
                starStyle={styles.star}
                isDisabled={true}
              />
              <CustomText
                style={[styles.cropTextStyle, { textTransform: 'lowercase' }]} type='sh'>
                {route?.params?.farmData?.totalReviews || 0} {t('reviews')}
              </CustomText>
            </View>
            {/* <View style={[styles.row]}>
              <Image
                source={require('../../assets/images/LocationGreen.png')}
                style={styles.cropStyle}
              /> */}
            {/* <CustomText style={styles.cropTextStyle} type='sh'>km away</CustomText> */}
            {/* </View> */}
            <View style={[styles.row]}>
              <Image
                source={require('../../assets/images/Crop.png')}
                style={styles.cropStyle}
              />
              <CustomText style={styles.cropTextStyle} type='sh'>
                {route?.params?.farmData?.blooming_crops.join(', ')}
              </CustomText>
            </View>
          </View>
        </View>
      </View>
      <ScrollView>
        <View style={styles.cardStyle}>
          <CustomText style={styles.title} type='btn'>{t('migrationDetails')}</CustomText>
          <View style={{ flexDirection: 'column', justifyContent: 'flex-start', gap: 10 }}>

            <Text
              style={[
                styles.title,
                {
                  fontSize: 16,
                  fontWeight: '600',
                  marginTop: 10,
                  // marginBottom: 10,
                },
              ]} type='label'>
              {t('arrivalDate')}
            </Text>

            <View>
              {showCalendar ? (
                <View
                  style={{
                    width: 1280,
                    alignSelf: 'center',
                    backgroundColor: '#FFFFFF',
                    margin: 20,
                  }}>
                  <CalendarPicker
                    onDateChange={date => handleDateChange(0, date)}
                    selectedDayColor={udyamitaTheme.beeAppColor}
                    selectedDayTextColor="#fff"
                    restrictMonthNavigation={true}
                    minDate={new Date()}
                  />
                </View>
              ) :
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',

                    borderWidth: 0.5,
                    borderColor: udyamitaTheme.borderStyleColor,
                    borderRadius: 6,
                    paddingLeft: 10,
                    marginBottom: 15,
                    alignItems: 'center',
                    backgroundColor: '#fff',
                  }}
                  onPress={() => setShowCalendar(!showCalendar)}>
                  <TouchableOpacity
                    style={[styles.calenderBtn, { position: 'relative' }]}
                    onPress={() => setShowCalendar(!showCalendar)}>
                    {/* <Text style={{position:'absolute',top:-7,paddingHorizontal:5,backgroundColor:'#fff',zIndex:3,left:6,fontSize:8,fontWeight:'400'}}>Blooming Date</Text>  */}
                    <CustomText style={styles.calenderBtnText} type="label">
                      {arrivingDate !== '' ? moment(arrivingDate).format('DD MMMM YYYY') : t('arrivalDate')}
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
                      style={{ width: 24, height: 24 }}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>


              }
            </View>
          </View>

          <CustomText style={styles.cropTextStyle} type='sh'>
            Next blooming is from {route?.params.farmData.blooming_start_date}, which is {daysFromBlooming(route?.params.farmData.blooming_start_date, new Date())} days after your specified
            arrival date.
          </CustomText>

          <View style={{ flexDirection: 'column', justifyContent: 'flex-start', gap: 10 }}>

            <Text
              style={[
                styles.title,
                {
                  fontSize: 16,
                  fontWeight: '600',
                  marginTop: 10,
                  // marginBottom: 10,
                },
              ]} type='label'>
              {t('beeBoxes')}
            </Text>

            <TextInput
                    placeholder={t('beeBoxes')}
                    placeholderTextColor={udyamitaTheme.textColor}
                    style={[
                      styles.textInputWrapNormal,
                      {marginBottom: 10},
                    ]}
                    value={noOfbeeboxes}
                    onChangeText={val => {
                     setnoOfbeeboxes(val)
                    }}
                    keyboardType='number'
                  />
            <View>

            </View>
          </View>
          <CustomText style={styles.cropTextStyle} type='sh'>
            {t('thisPropertyCanAccommodateAllYourBeeBoxes')}
          </CustomText>
          {/* <TouchableOpacity style={styles.contactHostBtn}>
            <CustomText style={styles.contactHostBtnText} type='label'>{t('editDetails')}</CustomText>
          </TouchableOpacity> */}
        </View>

        <View style={styles.cardStyle}>
          <CustomText
            style={[
              styles.title,
              {
                fontSize: udyamitaTheme.themeFontSizeLabel,

                marginBottom: 10,
              },
            ]} type='label'>
            {t('cancelationPolicy')}
          </CustomText>
          <CustomText style={styles.cropTextStyle}>{t('policy')}</CustomText>
        </View>

        <View style={styles.cardStyle}>
          <CustomText
            style={[
              styles.title,
              {
                fontSize: udyamitaTheme.themeFontSizeLabel,

                marginBottom: 10,
              },
            ]}>
            {t('note')}
          </CustomText>
          <CustomText style={styles.cropTextStyle} type='sh'>{t('noteText')}</CustomText>
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.searchBtn}
        onPress={() =>
          makereq()
        }
      >
        <CustomText style={styles.searchBtnText} type='btn'>{t('requestToBook')}</CustomText>
      </TouchableOpacity>
    </View>
  );
};

export default ReserveFarm;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: udyamitaTheme.themeBgColor,
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingTop: 30,
    paddingBottom: 20,
    paddingLeft: 30,
    paddingRight: 30,
    elevation: 10,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  calenderBtnText: {
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    color: udyamitaTheme.textColor,
    fontSize: udyamitaTheme.themeFontSizeLabel,
  },
  heading: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    fontSize: udyamitaTheme.themeFontSizeModalLabel,
    color: udyamitaTheme.textColor,
    marginLeft: 20,
  },
  farmImg: {
    width: 147,
    height: 114,
    borderRadius: 6,
  },
  farmName: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    color: udyamitaTheme.textColor,
  },
  cropTextStyle: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
    color: udyamitaTheme.borderStyleColor2,
  },
  cropStyle: {
    height: 16,
    width: 13,
    marginRight: 8,
    resizeMode: 'contain'
  },
  cardStyle: {
    backgroundColor: '#fff',
    marginTop: 10,
    marginBottom: 5,
    padding: 20,
  },
  title: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color: udyamitaTheme.textColor,
    fontSize: udyamitaTheme.themeFontSizeButton,
  },
  contactHostBtn: {
    backgroundColor: '#E6F3EE',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    marginTop: 10,
  },
  contactHostBtnText: {
    color: udyamitaTheme.beeAppColor,
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    fontSize: udyamitaTheme.themeFontSizeLabel,
  },
  calenderBtn: {
    height: 49,
    justifyContent: 'center',
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
  searchBtnText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    color: '#fff',
    fontSize: udyamitaTheme.themeFontSizeButton,
  },
  star: {
    marginRight: 10,
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
});
