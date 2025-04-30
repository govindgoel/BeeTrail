import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import CustomHeader from '../../components/reusable/generic/CustomHeader';
import {useTranslation} from 'react-i18next';
import CustomText from '../../components/reusable/CustomText';
import {udyamitaTheme} from '../../config/styles/udyamitaTheme';
import MyMigrationDetailsCard from '../../components/apiary-migration/partials/MyMigrationDetailsCard';
import PastMigrationDetailsCard from '../../components/apiary-migration/partials/PastMigrationDetailsCard_farmer';
const FarmerPastMigration = ({navigation}) => {
  const [activeTab, setActiveTab] = useState(0);
  const {t} = useTranslation();
  const handleBackPress = () => {
    navigation.goBack();
  };
  const tabs = ['all',t('upcoming'), t('pending'), t('past')];
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
  const renderFarmCard = ({item}) => (
    <MyMigrationDetailsCard farm={item} navigation={navigation} />
  );
  const renderPastMigration = ({item}) => (
    <PastMigrationDetailsCard farm={item} navigation={navigation} />
  );
  return (
    <View style={styles.mainContainer}>
      <CustomHeader
        showBackIcon={true}
        onBackPress={handleBackPress}
        title={t('myMigrations')}
      />
      <View style={styles.tabContainer}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tabItem, activeTab === index && styles.activeTab]}
            onPress={() => setActiveTab(index)}>
            <CustomText
              style={[
                styles.tabText,
                activeTab === index && styles.activeTabText,
              ]} type='sh'>
              {tab}
            </CustomText>
          </TouchableOpacity>
        ))}
      </View>
      {activeTab === 0 && (
        <FlatList
          data={farmData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderFarmCard}
          style={{paddingHorizontal:20,backgroundColor:'#FFFFFF'}}
        />
      )}
      {activeTab === 1 && (
        <View style={styles.pastMigrationContainer}>
        <CustomText style={styles.title} type='btn'>{t('upcoming')}</CustomText>
        <FlatList
          data={farmData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderFarmCard}
          style={{paddingHorizontal:20,backgroundColor:'#FFFFFF'}}

        />
        </View>
      )}
      {activeTab === 2 && (
        <View style={styles.pastMigrationContainer}>
        <CustomText style={styles.title} type='btn'>{t('pending')}</CustomText>
        <FlatList
          data={farmData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderFarmCard}
          style={{paddingHorizontal:20,backgroundColor:'#FFFFFF'}}

        />
        </View>
      )}
      {activeTab === 3 && <View style={styles.pastMigrationContainer}>
        <CustomText style={styles.title} type='btn'>{t('pastMigrations')}</CustomText>
        <FlatList
          data={farmData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderPastMigration}
          style={{paddingHorizontal:20,backgroundColor:'#FFFFFF'}}

        />
        </View>}
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
    // marginBottom: 10,
    height: 50,
  },
  tabItem: {
    //paddingVertical: 10,
    paddingHorizontal: 10,
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
    padding:20,
    paddingHorizontal:0
  },
  title:{
    fontFamily:udyamitaTheme.mainThemeFontFamilyBold,
    color:udyamitaTheme.textColor,
    fontSize:udyamitaTheme.themeFontSizeButton,
    paddingLeft:20
  }
});
