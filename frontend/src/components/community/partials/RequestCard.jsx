import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import {useTranslation} from 'react-i18next';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import CustomText from '../../../components/reusable/CustomText';

const RequestCard = ({
  data,
  navigation,
  handleAccept,
  handleReject,
  userId,
  allRequests,
  setAllRequests,
  reqUserName,
  communityId,
 
}) => {
  const {t} = useTranslation();
 
  return (
    <View style={styles.cardContainer}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={styles.avatarContainer}>
          <CustomText style={styles.avatarText} type="mlabel">{data?.userId?.name?.charAt(0) || ''}</CustomText>
          {/* <Text style={styles.avatarText}>{data?.userId?.name?.charAt(0) || ''}</Text> */}
        </View>
        <View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {/* <Text style={styles.requestText}>{data?.userId?.name}</Text> */}
                <CustomText style={styles.requestText}>
                  {data?.userId?.name}
                </CustomText>
                <CustomText style={styles.requestTextToJoin} type="sh">
                {t('hasRequestedToJoin')}
                </CustomText>
            {/* <Text style={styles.requestTextToJoin}>
              {t('hasRequestedToJoin')}
            </Text> */}
          </View>
          <CustomText style={styles.userInfo} type="xs">
          {data?.userId?.address?.district}, {data?.userId?.address?.state}
                </CustomText>
          {/* <Text style={styles.userInfo}>
            {data?.userId?.address?.district}, {data?.userId?.address?.state}
          </Text> */}
        </View>
      </View>
      <TouchableOpacity
        style={styles.viewAllBtn}
        onPress={() => {
          navigation.navigate('UserResponses',{data});
        }}>
          <CustomText style={styles.buttonText} type='label'>{t('viewResponse')}</CustomText>
        {/* <Text style={styles.buttonText}>{t('viewResponse')}</Text> */}
      </TouchableOpacity>
      <View style={{ flexDirection: 'row',marginTop:10,justifyContent:'space-between'}}>
      <TouchableOpacity
      style={[styles.button, { backgroundColor:'#FFE5E5' }]}
      onPress={() => handleReject(data?.userId?._id)}>
      {/* <Text style={[styles.buttonText, { color: '#FF0000' }]}>{t('decline')}</Text> */}
      <CustomText style={[styles.buttonText, { color: '#FF0000' }]} type='label'>{t('decline')}</CustomText>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.button, { backgroundColor:udyamitaTheme.beeAppPrimaryBgColor}]}
      onPress={() => {handleAccept(data?.userId?._id)}}>
        <CustomText style={[styles.buttonText, { color: udyamitaTheme.beeAppColor }]} type='label'>{t('accept')}</CustomText>
      {/* <Text style={[styles.buttonText, { color: udyamitaTheme.beeAppColor }]}>{t('accept')}</Text> */}
    </TouchableOpacity>

   
  </View>
    
    </View>
  );
};

const styles = {
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 6,
    justifyContent: 'center',
    //marginVertical: 10,
    //elevation: 2,
    marginBottom: 10,
    borderWidth: 0.4,
    borderColor: udyamitaTheme.borderStyleColor,
    marginTop: 10,
    padding: 10,
    marginLeft:20,
    marginRight:20,
  },
  requestText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    // marginTop: 10,
    paddingLeft: 10,
    color: udyamitaTheme.textColor,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: '#F2F3F4',
  },
  button: {
    //borderRightWidth: 1,
   
    //paddingVertical: 5,
    alignItems: 'center',
    padding:5,
    borderRadius:6,
    height:42,
    justifyContent:'center',
    width:'48%'
   
  },
  buttonText: {
    color: udyamitaTheme.textColor,
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    fontSize: udyamitaTheme.themeFontSizeLabel,
  },
  requestTextToJoin: {
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
    //padding: 9,
    paddingLeft: 5,
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    //marginTop: 11,
  },
  userInfo: {
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    color: udyamitaTheme.textColor,
    opacity: 0.5,
    fontSize: udyamitaTheme.themeFontSizeExtraSmall,
    paddingLeft: 10,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    //marginRight: 10,
    borderWidth: 1,
    borderColor: udyamitaTheme.borderStyleColor,
    //marginLeft: 8,
  },
  avatarText: {
    fontSize: udyamitaTheme.themeFontSizeModalLabel,
    color: udyamitaTheme.primaryColor,
  },
  viewAllBtn: {
    backgroundColor: '#F1F1F1',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    marginTop: 10,
  },
 
};

export default RequestCard;
