import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import CustomText from '../CustomText';
const NoContentFound = ({resetToRecommended}) => {
  const {t}=useTranslation();
  return (
    <View style={{
      //flex: 1,
      backgroundColor: udyamitaTheme.themeBgColor,
    }}>
      <View style={styles.container}>
        <Image
          source={require('../../../assets/images/NoContent.png')}
          style={{height: 120, width: 120}}
        />
        <CustomText style={styles.boldText} type='mlabel'>{t('noContentFound')}</CustomText>
        <CustomText style={styles.text}>
          {t('thisAreaIsContentFreeAtTheMoment')}
        </CustomText>
        <TouchableOpacity
          onPress={resetToRecommended}
          style={styles.arrowButtonStyle}>
          <CustomText style={styles.arrowButtonLabel} type='btn'>{t('viewAllVideos')}</CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NoContentFound;
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    //marginTop: 160,
    
  },
  boldText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color: udyamitaTheme.primaryColor,
    marginTop: 20,
    marginBottom: 10,
    fontSize: udyamitaTheme.themeFontSizeModalLabel,
  },
  Customtext: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    textAlign: 'center',
    marginLeft: 40,
    marginRight: 40,
    fontSize: udyamitaTheme.themeFontSizeLabel,
  },
  arrowButtonStyle: {
    borderColor: udyamitaTheme.primaryColor,
    borderWidth: 1.2,
    width: '90%',
    height: 52,
    borderRadius: 5,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    //position: 'absolute',
    //bottom: 0,
    //marginBottom: 10,
    flexDirection: 'row',
    marginTop: 20,
    backgroundColor: 'white',
  },
  arrowButtonLabel: {
    color: udyamitaTheme.primaryColor,
    fontSize: udyamitaTheme.themeFontSizeButton,
    alignSelf: 'center',
    marginLeft: 10,
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
  },
});
