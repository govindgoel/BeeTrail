import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import CustomText from '../../reusable/CustomText';
const OutOfStockNotificationModal = ({visible, onCancel}) => {
  const {t} = useTranslation();
  if (!visible) return null;

  useEffect(() => {
    if (visible) {
      const delay = 3000;
      const timeoutId = setTimeout(() => {
        onCancel();
      }, delay);

      return () => clearTimeout(timeoutId);
    }
  }, []);

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}>
      <View style={styles.container}>
        <View style={styles.alertBox}>
          <TouchableOpacity
            style={{alignSelf: 'flex-end'}}
            onPress={() => onCancel()}>
            <Image
              source={require('../../../assets/images/Cross.png')}
              style={{width: 25, height: 25}}
            />
          </TouchableOpacity>

          <Image
            source={require('../../../assets/images/bigNotification.png')}
            style={{marginBottom: 20}}
          />
          <CustomText type='btn' style={styles.secondText}>{t('outOfStockModal')}</CustomText>
        </View>
      </View>
    </Modal>
  );
};

export default OutOfStockNotificationModal;

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
    alignContent: 'center',
    justifyContent: 'center',
  },
  reviewText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color: udyamitaTheme.primaryColor,
    fontSize: udyamitaTheme.themeFontSizeModalLabel,
    marginBottom: 10,
  },
  secondText: {
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    fontSize: udyamitaTheme.themeFontSizeButton,
    color: udyamitaTheme.textColor,
  },
});
