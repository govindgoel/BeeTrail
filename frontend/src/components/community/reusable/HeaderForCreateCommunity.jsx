import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';

import { BackIcon } from '../../../assets/Icons/IconSvg';
import ProgressSteps from './ProgressSteps';
import CustomTitle from './CustomTitle';
import { useTranslation } from 'react-i18next';


import { udyamitaTheme } from '../../../config/styles/udyamitaTheme';
import CustomText from '../../reusable/CustomText';
const HeaderForCreateCommunity = ({navigation,title, stepNo,handleBack}) => {

  const {t} = useTranslation();

  return (
    <View style={{elevation: 10, backgroundColor: '#FFF',borderBottomLeftRadius:40,borderBottomRightRadius:40}}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => handleBack()}>
     
        <BackIcon />
        {/* <Text style={styles.titleStyle}>{title}</Text> */}
        <CustomText style={styles.titleStyle} type='mlabel'>
          {title}</CustomText>
      </TouchableOpacity>
      <ProgressSteps stepNo={stepNo} />
      <CustomTitle
        title={
          stepNo === 1
            ? `${t('communitySetUp')}`
            : stepNo === 2
            ? `${t('languagesAndMore')}`
            : `${t('profilePicture')}`
           
        }
      />
      
    </View>
  );
};

export default HeaderForCreateCommunity;
const styles = StyleSheet.create({
  header: {
    paddingVertical: 20,
    paddingLeft: 20,
    flexDirection: 'row',
   
    //alignItems: 'center',
    // borderBottomWidth: 1,
    // borderColor: 'grey',
  },
  titleStyle: {
    fontSize:udyamitaTheme.themeFontSizeModalLabel,
    marginLeft: 20,
   fontFamily:udyamitaTheme.mainThemeFontFamilyBold,
   color:udyamitaTheme.textColor,
   marginTop:-5
  },
});
