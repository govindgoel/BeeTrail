import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React from 'react';

import {
  BookOpen,
  Clock,
  MapIcon,
  MobilePhone,
} from '../../../assets/Icons/IconSvg';

import moment from 'moment';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import {useTranslation} from 'react-i18next';
import CustomText from '../../reusable/CustomText';
const Card = ({
  eventTitle,
  date,
  eventType,
  location,
  distanceInMetres,
  signupCounts,
  eventImageUrl,
  courseTitle,
  completedModules,
  totalModules,
  estimatedRemainingMins,
  totalUsersCompleted,

  videoCoverUrl,
}) => {
  const {t, i18n} = useTranslation();
  const formatRemainingDuration = durationInMins => {
    const YR_MINS = 60 * 24 * 365;
    const MON_IN_MINS = 60 * 24 * 30;
    const WEEKS_IN_MINS = 60 * 24 * 7;
    const DAYS_IN_MINS = 60 * 24;
    const HOURS_IN_MINS = 60;

    if (!durationInMins) {
      return '';
    } else if (durationInMins / YR_MINS >= 1) {
      return `${Math.floor(durationInMins / YR_MINS)} ${
        Math.floor(durationInMins / YR_MINS) === 1 ? t('year') : t('years')
      }`;
    } else if (durationInMins / MON_IN_MINS > 1) {
      return `${Math.floor(durationInMins / MON_IN_MINS)} ${
        Math.floor(durationInMins / MON_IN_MINS) === 1
          ? t('month')
          : t('months')
      }`;
    } else if (durationInMins / WEEKS_IN_MINS > 1) {
      return `${Math.floor(durationInMins / WEEKS_IN_MINS)} ${
        Math.floor(durationInMins / WEEKS_IN_MINS) === 1
          ? t('week')
          : t('weeks')
      }`;
    } else if (durationInMins / DAYS_IN_MINS > 1) {
      return `${Math.floor(durationInMins / DAYS_IN_MINS)} ${
        Math.floor(durationInMins / DAYS_IN_MINS) === 1 ? t('day') : t('days')
      }`;
    } else if (durationInMins / HOURS_IN_MINS > 1) {
      return `${Math.floor(durationInMins / HOURS_IN_MINS)} ${
        Math.floor(durationInMins / HOURS_IN_MINS) === 1 ? 'hour' : 'hours'
      }`;
    }
  };

  const formatDistance = dInMetres => {
    //  let resultDis = "";
    if (dInMetres > 1000) {
      return `${parseFloat(dInMetres / 1000).toFixed(1)} km`;
    } else {
      return `${dInMetres} m`;
    }
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardContent}>
        <Image
          source={{uri: eventImageUrl || videoCoverUrl}}
          style={styles.cardImg}
        />

        <CustomText style={styles.eventTitle} type='label'>
          {eventTitle ? eventTitle : courseTitle}
        </CustomText>
        {date && moment(date).isValid() ? (
          <CustomText style={styles.dateText} type='ml'>
            {moment(date).format('dddd, DD MMMM ')}
          </CustomText>
        ) : null}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingLeft: 10,
            paddingTop: 10,
          }}>
          {location || eventType === 'Virtual' ? (
            eventType === 'Virtual' ? (
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={require('../../../assets/images/Online.png')}
                  style={{width: 14, height: 14}}
                />
                <CustomText style={styles.placeText} type='ml'>Online</CustomText>
              </View>
            ) : (
              <View style={{flexDirection: 'row'}}>
                <MapIcon />
                <CustomText style={styles.placeText} type='ml'>
                  {location}, {formatDistance(distanceInMetres)} away{' '}
                </CustomText>
              </View>
            )
          ) : (
            <View style={{flexDirection: 'row'}}>
              <BookOpen />
              <CustomText style={styles.placeText} type='ml'>
                {completedModules}/{totalModules} tutorials complete
              </CustomText>
            </View>
          )}

          <View style={{flexDirection: 'row'}}>
            <Clock />
            <CustomText style={styles.TimeText} type='ml'>
              {date && moment(date).isValid()
                ? `${moment(date).format('hh:mm a')} onwards`
                : `${formatRemainingDuration(estimatedRemainingMins)} approx.`}
            </CustomText>
          </View>
        </View>

        <CustomText style={styles.CustomText} type='ml'>
          {signupCounts
            ? `beekeeper_2 and ${signupCounts} others are attending`
            : ` ${totalUsersCompleted} others completed this course`}
        </CustomText>
      </View>
      <TouchableOpacity style={styles.button}>
        <CustomText style={styles.buttonText} type='label'>
          {' '}
          {courseTitle ? 'Resume ' : 'Know more'}{' '}
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 6,
    width: 312,
    borderWidth: 0.5,
    borderColor: udyamitaTheme.borderStyleColor,
    marginRight: 10,
    backgroundColor: udyamitaTheme.themeBgColor,
    marginBottom: 10,
  },
  cardContent: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  cardImg: {
    marginTop: 10,
    width: 279,
    height: 128,
    marginBottom: 10,
    alignSelf: 'center',
    borderRadius: 6,
    resizeMode: 'cover',
  },
  eventTitle: {
    paddingLeft: 12,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    color:udyamitaTheme.textColor
  },
  dateText: {
    paddingLeft: 12,
    fontSize: udyamitaTheme.themeFontSizeCardMiniLabel,
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    paddingTop: 5,
    color:udyamitaTheme.textColor
  },
  placeText: {
    fontSize: udyamitaTheme.themeFontSizeCardMiniLabel,
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    paddingLeft: 5,
    color:udyamitaTheme.textColor
  },
  TimeText: {
    fontSize: udyamitaTheme.themeFontSizeCardMiniLabel,
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    paddingLeft: 5,
    color:udyamitaTheme.textColor
  },
  CustomText: {
    fontSize: udyamitaTheme.themeFontSizeCardMiniLabel,
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    paddingLeft: 12,
    paddingTop: 10,
    color:udyamitaTheme.textColor
  },
  button: {
    height: 35,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: udyamitaTheme.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color: udyamitaTheme.primaryColor,
    fontSize: udyamitaTheme.themeFontSizeLabel,
  },
});
