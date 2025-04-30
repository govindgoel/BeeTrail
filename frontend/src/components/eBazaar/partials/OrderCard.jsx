import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React, {useState, useEffect} from 'react';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import {getToken} from '../../../helpers/UserData';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import OutOfStockNotificationModal from '../resuable/OutOfStockNotifcationModal';
import {APP_API_ORDER_SERVICES} from '@env';
import { useTranslation } from 'react-i18next';
import CustomText from '../../reusable/CustomText';

const OrderCard = ({cartData, isCounterChange}) => {
const {t} =useTranslation();
  const [quantityCounter, setQuantityCounter] = useState(cartData?.newQuantity || cartData?.quantity);
  const [showModal,setShowModal] = useState(false);

  useEffect(() => {
    addToBag();
   
  }, [quantityCounter]);

  const addToBag = async () => {
    const reqBody = {
      variantId: cartData?.variantId,
      unitPrice: cartData?.variant?.sellingPrice,
      quantity: quantityCounter,
      productId: cartData?.variant?.productId,
    };

    const token = await getToken();
    const config = {headers: {Authorization: 'Bearer ' + token}};
    await axios
      .post(`${APP_API_ORDER_SERVICES}/bag/add-to-bag`, reqBody, config)
      .then(data => {
        // todo: disabling bags
        // getBagData();
        isCounterChange(true);
      });
  };
  const handleCancel = () => {
    setShowModal(false)
  };

  const TruncateText = ({text, maxLength}) => {
    if (text.length > maxLength) {
      const truncatedText = text.split(' ').slice(0, 4).join(' ');
      return (
        <CustomText style={styles.title} numberOfLines={2} type='label'>
          {truncatedText}...
        </CustomText>
      );
    } else {
      return (
        <CustomText style={styles.title} numberOfLines={2} type='label'>
          {text}
        </CustomText>
      );
    }
  };
  const text =
    cartData?.variant?.name ||
    'undefined';
  const maxLength = 3;
  return (
    <View style={{  borderTopWidth: 0.5,
      borderBottomWidth: 0.5,
      borderColor: udyamitaTheme.borderStyleColor,
      padding: 20,
      marginBottom: 10,
      // justifyContent: 'space-between',
      // flexDirection: 'row'
      }}>
      { !cartData?.outOfStock ? null : <View style={styles.outOfStockBox}>
       <CustomText style={styles.outOfStockText} type='btn'>{t('outOfStock')}</CustomText> 
      </View>}
    <View style={ !cartData?.outOfStock  ?  styles.mainConatiner : [styles.mainConatiner,{opacity:0.5}]   }>
      <View>
        <Image
          source={{uri: cartData?.variant?.photoUrl[0]}}
          resizeMode="contain"
          style={{width: 100, height: 100}}
        />
      </View>
      <View style={styles.secondSection}>
        <TruncateText text={text} maxLength={maxLength} />
        <View style={styles.row}>
          <CustomText style={styles.price} type='mlabel'>₹{cartData?.unitPrice}</CustomText>
          <CustomText style={styles.offerPrice} type='sh'>
            {' '}
            {Math.ceil(
              (cartData?.variant?.price?.mrp - cartData?.variant?.sellingPrice) *
                (100 / cartData?.variant?.price?.mrp),
            )}
            % off
          </CustomText>
          { !cartData?.outOfStock  ?  
          <CustomText type='sh' style={[styles.offerPrice,
                    {color:udyamitaTheme.beeAppColor}]}>{t('inStock')}</CustomText> :
                    <CustomText type='sh' style={[styles.offerPrice,
                       {color:udyamitaTheme.beeAppColor}]}>{t('outOfStock')}</CustomText>}
         
        </View>

        <CustomText
        type='sh'
          style={[
            styles.offerPrice,
            {color: udyamitaTheme.textColor, 
             marginLeft: 0, marginTop: 10},
          ]}>
          {cartData?.variant?.deliveryFee === 0
            ? 'FREE Delivery by Wednesday, 25 October'
            : 'Delivery by Wednesday, 25 October'}
        </CustomText>

        
        <View style={styles.row}>
          <CustomText
          type='label'
            style={[
              styles.title,
              {fontFamily: udyamitaTheme.mainThemeFontFamilyBold},
            ]}>
            {t('quantity')}
          </CustomText>
          <View style={styles.quantityBox}>
            <TouchableOpacity
              style={[
                styles.firstBox,
                {
                  borderRightWidth: 0.5,
                  borderColor: udyamitaTheme.borderStyleColor,
                  borderTopLeftRadius: 6,
                  borderBottomLeftRadius: 6,
                },
              ]}
              disabled={cartData?.outOfStock}
              onPress={() =>
                !cartData?.outOfStock  ? 
                setQuantityCounter(
                quantityCounter > 0 ? quantityCounter - 1 : null,
                ) :null
              }>
              <Image
                source={
                  quantityCounter === 1
                    ? require('../../../assets/images/Trash.png')
                    : require('../../../assets/images/minus.png')
                }
                style={{width: 11, height: quantityCounter === 1 ? 15 : 1}}
              />
            </TouchableOpacity>
            <View style={[styles.firstBox, {backgroundColor: '#fff'}]}>
              <Text
                style={[
                  styles.offerPrice,
                  {color: udyamitaTheme.textColor, marginLeft: 0},
                ]}>
                {quantityCounter}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.firstBox,
                {
                  borderLeftWidth: 0.5,
                  borderColor: udyamitaTheme.borderStyleColor,
                  borderTopRightRadius: 6,
                  borderBottomRightRadius: 6,
                },
              ]}
              disabled={cartData?.outOfStock}
              onPress={() => 
                !cartData?.outOfStock ? 
                (quantityCounter < cartData?.variant?.purchaseQtyLimit  ? 
                 setQuantityCounter(quantityCounter + 1) : 
                 Toast.show('You exceeding the purchase limit', Toast.SHORT)) :null
              }>
                
              <Image
                source={require('../../../assets/images/PlusIcon.png')}
                style={{width: 11, height: 15}}
              />
            </TouchableOpacity>
          </View>
        </View> 
        
      </View>
      
      
    </View>
   {!cartData?.outOfStock  ? null  : 
       <TouchableOpacity style={styles.notificationBox}  onPress={()=>setShowModal(true)}>
              <View style={styles.notificationBox2}>
                <Image source={require('../../../assets/images/notification_2.png')} style={{height:24,width:24}} />
                  <Text style={styles.notifyText}>{t('notifyMeWhenAvailable')}</Text>
            </View>
      </TouchableOpacity>
       } 
      {showModal ? <OutOfStockNotificationModal 
      visible={showModal} 
      onCancel={handleCancel}/>:null}
    </View>
  );
};

export default OrderCard;

const styles = StyleSheet.create({
  mainConatiner: {
    backgroundColor: '#fff',
    // borderTopWidth: 0.5,
    // borderBottomWidth: 0.5,
    // borderColor: udyamitaTheme.borderStyleColor,
    // padding: 20,
    // marginBottom: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  title: {
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    color: udyamitaTheme.textColor,
    fontSize:udyamitaTheme.themeFontSizeLabel
  },
  secondSection: {
    width: '70%',
    marginLeft: 30,
  },
  row: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
  price: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color: udyamitaTheme.textColor,
    fontSize: udyamitaTheme.themeFontSizeModalLabel,
  },
  offerPrice: {
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    color: udyamitaTheme.primaryColor,
    marginLeft: 10,
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
  },
  quantityBox: {
    borderWidth: 0.5,
    borderColor: udyamitaTheme.borderStyleColor,
    flexDirection: 'row',
    marginLeft: 10,
    height: 36,
    borderRadius: 6,
  },
  firstBox: {
    backgroundColor: '#F1F1F1',
    justifyContent: 'center',
    padding: 10,
    alignItems: 'center',
  },
  outOfStockText:{
    color: "#FFF",
  textAlign: "center",
  justifyContent:"center",
  fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
  fontSize: udyamitaTheme.themeFontSizeButton,
},
outOfStockBox:{
  width:171,
  height:32,
  position:"absolute",
  backgroundColor:"#606060",
  zIndex:1,
},
notificationBox:{
  width: "100%",
  height: 52,
  borderRadius: 6,
  backgroundColor: "rgba(239, 90, 32, 0.1)",
  marginTop:16,
  justifyContent:"center"
},
notifyText:{
  color:udyamitaTheme.primaryColor,
  fontFamily:udyamitaTheme.mainThemeFontFamilyMedium,
  fontSize:udyamitaTheme.themeFontSizeButton,
  textAlign:"center",

},
notificationBox2:{
  display:'flex',
flexDirection:"row",
justifyContent:"center",
// alignItems:"center"
}
});
