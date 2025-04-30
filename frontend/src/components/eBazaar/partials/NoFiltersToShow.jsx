import { StyleSheet, Text, View,Image } from 'react-native'
import React from 'react'
import { udyamitaTheme } from '../../../config/styles/udyamitaTheme'
import { useTranslation } from 'react-i18next'
import CustomText from '../../reusable/CustomText'
const NoFiltersToShow = () => {
  const {t}=useTranslation();
  return (
    <View style={styles.mainContainer}>
        <Image source={require('../../../assets/images/Nofilters.png')} style={{width:70,height:81}}/>
      <CustomText style={styles.mainText} type='mlabel'>{t('noFiltersAvailable')}</CustomText>
      <CustomText style={styles.normalText} type='label'>{t('noFilterOptionsArePresent')}</CustomText>
    </View>
  )
}

export default NoFiltersToShow

const styles = StyleSheet.create({
    mainText:{
        fontFamily:udyamitaTheme.mainThemeFontFamilyBold,
        color:udyamitaTheme.primaryColor,
        fontSize:udyamitaTheme.themeFontSizeModalLabel
    },
    mainContainer:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:udyamitaTheme.themeBgColor
    },
    normalText:{
        fontFamily:udyamitaTheme.mainThemeFontFamily,
        color:udyamitaTheme.textColor,
        marginTop:10,
        fontSize:udyamitaTheme.themeFontSizeLabel
    }
})