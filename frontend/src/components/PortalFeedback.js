import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {Modal, Portal} from 'react-native-paper';
import {FeedOptionsData} from '../screens/ai-helpdesk/DataHelpDesk';
import {udyamitaTheme} from '../config/styles/udyamitaTheme';
import {useTranslation} from 'react-i18next';
import {defaultStyles} from '../config/styles/defaultStyles';
import {PrimaryMargin, PrimaryInput} from './reusable/UIComponentsUdyamApp';
import ContentNegativeFeedback from './ContentNegativeFeedback';
import CustomText from './reusable/CustomText';

const containerStyle = {
  backgroundColor: 'white',
  paddingTop: 28,
  marginHorizontal: 24,
  borderRadius: 6,
  alignItems: 'center',
  justifyContent: 'flex-start',
  minHeight: 155,
};

export default function PortalFeedback({
  visible,
  setVisible,
  setVisible2,
  hideModal,
  changefeedbackmodalstate,
  postAnsFeedback,
  setIsSatisfactory,
  setDissatisfactionReason,
  setMiscellaneousReason,
  navigation,
}) {
  const {t} = useTranslation();
  const [portalId, setPortalId] = useState(0);
  const [selIndex, setSelIndex] = useState(-1);
  const [value, onChangeText] = useState('');
  const handlefeedback=(e)=>{
    changefeedbackmodalstate()
      setVisible(e,FeedOptionsData[selIndex],value); 
    }
  useEffect(() => {
    setPortalId(0)
  }, [visible])
  

  function PortalContentA() {
    return (
      <>
        <CustomText style={styles.helpTxt} type="btn">
          {t('wasAnswerHelpful')}
        </CustomText>
        <PrimaryMargin mt={17} />
        <View
          style={[
            defaultStyles.flexRow,
            {justifyContent: 'space-evenly', minWidth: '50%'},
          ]}>
          <TouchableOpacity
            onPress={() => {
              setIsSatisfactory(true);
               setPortalId(1);
              handlefeedback(1)
              // setTimeout(() => {
              //   navigation.navigate('TopicsScreen');
              // }, 5000);
            }}
            style={{alignItems: 'center'}}>
            <Image source={require('../assets/images/yes2.png')} />
            <CustomText style={styles.yTxt} type="sh">
              {t('yes')}
            </CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setIsSatisfactory(false);
              // postAnsFeedback();
              setPortalId(2);
            }}
            style={{alignItems: 'center'}}>
            <Image source={require('../assets/images/no2.png')} />
            <CustomText style={styles.yTxt} type="sh">
              {t('no')}
            </CustomText>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  function PortalContentB() {
    return (
      <>
        {/* <CustomText style={styles.thankTextModal}>{t('thankFeed')}</CustomText> */}
        
      </>
    );
  }

  function PortalContentC() {
    const [feedOptions, setFeedOptions] = useState(FeedOptionsData);
    return (
      <>
        <CustomText style={styles.feedHead}>{t('tellUsWhy')}</CustomText>
        <View style={{marginTop: 8, alignItems: 'flex-start'}}>
          {feedOptions?.map((el, index) => {
            return (
              <TouchableOpacity
                style={[
                  defaultStyles.flexRow,
                  {
                    alignItems: 'center',
                    marginTop: 16,
                    justifyContent: 'flex-start',
                    minWidth: '100%',
                    marginLeft: 54,
                  },
                ]}
                key={index}
                onPress={() => {
                  setSelIndex(index);

                  setDissatisfactionReason(el?.identifier);

                  let tempOptions = feedOptions;
                  let temp = feedOptions[index];
                  temp.selected = !temp.selected;
                  tempOptions[index] = temp;
                  setFeedOptions(tempOptions);
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setSelIndex(index);

                    setDissatisfactionReason(el?.identifier);

                    let tempOptions = feedOptions;
                    let temp = feedOptions[index];
                    temp.selected = !temp.selected;
                    tempOptions[index] = temp;
                    setFeedOptions(tempOptions);
                  }}
                  style={[
                    styles.outlinedTouchable,
                    // {
                    //   backgroundColor:
                    //     selIndex === index ? udyamitaTheme.primaryColor : 'white',
                    // },
                  ]}>
                  <View style={styles.selBox}>
                    {selIndex === index && (
                      <View
                        style={{
                          backgroundColor: udyamitaTheme.primaryColor,
                          minHeight: 12,
                          minWidth: 12,
                          borderRadius: 6,
                        }}
                      />
                    )}
                  </View>
                </TouchableOpacity>
                <CustomText style={styles.feedbContent}>
                  {t(el?.langId)}
                </CustomText>
              </TouchableOpacity>
            );
          })}
        </View>
        {selIndex === 3 && (
          <PrimaryInput
            editable
            maxLength={40}
            onChangeText={text => {
            
              onChangeText(text);
            }}
            value={value}
            placeholder={t('kindlyShare')}
            placeholderTextColor="#969696"
          />
        )}
        <TouchableOpacity
          style={[styles.subBtn, {marginBottom: 16}]}
          onPress={() => {
            setPortalId(1);
            handlefeedback(0)
           }}>
          <CustomText style={styles.subTxt}>{t('submit')}</CustomText>
        </TouchableOpacity>
      </>
    );
  }

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={()=>{
          if(portalId !== 1)  hideModal();
        }}
        contentContainerStyle={containerStyle}>
        {portalId === 2 ? (
          <PortalContentC />
        ) : portalId === 1 ? (
          <PortalContentB />
        ) : (
          <PortalContentA />
        )}
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
    fontSize: udyamitaTheme.themeFontSizeButton,
    lineHeight: 23,
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
    marginLeft: 10,
    flex: 1,
    paddingRight: 40,
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
    fontWeight: '600',
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
