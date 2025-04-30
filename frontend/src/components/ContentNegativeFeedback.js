import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {PrimaryMargin} from './reusable/UIComponentsUdyamApp';
import {defaultStyles} from '../config/styles/defaultStyles';
import {udyamitaTheme} from '../config/styles/udyamitaTheme';
import {useTranslation} from 'react-i18next';
import CustomText from './reusable/CustomText';

export default function ContentNegativeFeedback({navigation}) {
  const {t} = useTranslation();
  return (
    <>
      <CustomText style={styles.helpTxt} type="label">
        {t('incovenienceCaused')}
      </CustomText>
      <PrimaryMargin mt={17} />
      <View
        style={[
          defaultStyles.flexRow,
          {justifyContent: 'space-evenly', minWidth: '50%'},
        ]}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('TopicsScreen');
          }}
          style={{alignItems: 'center'}}>
          <Image source={require('../assets/images/yes2.png')} />
          <CustomText style={styles.yTxt} type="sh">{t('yes')}</CustomText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}} style={{alignItems: 'center'}}>
          <Image source={require('../assets/images/no2.png')} />
          <CustomText style={styles.yTxt} type="sh">{t('no')}</CustomText>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  helpTxt: {
    color: udyamitaTheme.textColor,
    fontFamily: udyamitaTheme?.mainThemeFontFamilySemiBold,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    marginHorizontal: 12,
    fontStyle: 'normal',
    textAlign: "center"
  },
  yTxt: {
    color: udyamitaTheme.textColor,
    fontFamily: udyamitaTheme?.mainThemeFontFamily,
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
    fontStyle: 'normal',
    fontWeight: '400',
  },
});
