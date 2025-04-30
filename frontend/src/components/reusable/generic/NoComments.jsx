import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { udyamitaTheme } from '../../../config/styles/udyamitaTheme';
import CustomText from '../CustomText';
const NoComments = () => {
  const {t} = useTranslation();
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/NoComment.png')}
        style={{width: 100, height: 97}}
      />
      <CustomText style={styles.boldText} type='mlabel'>{t('noCommentsYet')}</CustomText>
      <CustomText style={styles.text} type='label'>{t('beTheFirstOneToComment')}</CustomText>
    </View>
  );
};

export default NoComments;
const styles = StyleSheet.create({
  container: {
     justifyContent: 'center',
     alignItems: 'center',
   flex:1,
   //height:90,
   // flex: 1,
    //backgroundColor:'red'
  },
  boldText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color: udyamitaTheme.primaryColor,
    marginTop: 20,
    marginBottom: 10,
    fontSize: udyamitaTheme.themeFontSizeModalLabel,
  },
  text: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    textAlign: 'center',
    marginLeft: 50,
    marginRight: 50,
    color:udyamitaTheme.textColor,
    fontSize: udyamitaTheme.themeFontSizeLabel,
  },
});
