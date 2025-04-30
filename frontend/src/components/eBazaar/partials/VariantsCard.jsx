import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react'; 
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import { useTranslation } from 'react-i18next';
import CustomText from '../../reusable/CustomText';
const VariantsCard = ({item,  selectProduct, selectedItemId}) => {
  const selectedItem = item?.item;
const {t} = useTranslation();
  return (
    <TouchableOpacity
      style={[
        styles.mainContainer,
        {
          borderWidth: selectedItemId===selectedItem?._id ? 2 : 0.5,
          borderColor: selectedItemId===selectedItem?._id
            ? udyamitaTheme.primaryColor
            : udyamitaTheme.borderStyleColor,
            backgroundColor:selectedItemId===selectedItem?._id ? "rgba(255, 0, 0, 0.1)":'#fff',
            opacity: selectedItem?.outOfStock === 'yes' ? 0.9 : 1,
        },
      ]}
      disabled={selectedItem?.outOfStock === 'yes'}
      onPress={selectProduct}>
      <Image
        source={{uri: selectedItem?.photoUrl[0]}}
        style={styles.imageStyle}
        resizeMode="contain"
      />
      <CustomText style={styles.title} type='label'>
        {selectedItem?.name && selectedItem.name.length > 5
          ? selectedItem.name.slice(0, 38) + '...'
          : selectedItem.name}
      </CustomText>

      <CustomText
      type='label'
        style={[
          styles.title,
          {fontFamily: udyamitaTheme.mainThemeFontFamilyBold},
        ]}>
        ₹{selectedItem?.sellingPrice}
      </CustomText>
      {selectedItem?.outOfStock === 'No' ? (
        <CustomText style={styles.inStock} type='ml'>{t('inStock')}</CustomText>
      ) : (
        <CustomText style={[styles.inStock,{color:'red'}]} type='ml'>{t('outOfStock')}</CustomText>
      )}
    </TouchableOpacity>
  );
};

export default VariantsCard;

const styles = StyleSheet.create({
  mainContainer: {
    borderWidth: 0.5,
    borderColor: udyamitaTheme.borderStyleColor,
    padding: 10,
    marginRight: 10,
    borderRadius: 6,
    width: 120,
    marginBottom:16
  },
  imageStyle: {
    height: 80,
    width: 70,
    alignSelf: 'center',
  },
  inStock: {
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    color: udyamitaTheme.beeAppColor,
    fontSize: udyamitaTheme.themeFontSizeCardMiniLabel,
  },
  title: {
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    color: udyamitaTheme.textColor,
    fontSize: udyamitaTheme.themeFontSizeLabel,
  },
});
