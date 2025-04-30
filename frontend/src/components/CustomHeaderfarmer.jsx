import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {BackIcon} from './IconSvgs';
import CustomTitle from './CustomTitle';
import ProgressSteps from './ProgressSteps';
import {useTranslation} from 'react-i18next';
import {udyamitaTheme} from '../config/styles/udyamitaTheme';
// import {useSelector} from 'react-redux';
import CustomText from './reusable/CustomText';
import ProgressSteps2 from './Progresssteps2';

const CustomHeaderfarmer = ({navigation, title, stepNo, setCurrPg,handleBack}) => {
  const {t} = useTranslation();
  const [renderSaved, setRenderSaved] = useState('');
  const [renderSaved2, setRenderSaved2] = useState('');
  const [flag, setflag] = useState(false)

  useEffect(() => {
    setflag(!flag)
  }, [stepNo])
  
  const lastSaved = new Date()
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
    setRenderSaved2(temp[1].toUpperCase());
  }, [lastSaved]);
  
  return (
    <View style={{elevation: 10, backgroundColor: '#fff',borderBottomLeftRadius:40,borderBottomRightRadius:40,marginBottom:10}}>
      {console.log(stepNo)}
      <TouchableOpacity
        style={styles.header}
        onPress={() => handleBack()}>
        <BackIcon />
         <View style={{flexDirection:'column' , marginLeft:15,}}>
         <CustomText style={styles.titleStyle} type='bh'>{title}</CustomText>
        {/* <View style={{flexDirection:'row',alignItems:'center'}}>
          <CustomText
            style={{
              fontFamily: udyamitaTheme.mainThemeFontFamily,
              fontSize: udyamitaTheme.themeFontSizeSmall,
              color:udyamitaTheme.textColor
            }} type='sm'>
            {t('autosavedAt')+' '} 
          </CustomText>
          <CustomText
            style={{
              fontFamily: udyamitaTheme.mainThemeFontFamily,
              fontSize: udyamitaTheme.themeFontSizeSmall,
              color:udyamitaTheme.textColor
            }}  type='sm' >
           {renderSaved2}, {renderSaved}
          </CustomText>
        </View> */}
         </View>
      </TouchableOpacity>
      <ProgressSteps2 stepNo={stepNo} />
      <CustomTitle
        title={
          stepNo === 1
            ?'Farm Details'
            : stepNo === 2
            ? 'Crop Specifics'
            : 'Add Photos'
        }
      />
    </View>
  );
};

export default CustomHeaderfarmer;

const styles = StyleSheet.create({
  header: {
    paddingTop: 20,
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleStyle: {
     
    fontWeight:'600',
     
    fontSize: udyamitaTheme.themeFontSizeModalLabel,
    
    maxWidth: 180,
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    color:udyamitaTheme.textColor
  },
});
