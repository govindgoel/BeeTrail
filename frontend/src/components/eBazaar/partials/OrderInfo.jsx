import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Share,
} from 'react-native';
import React, {useState, useEffect} from 'react';

//import Share from 'react-native-share';
import {useTranslation} from 'react-i18next';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import {BackIcon} from '../../../assets/Icons/IconSvg';
const windowWidth = Dimensions.get('window').width;
import {useIsFocused} from '@react-navigation/native';
import {getValueByKey} from '../../../helpers/UserData';
import axios from 'axios';
import {APP_API_ORDER_SERVICES} from '@env';
import CustomText from '../../reusable/CustomText';

const OrderInfo = ({navigation, route}) => {
  const {t} = useTranslation();
  const [bagData, setBagData] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [reviewData, setReviewData] = useState(null);

  const handleBackPress = () => {
    navigation.navigate('MyOrder');
  };

  const isFocused = useIsFocused();

  const share = base64image => {
    let shareOptions = {
      title: '*Must Watch!*',
      message:
        'To view this product, click the link below https://www.letsendorse.com/utm-link',
    };

    Share.open(shareOptions)
      .then(res => {
        if (res.success) {
          console.log(
            '🚀 ~ file: ViewVideo.jsx:194 ~ share ~ res.success:',
            res,
          );
        }
      })
      .catch(err => err && console.log(err));
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        title: 'Share Oder Info',
        message: "Sharing order info",
         // You can provide an image URL or file path
      });

      if (result.action === Share.sharedAction) {
        console.log('Order info successfully');
       
      } else if (result.action === Share.dismissedAction) {
        console.log('Sharing dismissed');
      }
    } catch (error) {
      console.error('Error sharing post:', error.message);
    }
  };

  useEffect(() => {
    // todo: disabling bags
    // getUserBagData();
    getAllProductReview();
  }, [isFocused]);

  const getAllProductReview = async () => {
    const token = await getValueByKey('token');
    const config = {headers: {Authorization: 'Bearer ' + token}};
    await axios
      .get(
        `${APP_API_ORDER_SERVICES}/product/${route?.params?.orderData_Id}`,
        config,
      )
      .then(res => {
        // setGetAllReview(res?.data?.reviews?.slice(0,2));
        setReviewData(res?.data?.reviewsDetails);
      })
      .catch(err => {
        console.log('Error in getting review Data in product details', err);
      });
  };

  const getUserBagData = async () => {
    const token = await getValueByKey('token');
    const config = {headers: {Authorization: 'Bearer ' + token}};
    await axios
      .get(
        `${APP_API_ORDER_SERVICES}/order/details/${route?.params?.orderData?._id}`,
        config,
      )
      .then(res => {
        setBagData(res.data.bagDetails);
        setOrderData(res.data.orderDetails);
      })
      .catch(err => {
        console.log(
          'Error == >> >> error in getting bag data in list products',
          err,
        );
      });
  };

  const expectedDate = route?.params?.expectedDeliveryDate;
  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => handleBackPress()}
          style={{marginRight: 20}}>
          <BackIcon />
        </TouchableOpacity>
        <Image
          source={{uri: route?.params?.imgUrl}}
          resizeMode="contain"
          style={styles.imgStyle}
        />
        <View style={{marginLeft: 20, width: '60%'}}>
          <CustomText style={styles.title} type='label'>{route?.params?.title}</CustomText>
          <TouchableOpacity style={styles.shareBtn} onPress={() => onShare()}>
            <Image
              source={require('../../../assets/images/Send_post.png')}
              style={{width: 20, height: 20}}
            />
            <CustomText style={styles.shareBtnText} type='sh'>{t('share')}</CustomText>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView>
        <View style={[styles.card, {padding: 0}]}>
          <CustomText style={[styles.firstText, {paddingLeft: 20, paddingTop: 20}]} type='btn'>
            {route?.params?.deliveredDate
              ? `Delivered on ${route?.params?.deliveredDate}`
              : `Delivery expected on ${route?.params?.expectedDeliveryDate}`}
          </CustomText>
          <CustomText
          type='btn'
            style={[
              styles.firstText,
              {
                color: udyamitaTheme.textColor,
                fontSize: udyamitaTheme.themeFontSizeLabel,
                paddingLeft: 20,
                paddingTop: 10,
              },
            ]}>
            {route?.params?.deliveredDate
              ? `Package was delivered to ${orderData?.deliveryAddress?.name}`
              : `Delivering to ${orderData?.deliveryAddress?.name}`}
          </CustomText>
          <CustomText
          type='label'
            style={[styles.addressText, {paddingLeft: 20, paddingBottom: 10}]}>
        
            {orderData?.deliveryAddress?.deliveryAddress?.address},
            {orderData?.deliveryAddress?.deliveryAddress?.town},
            {orderData?.deliveryAddress?.deliveryAddress?.district},
            {orderData?.deliveryAddress?.deliveryAddress?.pincode},
            {orderData?.deliveryAddress?.deliveryAddress?.state}
          </CustomText>
          {route?.params?.returnDate ? null : (
            <View
              style={[
                styles.row,
                {
                  borderTopWidth: 0.5,
                  borderColor: udyamitaTheme.borderStyleColor,
                },
              ]}>
              {expectedDate ? (
                <CustomText style={styles.addressText} type='label'>{t('trackOrder')}</CustomText>
              ) : (
                <CustomText style={styles.addressText} type='label'>{t('buyItAgain')}</CustomText>
              )}

              <TouchableOpacity>
                <Image
                  source={require('../../../assets/images/Caret_right.png')}
                  style={{width: 32, height: 32}}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
        {route?.params?.returnDate ? (
          <View
            style={[
              styles.card,
              {flexDirection: 'row', justifyContent: 'space-between'},
            ]}>
            <View>
              <CustomText
              type='label'
                style={[
                  styles.firstText,
                  {
                    color: udyamitaTheme.textColor,
                    fontSize: udyamitaTheme.themeFontSizeLabel,
                  },
                ]}>
                {t('returnOrReplaceItem')}
              </CustomText>
              <CustomText style={styles.addressText} type='label'>
                {t('eligibleThrough')} {route?.params?.returnDate}
              </CustomText>
            </View>
            <Image
              source={require('../../../assets/images/Caret_right.png')}
              style={{width: 32, height: 32}}
            />
          </View>
        ) : null}

        {route?.params?.deliveredDate ? (
          reviewData?.isReviewByUser ? (
            <View
              style={[
                styles.card,
                {flexDirection: 'row', justifyContent: 'space-between'},
              ]}>
              <View>
                <CustomText
                type='btn'
                  style={[
                    styles.firstText,
                    {
                      color: udyamitaTheme.textColor,
                      fontSize: udyamitaTheme.themeFontSizeLabel,
                    },
                  ]}>
                  {t('howYourItem')}
                </CustomText>
                <CustomText style={styles.addressText} type='label'>
                  Edit your product review.
                </CustomText>
              </View>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('AddReview', {
                    selectedItem: route?.params?.orderData?.product_variant,
                    userReview: reviewData?.userReviewArr || [],
                  })
                }>
                <Image
                  source={require('../../../assets/images/Caret_right.png')}
                  style={{width: 32, height: 32}}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={[
                styles.card,
                {flexDirection: 'row', justifyContent: 'space-between'},
              ]}>
              <View>
                <CustomText
                type='btn'
                  style={[
                    styles.firstText,
                    {
                      color: udyamitaTheme.textColor,
                      fontSize: udyamitaTheme.themeFontSizeLabel,
                    },
                  ]}>
                  {t('howYourItem')}
                </CustomText>
                <CustomText style={styles.addressText} type='label'>{t('writeReview')}</CustomText>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('AddReview')}>
                <Image
                  source={require('../../../assets/images/Caret_right.png')}
                  style={{width: 32, height: 32}}
                />
              </TouchableOpacity>
            </View>
          )
        ) : null}

        <View style={[styles.card, {padding: 0}]}>
          <CustomText
          type='btn'
            style={[
              styles.firstText,
              {
                color: udyamitaTheme.textColor,
                fontSize: udyamitaTheme.themeFontSizeLabel,
                paddingLeft: 20,
                paddingTop: 20,
              },
            ]}>
            Order info
          </CustomText>
          <View
            style={[
              styles.row,
              {
                borderBottomWidth: 0.5,
                borderColor: udyamitaTheme.borderStyleColor,
              },
            ]}>
            <CustomText style={styles.addressText} type='btn'>View order details</CustomText>
            <TouchableOpacity
              onPress={() => navigation.navigate('OrderDetails', {orderData})}>
              <Image
                source={require('../../../assets/images/Caret_right.png')}
                style={{width: 32, height: 32}}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <CustomText style={styles.addressText} type='btn'>{t('downloadInvoice')}</CustomText>
            <TouchableOpacity>
              <Image
                source={require('../../../assets/images/Caret_right.png')}
                style={{width: 32, height: 32}}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default OrderInfo;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: udyamitaTheme.themeBgColor,
  },
  header: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: windowWidth,
    elevation: 10,
    marginBottom: 20,
  },
  title: {
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    color: udyamitaTheme.textColor,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    lineHeight: 22,
  },
  imgStyle: {
    height: 93,
    width: 74,
    resizeMode: 'contain',
  },
  shareBtn: {
    height: 36,
    backgroundColor: '#F1F1F1',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    marginTop: 10,
    flexDirection: 'row',
    width: 130,
  },
  shareBtnText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    color: udyamitaTheme.textColor,
    // width:'auto'
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
  },
  card: {
    backgroundColor: '#fff',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    padding: 20,
    borderColor: udyamitaTheme.borderStyleColor,
    marginBottom: 10,
  },
  firstText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color: udyamitaTheme.beeAppColor,
    fontSize: udyamitaTheme.themeFontSizeButton,
    marginBottom: 5,
  },
  addressText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    color: udyamitaTheme.textColor,
    lineHeight: 24,
    fontSize:udyamitaTheme.themeFontSizeLabel
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginTop:20,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
    paddingBottom: 10,
    paddingTop: 10,
  },
});
