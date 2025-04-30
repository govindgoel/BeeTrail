import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
} from 'react-native';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import {useTranslation} from 'react-i18next';
import CustomText from '../CustomText';
const crossIcon = require('../../../assets/images/greenCross.png');

const CustomAlertInvite = ({ visible,title, message,onCancel,member
}) => {
  const {t} = useTranslation();
  if (!visible) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel} >
      <View style={styles.container}>
        <View style={styles.alertBox}>
          <CustomText style={styles.title} type='mlabel'>{title}</CustomText>
            <CustomText style={styles.message} type='btn'>
              {message}
            </CustomText>
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
    width: '90%',
    borderRadius: 6,
    padding: 20,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: udyamitaTheme.themeFontSizeModalLabel,
    color: udyamitaTheme.textColor,
    textAlign: 'center',
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
  },
  message: {
    marginTop: 10,
    textAlign: 'center',
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    fontSize: udyamitaTheme.themeFontSizeButton,
    color: udyamitaTheme.textColor,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    //justifyContent: 'space-between',
  },

  button: {
    flex: 1,
    backgroundColor: '#F1F1F1',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    //width:130,
    marginRight: 10,
  },

  buttonTextCancel: {
    color: udyamitaTheme.textColor,
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    fontSize: udyamitaTheme.themeFontSizeButton,
  },
  buttonTextLogOut: {
    color: udyamitaTheme.beeAppColor,
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    fontSize: udyamitaTheme.themeFontSizeButton,
  },
  icon: {
    height: 24,
    width: 24,
  },
  iconContainer: {
    position: 'absolute',
    top: 8,
    left: '98%',
  },
});

export default CustomAlertInvite;
