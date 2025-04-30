import {View, Text, StyleSheet, Image,TouchableOpacity} from 'react-native';
import React from 'react';
import { udyamitaTheme } from '../../../config/styles/udyamitaTheme';
import { useTranslation } from 'react-i18next';
import CustomText from '../../reusable/CustomText';
const YoutubeCard = ({
 video,
 navigation
}) => {
  const {t}=useTranslation();
  const {title, metaInfo, _id, thumbnail, viewCount, duration, fileUrl,description,likeCount,shareCount,commentCount} =
  
    video?.item
    const uploadedOn =metaInfo?.created?.at
    const formatDuration = (duration) => {
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = duration % 60;
      
        if (hours > 0) {
          return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        } else {
          return `${minutes}:${String(seconds).padStart(2, '0')}`;
        }
      };
      const formattedDuration = formatDuration(duration);
      function formatViewCount(viewCount) {
        if (viewCount >= 1000) {
          return `${(viewCount / 1000).toFixed(1)}k ${t('views')}`;
        } else {
          return `${viewCount} ${t('views')}`;
        }
      }
      const formattedViewCount = formatViewCount(viewCount);
      function formatUploadTime(uploadedOn) {
        const currentDate = new Date();
        const uploadDate = new Date(uploadedOn);
      
        const timeDifferenceInSeconds = Math.floor((currentDate - uploadDate) / 1000);
      
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
          return `${yearsAgo} ${yearsAgo === 1 ? t('year') : t('years')} ${t('ago')}`;
        }
      }
      const formattedUploadTime = formatUploadTime(uploadedOn);    
      const handlePress = () => {
        navigation.navigate('ViewVideo', {
          id: _id,
          fileUrl,
          title,
          duration,
          metaInfo,
          viewCount,
          uploadDate:formattedUploadTime,
          description,
          likeCount,
          commentCount,
          shareCount
        });
      };  
  return (
    <TouchableOpacity style={styles.container} onPress={()=>handlePress()}>
      <View>
        <Image
          source={{uri:thumbnail}}
          style={styles.thumbnailStyle}
        />
        <View style={styles.durationContainer}>
          <Text style={styles.durationText}>{formattedDuration}</Text>
        </View>
      </View>

      <CustomText style={styles.text} type='label'>{title}</CustomText>
      <View style={{flexDirection: 'row'}}>
        {/* <Text
          style={{
            fontFamily: udyamitaTheme.mainThemeFontFamily,
            fontSize: udyamitaTheme.themeFontSizeVerySmallHeader,
            paddingRight: 5,
          }}>
          {postedBy}.
        </Text> */}
        <CustomText
         type='sh'
          style={{
            fontFamily: udyamitaTheme.mainThemeFontFamily,
            fontSize: udyamitaTheme.themeFontSizeSmallHeader,
            paddingRight: 5,
          }}>
          {formattedViewCount}.
        </CustomText>
        <CustomText
        type='sh'
          style={{
            fontFamily: udyamitaTheme.mainThemeFontFamily,
            fontSize: udyamitaTheme.themeFontSizeSmallHeader,
            paddingRight: 5,
          }}>
          {formattedUploadTime}.
        </CustomText>
      </View>
    </TouchableOpacity>
  );
};

export default YoutubeCard;

const styles = StyleSheet.create({
  container: {
    width: 215,
    borderRadius: 6,
    marginRight: 10,
    paddingBottom: 10,
  },
  thumbnailStyle: {
    width: 215,
    height: 125,
    borderRadius: 6,
  },
  text: {
    fontSize: udyamitaTheme.themeFontSizeLabel,
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    paddingTop: 10,
  },
  durationContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#000',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
  },
  durationText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
