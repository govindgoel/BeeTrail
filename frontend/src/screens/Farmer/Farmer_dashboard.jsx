import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
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
  Button,
  Alert,
  BackHandler,
} from 'react-native';
import CustomHeaderMigration from '../../components/Customheadermigration';
import CustomText from '../../components/reusable/CustomText';
import { udyamitaTheme } from '../../config/styles/udyamitaTheme';
import FarmCard from '../../components/apiary-migration/partials/FarmCard';
import PastmigrationCard from '../../components/apiary-migration/partials/PastmigrationCard';
import { ChevronRight } from 'react-native-feather';
import Myfarm_card from '../../components/farmer/reusable/Myfarm_card';
import {
  getAllbookingsoffarmer,
  getAllfarmoffarmer,
  getToken,
  getUser,
} from '../../helpers/UserData';
import axios from 'axios';
import { APP_API_USER_URL_SECOND } from '@env';
// import HeaderForDashBoard from '../../components/dashboard/resuable/HeaderForDashBoard';
import PastmigrationCard_Farmer from '../../components/apiary-migration/partials/PastMigrationCard_Farmer';
import HeaderForDashBoard from '../../components/dashboard/resuable/HeaderForDashBoard';
import { useTranslation } from 'react-i18next';
const userbaseurl = APP_API_USER_URL_SECOND;
const farmData = [
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
  _id: '6811abdc3fbd60e77a9a412a',
  bee_box_count: 33,
  beekeeper_id: "6810d1bc1a63229f743ccc2d",
  created_at: "2025-04-29T13:20:43.857000",
  farm_id: "68108a87d5d6edc8add9cedc",
  is_active: true,
  pollination_window_start: "2025-04-29T18:30:00"
}
];

const Farmer_dashboard = () => {
  const navigation = useNavigation();
  const [farm, setfarm] = useState(farmData);
  const [booking, setbooking] = useState([]);
  const [statusbookingarray, setstatusbookingarray] = useState({
    pending: [],
    confirmed: [],
    completed: [],
    canceled: [],
  });
  const [boxcount, setboxcount] = useState({
    total: '**',
    current: '0',
  });
  const {t} = useTranslation();
  const [bookingData, setbookingData] = useState([])
  const [farms, setfarms] = useState([])
  const [user, setuser] = useState();

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
            { text: `${t('yes')}`, onPress: () => BackHandler.exitApp() },
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
          setbooking(res.data)
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

      getdata();
    }, []),
  );

  useEffect(() => {
    if (statusbookingarray?.confirmed?.length > 0) {
      let usedboxcnt = 20;
      // statusbookingarray?.confirmed?.map(it => {
      //   usedboxcnt += beeboxed;
      // });
      setboxcount({ ...boxcount, current: usedboxcnt });
    }
  }, [statusbookingarray]);

  const renderFarmCard = ({ item }) => {
    return <FarmCard farm={item} navigation={navigation} />;
  };

  const renderPastMigration = ({ item }) => (
    <PastmigrationCard_Farmer booking={item} navigation={navigation} />
  );
  return (
    <>
      <HeaderForDashBoard
        navigation={navigation}
        userInfo={user}
        farmer={true}
      />
      {farm?.length == 0 || farm == undefined ? (
        <View
          style={{
            justifyContent: 'center',
            alignContent: 'center',
            flexDirection: 'column',
            minHeight: '80%',
            width: '100%',
          }}>
          <Text
            style={{
              color: '#262626',
              alignSelf: 'center',
              fontWeight: '600',
              marginBottom: 5,
              fontSize: 16,
            }}>
            Namaste {user?.name}
          </Text>
          <Text
            style={{
              color: '#262626',
              alignSelf: 'center',
              fontWeight: '600',

              fontSize: 16,
            }}>
            List your Farm to get started!
          </Text>
          <Image
            source={require('../../assets/images/background.png')}
            style={{
              width: 177,
              marginVertical: 25,
              height: 160,
              alignSelf: 'center',
            }}
          />
          <TouchableOpacity
            style={[styles.greenbutton, { alignSelf: 'center' }]}
            onPress={() => navigation.navigate('Listfarm_form')}>
            <CustomText style={styles.booknow} type="mlabel">
              Add Farm
            </CustomText>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={{ height: '100%' }}>
          <View
            style={[
              styles.flexcolumn,
              styles.align_center,
              {
                paddingVertical: 0,
              },
            ]}>
            <View
              style={{
                backgroundColor: '#FFFFFF',
                padding: 20,
                paddingVertical: 10,
                width: '90%',
                borderRadius: 8,
                borderWidth: 0.5,
                borderColor: '#CBCBCB',
                marginHorizontal: 20,
                marginHorizontal: 15,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
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
              <TouchableOpacity
                style={styles.greybutton}
                onPress={() => navigation.navigate('FarmerPastMigration', {
                  statusbookings: statusbookingarray,
                  allbooking: booking,
                  boxcount
                })}>
                <CustomText style={styles.booknow} type="mlabel">
                  {t('viewBookings')}
                </CustomText>
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.flexcolumn,
                styles.bordervertical,
                {
                  width: '100%',
                  paddingHorizontal: 23,
                  marginVertical: 16,
                  backgroundColor: '#FFFFFF',
                },
              ]}>
              <View
                style={[
                  styles.spacebtw_box,
                  { alignItems: 'center', marginTop: 10 },
                ]}>
                <CustomText style={styles.titleStyle} type="h">
                  {t('myRequests')}
                </CustomText>
              </View>
              <View style={{ marginBottom: 10 }}>
                {booking?.length == 0 ? (
                  <>
                    <View
                      style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignContent: 'center',
                        width: '100%',
                      }}>
                      <Image
                        source={require('../../assets/images/empty_request.png')}
                        style={{ width: 89, height: 120, alignSelf: 'center' }}
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
                  </>
                ) : (
                  <FlatList
                    data={booking}
                    renderItem={renderPastMigration}
                    keyExtractor={item => item.id}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                  />
                )}
              </View>
            </View>
          </View>
          <View
            style={[
              styles.bordervertical,
              {
                backgroundColor: '#FFFFFF',
                paddingVertical: 20,
                paddingHorizontal: 25,
              },
            ]}>
            <CustomText style={styles.titleStyle} type="h">
              {t('myfarms')}
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
      )}
    </>
  );
};

export default Farmer_dashboard;

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
    textAlign: 'center',
  },
  headingbook: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '400',
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
  greybutton: {
    backgroundColor: '#028454',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  viewalltext: {
    color: '#028454',
    fontWeight: '600',
    marginRight: 5,
  },
  bordervertical: {
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#CBCBCB',
  },
  booknow: {
    color: '#FFFFFF',
  },
  spacebtw_box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
