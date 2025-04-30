import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Linking} from 'react-native';
import {
  ChevronUp,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
} from 'react-native-feather';

import {useTranslation} from 'react-i18next';
import {udyamitaTheme} from '../../config/styles/udyamitaTheme';
import CustomText from '../reusable/CustomText';

const Accordion = ({
  title,
  description,
  benefits,
  howToApply,
  applyLink,
  id,
  isOpen,
  handleAccordionPress
}) => {
  const {t} = useTranslation();
  
 
  const handleLinkPress = applyLink => {
    // Use the Linking module to open the URL
    Linking.openURL(applyLink).catch(err =>
      console.error('Error opening URL: ', err),
    );
  };
  const toggleAccordion = () => {
    handleAccordionPress();
    //setIsExpanded(!isExpanded);
  };
  const renderHowToApply = () => {
    if (howToApply) {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const matches = howToApply.match(urlRegex);
  
      if (matches && matches.length > 0) {
        const parts = howToApply.split(urlRegex);
  
        return (
          <>
            <CustomText style={styles.subText} type='label'>{t('howToApply')}</CustomText>
            {parts.map((part, index) => (
              <React.Fragment key={index}>
                {index % 2 === 0 ? (
                  <CustomText style={styles.contentText} type='label'>{part}</CustomText>
                ) : (
                  <TouchableOpacity onPress={() => handleLinkPress(part)}>
                    <CustomText style={styles.linkStyle} type="label">{part}</CustomText>
                  </TouchableOpacity>
                )}
              </React.Fragment>
            ))}
          </>
        );
      } else {
        // If no HTTPS links, render the CustomText as is
        return (
          <>
            <CustomText style={styles.subText} type='label'>{t('howToApply')}</CustomText>
            <CustomText style={styles.contentText} type='label'>{howToApply}</CustomText>
          </>
        );
      }
    }
  
    return null;
  };
  
  return (
    <View
      style={{...styles.container, borderTopColor: udyamitaTheme.beeAppColor}}>
      <TouchableOpacity onPress={toggleAccordion}>
        <View style={styles.header}>
          <CustomText style={isOpen ? styles.Expandedtitle : styles.title} type={isOpen? 'btn':'label'}> 
            {title}
          </CustomText>
          <View>
            {isOpen ? (
              <ChevronUp
                width={22}
                height={22}
                color={udyamitaTheme.beeAppColor}
              />
            ) : (
              <ChevronDown
                width={22}
                height={22}
                color={udyamitaTheme.beeAppColor}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
      {isOpen && (
        <>
          <View style={styles.content}>
            <CustomText style={styles.subText} type='label'>{t('description')}</CustomText>
            <CustomText style={styles.contentText} type='label'>{description}</CustomText>
            {benefits ? (
              <>
                <CustomText style={styles.subText} type='label'>{t('benefits')}</CustomText>
                <CustomText style={styles.contentText} type='label'>{benefits}</CustomText>
              </>
            ) : null}

            {renderHowToApply()}
            {applyLink ? (
              <TouchableOpacity onPress={() => handleLinkPress(applyLink)}>
                <CustomText style={styles.linkStyle} type='label'>{applyLink}</CustomText>
              </TouchableOpacity>
            ) : null}
          </View>
        </>
      )}
    </View>
  );
};

export default Accordion;
const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: 'white',
    paddingLeft: 20,
    // height: 272,
    width: 300,
    // marginLeft: 30,
    // marginRight: 10,
    borderRadius: 12,
    //paddingRight: 10,
    bottom: 0,
    position: 'relative',
    //paddingBottom: 10,
    zIndex: 2,
  },
  closeButtonContainer: {
    width: 30,
    height: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: udyamitaTheme.beeAppColor,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  modalImg: {
    width: 295,
    height: 200,
    borderRadius: 6,
    marginTop: 10,
    marginBottom: 10,
  },
  container: {
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    borderWidth: 0.5,
    borderRadius: 5,
    borderBottomColor: udyamitaTheme.borderStyleColor,
    borderLeftColor: udyamitaTheme.borderStyleColor,
    borderRightColor: udyamitaTheme.themeBgColor,
    borderTopWidth: 5,
    backgroundColor: '#fff',
    //paddingRight:10,
    flexShrink: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    //backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
  },
  title: {
    //fontWeight: 'bold',
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    color: udyamitaTheme.textColor,
    marginRight:10
  },
  Expandedtitle: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    fontSize: udyamitaTheme.themeFontSizeButton,
    color: udyamitaTheme.textColor,
    marginRight:10,
  },
  content: {
    marginTop: 5,
    paddingLeft: 10,
    paddingBottom: 10,
  },
  subTitle: {
    textAlign: 'center',
    marginBottom: 10,
  },
  ResultImg: {
    width: 255,
    height: 148,
    borderRadius: 5,
    resizeMode: 'cover',
    paddingLeft: 10,
  },
  ViewButton: {
    borderWidth: 0.5,
    borderColor: udyamitaTheme.beeAppColor,
    borderRadius: 5,
    height: 48,
    justifyContent: 'space-between',
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    marginTop: 10,
  },
  contentText: {
    //paddingLeft: 10,
    paddingBottom: 10,
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    fontSize: udyamitaTheme.themeFontSizeLabel,
  },
  subText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color: udyamitaTheme.textColor,
    marginBottom: 5,
    fontSize: udyamitaTheme.themeFontSizeLabel,
  },
  linkStyle: {
    color: 'blue',
    textDecorationLine: 'underline',
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    fontSize: udyamitaTheme.themeFontSizeLabel,
  },
});
