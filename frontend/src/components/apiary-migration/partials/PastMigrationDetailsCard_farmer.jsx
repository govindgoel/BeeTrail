import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import {
  ChevronUp,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
} from 'react-native-feather';
import CustomText from '../../reusable/CustomText';
const PastMigrationDetailsCard_Farmer = ({farm,navigation}) => {
  const {t} = useTranslation();
  return (
    <View style={styles.mainContainer}>
    <View style={styles.row}>
      <View style={{flexDirection: 'row'}}>
        <Image source={{uri: farm?.photoUrls[0]}} style={styles.farmImg} />
        <View style={{marginLeft: 15}}>
          <CustomText style={styles.farmName} ellipsizeMode="tail" type='label'>
            {farm?.farmName}
          </CustomText>
          <View style={{flexDirection:'row',gap:5}}>
          <CustomText style={[styles.smallText, {marginTop:5}]} type='sh'>
            {t('arrivalDate')} :
          </CustomText>
          <CustomText style={[styles.smallText2, {marginTop:5,fontWeight:'600'}]} type='sh'>
           9 December, 2023
          </CustomText>

          </View>
           
          <CustomText style={[styles.smallText,{ fontWeight:'600'}]} type='sh'>30 {t('beeBoxes')}</CustomText>
        </View>
      </View>

      <TouchableOpacity style={{alignItems:'center',justifyContent:'center'}}>
        <ChevronRight
          height={20}
          width={20}
          color={udyamitaTheme.beeAppColor}
        />
      </TouchableOpacity>
    </View>
    {/* <View style={styles.row}>
      <TouchableOpacity style={styles.rescheduleBtn}>
        <CustomText style={styles.btnText} type='label'>{t('reschedule')}</CustomText>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.rescheduleBtn, {backgroundColor: '#E6F3EE'}]}>
        <CustomText style={[styles.btnText, {color: udyamitaTheme.beeAppColor}]} type='label'>
          {t('messageHost')}
        </CustomText>
      </TouchableOpacity>
    </View> */}
  </View>
);
};

export default PastMigrationDetailsCard_Farmer;

const styles = StyleSheet.create({
mainContainer: {
  borderBottomWidth: 0.5,
  borderColor: udyamitaTheme.borderStyleColor,
  paddingVertical:15,
  backgroundColor: '#fff',

},
farmImg: {
  width: 80,
  height: 80,
  borderRadius: 6,
  resizeMode: 'cover',
},
row: {
  flexDirection: 'row',
  justifyContent: 'space-between',
},
farmName: {
  fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
  fontSize: udyamitaTheme.themeFontSizeLabel,
  color: udyamitaTheme.textColor,
},
smallText: {
  fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
  fontSize: udyamitaTheme.themeFontSizeSmallHeader,
  color: udyamitaTheme.textColor,
  marginTop:5
},
smallText2: {
  fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
  fontSize: udyamitaTheme.themeFontSizeSmallHeader,
  color: udyamitaTheme.textColor,
  marginTop:5,
  fontWeight:'600'
},
rescheduleBtn: {
  backgroundColor: '#F1F1F1',
  justifyContent: 'center',
  alignItems: 'center',
  paddingLeft: 20,
  paddingRight: 20,
  borderRadius: 6,
  marginTop: 20,
  height: 32,
  width: 150,
},
btnText: {
  fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
  color: udyamitaTheme.textColor,
  fontSize:udyamitaTheme.themeFontSizeLabel
},
});
