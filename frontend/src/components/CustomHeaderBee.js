import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {BackIcon} from './IconSvgs';
import CustomTitle from './CustomTitle';
import ProgressSteps from './ProgressSteps';
import {useTranslation} from 'react-i18next';
import {udyamitaTheme} from '../config/styles/udyamitaTheme';
import {useSelector} from 'react-redux';
import CustomText from './reusable/CustomText';

const CustomHeaderBee = ({navigation, title, stepNo, setCurrPg,handleBack}) => {
  const {t} = useTranslation();
  const [renderSaved, setRenderSaved] = useState('');
  const [renderSaved2, setRenderSaved2] = useState('');
  const lastSaved = useSelector(state => state.bee.lastSaved);
  useEffect(() => {
    const temp = new Date(lastSaved)
      .toLocaleString(undefined, {
        timeZone: 'Asia/Kolkata',
        hour12: true,  // Specify that you want the time in 12-hour format
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      })
      .split(', ');
  
    setRenderSaved(temp[0]);
    setRenderSaved2(temp[1]?.toUpperCase()||'');
  }, [lastSaved]);
  
  return (
    <View style={{elevation: 10, backgroundColor: '#fff',borderBottomLeftRadius:40,borderBottomRightRadius:40,marginBottom:10}}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => handleBack()}>
        <BackIcon />
        <CustomText style={styles.titleStyle} type='mlabel'>{title}</CustomText>
        {/* <View style={{position: 'absolute', right: 10, alignItems: 'flex-end'}}> */}
          {/* <CustomText
            style={{
              fontFamily: udyamitaTheme.mainThemeFontFamily,
              fontSize: udyamitaTheme.themeFontSizeSmall,
              color:udyamitaTheme.textColor
            }} type='sm'>
            {t('autosavedAt')} 
          </CustomText> */}
          {/* <CustomText
            style={{
              fontFamily: udyamitaTheme.mainThemeFontFamily,
              fontSize: udyamitaTheme.themeFontSizeSmall,
              color:udyamitaTheme.textColor
            }}  type='sm' >
           {renderSaved}, {renderSaved2}
          </CustomText> */}
        {/* </View> */}
      </TouchableOpacity>
      <ProgressSteps stepNo={stepNo} />
      <CustomTitle
        title={
          stepNo === 1
            ? t('myApiary')
            : stepNo === 2
            ? t('myHives')
            : t('myBees')
        }
      />
    </View>
  );
};

export default CustomHeaderBee;

const styles = StyleSheet.create({
  header: {
    paddingVertical: 20,
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleStyle: {
    flex: 1,
    flexWrap: 'wrap',
    fontSize: udyamitaTheme.themeFontSizeModalLabel,
    marginLeft: 20,
    maxWidth: 180,
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    color:udyamitaTheme.textColor
  },
});
