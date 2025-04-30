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
const  PastmigrationCard_Farmer = ({booking, farm}) => {
  console.log(farm);
  const {t} = useTranslation();
  function generateCropString(crops) {
    return crops.map(crop => `${crop.name}`).join(', ');
  }
  function getMonthDate(dates) {
    const date = new Date(dates);
    const options = {month: 'long', day: 'numeric'};
    return date.toLocaleDateString('en-US', options);
  }

   return (
    <View>
      <View
        style={[
          styles.row,
          {borderWidth: 1, borderRadius: 5, padding: 15, marginRight: 20},
        ]}>
        <View style={{flexDirection: 'row'}}>
          <View style={{}}>
            <CustomText
              style={styles.farmName}
              ellipsizeMode="tail"
              type="label">
              {booking?.farm_id?.name}
            </CustomText>
            <View style={[styles.flexrow, styles.align_center, {marginTop: 1}]}>
              <Image
                source={require('../../../assets/images/grey_mappointer.png')}
                style={{width: 8.26, height: 10.14}}
              />

              <Text style={{fontWeight: '400', fontSize: 9, marginLeft: 3}}>
              {booking?.farm_id?.addressLine}
              </Text>
            </View>
            <CustomText
              style={[styles.smallText, {marginVertical: 5}]}
              type="sh">
              {t('arrivingDate')} : {getMonthDate( farm?.pollination_window_start)}
            </CustomText>
            <CustomText style={styles.smallText} type="sh">
              {t('beeBoxes')}: {farm?.bee_box_count}
            </CustomText>
            {/* <View style={[styles.statuspastmigration,{backgroundColor:'#95ED95',marginTop:5}]}> */}
            {/* <Text style={[styles.statuspastmigration,
                {
                  backgroundColor: booking?.status=='upcoming'
                    ? '#95ED95'
                    : booking?.status=='pending'
                    ? '#F5F56D'
                    : '#CBCBCB',
                  marginTop: 10,
                  fontWeight: '400',
                  alignSelf: 'flex-start', 
                  
                },]}><CustomText
              style={[
                styles.statuspastmigration,
                {
                  backgroundColor: booking?.status=='upcoming'
                    ? '#95ED95'
                    : booking?.status=='pending'
                    ? '#F5F56D'
                    : '#CBCBCB',
                  marginTop: 5,
                  fontWeight: '400',
                  alignSelf: 'flex-start', 
                  
                },
              ]}>
              {booking?.status=='upcoming'
                ? 'Upcoming'
                : booking?.status=='pending'
                ? 'Pending'
                : 'completed'}
            </CustomText>
            </Text> */}
            {/* </View> */}
            {/* <TouchableOpacity style={[styles.flexrow, {marginTop: 10}]}>
              <Image
                source={require('../../../assets/images/green_messageicon.png')}
                style={{width: 22.6, height: 22.6}}
              />
              <CustomText style={[styles.startchattext]}>Start Chat</CustomText>
            </TouchableOpacity> */}
          </View>
        </View>
      </View>
    </View>
  );
};

export default  PastmigrationCard_Farmer;

const styles = StyleSheet.create({
  flexcolumn: {
    flexDirection: 'column',
  },
  flexrow: {
    flexDirection: 'row',
  },
  align_center: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    borderBottomWidth: 0.5,
    borderColor: udyamitaTheme.borderStyleColor,
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
  },
  statuspastmigration: {
    borderRadius: 50,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  startchattext: {
    borderBottomWidth: 1.5,
    borderBottomColor:'#028454',
    
    color: '#028454',
    fontWeight: '600',
    marginLeft: 5,
  },
  farmImg: {
    width: 80,
    height: 80,
    borderRadius: 6,
    resizeMode: 'cover',
  },
});
