import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React, {useState, useEffect} from 'react';
import {getValueByKey} from '../../../helpers/UserData';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import axios from 'axios';
import {APP_API_CATALOG_SERVICES} from '@env';
import CustomText from '../../reusable/CustomText';
const SubCategoryList = ({navigation, Items, index, setSelectedIndex}) => {
  return (
    <View>
      {/* <TouchableOpacity onPress={() => setSelectedIndex(-1)}> */}
      {/* <TouchableOpacity>
        <Image
          source={require('../../../assets/images/Caretup_orange.png')}
          style={{
            marginTop: -14,
            alignSelf:
              index === 0 ? 'flex-start' : index === 1 ? 'center' : 'flex-end',
          }}
        />
      </TouchableOpacity> */}
      <View style={styles.CategoryContainer}>
        {Items.map((item, index) => (
          <>
            <TouchableOpacity
              style={[{
                flexDirection: 'row',
                padding: 10,
              }, Items.length-1!==index?{
                borderBottomColor: udyamitaTheme.borderStyleColor,
                borderBottomWidth: 0.5,
              }:{}]}
              onPress={() => {
                // getProductBySubcategoryId(subCategories?._id);
                navigation.navigate('ListProducts', {
                  id: item?.id,
                  objId: item?._id,
                  subCatName: item?.name,
                });
              }}>
              <CustomText style={styles.CategoryItem} type='label'>{item?.name}</CustomText>
            </TouchableOpacity>
          </>
        ))}
      </View>
    </View>
  );
};

export default SubCategoryList;

const styles = StyleSheet.create({
  CategoryContainer: {
    borderTopWidth: 2,
    borderTopColor: udyamitaTheme.primaryColor,
   // marginTop: -15,
    marginBottom: 10,
    width: '100%',
    backgroundColor: '#fff',
  },
  CategoryItem: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    color: udyamitaTheme.textColor,
  },
});
