import {StyleSheet, Text, View, TouchableOpacity, Image,Dimensions} from 'react-native';
import React from 'react';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import {AirbnbRating} from 'react-native-ratings';
import axios from 'axios';
import {useTranslation} from 'react-i18next';
import {APP_API_CATALOG_SERVICES, APP_API_ORDER_SERVICES} from '@env';

import Toast from 'react-native-simple-toast';
import {getValueByKey, getToken} from '../../../helpers/UserData';
import CustomText from '../../reusable/CustomText';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const ProductCard = ({
  item,
  navigation,
  productDetails,
  products,
  setAddToCart,
}) => {

  const {t} = useTranslation();
  const addToBag = async () => {
    const reqBody = {
      variantId: item?._id,
      unitPrice: item?.sellingPrice,
      quantity: 1,
      productId: item?.productId,
    };

    const token = await getToken();
    const config = {headers: {Authorization: 'Bearer ' + token}};
    await axios
      .post(`${APP_API_ORDER_SERVICES}/bag/add-to-bag`, reqBody, config)
      .then(data => {
        setAddToCart(true);
      })
      .catch(err => {
        console.log('Error in adding to bag :', err);
      });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        navigation.navigate('ProductDetails', {
          item: item,
          productDetails: productDetails,
          products: products,
        })
      }>

        <Image
          style={styles.img}
          source={item?.photoUrl.length > 0 ? {uri: item?.photoUrl[0]} : null}
          resizeMode="contain"
        />
     
      <View style={{flexDirection: 'column',width:'60%'}}>
 
          <CustomText style={[styles.title, {marginBottom: 8}]} type='btn'>{item.name}</CustomText>
      
        {(item?.totalReviewCount === 0) || (item?.totalReviewCount === undefined) ? null : (
          <View style={[styles.priceDetails, {marginBottom: 8}]}>
            <CustomText style={[styles.deliveryDate, {marginRight: 8}]} type='sh'>
              {item?.averageRating}
            </CustomText>

            <AirbnbRating
              count={5}
              reviews={['Terrible', 'Bad', 'OK', 'Good', 'Excellent']}
              defaultRating={item?.averageRating || 0}
              size={11}
              showRating={false}
              starContainerStyle={styles.starContainer}
              halfStar={true}
              starStyle={styles.star}
              isDisabled={true}
            />

            <CustomText style={[styles.deliveryDate, {marginLeft: 8}]} type='sh'>
              ({item?.totalReviewCount} {t('reviews')})
            </CustomText>
          </View>
        )}

        <View style={styles.priceDetails}>
          <CustomText
          type='mlabel'
            style={[
              styles.title,
              {fontSize: udyamitaTheme.themeFontSizeModalLabel},
            ]}>
            ₹{item.sellingPrice}/-{' '}
          </CustomText>
          {item?.sellingPrice === item?.price?.mrp ? null :  <CustomText style={styles.mrp} type='sh'>M.R.P: {item?.price?.mrp}</CustomText>}
         
          {Math.ceil(
              (item?.price?.mrp - item?.sellingPrice) *
                (100 / item?.price?.mrp),
            )===0 ? null :   <CustomText style={styles.offerPrice} type='label'>
            (
            {Math.ceil(
              (item?.price?.mrp - item?.sellingPrice) *
                (100 / item?.price?.mrp),
            )}
            % off)
          </CustomText>}
        
        </View>
        {/* <Text style={[styles.deliveryDate, {marginTop: 8}]}>
          {t('deliveredIn')} {item?.deliveryTime} {t('days')}
        </Text> */}
      </View>
     
      {/* {item?.in_bag === 'no' ? (
        <TouchableOpacity
          style={styles.addToCartBtn}
          onPress={() => addToBag()}>
          <Image
            source={require('../../../assets/images/Mybag.png')}
            style={{width: 15, height: 19}}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[
            styles.addToCartBtn,
            {backgroundColor: udyamitaTheme.primaryColor},
          ]}
          onPress={() =>
            Toast.show(`${t('thisProductAlreadyInTheBag')}`, Toast.SHORT)
          }>
          <Image
            source={require('../../../assets/images/BagIcon2.png')}
            style={{width: 15, height: 19}}
          />
        </TouchableOpacity>
      )} */}
    </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopColor: udyamitaTheme.borderStyleColor,
    borderBottomColor: udyamitaTheme.borderStyleColor,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
   padding:10,
    flexDirection: 'row',
    justifyContent:'space-between',
    width:windowWidth,
    marginBottom: 10,
    //flexWrap:'wrap'
  
  },
  title: {
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    fontSize: udyamitaTheme.themeFontSizeButton,
    color: udyamitaTheme.textColor,
    //marginRight: 10,
    //marginBottom:8
  },
  img: {
    resizeMode: 'contain',
    height: 100,
    width: 100,
    marginRight:8
  },
  imgContainer: {
    //width: '35%',
    //backgroundColor:'#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    // width:100,
    // height:100
  },
  priceDetails: {
    flexDirection: 'row',
    //justifyContent: 'space-between',
    //justifyContent:'center',
    alignItems: 'center',
    alignContent: 'center',
    // marginBottom:8
  },
  mrp: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    opacity: 0.4,
    color: '#000000',
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
    marginRight: 10,
    textDecorationLine: 'line-through',
  },
  offerPrice: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    color: udyamitaTheme.primaryColor,
    fontSize:udyamitaTheme.themeFontSizeLabel
  },
  deliveryDate: {
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
    color: '#000000',
  },
  addToCartBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: udyamitaTheme.borderStyleColor,
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginTop: 10,
    alignSelf: 'flex-start',
  },
});
