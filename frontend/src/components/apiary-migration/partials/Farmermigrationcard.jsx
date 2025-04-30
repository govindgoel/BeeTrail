import {StyleSheet,Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import {
  ChevronUp,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
} from 'react-native-feather';
import CustomText from '../../reusable/CustomText';
import { useTranslation } from 'react-i18next';
const FarmerMigrationDetailsCard = ({booking,navigation,status}) => {
  const {t} = useTranslation();

  function getMonthDate(dates) {
    const date = new Date(dates);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}
   return (
    <View style={styles.mainContainer}>
      <View style={styles.row}>
        <View style={{flexDirection: 'row'}}>
          <View style={{width:'100%'}}>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',width:'100%',}}>
            <CustomText style={styles.farmName} ellipsizeMode="tail" type='mlabel'>
              {booking?.farm?.name}
            </CustomText>
            {/* <TouchableOpacity style={[styles.flexrow, {marginTop: 10}]}>
              <Image
                source={require('../../../assets/images/green_messageicon.png')}
                style={{width: 22.6, height: 22.6}}
              />
              <CustomText style={[styles.startchattext]}>Start Chat</CustomText>
            </TouchableOpacity> */}
            </View>
            <View style={{flexDirection:'row',gap:5,marginTop:4}}>
            <Image
                source={require('../../../assets/images/grey_mappointer.png')}
                style={{width: 10.26, height: 12.14,marginTop:2}}
              />

              <Text style={{fontWeight: '400', fontSize: 12, marginLeft:1}}>
              {booking?.farm?.fulladdress}
              </Text>

            </View>
             
            <View style={{flexDirection:'row',gap:5}}>
            <CustomText style={[styles.smallText, {marginTop:5}]} type='sh'>
            {t('arrivingDate')} :
            </CustomText>
            <CustomText style={[styles.smallText2, {marginTop:5,fontWeight:'600',color:'#000'}]} type='sh'>
             {getMonthDate(booking?.pollination_window_start)}
            </CustomText>

            </View>
             
            <CustomText style={[styles.smallText,{ fontWeight:'600'}]} type='sh'>{t('beeBoxes')} :  { booking?.bee_box_count }</CustomText>
          </View>
        </View>
      </View>
     {status=='pending'?
       <View style={styles.row}>
       <TouchableOpacity
         style={[styles.rescheduleBtn, {backgroundColor: '#F1F1F1'}]}>
         <Text style={[styles.btnText,  ]} type='label'>
         {t('cancel')}
         </Text>
       </TouchableOpacity>
       <TouchableOpacity
       onPress={e=> navigation.navigate('AcceptRequest', {
        bookingInfo: booking,
      })   }
         style={[styles.rescheduleBtn, {backgroundColor: '#E6F3EE'}]}>
         <Text style={[styles.btnText, {color: udyamitaTheme.beeAppColor}]} type='label'>
         {t('accept')}
         </Text>
       </TouchableOpacity>
 
     </View>:
       <View style={styles.row}>
       <TouchableOpacity
         style={[styles.rescheduleBtn, {backgroundColor: '#E6F3EE'}]}>
         <Text style={[styles.btnText, {color: udyamitaTheme.beeAppColor}]} type='label'>
         Reschedule
         </Text>
       </TouchableOpacity>
       <TouchableOpacity style={[styles.rescheduleBtn,{backgroundColor:'rgba(255, 0, 0,0.2)',fontWeight:'400'}]}>
         <Text style={[styles.btnText,{color:'#FF0000'}]} type='label'>Cancel</Text>
       </TouchableOpacity>
     </View>}
    </View>
  );
};

export default FarmerMigrationDetailsCard;

const styles = StyleSheet.create({
  startchattext: {
    borderBottomWidth: 1.5,
    borderBottomColor:'#028454',
    
    color: '#028454',
    fontWeight: '600',
    marginLeft: 5,
  },
  flexrow: {
    flexDirection: 'row',
  },
  mainContainer: {
    borderBottomWidth: 0.5,
    borderColor: udyamitaTheme.borderStyleColor,

    paddingVertical:15,
    paddingTop:5,
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    paddingVertical:8,
    borderRadius: 6,
    marginTop: 20,
    width: '45%',
  },
  btnText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    color: udyamitaTheme.textColor,
    fontSize:udyamitaTheme.themeFontSizeLabel
  },
});
