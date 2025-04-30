import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import CustomText from '../../reusable/CustomText';
import { useNavigation } from '@react-navigation/native';
import { udyamitaTheme } from '../../../config/styles/udyamitaTheme';

const ApiaryLoading = ({route}) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
const {apiaryId,apiaryName,hiveCount,apiaryLocation,userName,apiaryData} =route?.params
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.navigate('BeeDashboard',{apiaryId,apiaryName,hiveCount,apiaryLocation,userName,apiaryData}); 
    },250); 

    return () => clearTimeout(timeout); 
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size={40} color={udyamitaTheme.beeAppColor} />
      <CustomText style={styles.mainText} type="label">{t('preparingYourApiaryForAction')}</CustomText>
    </View>
  );
};

export default ApiaryLoading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:udyamitaTheme.themeBgColor
  },
  mainText:{
    color:udyamitaTheme.textColor,
    fontFamily:udyamitaTheme.mainThemeFontFamilySemiBold,
    marginTop:10
  }
});
