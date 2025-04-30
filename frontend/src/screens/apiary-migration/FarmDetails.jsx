import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import {udyamitaTheme} from '../../config/styles/udyamitaTheme';
import {useTranslation} from 'react-i18next';
import CustomHeader from '../../components/reusable/generic/CustomHeader';
import {AirbnbRating} from 'react-native-ratings';

import Carousel, {Pagination} from 'react-native-snap-carousel-v4';
import {
  ChevronUp,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronsUp,
} from 'react-native-feather';
import ReviewCard from '../../components/eBazaar/partials/ReviewCard';
import MapView, {Marker} from 'react-native-maps';
import Geocoding from 'react-native-geocoding';
import CustomText from '../../components/reusable/CustomText';
import CustomHeaderMigration from '../../components/Customheadermigration';
import {useFocusEffect} from '@react-navigation/native';
import {getAllbookingsoffarmer, getUser} from '../../helpers/UserData';
import Geocoder from 'react-native-geocoding';
import {APP_GEO_KEY} from '@env'
const photoUrls = [
  'https://cff2.earth.com/uploads/2023/05/16064103/Farms-scaled.jpg',
  'https://scx2.b-cdn.net/gfx/news/hires/2019/farm.jpg',
  'https://static.country-guide.ca/wp-content/uploads/2020/04/03165951/farm-sunset-1015089708-benedek-iStock-GettyImages.jpg',
];

const reviewData = [
  {
    productRating: 4,
    review:
      "I had an outstanding experience at this farm! The facilities were top-notch, and the staff was incredibly knowledgeable and supportive. The beekeeping setup exceeded my expectations, making it a perfect spot for fellow beekeepers. I'll definitely be returning.",
    title: 'Great Product!',
    helpfulCount: 15,
    createdAt: '2023-12-06T10:30:00Z',
    user: {
      name: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      age: 30,
      address: {
        street: '123 Main St',
        city: 'Cityville',
        state: 'Stateville',
        zipCode: '12345',
      },
    },
  },
  {
    productRating: 5,
    review: "This is the best product I've ever used! Highly recommended!",
    title: 'Amazing Experience',
    helpfulCount: 27,
    createdAt: '2023-12-05T15:45:00Z',
    user: {
      name: 'Jane',

      email: 'jane.smith@example.com',
      age: 40,
      address: {
        street: '456 Oak St',
        city: 'Townsville',
        state: 'Countyville',
        zipCode: '54321',
      },
    },
  },
  {
    productRating: 4,
    review:
      "I had an outstanding experience at this farm! The facilities were top-notch, and the staff was incredibly knowledgeable and supportive. The beekeeping setup exceeded my expectations, making it a perfect spot for fellow beekeepers. I'll definitely be returning.",
    title: 'Great Product!',
    helpfulCount: 15,
    createdAt: '2023-12-06T10:30:00Z',
    user: {
      name: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      age: 30,
      address: {
        street: '123 Main St',
        city: 'Cityville',
        state: 'Stateville',
        zipCode: '12345',
      },
    },
  },
  {
    productRating: 5,
    review: "This is the best product I've ever used! Highly recommended!",
    title: 'Amazing Experience',
    helpfulCount: 27,
    createdAt: '2023-12-05T15:45:00Z',
    user: {
      name: 'Jane',

      email: 'jane.smith@example.com',
      age: 40,
      address: {
        street: '456 Oak St',
        city: 'Townsville',
        state: 'Countyville',
        zipCode: '54321',
      },
    },
  },
  // Add more review objects as needed
];

const FarmDetails = ({route, navigation}) => {
  const {width, height} = Dimensions.get('window');
  const {t} = useTranslation();
  const [carouselIndex, setCarouselIndex] = useState(0);
  const viewAllRef = useRef(null);
  const [user, setuser] = useState(false);
  const [bookings, setbookings] = useState(false);
  const [farmLocation, setFarmLocation] = useState({
    latitude: 12.124,
    longitude: 12.24,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [ShowAllreview, setShowAllreview] = useState(false)
  const [averageRatingOffset, setAverageRatingOffset] = useState(0);
  const [reviewsOffset, setReviewsOffset] = useState(0);
  const [completed, setcompleted] = useState(reviewData)
  const handleBackPress = () => {
    navigation.goBack();
  };
  function generateCropString(crops) {
    return crops.map(crop => `${crop.name}`).join(', ');
  }
  function getMonthDate(dates) {
    const date = new Date(dates);
    const options = {month: 'long', day: 'numeric'};
    return date.toLocaleDateString('en-US', options);
  }

  function generateStatusArrays(bookings, bookingStatus) {
    const statusArrays = { pending: [], confirmed: [], completed: [], canceled: [] };
  
    bookings.forEach(booking => {
       
        statusArrays[booking.status].push(booking);
   
    });
    setcompleted(statusArrays?.completed)
    console.log(statusArrays);
  }



  useFocusEffect(
    React.useCallback(() => {
      const getdata = async () => {
        const res = await getUser();
        setuser(res.userInfo);
        console.log(res.userInfo);
        // try {
        //   const bookings = await getAllbookingsoffarmer(res.userInfo._id);
        //   if (!bookings.error) {
        //     setbookings(bookings?.data);
        //     // generateStatusArrays(bookings?.data)
        //   }
        //  } catch (error) {
        //   console.log(error);
        // }
      };

      getdata();
      console.log(route?.params?.farm);
      let farmLocations = farmLocation;
      let location = route?.params?.farm?.location;
      if (location.latitude) {
        farmLocations.latitude = location.latitude;
        // farmLocations.latitudeDelta = location.latitude;
      }
      if (location.longitude) {
        farmLocations.longitude = location.longitude;
        // farmLocations.longitudeDelta = location.longitude;
      }
      console.log(farmLocations);
      setFarmLocation(farmLocations);
      Geocoder.init(APP_GEO_KEY);
      
    }, []),
  );
  const renderCarouselItem = ({item}) => {
    return (
      <>
        <Image
          source={{uri: item}}
          style={{
            height: 237,
            width: '85%',
            alignSelf: 'center',
            resizeMode: 'cover',
            borderRadius: 2,
            marginBottom: 8,
          }}
        />
        {route?.params?.farm?.farm_photos.length > 1 && (
          <Pagination
            dotsLength={route?.params?.farm?.farm_photos.length}
            activeDotIndex={carouselIndex}
            containerStyle={styles.paginationContainer}
            dotStyle={styles.paginationDot}
            inactiveDotStyle={styles.inactivePaginationDot}
          />
        )}
      </>
    );
  };

  const renderReviewItem = ({item}) => {
    return <ReviewCard reviewData={item} />;
  };

  const handleAverageRatingLayout = event => {
    console.log('handleAverageRatingLayout: ');
    const {y} = event.nativeEvent.layout;
    console.log('handleAverageRatingLayout: y');
    setAverageRatingOffset(y);
  };

  const handleReviewsLayout = event => {
    const {y} = event.nativeEvent.layout;
    console.log(' y: ', y);
    setReviewsOffset(y);
  };
  const goToReviews = () => {
    if (viewAllRef.current) {
      const offset = reviewsOffset - averageRatingOffset;
      console.log('offset: ', offset,reviewsOffset,averageRatingOffset);
      const yOffset = offset > 0 ? offset : 0;
      // viewAllRef.current.scrollTo({y: yOffset, animated: true});
      viewAllRef.current?.scrollToEnd({ animated: true });
    }
  };
  try {
    return (
      <View style={styles.mainContainer}>
        <CustomHeaderMigration
          title={t('migrate')}
          navigation={navigation}
          clock={false}
          messageicon={false}
          handleBack={() => {
            navigation.goBack();
          }}
        />
        <ScrollView
          style={styles.scrollViewContainer}
          ref={viewAllRef}
          showsVerticalScrollIndicator={false}>
          {route?.params?.farm?.farm_photos?.length > 1 ? (
            <>
              <Carousel
                data={route?.params?.farm?.farm_photos}
                renderItem={renderCarouselItem}
                sliderWidth={width}
                itemWidth={width}
                onSnapToItem={index => setCarouselIndex(index)}
                pagination={true}
              />
              {route?.params?.farm?.farm_photos && route?.params?.farm?.farm_photos.length > 1 && (
                <View style={styles.imageCounter}>
                  <CustomText style={styles.imageCounterText} type="ml">
                    {carouselIndex + 1}/{route?.params?.farm?.farm_photos.length}
                  </CustomText>
                </View>
              )}
            </>
          ) : (
            <Image
              source={{uri: photoUrls[(Math.floor(Math.random() * 3) + 1)%3]}}
              style={{
                height: 237,
                width: '85%',
                alignSelf: 'center',
                resizeMode: 'cover',
                borderRadius: 2,
                marginTop: 8,
                marginBottom: 8,
              }}
            />
          )}
         <View style={[styles.subContainer, { borderBottomLeftRadius: 40, borderBottomRightRadius: 40, paddingBottom: 20 }]}>
  <View style={styles.row}>
    <CustomText style={styles.farmNameText} type="btn">
      {route?.params?.farm.name || 'N/A'}
    </CustomText>
    <View onLayout={handleAverageRatingLayout}>
      <TouchableOpacity style={styles.row} onPress={() => goToReviews()}>
        <CustomText
          style={[styles.cropTextStyle, { alignSelf: 'center' }]}
          type="sh">
          {route?.params?.farm?.averageRating ?? 0}
        </CustomText>
        <AirbnbRating
          count={1}
          reviews={['Terrible', 'Bad', 'OK', 'Good', 'Excellent']}
          defaultRating={route?.params?.farm?.averageRating ?? 0}
          size={11}
          showRating={false}
          halfStar={true}
          isDisabled={true}
        />
        <CustomText
          style={[
            styles.cropTextStyle,
            { textTransform: 'lowercase', alignSelf: 'center' },
          ]}
          type="sh">
          {route?.params?.farm?.totalReviews ?? 0} {t('reviews')}
        </CustomText>
      </TouchableOpacity>
    </View>
  </View>

  <CustomText
    style={[
      styles.cropTextStyle,
      {
        color: udyamitaTheme.textColor,
        fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
      },
    ]}
    type="sh">
    {route?.params?.farm?.fulladdress || 'N/A'}
  </CustomText>

  <View style={styles.infoBox}>
    <View style={[styles.singleBox, {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      padding: 15,
    }]}>
      <CustomText
        style={[
          styles.farmNameText,
          {
            alignSelf: 'center',
            fontSize: udyamitaTheme.themeFontSizeLabel,
            fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
          },
        ]}
        type="label">
        {route?.params?.farm?.blooming_crops?.[0] || 'N/A'}
        {route?.params?.farm?.blooming_crops?.length > 1
          ? `+ ${route?.params?.farm?.blooming_crops?.length - 1}`
          : null}
      </CustomText>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
      }}>
        <Image
          source={require('../../assets/images/Crop.png')}
          style={styles.cropStyle}
        />
        <CustomText style={styles.cropTextStyle} type="sh">
          {t('crop')}
        </CustomText>
      </View>
    </View>

    <View style={styles.borderStyle} />

    <View style={styles.singleBox}>
      <CustomText
        style={[
          styles.farmNameText,
          {
            fontSize: udyamitaTheme.themeFontSizeLabel,
            fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
          },
        ]}
        type="btn">
        {route?.params?.farm?.farm_size
          ? `${route?.params?.farm?.farm_size}`
          : 'N/A'}
      </CustomText>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
      }}>
        <CustomText style={styles.cropTextStyle} type="sh">
          {t('area')}
        </CustomText>
      </View>
    </View>

    <View style={styles.borderStyle} />

    <View style={[styles.singleBox, { padding: 15 }]}>
      <CustomText
        style={[
          styles.farmNameText,
          {
            fontSize: udyamitaTheme.themeFontSizeLabel,
            fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
          },
        ]}
        type="label">
        {route?.params?.farm?.distance || '89 Km Away'}
      </CustomText>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
      }}>
        <Image
          source={require('../../assets/images/LocationGreen.png')}
          style={styles.cropStyle}
        />
        <CustomText style={styles.cropTextStyle} type="sh">
          {t('distance')}
        </CustomText>
      </View>
    </View>
  </View>

  <View style={styles.infoBox}>
    <View style={[styles.row, { paddingHorizontal: 10, paddingVertical: 10 }]}>
      <CustomText
        style={[
          styles.cropTextStyle,
          { fontFamily: udyamitaTheme.mainThemeFontFamilyMedium },
        ]}
        type="sh">
        {t('nextBlooming')} :
      </CustomText>
      <CustomText
        style={[
          styles.cropTextStyle,
          {
            fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
            color: udyamitaTheme.textColor,
          },
        ]}
        type="sh">
        {route?.params?.farm?.blooming_start_date
          ? route?.params?.farm?.blooming_start_date
          : 'N/A'}
      </CustomText>
    </View>
  </View>

  <View style={styles.infoBox}>
    <View style={[styles.row, { paddingHorizontal: 10, paddingVertical: 10 }]}>
      <CustomText
        style={[
          styles.cropTextStyle,
          { fontFamily: udyamitaTheme.mainThemeFontFamilyMedium },
        ]}
        type="sh">
        {t('farmingMethod')} :
      </CustomText>
      <CustomText
        style={[
          styles.cropTextStyle,
          {
            fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
            color: udyamitaTheme.textColor,
          },
        ]}
        type="sh">
        {route?.params?.farm?.farming_method || 'N/A'}
      </CustomText>
    </View>
  </View>

  <View style={styles.infoBox}>
    <View style={[styles.row, { paddingHorizontal: 10, paddingVertical: 10 }]}>
      <CustomText
        style={[
          styles.cropTextStyle,
          { fontFamily: udyamitaTheme.mainThemeFontFamilyMedium },
        ]}
        type="sh">
        {t('accommodates')}
      </CustomText>
      <CustomText
        style={[
          styles.cropTextStyle,
          {
            fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
            color: udyamitaTheme.textColor,
          },
        ]}
        type="sh">
        {route?.params?.farm?.total_beebox ?? 'N/A'}
      </CustomText>
    </View>
  </View>
</View>
{/* user && user.userRole == 'farmer' condition to be used in place of true */}
          {/* {user && user.userRole == 'farmer' && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginVertical:15
                }}>
                <TouchableOpacity
                  style={[styles.searchBtn2,{backgroundColor:'#F1F1F1' }]}
                  onPress={() =>
                    console.log('delete list')
                  }>
                  <CustomText style={[styles.searchBtnText,{color:'#262626'}]} type="btn">
                  Remove Listing
                  </CustomText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.searchBtn2}
                  onPress={() =>
                    navigation.navigate('Listfarm_form', {
                      editfarm: route?.params?.farm,
                    })                }>
                  <CustomText style={styles.searchBtnText} type="btn">
                    Edit listing
                  </CustomText>
                </TouchableOpacity>
              </View>
            )} */}
          {false && (
            <View style={styles.subContainer}>
              <CustomText style={styles.farmNameText} type="btn">
                {t('chatWithTheHost')}
              </CustomText>
              <CustomText
                style={[styles.cropTextStyle, {marginBottom: 10, marginTop: 10}]}
                type="sh">
                {t('responseRate')} :100%
              </CustomText>
              <CustomText style={styles.cropTextStyle} type="sh">
                {t('responseTime')} : {t('withinAnHour')}
              </CustomText>
              <TouchableOpacity style={styles.contactHostBtn}>
                <CustomText style={styles.contactHostBtnText} type="label">
                  {t('contactHost')}
                </CustomText>
              </TouchableOpacity>
            </View>
          )}
            <View style={styles.subContainer}>
          <CustomText style={styles.farmNameText} type="btn">
            {t('whereAreWe')}
          </CustomText>
          <CustomText
            style={[
              styles.cropTextStyle,
              {
                marginBottom: 10,
                marginTop: 5,
                fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
                color: udyamitaTheme.textColor,
              },
            ]}
            type="sh">
            {route?.params?.farm?.fulladdress}
          </CustomText>
          {console.log(farmLocation)}
          <MapView
            style={{height: 200, marginVertical: 10}}
            region={farmLocation}>
            <Marker
              coordinate={farmLocation}
              title={route?.params?.farm?.addressLine}
            />
          </MapView>
        </View>
         {/* { completed?.length>0 && <View style={styles.subContainer}>
            <View
              onLayout={handleReviewsLayout}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <CustomText style={styles.farmNameText} type="btn">
                {t('ratingAndReviews')}
              </CustomText>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onPress={e=>
                  setShowAllreview(!ShowAllreview)
                }
                
                >
                <CustomText
                  style={{
                    color: udyamitaTheme.beeAppColor,
                    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
                    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
                    marginRight:5
                  }}
                  type="sh">
                  {t('viewAll')}
                </CustomText>

                {ShowAllreview ? 
                <ChevronDown
                  width={12}
                  height={12}
                  color={udyamitaTheme.beeAppColor}
                />
              : 
              <ChevronUp
                  width={12}
                  height={12}
                  color={udyamitaTheme.beeAppColor}
                />
              }
              </TouchableOpacity>
            </View>
            <View>
              <FlatList
                data={ShowAllreview? completed : completed.slice(0, 2)}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderReviewItem}
              />
            </View>
          </View>} */}
        </ScrollView>
        {user && user.userRole !== 'farmer' && (
          <TouchableOpacity
            style={styles.searchBtn}
            onPress={() =>
              navigation.navigate('ReserveFarm', {farmData: route?.params?.farm})
            }>
            <CustomText style={styles.searchBtnText} type="btn">
              {t('reserve')}
            </CustomText>
          </TouchableOpacity>
        )}
      </View>
    );
  } catch (error) {
    console.log(error);
    return (
      <Text>afs</Text>
    )
  }
};

export default FarmDetails;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: udyamitaTheme.themeBgColor,
    flex: 1,
  },
  scrollViewContainer: {
    // paddingLeft: 20,
    // paddingRight: 20,
  },
  subContainer: {
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 20,
    paddingHorizontal: 20,
  },
  subContainer2: {
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 20,
    paddingHorizontal: 0,
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
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: '#FFF',
  },
  imageCounter: {
    position: 'absolute',
    top: 4,
    right: 35,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 6,
    // paddingHorizontal: 6,
    // paddingVertical: 2,
    width: 45,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  imageCounterText: {
    color: '#fff',
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
    fontSize: udyamitaTheme.themeFontSizeCardMiniLabel,
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
    resizeMode: 'contain',
  },
  cropTextStyle: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
    color: udyamitaTheme.borderStyleColor2,
  },
  infoBox: {
    borderColor: udyamitaTheme.borderStyleColor,
    borderWidth: 0.5,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    borderRadius: 12,
  },
  singleBox: {
    //marginTop:20,
    width: '33%',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  borderStyle: {
    borderRightWidth: 0.5,
    borderRightColor: udyamitaTheme.borderStyleColor,
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
  contactHostBox: {
    padding: 10,
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
  searchBtn2: {
    width: '40%',
    padding:15,
    paddingHorizontal:20,
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
});
