import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { udyamitaTheme } from '../../../config/styles/udyamitaTheme';
import { useTranslation } from 'react-i18next';
import CustomText from '../CustomText';
const CustomAlertToDelete = ({ visible, title, message, onCancel, onConfirm,otherText }) => {
  const {t} =useTranslation();
  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
      <View style={styles.container}>
        <View style={styles.alertBox}>
          <CustomText style={styles.title} type="btn">{title}</CustomText>
          <CustomText style={styles.title} type="label">{message}</CustomText>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onCancel}>
              <CustomText style={styles.buttonTextCancel} type="label">{t('noCancel')}</CustomText>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button,{backgroundColor:"rgba(255, 0, 0, 0.1)",marginRight:0}]} onPress={onConfirm}>
              <CustomText style={styles.buttonTextLogOut} type="label">{otherText}</CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  alertBox: {
    backgroundColor: 'white',
    width: 300,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    alignContent:'center',
    justifyContent:'center'
  },
  title: {
    fontSize: udyamitaTheme.themeFontSizeModalLabel,
   color:udyamitaTheme.textColor,
    textAlign: 'center', 
    fontFamily:udyamitaTheme.mainThemeFontFamilyBold
  },
  message: {
    marginTop: 10,
    textAlign: 'center',
    fontFamily:udyamitaTheme.mainThemeFontFamily,
    fontSize: udyamitaTheme.themeFontSizeButton,
    color:udyamitaTheme.textColor,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    //justifyContent: 'space-between',
  },
  
  button: {
    flex: 1,
    backgroundColor: "#F1F1F1",
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    //width:130,
    marginRight: 10, 
  },
  
  buttonTextCancel: {
    color:udyamitaTheme.textColor,
   
    fontFamily:udyamitaTheme.mainThemeFontFamilyBold,
    fontSize: udyamitaTheme.themeFontSizeButton,
  },
  buttonTextLogOut: {
    color:udyamitaTheme.primaryColor,
   
    fontFamily:udyamitaTheme.mainThemeFontFamilyBold,
    fontSize: udyamitaTheme.themeFontSizeButton,
  },
});

export default CustomAlertToDelete;
