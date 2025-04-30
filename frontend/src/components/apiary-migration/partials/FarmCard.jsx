import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useState, useTransition} from 'react';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import {AirbnbRating} from 'react-native-ratings';
import Carousel, {Pagination} from 'react-native-snap-carousel-v4';
import CustomText from '../../reusable/CustomText';
import { useTranslation } from 'react-i18next';

const photoUrls = [
  'https://cff2.earth.com/uploads/2023/05/16064103/Farms-scaled.jpg',
  'https://scx2.b-cdn.net/gfx/news/hires/2019/farm.jpg',
  'https://static.country-guide.ca/wp-content/uploads/2020/04/03165951/farm-sunset-1015089708-benedek-iStock-GettyImages.jpg',
];


const FarmCard = ({farm, navigation}) => {
  const {width, height} = Dimensions.get('window');
  const {t} = useTranslation();
  const [carouselIndex, setCarouselIndex] = useState(0);
  const renderCarouselItem = ({item}) => {
    return (
      <>
        <Image
          source={{uri: item}}
          style={{
            height: 237,
            width: '100%',
            alignSelf: 'center',
            resizeMode: 'cover',
            // marginLeft: 15,
            marginTop: 8,
            marginBottom: 8,
          }}
        />
        {farm.farm_photos.length > 1 && (
          <Pagination
            dotsLength={farm.farm_photos.length}
            activeDotIndex={carouselIndex}
            containerStyle={styles.paginationContainer}
            dotStyle={styles.paginationDot}
            inactiveDotStyle={styles.inactivePaginationDot}
          />
        )}
      </>
    );
  };

  return (
    <TouchableOpacity
      style={styles.mainCard}
      onPress={() => navigation.navigate('FarmDetails', {farm})}>
      {farm.farm_photos.length > 1 ? (
        <>
          <Carousel
            data={farm.farm_photos || photoUrls}
            renderItem={renderCarouselItem}
            sliderWidth={width-62}
            itemWidth={width-62}
            onSnapToItem={index => setCarouselIndex(index)}
            pagination={true}
          />

          {farm.farm_photos && farm?.farm_photos.length > 1 && (
            <View style={styles.imageCounter}>
              <CustomText style={styles.imageCounterText} type='ml'>
                {carouselIndex + 1}/{farm.farm_photos.length}
              </CustomText>
            </View>
          )}

          {farm?.organic ? (
            <Image source={require('../../../assets/images/Organic.png')} style={styles.img}/>
          ) : (
            <Image source={require('../../../assets/images/Inorganic.png')} style={styles.img} />
          )}
        </>
      ) : (
        <Image  style={{
          height: 237,
          width: '100%',
          alignSelf: 'center',
          resizeMode: 'cover',
          // marginLeft: 15,
          marginTop: 8,
          marginBottom: 8,
        }} source={{uri: photoUrls[(Math.floor(Math.random() * 3) + 1)%3]}} />
      )}
      <View style={[styles.row,{paddingHorizontal:5}]}>
        <CustomText style={styles.farmNameText} type='btn'>{farm.name|| '-'}</CustomText>
        <View style={styles.row}>
          <CustomText style={styles.cropTextStyle} type='sh'>{farm.averageRating|| '-'}</CustomText>
          <AirbnbRating
            count={1}
            reviews={['Terrible', 'Bad', 'OK', 'Good', 'Excellent']}
            defaultRating={farm?.averageRating || 0}
            size={11}
            showRating={false}
            //starContainerStyle={styles.starContainer}
            halfStar={true}
            //starStyle={styles.star}
            isDisabled={true}
          />
          <CustomText style={[styles.cropTextStyle, {textTransform: 'lowercase'}]} type='sh'>
            {farm.totalReviews || '-'} {t('reviews')}
          </CustomText>
        </View>
      </View>
      <View
        style={[
          styles.row,
          {paddingHorizontal:5,justifyContent: 'flex-start', alignItems: 'center'},
        ]}>
        <Image
          source={require('../../../assets/images/Crop.png')}
          style={styles.cropStyle}
        />
        <CustomText style={styles.cropTextStyle} type='sh'>{t('crop')} : </CustomText>
        <CustomText
          style={[
            styles.cropTextStyle,
            {
              color: udyamitaTheme.textColor,
              fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
            },
          ]} type='sh'> 
          {farm.blooming_crops.join(', ')}
        </CustomText>
      </View>
      <View style={[styles.row,{paddingHorizontal:5}]}>
        <View
          style={[
            styles.row,
            {justifyContent: 'flex-start', alignItems: 'center', width: '60%'},
          ]}>
          <Image
            source={require('../../../assets/images/LocationGreen.png')}
            style={{
              height: 14,
              width: 11,
              marginRight: 8,
              resizeMode: 'contain',
            }}
          />
          <CustomText
            numberOfLines={2}
            style={[
              styles.cropTextStyle,
              {
                color: udyamitaTheme.textColor,
                fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
              },
            ]} type='sh'>
            {farm.fulladdress}
          </CustomText>
        </View>

        {/* <CustomText style={styles.cropTextStyle} type='sh'>(100 km away)</CustomText> */}
      </View>
      <View style={[styles.row,{paddingHorizontal:5}]}>
        <View
          style={[
            styles.row,
            {justifyContent: 'flex-start', alignItems: 'center'},
          ]}>
          <CustomText style={styles.cropTextStyle} type='sh'>{t('area')} : </CustomText>

          <CustomText
            style={[
              styles.cropTextStyle,
              {
                color: udyamitaTheme.textColor,
                fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
              },
            ]} type='sh'>
            {farm.farm_size + ' Acres'}
          </CustomText>
        </View>
        <CustomText style={styles.cropTextStyle} type='sh'>
          ({t('accommodates')} {farm.total_beebox})
        </CustomText>
      </View>
      <View style={[styles.row,{paddingHorizontal:5}]}>
        <View
          style={[
            styles.row,
            {justifyContent: 'flex-start', alignItems: 'center'},
          ]}>
          <CustomText style={styles.cropTextStyle} type='sh'>{t('nextBlooming')} : </CustomText>

          <CustomText
            style={[
              styles.cropTextStyle,
              {
                color: udyamitaTheme.textColor,
                fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
              },
            ]} type='sh'>
            {farm.blooming_start_date}
          </CustomText>
        </View>
        {/* <CustomText style={styles.cropTextStyle} type='sh'>(In 5 days)</CustomText> */}
      </View>
    </TouchableOpacity>
  );
};

export default FarmCard;

const styles = StyleSheet.create({
  mainCard: {
    backgroundColor: '#fff',
    borderColor: udyamitaTheme.borderStyleColor,
    marginVertical: 20,
    paddingHorizontal: 5,
    borderWidth: 0.5,
    borderRadius: 6,
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  farmNameText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color: udyamitaTheme.textColor,
    fontSize: udyamitaTheme.themeFontSizeButton,
  },
  cropStyle: {
    height: 16,
    width: 11,
    marginRight: 10,
  },
  cropTextStyle: {
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
    color: udyamitaTheme.borderStyleColor2,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    paddingVertical: 5,
    paddingHorizontal: 20,
  },

  paginationDot: {
    width: 15,
    height: 5,
    borderRadius: 6,
    marginHorizontal: 5,
    backgroundColor: udyamitaTheme.beeAppColor,
  },
  inactivePaginationDot: {
    width: 8,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: '#FFF',
  },
  imageCounter: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 6,
    width: 40,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  imageCounterText: {
    color: '#fff',
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
    fontSize: udyamitaTheme.themeFontSizeCardMiniLabel,
  },
  img:{
    width:78,
    height:33,
    resizeMode:'contain',
    position:'absolute',
    left:15,
    top:15
  }
});
