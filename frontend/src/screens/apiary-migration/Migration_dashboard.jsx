import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  PermissionsAndroid,
  ScrollView,
  Platform,
  SafeAreaView,
  FlatList,
  BackHandler,
  Alert,
} from 'react-native';
import CustomHeaderMigration from '../../components/Customheadermigration';
import {useTranslation} from 'react-i18next';
import CustomText from '../../components/reusable/CustomText';
import {udyamitaTheme} from '../../config/styles/udyamitaTheme';
import FarmCard from '../../components/apiary-migration/partials/FarmCard';
import PastmigrationCard from '../../components/apiary-migration/partials/PastmigrationCard';
import {ChevronRight} from 'react-native-feather';
import HeaderForDashBoard from '../../components/dashboard/resuable/HeaderForDashBoard';
import { getUser } from '../../helpers/UserData';
import {APP_API_USER_URL_SECOND} from '@env'
import axios from 'axios';
const farmData = [
  {
    farmName: 'Green Acres Farm',
    averageRating: 4.5,
    totalReviews: 20,
    crop: 'Tomatoes',
    location: '123 Main Street, Anytown, USA',
    area: '10 acres',
    capacity: '50 boxes',
    nextBlooming: '9 December',
    photoUrls: [
      'https://cff2.earth.com/uploads/2023/05/16064103/Farms-scaled.jpg',
      'https://scx2.b-cdn.net/gfx/news/hires/2019/farm.jpg',
      'https://static.country-guide.ca/wp-content/uploads/2020/04/03165951/farm-sunset-1015089708-benedek-iStock-GettyImages.jpg',
    ],
    farmingMethod: 'organic',
  },
  {
    farmName: 'Sunflower Fields Farm',
    averageRating: 4.2,
    totalReviews: 15,
    crop: 'Sunflowers',
    location: '456 Country Road, Villagetown, USA',
    area: '5 acres',
    capacity: '20 boxes',
    nextBlooming: '12 December',
    photoUrls: [
      'https://images.cnbctv18.com/wp-content/uploads/2023/08/Zetta-Farms-780x438.jpg',
      'https://hbr.org/resources/images/article_assets/2021/08/Sep21_02_1176415931.jpg',
      'https://live.staticflickr.com/65535/50881797506_176f3d534f_z.jpg',
    ],
    farmingMethod: 'inorganic',
  },
  {
    farmName: 'Harvest Haven',
    averageRating: 4.8,
    totalReviews: 30,
    crop: 'Apples',
    location: '789 Orchard Lane, Fruitville, USA',
    area: '15 acres',
    capacity: '40 boxes',
    nextBlooming: '5 December',
    photoUrls: [
      'https://external-preview.redd.it/nq9YwvSVhVTc3E1yezWXG9M8T2Km99hpwLY3BgZuROA.jpg?auto=webp&s=b9efa5606054ccde13bc3e10f97cdbdf3a032784',
      'https://rare-gallery.com/thumbs/5291330-field-flower-tulip-pink-farm-house-meadow-flower-field-green-cloudy-tree-landscape-outdoor-blue-cloudscape-farmland-farm-garden-skyline-netherlands-outside-free-images.jpg',
      'https://cdn.perishablenews.com/2020/05/fl4addf3-326x245.jpg',
    ],
    farmingMethod: 'organic',
  },
  {
    farmName: 'Golden Wheat Farms',
    averageRating: 4.0,
    totalReviews: 18,
    crop: 'Wheat',
    location: '101 Wheatfield Road, Grainland, USA',
    area: '8 acres',
    capacity: '25 boxes',
    nextBlooming: '15 December',
    photoUrls: [
      'https://grocycle.com/wp-content/uploads/2022/09/Snapdragon-flower-farm-1024x589.jpg',
      'https://fruitpickingfarms.com/wp-content/uploads/2021/07/Flower-farms-new-jersey-e1626782403216.jpg',
      'https://hips.hearstapps.com/hmg-prod/images/tulip-field-royalty-free-image-1620218370.?crop=0.457xw:1.00xh;0.272xw,0&resize=1200:*',
    ],
    farmingMethod: 'inorganic',
  },
];

const pastfarmData = [
  {
    farmName: 'Green Acres Farm',
    averageRating: 4.5,
    totalReviews: 20,
    crop: 'Tomatoes',
    location: '123 Main Street, Anytown, USA',
    area: '10 acres',
    upcoming:true,
    pending:false,
    completed:false,
    capacity: '50 boxes',
    nextBlooming: '9 December',
    photoUrls: [
      'https://cff2.earth.com/uploads/2023/05/16064103/Farms-scaled.jpg',
      'https://scx2.b-cdn.net/gfx/news/hires/2019/farm.jpg',
      'https://static.country-guide.ca/wp-content/uploads/2020/04/03165951/farm-sunset-1015089708-benedek-iStock-GettyImages.jpg',
    ],
  },
  {
    farmName: 'Sunflower Fields Farm',
    averageRating: 4.2,
    totalReviews: 15,
    upcoming:false,
    pending:true,
    completed:false,
    crop: 'Sunflowers',
    location: '456 Country Road, Villagetown, USA',
    area: '5 acres',
    capacity: '20 boxes',
    nextBlooming: '12 December',
    photoUrls: [
      'https://images.cnbctv18.com/wp-content/uploads/2023/08/Zetta-Farms-780x438.jpg',
      'https://hbr.org/resources/images/article_assets/2021/08/Sep21_02_1176415931.jpg',
      'https://live.staticflickr.com/65535/50881797506_176f3d534f_z.jpg',
    ],
  },
  {
    farmName: 'Harvest Haven',
    averageRating: 4.8,
    totalReviews: 30,
    upcoming:false,
    pending:false,
    completed:true,
    crop: 'Apples',
    location: '789 Orchard Lane, Fruitville, USA',
    area: '15 acres',
    capacity: '40 boxes',
    nextBlooming: '5 December',
    photoUrls: [
      'https://external-preview.redd.it/nq9YwvSVhVTc3E1yezWXG9M8T2Km99hpwLY3BgZuROA.jpg?auto=webp&s=b9efa5606054ccde13bc3e10f97cdbdf3a032784',
      'https://rare-gallery.com/thumbs/5291330-field-flower-tulip-pink-farm-house-meadow-flower-field-green-cloudy-tree-landscape-outdoor-blue-cloudscape-farmland-farm-garden-skyline-netherlands-outside-free-images.jpg',
      'https://cdn.perishablenews.com/2020/05/fl4addf3-326x245.jpg',
    ],
  },
  {
    farmName: 'Golden Wheat Farms',
    averageRating: 4.0,
    totalReviews: 18,
    crop: 'Wheat',
    location: '101 Wheatfield Road, Grainland, USA',
    area: '8 acres',
    capacity: '25 boxes',
    nextBlooming: '15 December',
    photoUrls: [
      'https://grocycle.com/wp-content/uploads/2022/09/Snapdragon-flower-farm-1024x589.jpg',
      'https://fruitpickingfarms.com/wp-content/uploads/2021/07/Flower-farms-new-jersey-e1626782403216.jpg',
      'https://hips.hearstapps.com/hmg-prod/images/tulip-field-royalty-free-image-1620218370.?crop=0.457xw:1.00xh;0.272xw,0&resize=1200:*',
    ],
  },
];

const Migration_dashboard = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [user, setuser] = useState(false)
  const [boxcount, setboxcount] = useState({
    total: 50,
    current: 0,
  });
  const [bookingData, setbookingData] = useState([])
  const [farms, setfarms] = useState([])
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (true) {
          Alert.alert(`${t('holdOn')}`, `${t('areYouSureYouWantToGoBack')}`, [
            {
              text: `${t('cancel')}`,
              onPress: () => null,
              style: 'cancel',
            },
            {text: `${t('yes')}`, onPress: () => BackHandler.exitApp()},
          ]);
          //return true;
        } else {
          navigation.goBack();
          //return false;
        }
        return true;
      };
  const backHandler = BackHandler.addEventListener(
    'hardwareBackPress',
    onBackPress,
  );
  return () => backHandler.remove();
}, []),
  );


  useFocusEffect(
    React.useCallback(() => {
      const getfarms= async (id)=>{
      try {
        let url=`${APP_API_USER_URL_SECOND}farmer/farms/b/${id}`
          console.log(id,url);
          const res=await axios.get(url)
          setfarms(res.data.farms);
      } catch (error) {
        console.log(error,'while fetching farmers');
      }
      }
      const getbooking= async (id)=>{
      try {
        let url=`${APP_API_USER_URL_SECOND}matchmaking/requests/beekeeper/${id}`
          console.log(id,url,'getbooking');
          const res=await axios.get(url)
          console.log(res.data);
          setbookingData(res.data)
      } catch (error) {
        console.log(error,'while fetching booking');
      }
      }
      const getdata = async () => {
        const res = await getUser();
        console.log(res.userInfo);
        getfarms(res.userInfo.beekeeper_id)
        getbooking(res.userInfo.beekeeper_id)
        setuser(res.userInfo);
      };
      getdata();
    }, []),
  );

  const renderFarmCard = ({item}) => {
    return <FarmCard farm={item} navigation={navigation} />;
  };

  const renderPastMigration = ({item}) => (
    <PastmigrationCard farm={item} navigation={navigation} />
  );
  return (
    <>
      <ScrollView style={{height: '100%',backgroundColor:'#FFFFFF'}}>
        <HeaderForDashBoard
          navigation={navigation}
          userInfo={user}
          
        />
        <View
          style={[
            styles.flexcolumn,
            styles.align_center,
            {
              borderColor: '#CBCBCB',
              borderRightWidth: 0,
              gap: 5,
              borderWidth: 0.5,
              paddingVertical: 20,
            },
          ]}>
          <Text style={styles.counttext}>
            {bookingData.reduce((sum, item) => {
  return sum + (item.bee_box_count || 0); // Handles missing/null values safely
}, 0) + '/' + (user.numberOfHivesWithBroodAndSuper +user.numberOfHivesWithBroodOnly )}
          </Text>
          <CustomText styles={styles.headingbook} type="mlabel">
            {t('beeboxoccuped')}
          </CustomText>
          <View
            style={[styles.flexcolumn, {width: '100%', paddingHorizontal: 23}]}>
            <View style={[styles.spacebtw_box, {alignItems: 'center',marginTop:10}]}>
              <CustomText style={styles.titleStyle} type="h">
                {t('myBookings')}
              </CustomText>
              <View style={styles.flexrow}>
                <TouchableOpacity onPress={()=>navigation.navigate('PastMigrationBeekeeper')}> 
                <CustomText style={styles.viewalltext} type="sh">
                  {t('viewAll')} 
                </CustomText>
                </TouchableOpacity>
                <ChevronRight
                  height={15}
                  width={15}
                  color={udyamitaTheme.beeAppColor}
                />
              </View>
            </View>
            <View style={{marginBottom:10}}>
            {bookingData?.length==0 ?
               <View
               style={{
                 flexDirection: 'column',
                 justifyContent: 'center',
                 alignContent: 'center',
                 width: '100%',
               }}>
               <Image
                 source={require('../../assets/images/empty_request.png')}
                 style={{width: 89, height: 120, alignSelf: 'center'}}
               />
               <CustomText
                 style={{
                   fontWeight: '400',
                   fontSize: 14,
                   alignSelf: 'center',
                   color: '#262626',
                   paddingVertical: 20,
                 }}>
                 {t('noContentFound')}
               </CustomText>
             </View>
            :<FlatList
              data={bookingData}
              renderItem={renderPastMigration}
              keyExtractor={item => item.id}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            />}
            </View>
          </View>

          {/* <TouchableOpacity style={styles.greenbutton} onPress={()=>navigation.navigate('MigrationForm')}>
            <CustomText style={styles.booknow} type="mlabel">
              {t('reserve')}
            </CustomText>
          </TouchableOpacity> */}
        </View>
        <View style={{marginVertical: 20, marginHorizontal: 25}}>
          <CustomText style={styles.titleStyle} type="h">
            {t('exploreFarms')}
          </CustomText>

          <ScrollView>
            <FlatList
              data={farms}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderFarmCard}
            />
          </ScrollView>
        </View>
      </ScrollView>
    </>
  );
};

export default Migration_dashboard;

const styles = StyleSheet.create({
  titleStyle: {
    // flex: 1,
    fontWeight: 600,
    // fontSize: udyamitaTheme.themeFontSizeModalLabel,
    // marginLeft: 20,
    // maxWidth: 180,
    // fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    color: '#262626',
  },
  flexcolumn: {
    flexDirection: 'column',
  },
  flexrow: {
    flexDirection: 'row',
  },
  align_center: {
    alignItems: 'center',
  },
  counttext: {
    color: '#028454',
    fontSize: 28,
    fontWeight: '600',
  },
  headingbook: {
    fontSize: 14,
    color: '#262626',
    fontWeight: 400,
  },
  greenbutton: {
    marginTop: 20,
    backgroundColor: '#028454',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    width: '90%',
  },
  viewalltext: {
    color: '#028454',
    fontWeight: '600',
    marginRight:5
  },
  booknow: {
    color: '#FFFFFF',
  },
  spacebtw_box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
