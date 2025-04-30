import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {Modal, Portal} from 'react-native-paper';
import {CrossIcon} from '../assets/Icons/IconSvg';
import {udyamitaTheme} from '../config/styles/udyamitaTheme';
import {useTranslation} from 'react-i18next';
import {setQuestion} from '../store/reducers/udyamReducer';
import {useDispatch} from 'react-redux';
import CustomText from './reusable/CustomText';
import {defaultStyles} from '../config/styles/defaultStyles';
import {SpeakerIcon} from '../assets/Icons/IconSvg';
import {
  PrimaryButton,
  ButtonText,
} from '../components/reusable/UIComponentsUdyamApp';

const containerStyle = {
  backgroundColor: 'white',
  paddingVertical: 28,
  paddingHorizontal: 22,
  marginHorizontal: 24,
  borderRadius: 6,
  // alignItems: 'center',
  justifyContent: 'flex-start',
  minHeight: 260,
  maxHeight:260
};

export default function PortalInvalidQuestion({
  visible,
  hideModal,
  navigation,
  openkeyboard,
  textInputScreen,
  handlechangerecording_screen,
  isConnected,
}) {
  const {t} = useTranslation();
  const dispatch = useDispatch();

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={containerStyle}>
            <CustomText style={styles.askagaintext} type="h">
              {t('askAgain')}
            </CustomText>
            <CustomText style={styles.thankTextModal1} type="label">
              {t('voiceinvalidQuestion')}
            </CustomText>
            <CustomText style={styles.thankTextModal2} type="label">
              {t('speakslowly')}
            </CustomText>
      
            <View style={[styles.askAI,{flex:1,flexDirection:'row',paddingHorizontal: 28,
    marginVertical: 16,justifyContent:'center',gap:80,alignItems:'center'}]}>
              <View >
                <TouchableOpacity
                  onPress={() => {
                    openkeyboard()
                    hideModal();
                  }}
                  style={styles.key}>
                  <Image
                    source={require('../assets/images/keyboard.png')}
                    style={{minHeight: 32, minWidth: 18}}
                  />
                </TouchableOpacity>

                <CustomText type="label" style={{ alignSelf:'center', marginTop: 5}}>
                  {t('type')}
                </CustomText>
              </View>
              <View>
                <TouchableOpacity
                  onPress={async () => {
                    handlechangerecording_screen()
                    hideModal()
                  }}
                  style={styles.askAI}>
                  <View
                    style={[
                      styles.key,
                    ]}>
                    <SpeakerIcon />
                    </View>
                </TouchableOpacity>
                <CustomText type="label" style={{alignSelf:'center', marginTop: 5}}>
                  {t('audio')}
                </CustomText>
              </View>
            </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  helpTxt: {
    color: udyamitaTheme.textColor,
    fontFamily: udyamitaTheme?.mainThemeFontFamilySemiBold,
    fontSize: udyamitaTheme.themeFontSizeButton,
    fontStyle: 'normal',
  },
  askAI: {
    minHeight: 52,
    // paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: udyamitaTheme.primaryColor,
    justifyContent: 'center',
  },
  yTxt: {
    color: udyamitaTheme.textColor,
    fontFamily: udyamitaTheme?.mainThemeFontFamily,
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  thankTextModal2: {
    color: udyamitaTheme?.primaryColor,
    fontFamily: udyamitaTheme?.mainThemeFontFamily,
    fontSize: udyamitaTheme.themeFontSizeButton,
    lineHeight: 23,
    letterSpacing: 0,
    textAlign: 'center',
    paddingHorizontal: 28,
    paddingBottom: 12,
    alignSelf: 'center',
    // marginTop: 30,
  },
  thankTextModal: {
    color: udyamitaTheme?.primaryColor,
    fontFamily: udyamitaTheme?.mainThemeFontFamily,
    fontSize: udyamitaTheme.themeFontSizeButton,
    lineHeight: 23,
    letterSpacing: 0,
    textAlign: 'center',
    paddingHorizontal: 28,
    paddingVertical: 12,
    alignSelf: 'center',
    // marginTop: 30,
  },
  thankTextModal1: {
    color: udyamitaTheme?.primaryColor,
    fontFamily: udyamitaTheme?.mainThemeFontFamily,
    fontSize: udyamitaTheme.themeFontSizeButton,
    lineHeight: 23,
    letterSpacing: 0,
    textAlign: 'center',
    paddingHorizontal: 28,
    alignSelf: 'center',
    // marginTop: 30,
  },
  thankTextModal1: {
    color: udyamitaTheme?.primaryColor,
    fontFamily: udyamitaTheme?.mainThemeFontFamily,
    fontSize: udyamitaTheme.themeFontSizeButton,
    lineHeight: 23,
    letterSpacing: 0,
    textAlign: 'center',
    paddingHorizontal: 28,

    alignSelf: 'center',
    // marginTop: 30,
  },
  askagaintext: {
    color: '#262626',
    fontFamily: udyamitaTheme?.mainThemeFontFamily,
    fontSize: udyamitaTheme.themeFontSizeButton,
    lineHeight: 23,
    letterSpacing: 0,
    textAlign: 'center',
    paddingHorizontal: 28,

    alignSelf: 'center',
    // marginTop: 30,
  },
  feedbContent: {
    color: udyamitaTheme.textColor,
    fontFamily: udyamitaTheme?.mainThemeFontFamily,
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
    fontStyle: 'normal',
    fontWeight: '400',
    marginLeft: 8,
  },
  key: {
    width:67,
    backgroundColor: udyamitaTheme.primaryColor,
    minWidth: '20%',
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  feedHead: {
    color: udyamitaTheme.textColor,
    textAlign: 'center',
    fontFamily: udyamitaTheme?.mainThemeFontFamilySemiBold,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    fontWeight: '500',
  },
  subBtn: {
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: udyamitaTheme?.primaryColor,
    paddingVertical: 10,
    paddingHorizontal: 41,
    marginTop: 24,
    marginBottom: 16,
    minWidth: '80%',
  },
  subTxt: {
    fontFamily: udyamitaTheme?.mainThemeFontFamilySemiBold,
    textAlign: 'center',

    fontSize: udyamitaTheme.themeFontSizeLabel,
    color: udyamitaTheme.primaryColor,
  },
  outlinedTouchable: {
    minWidth: 16,
    minHeight: 16,
    maxWidth: 16,
    maxHeight: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: udyamitaTheme?.primaryColor,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    // padding: 2,
  },
  askAI: {
    width: '100%',
    // maxWidth: 169,
    minHeight: 56,
    // marginLeft:'20%',
    // paddingHorizontal: 40,
    // paddingVertical: 41,
    alignItems: 'center',

    justifyContent: 'center',
  },
  askAct: {
    minWidth: 239,
    maxWidth: 239,
    minHeight: 56,
    paddingHorizontal: 10,
    // paddingVertical: 41,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#F8291C',
    justifyContent: 'center',
  },
  askText: {
    color: udyamitaTheme.textColor,
    fontFamily: udyamitaTheme?.mainThemeFontFamily,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    fontStyle: 'normal',
    // fontWeight: 500,
    marginLeft: 8,
  },
  askAct: {
    color: 'white',
    marginLeft: 8,
    fontFamily: udyamitaTheme?.mainThemeFontFamily,
    fontSize: udyamitaTheme.themeFontSizeLabel,
  },
  staticBtm: {
    position: 'absolute',
    bottom: 0,
    padding: 20,
    minWidth: '100%',
    backgroundColor: udyamitaTheme.udyamAppTertiaryColor,
    elevation: 10,
    border: 'none',
  },
});
