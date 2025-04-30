import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import {udyamitaTheme} from '../../config/styles/udyamitaTheme';
import moment from 'moment';
import {useTranslation} from 'react-i18next';
import {defaultStyles} from '../../config/styles/defaultStyles';
import {MsgPhotoIcon, MsgAudioIcon} from '../../assets/Icons/IconSvg';
import CustomText from '../reusable/CustomText';

// const windowWidth = Dimensions.get('window').width;
const MessageItem = ({navigation, memberName, message, memberId, userSent, messageSeen}) => {
console.log('✌️userSent --->', message);

  const getTimestampOfMessage = postTime => {
    const parsedDate = moment(postTime);
    const {t} = useTranslation();

    const currentDate = moment();

    const duration = moment.duration(currentDate.diff(parsedDate));
    let dateTimeText = '';

    if (duration.years() > 0) {
      dateTimeText =
        `${duration.years()} ` +
        `${duration.years() > 1 ? t('years') : t('year')} ` +
        `${t('ago')}`;
    } else if (duration.months() > 0) {
      dateTimeText =
        `${duration.months()} ` +
        `${duration.months() > 1 ? t('months') : t('month')} ` +
        `${t('ago')}`;
    } else if (duration.weeks() > 0) {
      dateTimeText =
        `${duration.weeks()} ` +
        `${duration.weeks() > 1 ? t('weeks') : t('week')} ` +
        `${t('ago')}`;
    } else if (duration.days() > 0) {
      dateTimeText =
        `${duration.days()} ` +
        `${duration.days() > 1 ? t('days') : t('day')} ` +
        `${t('ago')}`;
    } else if (duration.hours() > 0) {
      dateTimeText =
        `${duration.hours()} ` +
        `${duration.hours() > 1 ? t('hours') : t('hour')} ` +
        `${t('ago')}`;
    } else if (duration.minutes() > 0) {
      dateTimeText =
        `${duration.minutes()} ` +
        `${duration.minutes() > 1 ? t('minutes') : t('minute')} ` +
        `${t('ago')}`;
    } else if (duration.seconds() > 0) {
      dateTimeText =
        `${duration.seconds()} ` +
        `${duration.seconds() > 1 ? t('seconds') : t('second')} ` +
        `${t('ago')}`;
    } else if (duration.seconds() <= 0) {
      dateTimeText = `${t('justNow')}`;
    }
    return dateTimeText;
  };

  const ImageMessageText = () => {
    return (
      <View style={defaultStyles?.flexRow}>
        <MsgPhotoIcon />
        <CustomText style={[styles.message, {marginLeft: 6}]} type="label">
          Photo
        </CustomText>
        <Text style={styles?.timeText}>
          {getTimestampOfMessage(message?.createdAt)}
        </Text>
      </View>
    );
  };

  const AudioMessageText = () => {
    return (
      <View style={defaultStyles?.flexRow}>
        <MsgAudioIcon />
        <CustomText style={[styles.message, {marginLeft: 6}]} type="label">
          Audio
        </CustomText>
        <Text style={styles?.timeText}>
          {getTimestampOfMessage(message?.createdAt)}
        </Text>
      </View>
    );
  };

  const MessageText = () => {
    return (
      <View style={[defaultStyles?.flexRow, {alignItems: "flex-end"}]}>
        <CustomText style={styles.message} type="sh">
          {message?.message}
        </CustomText>
        <Text style={styles?.timeText}>
          {getTimestampOfMessage(message?.createdAt)}
        </Text>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('CommunityMessage', {
          memberId: userSent ? message?.to : message?.from,
          memberName: userSent ? message?.toName : message?.fromName,
        })
      }>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>
          {userSent ? message?.toName?.charAt(0) : message?.fromName?.charAt(0)}
        </Text>
      </View>
      <View style={{minWidth: '70%'}}>
        <CustomText style={[styles.nameText, {marginBottom: 6}]} type="btn">
          {userSent ? message?.toName : message?.fromName}
        </CustomText>
        {message?.type === 'text' ? (
          <MessageText />
        ) : message?.type === 'image' ? (
          <ImageMessageText />
        ) : (
          <AudioMessageText />
        )}
      </View>
      {message.unReadMessageCount > 0 ? (
        <View style={styles.messageCountContainer}>
          <Text style={styles.messageCount}>{message?.unReadMessageCount}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

export default MessageItem;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    //width:windowWidth,
    padding: '5%',
    paddingRight: '15%',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.4,
    borderColor: udyamitaTheme.borderStyleColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: udyamitaTheme.borderStyleColor,
    marginLeft: 8,
  },
  avatarText: {
    fontSize: udyamitaTheme.themeFontSizeModalLabel,
    color: udyamitaTheme.primaryColor,
  },
  nameText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color: udyamitaTheme.textColor,
    fontSize: udyamitaTheme.themeFontSizeButton,
  },
  message: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    color: udyamitaTheme.textColor,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    lineHeight: 14
  },
  timeText: {
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    fontSize: udyamitaTheme.themeFontSizeCardMiniLabel,
    color: udyamitaTheme.primaryColor,
    position: 'absolute',
    right: 10,
    lineHeight: 14
    // marginLeft: '-7%',
  },
  messageCount:{fontSize:udyamitaTheme.themeFontSizeLabel,
    fontFamily:udyamitaTheme.mainThemeFontFamily,
    color:"white",
    textAlign:"center"
  },
    messageCountContainer:{
      height:24,
      width:24,
      borderRadius:50,
      justifyContent:"center",
      backgroundColor:udyamitaTheme.primaryColor,
      marginLeft:-50}
});
