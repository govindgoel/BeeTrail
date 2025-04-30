import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import React, {useState, useRef} from 'react';
import {udyamitaTheme} from '../../config/styles/udyamitaTheme';
import CustomHeader from '../../components/reusable/generic/CustomHeader';
import {useTranslation} from 'react-i18next';
import BottomSheet from 'react-native-raw-bottom-sheet';
import FarmCard from '../../components/apiary-migration/partials/FarmCard';
import FarmFilter from '../../components/apiary-migration/partials/FarmFilter';
import CustomText from '../../components/reusable/CustomText';
import CustomHeaderMigration from '../../components/Customheadermigration';
const windowHeight = Dimensions.get('window').height;
const FarmListing = ({navigation}) => {
  const {t} = useTranslation();
  const handleBackPress = () => {
    navigation.goBack();
  };
  const sortBottomSheetRef = useRef(null);
  const FilterbottomSheetRef = useRef(null);
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
      farmingMethod:'organic'
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
      farmingMethod:'inorganic'
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
      farmingMethod:'organic'
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
      farmingMethod:'inorganic'
    },
  ];
  const renderFarmCard = ({item}) => (
    <FarmCard farm={item} navigation={navigation} />
  );
  const closeBottomSheet = () => {
    FilterbottomSheetRef.current.close();
  };
  const openBottomSheet = () => {
    FilterbottomSheetRef.current.open();
  };
  return (
    <View style={styles.mainContainer}>
      <CustomHeaderMigration
      clock={true}
          title={'Farm Listings'}
          navigation={navigation}
          handleBack={() => {
            navigation.goBack();
          }}
        />
          <View style={styles.footer}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => sortBottomSheetRef.current.open()}>
          <Image
            source={require('../../assets/images/Sort.png')}
            style={styles.iconStyle}
          />
          <CustomText style={styles.btnText} type='btn'>{t('sort')}</CustomText>
        </TouchableOpacity>
        <View style={styles.borderStyle} />
        <TouchableOpacity style={styles.btn} onPress={openBottomSheet}>
          <Image
            source={require('../../assets/images/Filter.png')}
            style={styles.iconStyle}
          />
          <CustomText style={styles.btnText} type='btn'>{t('Filter')}</CustomText>
        </TouchableOpacity>
      </View>
      <FlatList
        data={farmData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderFarmCard}
        contentContainerStyle={{
          paddingHorizontal:20,
          paddingBottom:20
        }}
      />
     
      <BottomSheet
        ref={FilterbottomSheetRef}
        height={windowHeight}
        dragFromTopOnly
        animationType="slide"
        customStyles={{
          container: {
            borderTopRightRadius: 40,
            borderTopLeftRadius: 40,
          },
        }}>
          <FarmFilter  onClose={closeBottomSheet}/>
  
      </BottomSheet>
      <BottomSheet
        ref={sortBottomSheetRef}
        // height={264}
        dragFromTopOnly
        animationType="slide"
        customStyles={{
          container: {
            borderTopRightRadius: 40,
            borderTopLeftRadius: 40,
            //padding: 20,
          },
        }}>
        <>
          <View style={[styles.main,{justifyContent:'space-between'}]}>
            <CustomText style={styles.title} type='mlabel'>{t('sort')}</CustomText>
            <TouchableOpacity
              onPress={() => sortBottomSheetRef.current.close()}>
              <Image
                source={require('../../assets/images/Cross.png')}
                style={{width: 24, height: 24}}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.main}>
            <Image source={require('../../assets/images/FarmSort.png')} style={styles.sortIcons}/>
            <CustomText style={styles.sortText} type='btn'> {t('closestToFarthestFarms')}</CustomText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.main}>
          <Image source={require('../../assets/images/RatingsSort.png')} style={styles.sortIcons}/>
            <CustomText style={styles.sortText} type='btn'>{t('highestToLowestRatings')}</CustomText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.main}>
          <Image source={require('../../assets/images/BloomSort.png')} style={styles.sortIcons}/>
            <CustomText style={styles.sortText} type='btn'>{t('earliestToLatestBlooming')}</CustomText>
          </TouchableOpacity>
        </>
      </BottomSheet>
    </View>
  );
};

export default FarmListing;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: udyamitaTheme.themeBgColor,
    flex: 1,
  },
  footer: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    padding: 10,
    height: 80,
    flexDirection: 'row',
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    flexDirection: 'row',
  },
  borderStyle: {
    borderColor: udyamitaTheme.borderStyleColor,
    borderWidth: 0.5,
  },
  iconStyle: {
    width: 22,
    height: 22,
    marginRight: 10,
  },
  btnText: {
    fontSize: udyamitaTheme.themeFontSizeButton,
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    color: udyamitaTheme.textColor,
  },
  main: {
    flexDirection: 'row',
    //justifyContent: 'space-between',
    borderBottomColor: udyamitaTheme.borderStyleColor,
    borderBottomWidth: 0.5,
    padding: 20,
  },
  sortText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    color: udyamitaTheme.textColor,
    fontSize: udyamitaTheme.themeFontSizeButton,
  },
  title: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color: udyamitaTheme.textColor,
    fontSize: udyamitaTheme.themeFontSizeModalLabel,
  },
  sortIcons:{
    width:24,
    height:22,
    marginRight:14
  }
});
