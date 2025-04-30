import {StyleSheet, Text, View, TouchableOpacity, Image, FlatList} from 'react-native';
import React, {useState} from 'react';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import {AirbnbRating} from 'react-native-ratings';
import { useTranslation } from 'react-i18next';
import FullScreenImage from '../../reusable/generic/FullScreenImage';
import CustomText from '../../reusable/CustomText';
import moment from 'moment';
const ReviewCard = ({reviewData, handleChangeRatingVote}) => {
  console.log(reviewData,handleChangeRatingVote);
  const {t} = useTranslation();
  const [isLike, setIsLike] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const {name} = reviewData?.user;
  const {productRating: rating, review, title, mediaUrls,helpfulCount,createdAt} = reviewData;





  const formattedDate = moment(createdAt).format('DD MMM, YYYY');



  return (
    <>
      <View style={styles.mainContainer}>
        <View style={styles.rowAreas}>
          <View style={styles.userInital}>
            <Text style={styles.userInitalName}>{name[0]}</Text>
          </View>
          <Text style={styles.name}>{name}</Text>
        </View>
      
          <AirbnbRating
            count={5}
            reviews={['Terrible', 'Bad', 'OK', 'Good', 'Excellent']}
            defaultRating={rating}
            size={14}
            showRating={false}
            starContainerStyle={styles.starContainer}
            halfStar={true}
            starStyle={styles.star}
          />
       <CustomText style={styles.helpfulCount} type='sh'>{t('reviewedOn')} {formattedDate} </CustomText>
        <View>
      {mediaUrls?.length > 0 && (
        <FlatList
          data={mediaUrls}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setSelectedImage(item)}>
              <Image
                source={{ uri: item }}
                style={{ width: 150, height: 150, marginRight: 10,marginBottom:10,borderRadius:6,marginTop:10 }}
              />
            </TouchableOpacity>
          )}
        />
      )}
      <FullScreenImage imageUri={selectedImage} onClose={() => setSelectedImage(null)} />
    </View>
        <CustomText
        type='label'
          style={{
            fontSize: udyamitaTheme.themeFontSizeLabel,
            color: udyamitaTheme.textColor,
            fontFamily:udyamitaTheme.mainThemeFontFamilyMedium
          }}>
          {review}
        </CustomText>
      <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
        {helpfulCount > 0 ? <CustomText style={styles.helpfulCount} type='sh'>{helpfulCount} {t('peopleFoundThisHelpful')}</CustomText>:<View></View>}
      <TouchableOpacity
          style={styles.helpfulBtn}
          onPress={() => handleChangeRatingVote()}>
          <View style={{display: 'flex', flexDirection: 'row'}}>
            {reviewData.isLikedByUser === 1 ? (
              <Image
                source={require('../../../assets/images/Like_active.png')}
                style={{width: 20, height: 20}}
              />
            ) : (
              <Image
                source={require('../../../assets/images/Like_inactive.png')}
                style={{width: 20, height: 20}}
              />
            )}
            <CustomText
            type='label'
              style={{
                color: udyamitaTheme.textColor,
                fontFamily: udyamitaTheme.mainThemeFontFamily,
                fontSize: udyamitaTheme.themeFontSizeLabel,
              }}>
              {t('helpful')}
            </CustomText>
          </View>
        </TouchableOpacity>
      </View>
    
      </View>
    </>
  );
};

export default ReviewCard;

const styles = StyleSheet.create({
  helpfulCount:{
fontFamily:udyamitaTheme.mainThemeFontFamilyMedium,
color:udyamitaTheme.textColor,
opacity:0.8,
fontSize:udyamitaTheme.themeFontSizeSmallHeader
  },
  mainContainer:{
borderBottomWidth:0.5,
borderBottomColor:udyamitaTheme.borderStyleColor,
padding:20,
backgroundColor:'#fff'
  },
  rowAreas: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userInital: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 0.5,
    borderColor: udyamitaTheme.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  name: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color: udyamitaTheme.textColor,
    fontSize: udyamitaTheme.themeFontSizeButton,
  },
  helpfulBtn: {
    borderWidth: 0.5,
    borderColor: udyamitaTheme.borderStyleColor,
    //width: 92,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    padding:10,
    alignSelf:'flex-end'
    // position: 'absolute',
    // right: 10,
    // bottom: 10,
    // top: 200,
  },
  userInitalName: {
    color: udyamitaTheme.primaryColor,
    fontSize: udyamitaTheme.themeFontSizeLabel,
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    alignSelf: 'flex-start',
  },
});
