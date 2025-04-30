import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { udyamitaTheme } from '../../../config/styles/udyamitaTheme';
import { useTranslation } from 'react-i18next';
import CustomText from '../../reusable/CustomText';

const FarmReserveSuccess = ({ navigation }) => {
  const { t } = useTranslation();

  useEffect(() => {
    // Set a timeout to navigate after 5 seconds
    const timeout = setTimeout(() => {
      // Navigate to the FarmListing screen
      navigation.navigate('FarmListing');
    }, 5000);

    // Clear the timeout when the component unmounts
    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <View style={styles.mainContainer}>
      <Image source={require('../../../assets/images/RequestsentGreen.png')} style={styles.imgStyle} />
      <CustomText style={styles.mainTitle} type='mlabel'>{t('requestSent')}</CustomText>
      <CustomText style={styles.subText} type='label'>{t('receiveResponseWithin24Hours')}</CustomText>
    </View>
  );
};

export default FarmReserveSuccess;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: udyamitaTheme.themeBgColor,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 30,
    paddingRight: 30,
  },
  imgStyle: {
    width: 153,
    height: 153,
  },
  mainTitle: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color: udyamitaTheme.beeAppColor,
    fontSize: udyamitaTheme.themeFontSizeModalLabel,
    lineHeight: 24,
    marginBottom: 8,
  },
  subText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    textAlign: 'center',
    color: udyamitaTheme.textColor,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    lineHeight: 20,
  },
});
