import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {Modal, Portal} from 'react-native-paper';
import {FeedOptionsData} from '../screens/ai-helpdesk/DataHelpDesk';
import {udyamitaTheme} from '../config/styles/udyamitaTheme';
import {useTranslation} from 'react-i18next';
import ContentNegativeFeedback from './ContentNegativeFeedback';

const containerStyle = {
  backgroundColor: 'white',
  paddingVertical: 24,
  marginHorizontal: 24,
  borderRadius: 6,
  alignItems: 'center',
  justifyContent: 'flex-start',
  minHeight: 155,
};

export default function PortalNegativeFeedback({
  visible,
  hideModal,
  navigation,
}) {
  const {t} = useTranslation();

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={containerStyle}>
        <ContentNegativeFeedback navigation={navigation} />
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
  yTxt: {
    color: udyamitaTheme.textColor,
    fontFamily: udyamitaTheme?.mainThemeFontFamily,
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  thankTextModal: {
    color: udyamitaTheme?.primaryColor,
    fontFamily: udyamitaTheme?.mainThemeFontFamily,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    lineHeight: 19,
    letterSpacing: 0,
    textAlign: 'center',
    paddingHorizontal: 28,
    paddingTop: 22,
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
});
