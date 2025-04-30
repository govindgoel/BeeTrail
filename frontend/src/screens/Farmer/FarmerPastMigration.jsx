import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import CustomHeader from '../../components/reusable/generic/CustomHeader';
import {useTranslation} from 'react-i18next';
import CustomText from '../../components/reusable/CustomText';
import {udyamitaTheme} from '../../config/styles/udyamitaTheme';
import MyMigrationDetailsCard from '../../components/apiary-migration/partials/MyMigrationDetailsCard';
import PastMigrationDetailsCard from '../../components/apiary-migration/partials/PastMigrationDetailsCard_farmer';
import FarmerMigrationDetailsCard from '../../components/apiary-migration/partials/Farmermigrationcard';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import PastMigrationDetailsCard_Farmer from '../../components/apiary-migration/partials/PastMigrationDetailsCard_farmer';
import axios from 'axios';
import {APP_API_USER_URL_SECOND} from '@env'
import { getUser } from '../../helpers/UserData';
const FarmerPastMigration = ({}) => {
  const route=useRoute()
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState(0);
  const {t} = useTranslation();
  const [boxcount, setboxcount] = useState({
    total: '**',
    current:'0',
  });
  const [user, setuser] = useState();
  const [allbookings, setallbookings] = useState([])

  const [statusbookings, setstatusbookings] = useState([])
  const handleBackPress = () => {
    navigation.goBack();
  };
  const [farms, setfarms] = useState([])

  const tabs = [ t('myRequests')];
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
  
  const getfarms = async (id) => {
    try {
      let url = `${APP_API_USER_URL_SECOND}farmer/farms/f/${id}`
      console.log(id, url);
      const res = await axios.get(url)
      console.log(res.data);
      setfarms(res.data.farms);
    } catch (error) {
      console.log(error, 'while fetching farmers');
    }
  }
  const getbooking = async (id) => {
    try {
      let url = `${APP_API_USER_URL_SECOND}matchmaking/requests/farmer/${id}`
      console.log(id, url, 'getbooking');
      const res = await axios.get(url)
      console.log(res.data);
      setallbookings(res.data)
    } catch (error) {
      console.log(error, 'while fetching booking');
    }
  }

  const getdata = async () => {
    const res = await getUser();
    setuser(res.userInfo);
    console.log(res.userInfo);
    getfarms(res.userInfo.id)
    getbooking(res.userInfo.id)
  }
  useFocusEffect(
    useCallback(
      () => {
        getdata()
        // if(route?.params?.boxcount){
        //   setboxcount(route?.params?.boxcount)
        // }
        // if(route?.params?.allbooking){
        //   setallbookings(route?.params?.allbooking)
        // }
        // if(route?.params?.statusbookings){
        //   setstatusbookings(route?.params?.statusbookings)
        // }
        
      },
      [],
    )
    
  )
  const renderFarmCard = ({item}) => (
    <FarmerMigrationDetailsCard status='pending' booking={item} navigation={navigation} />
  );
 
  return (
    <View style={styles.mainContainer}>
      <CustomHeader
        showBackIcon={true}
        onBackPress={handleBackPress}
        title={t('myMigrations')}
      />
        <View
              style={{
                backgroundColor: '#FFFFFF',
                padding: 20,
                paddingVertical: 10,
                width: '90%',
                borderRadius: 8,
                borderWidth: 0.5,
                marginVertical:20,
                borderColor: '#CBCBCB',
                marginHorizontal: 15,
                marginHorizontal: 15,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View style={[styles.flexcolumn, {}]}>
                <Text style={styles.counttext}>
                  {boxcount.current + '/' + farms.reduce((sum, item) => {
                    return sum + (item.total_beebox || 0); // Handles missing/null values safely
                  }, 0) || 0}
                </Text>
                <CustomText styles={styles.headingbook} type="mlabel">
                {t('beeboxoccuped')}
                </CustomText>
              </View>
            </View>
      <View style={styles.tabContainer}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tabItem, activeTab === index && styles.activeTab]}
            onPress={() => setActiveTab(index)}>
            <Text
              style={[
                styles.tabText,
                activeTab === index && styles.activeTabText,
              ]}  >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {activeTab === 0 && (
        <FlatList
          data={allbookings}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderFarmCard}
          style={{paddingHorizontal:20,backgroundColor:'#FFFFFF'}}
        />
      )}
  
     
    </View>
  );
};

export default FarmerPastMigration;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: udyamitaTheme.themeBgColor,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingBottom: 10,
    marginLeft: 20,
    marginTop: 5,
    marginBottom: 15,
    height: 50,
  },
  counttext: {
    color: '#028454',
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
  },
  headingbook: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '400',
  },
  flexcolumn: {
    flexDirection: 'column',
  },
  tabItem: {
    //paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: udyamitaTheme.borderStyleColor,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  tabText: {
    color: udyamitaTheme.textColor,
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
  },
  activeTabText: {
    color: 'white',
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
  },
  activeTab: {
    backgroundColor: udyamitaTheme.beeAppColor,
    borderWidth: 0,
  },
  pastMigrationContainer:{
    backgroundColor:'#fff',
    borderTopWidth:0.5,
    borderBottomWidth:0.5,
    borderColor:udyamitaTheme.borderStyleColor,
  },
  title:{
    fontFamily:udyamitaTheme.mainThemeFontFamilyBold,
    color:udyamitaTheme.textColor,
    fontSize:udyamitaTheme.themeFontSizeButton,
    paddingLeft:20
  }
});
