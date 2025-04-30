import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {udyamitaTheme} from '../config/styles/udyamitaTheme';
import CustomText from './reusable/CustomText';

export default function SubTitle({subTitle}) {


  return (
    <View style={styles.titleBox}>
      <CustomText style={styles.titleTxt} type='sh'>{subTitle}</CustomText>
    </View>
  );
}

const styles = StyleSheet.create({
  titleBox: {
    minWidth: '100%',
    paddingBottom: 5,
  },
  titleTxt: {
    textAlign: 'center',
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
   
    color: udyamitaTheme.textColor,
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    marginBottom:16,
    marginTop:-6
  },
});
