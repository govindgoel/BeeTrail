import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import axios from 'axios';
import {getValueByKey} from '../../../helpers/UserData';
import {
  APP_API_COMMUNITY_URL,
} from '@env';
import CustomText from '../../reusable/CustomText';
const CommunityPostCard = ({
  navigation,
  caption,
  memberName,
  postImages,
  postedTime,
  communityId,
}) => {
  const [communityData, setCommunityData] = useState([]);
  const getCommunityById = async id => {
    const token = await getValueByKey('token');
    const config = {headers: {Authorization: 'Bearer ' + token}};

    await axios
      .get(`${APP_API_COMMUNITY_URL}/community/${communityId}`, config)
      .then(response => {
        if (response.status == 200) {
          setCommunityData(response.data.community);
        }
      })
      .catch(err => {
        console.log(
          'error getting community details',
          err,
          err?.response?.errorMessage,
        );
      });
  };
  useEffect(() => {
    getCommunityById();
  }, []);
  return (
    <TouchableOpacity
      style={styles.mainContainer}
      onPress={() =>
        navigation.navigate('CommunityFeed', {communityData: communityData})
      }>
      <CustomText style={styles.memberName} type='sh'>{memberName}</CustomText>
      {postImages && postImages.length === 0 ? null : (
        <Image source={{uri: postImages[0]}} style={styles.singleImage} />
      )}

      <CustomText style={styles.captionText} type='xs'>{caption}</CustomText>
      <CustomText style={styles.postedTime} type='xs'>{postedTime}</CustomText>
      {/* {renderMedia()} */}
    </TouchableOpacity>
  );
};

export default CommunityPostCard;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#fff',
    width: 204,
    borderWidth: 0.5,
    borderColor: udyamitaTheme.borderStyleColor,
    borderRadius: 6,
    padding: 15,
    marginRight: 20,
  },
  memberName: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color: udyamitaTheme.textColor,
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
  },
  captionText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    fontSize: udyamitaTheme.themeFontSizeExtraSmall,
    color: udyamitaTheme.textColor,
    marginTop: 10,
  },
  carouselImage: {
    width: 200,
    height: 200,
  },
  singleImage: {
    width: 180,
    height: 180,
    marginTop: 5,
    borderRadius: 6,
  },
  postedTime: {
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    fontSize: udyamitaTheme.themeFontSizeExtraSmall,
    lineHeight: 14,
    marginTop: 5,
  },
});
