import React, {useRef, useState} from 'react';
import {
  Image,
  ScrollView,
  TextInput,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CustomText from './reusable/CustomText';
import {udyamitaTheme} from '../config/styles/udyamitaTheme';
import Toast from 'react-native-simple-toast';
import { useTranslation } from 'react-i18next';

export const Inputlabel = ({
  fields,
  setfields,
  label,
  activeref,
  erroralert,
  focus,
  blur,
  errormessage,
  placeholder,
  currTheme,
  useNumberPad
}) => {
  const {t, i18n} = useTranslation();




  return (
    <View>
      <View
        style={[
          styles.flexrow,
          {gap: 8, marginLeft: 5, marginTop: 14, marginBottom: 6},
        ]}>
        {fields && (
          <View
            style={{
              backgroundColor: '#028454',
              paddingHorizontal: 2,
              alignSelf: 'end',
              paddingVertical: 3.5,
              borderRadius: 500,
              marginTop: 10,
            }}>
            <Image
              style={{alignSelf: 'center', width: 9.17, height: 6.76}}
              source={require('../assets/images/white_tick.png')}
            />
          </View>
        )}

        <CustomText
          style={[fields ? styles.correctlabel : styles.label]}
          type="label">
          {label}
        </CustomText>
      </View>
      <View style={{flexDirection: 'column'}}>
        <View
          style={styles.textInputWrap({
            greenborder: activeref,
            redborder: erroralert,
          })}>
          <TextInput
             {...(useNumberPad && { keyboardType: 'number-pad' })}
            placeholder={placeholder}
            placeholderTextColor={udyamitaTheme.textColor}
            placeholderStyle={styles.placeholderStyle(currTheme)}
            style={styles.textInputStyle(currTheme)}
            value={fields}
            onChangeText={e => {
              if(useNumberPad ){
                if(!isNaN(e)){
                  setfields(e);
                }
                else{
                  Toast.show(t('pleaseEnterNumbers'), Toast.SHORT);
                }
              }
              else{
              setfields(e);
              }
             }}
            onFocus={e => {
              focus();
            }}
            onBlur={e => {
              blur();
            }}
          />
        </View>
        {erroralert && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingLeft: 5,
              marginTop: 5,
            }}>
            <Image
              style={{width: 12.86, height: 13}}
              source={require('../assets/images/error_alert.png')}
            />
            <Text style={styles.erroralert}>{errormessage}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flexrow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexcol: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  textcenter: {
    textAlign: 'center',
  },
  verticalmargin_20: {
    marginVertical: 20,
  },
  verticalmargin_15: {
    marginVertical: 15,
  },
  horizontalmargin_30: {
    marginHorizontal: 30,
  },
  heading: {
    fontSize: 25,
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '600',
    color: udyamitaTheme.textColor,
  },
  textInputStyle: props => ({
    //height: 50,
    fontSize: props?.themeFontSizeLabel,
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    paddingLeft: 10,
    alignSelf: 'center',
    // letterSpacing: 1.5,
    width: '100%',
    backgroundColor: 'white',
    paddingLeft: 20,
    textTransform: 'capitalize',
    color: 'rgba(38, 38, 38)',
  }),
  placeholderStyle: props => ({
    fontFamily: udyamitaTheme.mainThemeFontFamily,
  }),
  textInputWrap: props => ({
    // height: 50,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: props.greenborder
      ? '#028454'
      : props?.redborder
      ? '#FF0000'
      : udyamitaTheme.borderStyleColor,
    flexDirection: 'row',
    marginTop: 10,
    backgroundColor: '#fff',
  }),
  erroralert: {
    color: '#FF0000',
    fontSize: 12,
    fontWeight: '400',
    marginLeft: 8,
  },
  label: {
    color: udyamitaTheme.textColor,
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    marginTop: 10,
  },
  correctlabel: {
    color: '#028454',
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    marginTop: 10,
  },
  genderCard: {
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 10,
    borderWidth: 0.5,
    borderColor: udyamitaTheme.borderStyleColor,
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
    backgroundColor: '#fff',
  },
  genderImage: {
    width: 64,
    height: 64,
    resizeMode: 'contain',
  },
  greenborder: {
    borderColor: '#028454',
  },
  genderLabel: {
    color: udyamitaTheme.textColor,
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    paddingTop: 8,
  },
});
