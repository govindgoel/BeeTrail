import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { udyamitaTheme } from '../../../config/styles/udyamitaTheme';
import CustomText from '../../reusable/CustomText';
export default function CustomTitle({title}) {
 
  return (
    <View style={styles.titleBox}>
      <CustomText style={styles.titleTxt} type='btn'>{title}</CustomText>
      {/* <Text style={styles.titleTxt}>{title}</Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  titleBox: {
   // minWidth: '100%',
    paddingBottom: 10
  },
  titleTxt: {
    textAlign: 'center',
    fontSize: udyamitaTheme.themeFontSizeButton,
    fontFamily:udyamitaTheme.mainThemeFontFamilySemiBold,
    color:udyamitaTheme.textColor
  },
});
