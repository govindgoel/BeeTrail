import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import React, {useState, useEffect} from 'react';
import {APP_API_LIBRARY_URL} from '@env';
import {getValueByKey} from '../../../helpers/UserData';
import axios from 'axios';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
const logo = require('../../../assets/images/udyamita-logo.png');
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import {useTranslation} from 'react-i18next';
import CustomText from '../../reusable/CustomText';



const VideoCard = ({ video, navigation, getWatchLater, isLastVideo }) => {
  const { t } = useTranslation();
  const [saved, setSaved] = useState(
    video?.item?.savedByUser || video?.savedByUser || 0,
  );

  const {
    title,
    metaInfo,
    _id,
    thumbnail,
    viewCount,
    duration,
    fileUrl,
    description,
    // likeCount,
    // shareCount,
    // commentCount,
  } = video?.item || video;

  const uploadDateofVideo = metaInfo?.created?.at;
  function formatUploadTime(uploadDateofVideo) {
    const currentDate = new Date();
    const uploadDate = new Date(uploadDateofVideo);

    const timeDifferenceInSeconds = Math.floor(
      (currentDate - uploadDate) / 1000,
    );

    if (timeDifferenceInSeconds < 60) {
      return `${t('justNow')}`;
    } else if (timeDifferenceInSeconds < 3600) {
      const minutesAgo = Math.floor(timeDifferenceInSeconds / 60);
      return `${minutesAgo} ${minutesAgo === 1 ? t('minute') : t('minutes')} ${t('ago')}`;
    } else if (timeDifferenceInSeconds < 86400) {
      const hoursAgo = Math.floor(timeDifferenceInSeconds / 3600);
      return `${hoursAgo} ${hoursAgo === 1 ? t('hour') : t('hours')} ${t('ago')}`;
    } else if (timeDifferenceInSeconds < 604800) {
      const daysAgo = Math.floor(timeDifferenceInSeconds / 86400);
      return `${daysAgo} ${daysAgo === 1 ? t('day') : t('days')} ${t('ago')}`;
    } else if (timeDifferenceInSeconds < 2419200) {
      const weeksAgo = Math.floor(timeDifferenceInSeconds / 604800);
      return `${weeksAgo} ${weeksAgo === 1 ? t('week') : t('weeks')} ${t('ago')}`;
    } else if (timeDifferenceInSeconds < 29030400) {
      const monthsAgo = Math.floor(timeDifferenceInSeconds / 2419200);
      return `${monthsAgo} ${monthsAgo === 1 ? t('month') : t('months')} ${t('ago')}`;
    } else {
      const yearsAgo = Math.floor(timeDifferenceInSeconds / 29030400);
      return Number.isNaN(yearsAgo)
        ? ''
        : `${yearsAgo} ${yearsAgo === 1 ? t('year') : t('years')} ${t('ago')}`;
    }
  }

  const formattedUploadTime = formatUploadTime(uploadDateofVideo);
  const handlePress = () => {
    navigation.navigate('ViewVideo', {
      id: _id,
    });
    // console.log("inside viewVideo")
    // navigation.navigate("learn",{
    //     screen: "ViewVideo", params: {
    //       id: _id
    //     }
    //   });
  };
  // const getWatchLater = async () => {
  //   const token = await getValueByKey('token');
  //   const config = {headers: {Authorization: 'Bearer ' + token}};
  //   await axios
  //     .get(`${APP_API_LIBRARY_URL}/watch-later`, config)
  //     .then(response => {
  //       console.log('response saved: ', response.data.saved);
  //       if (response.status === 200) {
  //         const newArr = response.data.saved;
  //       }
  //     })
  //     .catch(err => console.log('ERR while getting saved videosssss', err));
  // };
  const saveToWatchLater = async () => {
    const token = await getValueByKey('token');
    const config = { headers: { Authorization: 'Bearer ' + token } };
    axios
      .post(`${APP_API_LIBRARY_URL}/watch-later/${_id}`, null, config)
      .then(response => {
        Toast.show(
          saved ? t('youUnsavedThisVideo') : t('youSavedThisVideo'),
          Toast.LONG,
        );
        // getVideoDetails();
        setSaved(!saved);
        // getWatchLater();
      })
      .catch(err => console.log('Error while saving the video', err));
  };

  // const getVideoDetails = async () => {
  //   const token = await getValueByKey('token');
  //   const config = {headers: {Authorization: 'Bearer ' + token}};
  //   await axios
  //     .get(`${APP_API_LIBRARY_URL}/media/${_id}`, config)
  //     .then(response => {
  //       const {saved} = response?.data;

  //       setSaved(saved);
  //     })

  //     .catch(err => console.log('ERR 1', err.response.data));
  // };
  const formatDuration = duration => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(
        seconds,
      ).padStart(2, '0')}`;
    } else {
      return `${minutes}:${String(seconds).padStart(2, '0')}`;
    }
  };
  const formattedDuration = formatDuration(duration);

  return (
    <View
      style={{ ...styles.mainContainer, marginBottom: isLastVideo ? 160 : 16 }}>
      <TouchableOpacity onPress={handlePress}>
         <View style={styles.metaInfo}>
         <View style={{flexDirection: 'row'}}>
            <CustomText style={styles.titleText} type='btn'>{title}</CustomText>
            <View
              style={{
                
                //alignSelf:'flex-end',
                flexDirection: 'column',
                alignItems: 'center',
                right: 0,
                position: 'absolute',
              }}>
              <TouchableOpacity
                style={{justifyContent: 'center', alignItems: 'center'}}
                onPress={() => saveToWatchLater()}>
                {saved ? (
                  <Image
                    source={require('../../../assets/images/Saved.png')}
                    style={[styles.actionImg, {height: 24, width: 24}]}
                  />
                ) : (
                  <Image
                    source={require('../../../assets/images/Save.png')}
                    style={[styles.actionImg, {height: 24, width: 24}]}
                  />
                )}

                <CustomText
                  style={[
                    styles.actionText,
                    {
                      opacity: 1,
                      fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
                      fontSize: udyamitaTheme.themeFontSizeExtraSmall,
                    },
                  ]} type='xs'>
                 {saved ? t('saved') : t('save')} 
                </CustomText>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flexDirection: 'row', marginBottom: 12}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={require('../../../assets/images/ViewsCount.png')}
                style={styles.infoImg}
              />
              <CustomText style={styles.info} type='ml'>
                {viewCount} {t('views')}
              </CustomText>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginLeft: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={require('../../../assets/images/History.png')}
                style={styles.infoImg}
              />
              <CustomText style={styles.info} type='ml'>{formattedUploadTime}</CustomText>
            </View>
          </View>
        </View>
        <View>
          {thumbnail.length > 0 ? (
            <Image source={{uri: thumbnail}} style={styles.thumbnail} />
          ) : (
            <View style={styles.thumbnail}>
              <Image source={logo} style={styles.logo} />
            </View>
          )}
          <View style={styles.durationContainer}>
            <CustomText style={styles.durationText} type='ml'>{formattedDuration}</CustomText>
          </View>
        </View> 
      </TouchableOpacity>
    </View>
  );
};

export default VideoCard;
const styles = StyleSheet.create({
  mainContainer: {
    borderTopWidth: 0.5,
    //borderBottomWidth: 0.5,
    borderTopColor: udyamitaTheme.borderStyleColor,
   
    paddingTop: 10,
    //paddingBottom: 10,
    width: windowWidth,
    marginBottom: 16,
    backgroundColor: '#FFF',
  },
  metaInfo: {
    marginLeft: 18,
    marginRight: 18,
    flexDirection: 'column',
  },
  thumbnail: {
    // height: 183,
    height: 200,
    width: windowWidth,
    resizeMode: 'contain',
    // resizeMode: 'cover',
    // padding: '1%',
    // marginLeft: -18,
    position: 'relative',
    left: 0,
    // right: 0,
  },
  logo: {
    height: '100%',
    width: windowWidth,
    alignSelf: 'center',
    opacity: 0.7,
    resizeMode: 'contain',
  },
  titleText: {
    color: udyamitaTheme.textColor,
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    fontSize: udyamitaTheme.themeFontSizeButton,
    marginRight: 65,
  },
  info: {
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    fontSize: udyamitaTheme.themeFontSizeCardMiniLabel,
    color: udyamitaTheme.textColor,
  },
  infoImg: {
    width: 10,
    height: 10,
    marginRight: 3,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 6,
    marginTop: 10,
  },
  action: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginHorizontal: 2,
  },
  actionText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    color: udyamitaTheme.textColor,
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
    opacity: 0.7,
  },
  actionImg: {
    height: 19,
    width: 19,
  },
  durationContainer: {
    position: 'absolute',
    bottom: 10,
    right: 20,
    backgroundColor: '#000',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
  },
  durationText: {
    color: 'white',
    fontSize:udyamitaTheme.themeFontSizeCardMiniLabel ,
    fontWeight: 'bold',
  },
});
