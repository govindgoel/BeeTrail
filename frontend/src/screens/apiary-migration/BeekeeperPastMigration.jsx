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
import { BackIcon } from '../../components/IconSvgs';


const BeekeeperPastMigration = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [user, setuser] = useState(false)
  const [boxcount, setboxcount] = useState({
    total: 50,
    current: 0,
  });
  const [bookingData, setbookingData] = useState([])
  const [farms, setfarms] = useState([])
  const onBackPress = () => {
    navigation.goBack();
    return true;
  };
  useFocusEffect(
    React.useCallback(() => {
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
        let url=`${APP_API_USER_URL_SECOND}farmer/farms/${id}`
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
      <ScrollView style={{height: '100%', backgroundColor: '#FFFFFF'}}>
      <View style={styles.header}>
        <TouchableOpacity style={[styles.row,{gap:10}]} onPress={onBackPress}>
          <BackIcon />
          <Text style={styles.heading} type='mlabel'>{t('myMigrations')}</Text>
        </TouchableOpacity>
      </View>

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
            </View>
            <View style={{marginBottom:10}}>
            {bookingData?.length==0 ?
              <View style={{
                width:'95%',
                marginTop:20,
                height:130,
                backgroundColor:'#F5F5F5',
                borderRadius:8,
                alignSelf:'center',
                justifyContent:'center',
                
              }}>
                  <Text style={{
                     color: '#028454',
                     fontWeight: '600',
                     textAlign:'center'
                  }}>{t('noContentFound')}</Text>
              </View>
            :<FlatList
              data={bookingData}
              renderItem={renderPastMigration}
              keyExtractor={item => item.id}
              horizontal={false}
              showsHorizontalScrollIndicator={false}
            />}
            </View>
          </View>

          
        </View>
      
          </ScrollView>
        
    </>
  );
};

export default BeekeeperPastMigration;

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
  heading: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    fontSize: udyamitaTheme.themeFontSizeModalLabel,
    color: udyamitaTheme.textColor,
    // marginLeft: 20,
  },
  booknow: {
    color: '#FFFFFF',
  },
  spacebtw_box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingTop: 30,
    paddingBottom: 20,
    paddingLeft: 30,
    paddingRight: 30,
    elevation: 10,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  headingbook: {
    fontSize: 14,
    color: '#262626',
    fontWeight: 400,
  },
});
