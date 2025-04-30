// MyOrderCard.js

import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import {useTranslation} from 'react-i18next';
import CustomText from '../../reusable/CustomText';
const MyOrderCard = ({
  title,
  deliveredDate,
  expectedDeliveryDate,
  imgUrl,
  returnDate,
  navigation,
  onShare,
  orderData_Id,
}) => {
  const {t} = useTranslation();
  return (
    <View style={styles.mainContainer}>
      <Image
        source={{uri: imgUrl}}
        resizeMode="contain"
        style={{height: 96, width: 77, borderRadius: 6}}
      />
      <View style={styles.productDetails}>
        <View style={{width: '75%'}}>
          <CustomText numberOfLines={2} style={styles.title} type='label'>
            {title}
          </CustomText>
        </View>

        {deliveredDate ? (
          <CustomText style={styles.deliveredDate} type='sh'>
            {t('deliveredOn')} {deliveredDate}
          </CustomText>
        ) : null}
        {returnDate ? (
          <CustomText style={styles.deliveredDate} type='sh'>
            {t('returnAvailableTill')} {returnDate}
          </CustomText>
        ) : null}
        {expectedDeliveryDate ? (
          <View style={styles.expectedDeliveryDateStyle}>
            <CustomText
            type='sh'
              style={[
                styles.deliveredDate,
                {
                  color: udyamitaTheme.beeAppColor,
                  fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
                },
              ]}>
              {t('deliveryExpected')} {expectedDeliveryDate}
            </CustomText>
          </View>
        ) : null}
      </View>
      <TouchableOpacity
        style={{width: 30, height: 30, marginLeft: -20}}
        onPress={() =>
          navigation.navigate('OrderInfo', {
            orderData_Id,
            imgUrl,
            title,
            deliveredDate,
            expectedDeliveryDate,
            returnDate,
            onShare,
          })
        }>
        <Image
          source={require('../../../assets/images/Caret_right.png')}
          style={{width: 32, height: 32}}
        />
      </TouchableOpacity>
    </View>
  );
};

export default MyOrderCard;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: udyamitaTheme.borderStyleColor,
    marginTop: 5,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: windowWidth,
  },
  productDetails: {
    // width: '55%',
    marginLeft: 20,
  },
  title: {
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    color: udyamitaTheme.textColor,
    fontSize: udyamitaTheme.themeFontSizeLabel,
  },
  deliveredDate: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
    marginTop: 10,
    color: udyamitaTheme.textColor,
  },
  expectedDeliveryDateStyle: {
    width: '100%',
    marginTop: 20,
  },
});
