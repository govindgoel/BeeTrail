import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import CustomHeader from '../../reusable/generic/CustomHeader';
import { useTranslation } from 'react-i18next';
import CustomText from '../../reusable/CustomText';
const CreateCommunityEndScreen = ({navigation}) => {
  
  const {t} = useTranslation();
  
  const handleBackPress = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.mainContainer}>
      <CustomHeader
        navigation={navigation}
        showBackIcon={true}
        onBackPress={handleBackPress}
      />
      <View style={{marginTop:'60%'}}>
      <CustomText style={styles.firstText}>{t('yourGrouphasBeenCreated')}</CustomText>
      <CustomText style={[styles.firstText,{color:udyamitaTheme.textColor,marginLeft:30,marginRight:30,marginTop:10}]}>
        {t("bringLikeMindedPeopleTogether")}
      </CustomText>
      </View>
    </View>
  );
};

export default CreateCommunityEndScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: udyamitaTheme.themeBgColor,
   
  },
  firstText:{
    fontFamily:udyamitaTheme.mainThemeFontFamilyBold,
    color:udyamitaTheme.primaryColor,
    textAlign:'center'
  }
});
