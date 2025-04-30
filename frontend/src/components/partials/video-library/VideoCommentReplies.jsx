import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import React, {useEffect, useState, useRef} from 'react';
import {APP_API_LIBRARY_URL} from '@env';

import Toast from 'react-native-simple-toast';
import axios from 'axios';
import moment from 'moment';
import CustomAlertToDelete from '../../reusable/generic/CustomAlertToDelete';
import RBSheet from 'react-native-raw-bottom-sheet';
import {getValueByKey} from '../../../helpers/UserData';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import CustomText from '../../reusable/CustomText';

const windowHeight = Dimensions.get('window').height;
const VideoCommentReplies = ({id, handleReplyPress, userInfo, likeComment}) => {

  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [commentIdToDeleteOrEdit, setCommentIdToDeleteOrEdit] = useState(null);
  const bottomSheetRefInReply = useRef();
  const {t} = useTranslation();
  const [replies, setReplies] = useState([]);

  const fetchReplies = async () => {
    const token = await getValueByKey('token');
    const config = {headers: {Authorization: 'Bearer ' + token}};
    await axios
      .get(`${APP_API_LIBRARY_URL}/comment/${id}`, config)
      .then(response => {
        setReplies(response?.data?.replies);
   
      })
      .catch(err => console.log('ERR while getting replies', err));
  };
  useEffect(() => {
    fetchReplies();
  }, []);
  const deleteComment = async () => {
    if (!commentIdToDeleteOrEdit) {
      Toast.show('No comment ID to delete', Toast.LONG);
      return;
    }
    const token = await getValueByKey('token');
    const config = {headers: {Authorization: 'Bearer ' + token}};
    axios
      .delete(
        `${APP_API_LIBRARY_URL}/comment/${commentIdToDeleteOrEdit}`,
        config,
      )
      .then(response => {
        if (response.status === 200) {
          setDeleteModalVisible(false);
          bottomSheetRefInReply.current.close();
          Toast.show('Reply Comment Deleted', Toast.LONG);
          fetchReplies();
        }
      })
      .catch(err => console.log('ERR', err));
  };
  const RenderSheetContent = () => (
    <View style={{marginLeft: 40, marginTop: 30}}>
      <TouchableOpacity
        onPress={() => bottomSheetRefInReply.current.close()}
        style={{alignSelf: 'flex-end', marginRight: 20}}>
        <Image
          source={require('../../../assets/images/Cross.png')}
          style={{width: 24, height: 24}}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{flexDirection: 'row', alignItems: 'center'}}
        onPress={() => setDeleteModalVisible(true)}>
        <Image
          source={require('../../../assets/images/Deleteicon.png')}
          style={{width: 32, height: 32, marginRight: 10}}
        />
        <CustomText style={styles.item} type='btn'>{t('deleteReply')}</CustomText>
      </TouchableOpacity>
      <CustomAlertToDelete
        visible={isDeleteModalVisible}
        title={t('deleteReply')}
        message={t('areYouSureYouWantToDeleteThisReply')}
        onCancel={handleLogoutCancel}
        onConfirm={() => deleteComment()}
        otherText={t('yesProceed')}
      />
    </View>
  );
  const getDurationOfComment = data => {
    const parsedDate = moment(data?.createdAt);
    const currentDate = moment();
    const duration = moment.duration(currentDate.diff(parsedDate));
    let dateTimeText = '';

    if (duration.years() > 0) {
      dateTimeText =
        `${duration.years()} ` +
        `${duration.years() > 1 ? t('years') : t('year')} ` +
        `${t('ago')}`;
    } else if (duration.months() > 0) {
      dateTimeText =
        `${duration.months()} ` +
        `${duration.months() > 1 ? t('months') : t('month')} ` +
        `${t('ago')}`;
    } else if (duration.weeks() > 0) {
      dateTimeText =
        `${duration.weeks()} ` +
        `${duration.weeks() > 1 ? t('weeks') : t('week')} ` +
        `${t('ago')}`;
    } else if (duration.days() > 0) {
      dateTimeText =
        `${duration.days()} ` +
        `${duration.days() > 1 ? t('days') : t('day')} ` +
        `${t('ago')}`;
    } else if (duration.hours() > 0) {
      dateTimeText =
        `${duration.hours()} ` +
        `${duration.hours() > 1 ? t('hours') : t('hour')} ` +
        `${t('ago')}`;
    } else if (duration.minutes() > 0) {
      dateTimeText =
        `${duration.minutes()} ` +
        `${duration.minutes() > 1 ? t('minutes') : t('minute')} ` +
        `${t('ago')}`;
    } else if (duration.seconds() > 0) {
      dateTimeText =
        `${duration.seconds()} ` +
        `${duration.seconds() > 1 ? t('seconds') : t('second')} ` +
        `${t('ago')}`;
    } else if (duration.seconds() <= 0) {
      dateTimeText = `${t('justNow')}`;
    }
    return dateTimeText;
  };
  const handleLogoutCancel = () => {
    setDeleteModalVisible(false);
  };
  return (
    <>
      <View style={{marginLeft: 50}}>
        {replies.length > 0 &&
          replies.map(x =>
            x ? (
              <TouchableOpacity key={x._id} styles={{flexDirection: 'row'}}>
                { [undefined, null, ''].includes(x?.userId?.profilePictureUrl) && [undefined, null, ''].includes(x?.userId?.photo) ? (
                        <View
                        style={[
                          styles.userInitial,
                          {
                            borderWidth: 0.69,
                            //marginRight: 15,
                            width: 36,
                            height: 36,
                            borderRadius: 18,
                          },
                        ]}>
                        <CustomText style={styles.initialText} type='mlabel'>
                          {x.userId?.name[0] || ''}
                        </CustomText>
                      </View>
      
                ) : (
                  <Image
                  source={{uri: x?.userId?.profilePictureUrl || x?.userId?.photo}}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    resizeMode: 'contain',
                    marginRight: 20,
                  }}
                />
                )}

                <TouchableOpacity
                  style={{
                    backgroundColor: 'rgba(203, 203, 203, 0.2)',
                    width: '65%',
                    marginLeft: 50,
                    marginTop: -45,
                    borderRadius: 6,
                    padding: 10,
                  }}
                  //   onPress={() => {
                  //     setCommentIdToDeleteOrEdit(x._id);
                  //     bottomSheetRef.current.open();
                  //   }}
                >
                  <View style={{flexDirection: 'column'}}>
                    <CustomText style={styles.userName} type='sh'>{x.userId?.name || ''}</CustomText>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginLeft: -2,
                      }}>
                      <Image
                        source={require('../../../assets/images/Active.png')}
                        style={{width: 12, height: 12, opacity: 0.6}}
                      />
                      <CustomText
                        style={{
                          fontSize: udyamitaTheme.themeFontSizeSmall,
                          fontFamily: udyamitaTheme.mainThemeFontFamily,
                          paddingLeft: 2,
                          color: udyamitaTheme.textColor,
                          opacity: 0.6,
                        }}
                        type='sm'
                        >
                        {getDurationOfComment(x)}
                      </CustomText>
                    </View>
                    <CustomText style={styles.comment} type='sh'>{x.comment}</CustomText>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flexDirection: 'column',
                    alignSelf: 'flex-end',
                    right: 10,
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'center',
                    top: -10,
                  }}
                  disabled={x?.userId?._id !== userInfo?._id}
                  onPress={() => {
                    setCommentIdToDeleteOrEdit(x._id);
                    bottomSheetRefInReply.current.open();
                  }}>
                  {x?.userId?._id !== userInfo?._id ? null : (
                    <Image
                      source={require('../../../assets/images/More.png')}
                      style={{width: 20, height: 20}}
                    />
                  )}
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: 'column',
                    alignSelf: 'flex-end',
                    right: 10,
                    position: 'relative',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent: 'center',
                    top: -32,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      likeComment(x._id);
                    }}>
                    {x.liked === true ? (
                      <Image
                        source={require('../../../assets/images/Like_active.png')}
                        style={{width: 20, height: 20}}
                      />
                    ) : (
                      <Image
                        source={require('../../../assets/images/Like_inactive.png')}
                        style={{width: 20, height: 20}}
                      />
                    )}
                  </TouchableOpacity>
                  <CustomText style={styles.likeCount} type='ml'> {x.likes}</CustomText>
                </View>
                {/* 
                <View style={{flexDirection: 'column'}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginLeft: 60,
                      // marginTop: 10,
                      // marginBottom: 8,
                      alignItems: 'center',
                      position: 'relative',
                      top: -30,
                    }}>
                    <Image
                      source={require('../../../assets/images/Reply.png')}
                      style={{width: 20, height: 20}}
                    />
                    <TouchableOpacity onPress={() => handleReplyPress()}>
                      <CustomText style={styles.text}>Reply</CustomText>
                    </TouchableOpacity>
                  </View>
                  {x.replyCount > 0 ? (
                    <TouchableOpacity style={{marginLeft: 60}}>
                      <CustomText style={styles.text}>View {x.replyCount} reply</CustomText>
                    </TouchableOpacity>
                  ) : null}
                </View> */}
              </TouchableOpacity>
            ) : null,
          )}

        <RBSheet
          ref={bottomSheetRefInReply}
          closeOnDragDown={false}
          closeOnPressBack
          height={131}
          duration={250}
          customStyles={{
            container: {
              borderTopLeftRadius: 40,
              borderTopRightRadius: 40,
            },
          }}>
          {RenderSheetContent()}
        </RBSheet>
      </View>
    </>
  );
};

export default VideoCommentReplies;
const styles = StyleSheet.create({
  container: {
    //flex: 1,
  },
  title: {
    fontFamily: udyamitaTheme.mainThemeFontFamily,
  },
  inputWrap: {
    position: 'absolute',
    bottom: -160,
    backgroundColor: '#fff',
    height: 87,
    flexDirection: 'row',
    // justifyContent: 'center',
    paddingLeft: 20,
    paddingTop: 20,
    width: '100%',
  },
  //   commentTextInput: {

  //   },
  userInitial: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
    borderColor: udyamitaTheme.borderStyleColor,
    borderWidth: 1,
  },
  initialText: {
    fontSize: udyamitaTheme.themeFontSizeModalLabel,
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    color: udyamitaTheme.primaryColor,
    textAlign: 'center',
  },
  input: {
    borderWidth: 0.5,
    borderColor: udyamitaTheme.borderStyleColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 6,
    width: '70%',
    paddingRight: 10,
  },
  commentInputWrap: {
    // marginBottom: 15,
    flexDirection: 'row',
    paddingHorizontal: 10,
    borderColor: 'lightgrey',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopColor: udyamitaTheme.themeBgColor,
    borderBottomWidth: 0.5,
    paddingBottom: 10,
  },
  commentTextInput: {
    minHeight: 20,
    height: 48,
    width: '75%',
    fontSize: udyamitaTheme.themeFontSizeLabel,
    marginTop: 5,
    marginLeft: 10,
    flexWrap: 'wrap',
    color: 'black',
    borderWidth: 0.5,
    borderColor: udyamitaTheme.borderStyleColor,
    //backgroundColor:"#CFD8DC",
    borderRadius: 6,
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    padding: 10,
    // position: 'absolute',
  },
  commentBox: {
    backgroundColor: udyamitaTheme.themeBgColor,
    borderRadius: 10,
    opacity: 0.4,
    marginLeft: 50,
    marginTop: 10,
    padding: 10,
  },
  sendIcon: {
    width: 24,
    height: 34,
    marginLeft: 5,
  },
  likeCount: {
    fontSize: udyamitaTheme.themeFontSizeCardMiniLabel,
    alignSelf: 'center',
    // marginLeft: 5,
    color: 'grey',
    fontFamily: udyamitaTheme.mainThemeFontFamily,
  },
  topContainer: {
    flexDirection: 'column',
    //alignItems: 'center',
  },
  userName: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
    color: '#000000',
  },
  comment: {
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
    color: udyamitaTheme.textColor,
    //marginLeft: 50,
  },
  text: {
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
    paddingLeft: 5,
    opacity: 0.8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: udyamitaTheme.themeBgColor,
    height: 50,
    paddingHorizontal: 20,
  },
  item: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    fontSize: udyamitaTheme.themeFontSizeButton,
    color: udyamitaTheme.textColor,
  },
});
