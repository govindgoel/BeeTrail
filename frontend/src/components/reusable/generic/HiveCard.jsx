import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import React,{useState} from 'react';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import CustomAlert from './CustomAlert';
import { useTranslation } from 'react-i18next';
import { removeItemByKey } from '../../../helpers/UserData';
import CustomText from '../CustomText';
const HiveCard = ({hiveNumber,autoSaveDate,navigation, handleDelete,
  apiaryId,
  hiveCount,
  apiaryName}) => {
  const {t} =useTranslation();
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
    const handleLogoutCancel = () => {
        setDeleteModalVisible(false);
      };
      const [resumeModalVisible,setResumeModalVisible]=useState(false);
      const handleCancel = () => {
        setResumeModalVisible(false);
      };
      const asyncKey = `InspectionData-${hiveNumber}`;
      
     const deleteData = ()=>{
      if (asyncKey) {
        removeItemByKey(asyncKey);
        setDeleteModalVisible(false);
      }
      if(handleDelete){
        handleDelete();
      }
      }
      const resumeInspection = ()=>{
        navigation.navigate('SymptomMapping',{hiveNumber,apiaryId,hiveCount,apiaryName})
      }
  return (
    <View style={styles.cardContainer}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <CustomText style={styles.hiveNumberText} type='label'>{hiveNumber}</CustomText>
        <TouchableOpacity onPress={() => setDeleteModalVisible(true)}>
          <Image
            source={require('../../../assets/images/Crossgreen.png')}
            style={{width: 16, height: 16}}
          />
        </TouchableOpacity>
      </View>
      <CustomText style={styles.autoSaveText} type='sh'>{t('autosavedAt')} {autoSaveDate}</CustomText>
      <TouchableOpacity
        style={styles.resumeBtn}
        onPress={() => setResumeModalVisible(true)}>
        <CustomText style={styles.btnText} type='label'>{t('resumeNow')}</CustomText>
      </TouchableOpacity>
      <CustomAlert
        visible={isDeleteModalVisible || resumeModalVisible}
        title={isDeleteModalVisible ? null : t('goodDecision')}
        message={
          isDeleteModalVisible
            ? t('deleteConfirmationOfHive')
            : t('confirmationToContinue')
        }
        onCancel={isDeleteModalVisible ? handleLogoutCancel : handleCancel}
        onConfirm={isDeleteModalVisible ? deleteData : resumeInspection}
        otherTextColor={
          isDeleteModalVisible ? '#ff0000' : udyamitaTheme.beeAppColor
        }
        otherText={t('yesProceed')}
        cancelInGrey={isDeleteModalVisible ? false : true}
        otherBackgroundColor={
          isDeleteModalVisible
            ? 'rgba(255, 0, 0, 0.1)'
            : udyamitaTheme.beeAppPrimaryBgColor
        }
      />
    </View>
  );
};

export default HiveCard;
const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: udyamitaTheme.beeAppPrimaryBgColor,
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
    width:197,
    marginRight:10
  },
  hiveNumberText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    color: udyamitaTheme.textColor,
    fontSize: udyamitaTheme.themeFontSizeLabel,
  },
  autoSaveText:{
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    fontSize:9
  },
  resumeBtn:{
    backgroundColor:udyamitaTheme.beeAppColor,
    borderRadius:4,
    justifyContent:'center',
    alignItems:'center',
   height:30,
   marginTop:16
  },
  btnText:{
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    color:'#fff',
    fontSize:udyamitaTheme.themeFontSizeLabel
  }
});
