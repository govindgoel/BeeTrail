import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  Dimensions,
} from 'react-native';
import React, {useState,useEffect} from 'react';
import Carousel from 'react-native-snap-carousel-v4';
import {useTranslation} from 'react-i18next';
import axios from 'axios';
import { getValueByKey } from '../../../helpers/UserData';
import {APP_API_CATALOG_SERVICES} from '@env'
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import CategoryPlaceholder from '../../reusable/generic/CategoryPlaceholder';
import CustomText from '../../reusable/CustomText';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function MarketplaceCard({navigation}) {
  const {t} = useTranslation();
  const placeHolderARR = [1, 2, 3,4];
  const carouselRef = React.useRef(null);
  const [subcategories,setSubCategories]=useState([])
const [loading,setLoading]=useState(false)
  const getProductCategories = async () => {
    
    const token = await getValueByKey('token');

    const config = {headers: {Authorization: 'Bearer ' + token}};
   setLoading(true);
    await axios
      .get(`${APP_API_CATALOG_SERVICES}/categories`,config)
      .then(response => {
        if (response.status === 200) {
          const reversedCategories = response?.data?.categories.reverse();
    
          setSubCategories(reversedCategories.slice(0,10));
          //setSubCategories(response?.data?.categories.slice(0,10));
         setLoading(false);
          
        }
      })
      .catch(err => {
        console.log(
          'error getting categories --',
          err,
        
        );
      });
  };
  useEffect(() => {
    getProductCategories();
  }, [])


  const [activeImageIndex, setActiveImageIndex] = useState(0);
  // const Data = [
  //   {
  //     images: require('../../../assets/images/Salecarousel.png'),
  //   },
  //   {
  //     images: require('../../../assets/images/Salecard_2.png'),
  //   },
  //   {
  //     images: require('../../../assets/images/Salecard_3.png'),
  //   },
  // ];

  const renderCarouselItem = ({item, index}) => {
    return (
      <View style={{position: 'relative'}}>
        <Image source={item.images} key={index} style={styles.modalImg} />
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingBottom: 10,
          marginTop:16,
          marginBottom:12
        }}>
        <CustomText
        type='btn'
          style={{
            fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
            fontSize: udyamitaTheme.themeFontSizeButton,
            color: udyamitaTheme.textColor,
            paddingLeft: 10,
          }}>
          {t('eBazaar')}
        </CustomText>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("eBazaar",{screen: 'ListCategories'});
          }}
          style={{flexDirection: 'row'}}>
          <CustomText
          type='label'
            style={{
              color: udyamitaTheme.primaryColor,
              fontFamily: udyamitaTheme.mainThemeFontFamily,
              fontSize: udyamitaTheme.themeFontSizeLabel,
              paddingRight: 10,
            }}>
            {t('viewAll')}
          </CustomText>
          <Image
            source={require('../../../assets/images/Caret_right.png')}
            style={{width: 18, height: 20}}
          />
        </TouchableOpacity>
      </View>
      {loading ?  (
     <CategoryPlaceholder/>
      )  :  
      <FlatList
      data={subcategories}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      renderItem={({item, index}) => {
        return (
          <TouchableOpacity
            style={{
              alignItems: 'center',
              flexDirection: 'column',
              width: 100, 
              //marginHorizontal: 5, 
            }}
            onPress={() => {
              navigation.navigate('ListProducts', {
                id: item?.id,
                objId: item?._id,
                subCatName: item?.name,
              });
            }}>
            <Image source={{uri: item.photoUrl}} style={styles.catImg} />
            <View style={{width: '90%'}}>
              <CustomText style={styles.text} type='sh'>{item.name}</CustomText>
            </View>
          </TouchableOpacity>
        );
      }}
    />
    
    }
    
      {/* <View
        style={{justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
        <Carousel
          ref={carouselRef}
          data={Data}
          renderItem={renderCarouselItem}
          sliderWidth={windowWidth}
          itemWidth={312}
          activeSlideAlignment="center"
          firstItem={activeImageIndex}
          onSnapToItem={index => setActiveImageIndex(index)}
        />
        <View style={styles.carouselDotsContainer}>
          {Array.from({length: Data.length || 0}).map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.carouselDot,
                {
                  backgroundColor:
                    index === activeImageIndex
                      ? udyamitaTheme.primaryColor
                      : 'gray',
                  width: index === activeImageIndex ? 10 : 6,
                  borderRadius: index === activeImageIndex ? 6 : 3,
                },
              ]}
              onPress={() => setActiveImageIndex(index)}
            />
          ))}
        </View>
      </View> */}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',

    marginTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,

    paddingBottom: 5,
  },
  carouselDotsContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  carouselDot: {
    height: 6,

    marginHorizontal: 5,
    color: '#000',
  },
  modalImg: {
    width: 312,
    height: 170,
    borderRadius: 15,
  },
  catImg: {
    width: 70,
    height: 70,
    borderRadius: 35,
  resizeMode:'contain'
  },
  text: {
    textAlign: 'center',
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    color:udyamitaTheme.textColor,
 
  },
});
