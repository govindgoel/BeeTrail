import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import React from 'react';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import { useTranslation } from 'react-i18next';
import CustomText from '../../reusable/CustomText';
const windowWidth = Dimensions.get('window').width;

const OrderedProductCard = ({onOpen}) => {
  const {t} = useTranslation();
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

  const text = 'Hi-tech Natural Products(India)ltd. Rubber Bee Keeping Gloves';
  const maxLength = 4;

  return (
    <View style={styles.mainContainer}>
      <Image
        source={require('../../../assets/images/dummyImgorder.png')}
        resizeMode="contain"
      />
      <View style={styles.secondSection}>
        <View style={{width: '88%'}}>
        
          <TruncateText text={text} maxLength={maxLength} />
        </View>

        <TouchableOpacity style={styles.reviewNowBtn}>
          <CustomText style={styles.reviewNowText} type='label'>{t('reviewNow')}</CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OrderedProductCard;

const styles = StyleSheet.create({
  mainContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    //flex: 1 // Use flex: 1 to take up available space
    borderBottomWidth:1,
    borderBottomColor:udyamitaTheme.borderStyleColor
  },
  reviewNowBtn: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    width: '88%',
    borderRadius: 6,
    marginTop: 20,
  },
  secondSection: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  title: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color: udyamitaTheme.textColor,
    fontSize:udyamitaTheme.themeFontSizeLabel
  },
  reviewNowText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    color: udyamitaTheme.primaryColor,
    fontSize: udyamitaTheme.themeFontSizeLabel,
  },
});
