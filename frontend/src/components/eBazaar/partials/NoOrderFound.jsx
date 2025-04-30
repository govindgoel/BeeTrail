import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import CustomText from '../../reusable/CustomText';
const NoOrderFound = ({navigation}) => {
  const {t}=useTranslation();
  return (
    <View style={{
    //   flex: 1,
      backgroundColor: udyamitaTheme.themeBgColor,
    }}>
      <View style={styles.container}>
        <Image
          source={require('../../../assets/images/NoOrderFound.png')}
          style={{height: 172, width: 148}}
        />
        <CustomText style={styles.boldText} type='mlabel'>{t('noOrdersYet')}</CustomText>
        <CustomText style={styles.text} type='label'>
          {t('looksLikeYouHaventOrderedAnythingYet')}
        </CustomText>
        <TouchableOpacity style={styles.btn} onPress={()=>navigation.navigate('ListCategories')}>
          <CustomText type="btn" style={styles.btnText}>{t('discoverProducts')}</CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NoOrderFound;
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginTop: 160,
    
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
    marginLeft: 20,
    marginRight: 20,
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
  btnText:{
    fontSize:16,
    fontFamily:udyamitaTheme.mainThemeFontFamilySemiBold,
    color:'#fff',
    lineHeight:50
},
btn:{
    backgroundColor:udyamitaTheme.primaryColor,
    width:'90%',
    borderRadius:10,
    justifyContent:'center',
    alignItems:'center',
    height:52,
    marginTop:20
},
});
