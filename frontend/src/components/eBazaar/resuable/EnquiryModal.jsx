import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import axios from 'axios';
import {APP_API_MARKETPLACE_SERVICES} from '@env';
import {useTranslation} from 'react-i18next';
import Toast from 'react-native-simple-toast';
import { getToken } from '../../../helpers/UserData';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import CustomText from '../../reusable/CustomText';
const EnquiryModal = ({visible, requestClose, variantId, variantName}) => {
  const [numberOfUnitsReq, setNumberOfUnitsReq] = useState(null);
  const [comments, setComments] = useState('');
  const {t} = useTranslation();
  const submitRequest = async () => {
    const reqBody = {
      variantId: variantId,
      comments: comments,
       quantity: numberOfUnitsReq,
    };

    const token = await getToken();
    const config = {headers: {Authorization: 'Bearer ' + token}};
    await axios
      .post(`${APP_API_MARKETPLACE_SERVICES}/product-enquiry`, reqBody, config)
      .then(data => {
        // Toast.show(`${t('itemAddedToBag')}`, Toast.SHORT);
        Toast.show(`${t('yourQueryHasBeenRecorded')}`, Toast.SHORT);
       requestClose();
      })
      .catch(err => {
        console.log('Error in submitting request :', err, err.response.data.message);
      });
  };
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={() => {
        requestClose();
      }}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={{flexDirection:'row',justifyContent:'space-between', marginBottom: '1%'}}>

          <CustomText type='label' style={{fontFamily:udyamitaTheme.mainThemeFontFamilyBold,fontSize:udyamitaTheme.themeFontSizeLabel,color:udyamitaTheme.textColor}}>{ variantName || ''} </CustomText>
          <TouchableOpacity
            
            onPress={() => requestClose()}>
            <Image
              source={require('../../../assets/images/Cross.png')}
              style={{width: 24, height: 24}}
            />
          </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={true}>
            <CustomText style={styles.label} type='label'>
              {t('numberOfUnitsRequired')}{' '}
              <CustomText
                style={{
                  color: 'red',
                  fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
                }}>
                *
              </CustomText>
            </CustomText>
            <TextInput
              placeholder={t('numberOfUnitsRequired')}
              placeholderTextColor={udyamitaTheme.textColor}
              keyboardType="number-pad"
              style={styles.textInputWrapNormal}
              value={numberOfUnitsReq}
              onChangeText={val => {
                // Check if the entered value is a number
                if (!isNaN(val)) {
                  // If it's a number, update the state
                  setNumberOfUnitsReq(val);
                } else {
                  Toast.show(t('pleaseEnterNumbers'), Toast.SHORT);
                }
              }}
            />

            <CustomText style={styles.label} type='label'>{t('anyCommentsspecialRequests')}</CustomText>
            <TextInput
              multiline
              placeholder={t('anyCommentsspecialRequests')}
              placeholderTextColor={udyamitaTheme.textColor}
              style={styles.textInputWrapNormal}
              value={comments}
              onChangeText={text => setComments(text)}
            />
            <TouchableOpacity
            onPress={()=>submitRequest()}
              style={[
                styles.submitBtn,
                {
                  backgroundColor: !numberOfUnitsReq
                    ? udyamitaTheme.disabledButtonColor
                    : udyamitaTheme.primaryColor,
                },
              ]}
              disabled={!numberOfUnitsReq}>
              <CustomText style={styles.submitBtnText} type='btn'>{t('submitMyRequest')}</CustomText>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default EnquiryModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 312,
    borderRadius: 24,
    backgroundColor: '#fff',
    padding: 20,
    //alignItems: 'center',
    // height:240,
  },
  label: {
    color: udyamitaTheme.textColor,
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    marginTop: 15,
    marginBottom: 10,
  },
  textInputWrap: {
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    width: '90%',
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
  },
  textInputWrapNormal: {
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: udyamitaTheme.borderStyleColor,
    paddingLeft: 10,
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
  },
  submitBtn: {
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    height: 50,
    backgroundColor: udyamitaTheme.primaryColor,
  },
  submitBtnText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    color: '#fff',
    textTransform: 'capitalize',
    fontSize:udyamitaTheme.themeFontSizeButton
  },
});
