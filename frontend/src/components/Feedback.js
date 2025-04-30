import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {PrimaryInput} from './reusable/UIComponentsUdyamApp';
import {defaultStyles} from '../config/styles/defaultStyles';
import {winHeight} from '../helpers/dimensions';
import {udyamitaTheme} from '../config/styles/udyamitaTheme';
import {useBackHandler} from '../helpers/hooks/useBackhandler';
import {useTranslation} from 'react-i18next';
import {FeedOptionsData} from '../screens/ai-helpdesk/DataHelpDesk';
import CustomText from './reusable/CustomText';

export default function Feedback({onpress}) {
  const {t} = useTranslation();
  const [feedSent, setFeedSent] = useState(false);
  const [reasonSent, setReasonSent] = useState(false);
  const [selIndex, setSelIndex] = useState(0);
  const [value, onChangeText] = useState('');
  const [feedOptions, setFeedOptions] = useState(FeedOptionsData);

  const handlefeedback = status => {
    console.log('ibhib');
    onpress(status, feedOptions[selIndex], value);
  };
  // useBackHandler(() => {
  //   console.log('---t--');
  //   if (!feedSent) {
  //     console.log('feed not sent');
  //     setModalVisible();
  //     return true;
  //   }
  //   return false;
  // });

  return (
    <View style={styles.staticBtm}>
      {!feedSent ? (
        <View style={[styles.helpBox]}>
          <View style={[defaultStyles.flexRow, styles.feedBoxA]}>
            <CustomText style={styles.helpTxt} type="btn">
              {t('wasAnswerHelpful')}
            </CustomText>
            <TouchableOpacity
              onPress={() => {
                setFeedSent(true);
                setReasonSent(true);
                // setIsSatisfactory(true);
                // postAnsFeedback();
                handlefeedback(1);
              }}
              style={{alignItems: 'center'}}>
              <Image source={require('../assets/images/yes.png')} />
              <CustomText style={styles.yTxt} type="sh">
                {t('yes')}
              </CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setFeedSent(true);
                setReasonSent(false);
                // setIsSatisfactory(false);
                // postAnsFeedback();
              }}
              style={{alignItems: 'center'}}>
              <Image source={require('../assets/images/no.png')} />
              <CustomText style={styles.yTxt} type="sh">
                {t('no')}
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
      ) : reasonSent ? (
        <>
          {/* <View style={[defaultStyles.flexRow, styles.thankFeed]}>
            <CustomText style={styles.thankText} type="label">
              {t('thankFeed')}
            </CustomText>
          </View> */}
        </>
      ) : (
        <View style={styles.feedbackNo}>
          <CustomText style={styles.feedHead} type="btn">
            {t('tellUsWhy')}
          </CustomText>
          <View style={{marginTop: 0, marginLeft: 24}}>
            {feedOptions?.map((el, index) => {
              return (
                <TouchableOpacity
                  style={[
                    defaultStyles.flexRow,
                    {alignItems: 'center', marginTop: 20, minWidth: '100%'},
                  ]}
                  key={index}
                  onPress={() => {
                    setSelIndex(index);
                    // setDissatisfactionReason(el?.identifier);

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
                  <Text style={styles.feedbContent}>{t(el?.langId)}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {selIndex === 3 && (
            <PrimaryInput
              editable
              maxLength={40}
              onChangeText={text => {
                // setMiscellaneousReason(text);
                onChangeText(text);
              }}
              value={value}
              placeholder={t('kindlyShare')}
              placeholderTextColor="#969696"
            />
          )}
          <TouchableOpacity
            style={styles.subBtn}
            onPress={() => {
              // postAnsFeedback();
              setReasonSent(true);
              handlefeedback(0);
            }}>
            <CustomText style={styles.subTxt} type="label">
              {t('submit')}
            </CustomText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  staticBtm: {
    position: 'absolute',
    bottom: 0,
    minWidth: '100%',
    elevation: 5,
  },
  helpBox: {
    position: 'absolute',
    bottom: 0,
  },
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
    fontSize: udyamitaTheme.themeFontSizeButton,
    fontWeight: '500',
    marginTop: 6,
  },
  subBtn: {
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: udyamitaTheme?.primaryColor,
    paddingVertical: 10,
    paddingHorizontal: 41,
    marginTop: 24,
    minWidth: '80%',
  },
  subTxt: {
    fontFamily: udyamitaTheme?.mainThemeFontFamilySemiBold,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: udyamitaTheme.themeFontSizeLabel,
    color: udyamitaTheme.primaryColor,
  },
  thankText: {
    color: udyamitaTheme?.primaryColor,
    fontFamily: udyamitaTheme?.mainThemeFontFamily,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    lineHeight: 19,
    letterSpacing: 0,
    textAlign: 'center',
    // marginTop: 30,
  },
  feedbackNo: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: 'white',
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    minWidth: '100%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  feedBoxA: {
    backgroundColor: 'white',
    minWidth: '100%',
    // paddingHorizontal: 60,
    alignItems: 'center',
    // paddingVertical: 14,
    // paddingBottom: 42,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: 90,
    justifyContent: 'space-evenly',
  },
  thankFeed: {
    backgroundColor: 'white',
    minWidth: '100%',
    paddingHorizontal: 36,
    alignItems: 'center',
    // paddingVertical: 14,
    // paddingBottom: 42,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: 90,
    justifyContent: 'space-evenly',
  },
});
