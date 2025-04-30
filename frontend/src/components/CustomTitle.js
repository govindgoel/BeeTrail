import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {udyamitaTheme} from '../config/styles/udyamitaTheme';
import CustomText from './reusable/CustomText';

export default function CustomTitle({title}) {
  return (
    <View style={styles.titleBox}>
      <CustomText style={styles.titleTxt} type='btn'>{title}</CustomText>
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
    fontSize: udyamitaTheme.themeFontSizeButton,
    lineHeight: 24,
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color:udyamitaTheme.textColor
  },
});
