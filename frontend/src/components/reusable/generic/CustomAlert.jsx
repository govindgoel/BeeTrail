import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import {useTranslation} from 'react-i18next';
import CustomText from '../CustomText';
const CustomAlert = ({
  visible,
  title,
  message,
  onCancel,
  onConfirm,
  otherText,
  cancelInGrey,
  otherTextColor,
  otherBackgroundColor,
  harvest
}) => {
  if (!visible) return null;
  const {t} = useTranslation();
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    return () => setLoggingOut(false);
  }, []);
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}>
      <View style={styles.container}>
        <View style={styles.alertBox}>
          <TouchableOpacity style={{alignSelf: 'flex-end'}} onPress={onCancel}>
            <Image
              source={require('../../../assets/images/Crossgreen.png')}
              style={{height: 24, width: 24}}
            />
          </TouchableOpacity>
          {title ? (
            <CustomText style={styles.title} type="mlabel">
              {title}
            </CustomText>
          ) : null}

          <CustomText
            style={title ? styles.messageLight : styles.message}
            type="btn">
            {message}
          </CustomText>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                cancelInGrey ? {backgroundColor: '#F1F1F1'} : null,
              ]}
              onPress={onCancel}>
                {harvest ? <CustomText
                type="btn"
                style={[
                  styles.buttonTextCancel,
                  cancelInGrey ? {color: udyamitaTheme.textColor} : null,
                ]}>
                {t('edit')}
              </CustomText>: <CustomText
                type="btn"
                style={[
                  styles.buttonTextCancel,
                  cancelInGrey ? {color: udyamitaTheme.textColor} : null,
                ]}>
                {t('noCancel')}
              </CustomText>}
             
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                {backgroundColor: otherBackgroundColor, marginRight: 0},
              ]}
              onPress={() => {
                setLoggingOut(true);
                onConfirm();
              }}>
              {loggingOut ? (
                <ActivityIndicator />
              ) : (
                <CustomText
                  style={[styles.buttonTextLogOut, {color: otherTextColor}]}
                  type="btn">
                  {otherText}
                </CustomText>
              )}
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
    borderRadius: 6,
    padding: 16,
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
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    fontSize: udyamitaTheme.themeFontSizeButton,
    color: udyamitaTheme.textColor,
  },
  messageLight: {
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
    backgroundColor: udyamitaTheme.beeAppPrimaryBgColor,
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    //width:130,
    marginRight: 10,
  },

  buttonTextCancel: {
    color: udyamitaTheme.beeAppColor,

    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    fontSize: udyamitaTheme.themeFontSizeButton,
  },
  buttonTextLogOut: {
    // color: udyamitaTheme.primaryColor,

    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    fontSize: udyamitaTheme.themeFontSizeButton,
  },
});

export default CustomAlert;
