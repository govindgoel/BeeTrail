import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import CustomAlertToDelete from '../../reusable/generic/CustomAlertToDelete';
import Toast from 'react-native-simple-toast';
import React, {useEffect, useState, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import RBSheet from 'react-native-raw-bottom-sheet';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import {getValueByKey, getUser} from '../../../helpers/UserData';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import axios from 'axios';
import moment from 'moment';
import {APP_API_LIBRARY_URL} from '@env';

import VideoCommentReplies from './VideoCommentReplies';
import CommentSectionPlaceholder from '../../reusable/generic/CommentSectionPlaceholder';
import NoComments from '../../reusable/generic/NoComments';
import CustomText from '../../reusable/CustomText';

//const APP_API_LIBRARY_URL = "https://le-library.loca.lt";

const windowHeight = Dimensions.get('window').height;
const VideoComments = ({onClose, videoId}) => {
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const textInputRef = useRef();
  const placeHolderARR = [1, 2, 3, 4, 5, 6, 7, 8];
  const [loading, setLoading] = useState(false);
  const [commentIdToDeleteOrEdit, setCommentIdToDeleteOrEdit] = useState(null);
  const [commentIdToReply, setCommentIdToReply] = useState(null);
  const bottomSheetRef = useRef();
  const {t, i18n} = useTranslation();
  const [userInfo, setUserInfo] = useState(false);
  const [comments, setComments] = useState([]);
  const [myReply, setMyReply] = useState('');
  const [myComment, setMyComment] = useState(null);
  const [showReplies, setShowReplies] = useState(null);
  const [replayTo, setReplyTo] = useState(null);
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

  const likeComment = async id => {
    const token = await getValueByKey('token');
    const config = {headers: {Authorization: 'Bearer ' + token}};
    axios
      .put(`${APP_API_LIBRARY_URL}/comment-like/${id}`, null, config)
      .then(response => {
        if (response.status === 200) {
          fetchComments();
        }
      })
      .catch(err => console.log('ERR while liking comment', err.response));
  };
  useFocusEffect(
    React.useCallback(() => {
      const getUserInfo = async () => {
        const user = await getUser();
        if (user && user.userInfo) {
          setUserInfo(user.userInfo);
        }
      };
      getUserInfo();
      // console.log('user idddd', userInfo._id);
    }, []),
  );
  const fetchComments = async () => {
    setLoading(true);
    const token = await getValueByKey('token');
    const config = {headers: {Authorization: 'Bearer ' + token}};

    axios
      .get(`${APP_API_LIBRARY_URL}/comment/byVideo/${videoId}`, config)

      .then(response => {
        setComments(response?.data?.comments);

        setLoading(false);
      })
      .catch(err => console.log('ERR while getting comments', err));
  };

  const addReply = async () => {
    const data = {
      comment: myComment,
      replyTo: commentIdToReply,
      videoId,
      userId: userInfo._id,
      type: 'reply',
    };

    const token = await getValueByKey('token');
    const config = {headers: {Authorization: 'Bearer ' + token}};
    await axios
      .post(`${APP_API_LIBRARY_URL}/comment`, data, config)
      .then(response => {
        if (response.status === 200) {
          setMyComment('');
          setCommentIdToReply('');

          Toast.show(`${t('yourReplyHasBeenPosted')}`, Toast.LONG);
          fetchComments();
        }
      })
      .catch(err => console.log('ERR while adding Reply', err.response));
  };
  const addComment = async () => {
    const data = {
      comment: myComment,
      videoId,
      userId: userInfo._id,
      type: 'primary',
    };

    const token = await getValueByKey('token');
    const config = {headers: {Authorization: 'Bearer ' + token}};

    axios
      .post(`${APP_API_LIBRARY_URL}/comment`, data, config)
      .then(response => {
        if (response.status === 200) {
          setMyComment('');

          Toast.show(`${t('yourCommentHasbeenPosted')}`, Toast.LONG);
          fetchComments();
        }
      })
      .catch(err => console.log('err while posting comment', err));
  };

  useEffect(() => {
    fetchComments();
  }, []);
  const handleLogoutCancel = () => {
    setDeleteModalVisible(false);
  };

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
          bottomSheetRef.current.close();
          Toast.show(`${t('commentDeleted')}`, Toast.LONG);
          fetchComments();
        }
      })
      .catch(err => console.log('ERR', err));
  };
  const handleReplyPress = id => {
    if (textInputRef.current) {
      textInputRef.current.focus();
      setCommentIdToReply(id);
    }
  };
  const RenderSheetContent = () => (
    <View style={{marginLeft: 40, marginTop: 30}}>
      <TouchableOpacity
        onPress={() => bottomSheetRef.current.close()}
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
        <CustomText style={styles.item} type="btn">
          {t('deleteComment')}
        </CustomText>
      </TouchableOpacity>
      <CustomAlertToDelete
        visible={isDeleteModalVisible}
        title={t('deleteComment')}
        message={t('areYouSureYouWantToDeleteThisComment')}
        onCancel={handleLogoutCancel}
        onConfirm={() => deleteComment()}
        otherText={t('yesProceed')}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <CustomText
          style={{
            fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
            color: udyamitaTheme.textColor,
            fontSize: udyamitaTheme.themeFontSizeModalLabel,
            marginLeft: 10,
          }}
          type="mlabel">
          {t('comments')}
        </CustomText>
        <TouchableOpacity onPress={() => onClose()}>
          <Image
            source={require('../../../assets/images/Cross.png')}
            style={{width: 24, height: 24}}
          />
        </TouchableOpacity>
      </View>

      <View
        style={{
          ...styles.commentInputWrap,
        }}>
        {[undefined, null, ''].includes(userInfo?.profilePictureUrl) &&
        [undefined, null, ''].includes(userInfo?.photo) ? (
          <View style={styles.userInitial}>
            <CustomText style={styles.initialText} type="mlabel">
              {(userInfo?.name && userInfo?.name[0]) || ''}
            </CustomText>
          </View>
        ) : (
          <Image
            source={{uri: userInfo?.profilePictureUrl || userInfo?.photo}}
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              resizeMode: 'contain',
              marginRight: 20,
            }}
          />
        )}

        <TextInput
          placeholder={t('addAComment')}
          multiline
          //numberOfLines={2}
          value={myComment}
          style={styles.commentTextInput}
          placeholderTextColor={'#ABB2B9'}
          onChangeText={t => setMyComment(t)}
          autoFocus={true}
          ref={textInputRef}
        />

        <TouchableOpacity
          style={{alignSelf: 'center'}}
          onPress={() => (commentIdToReply ? addReply() : addComment())}>
          <Image
            source={require('../../../assets/images/SendMsg.png')}
            style={styles.sendIcon}
          />
        </TouchableOpacity>
      </View>
      <ScrollView
        scrollEnabled={true}
        contentContainerStyle={{
          marginLeft: 15,
          marginRight: 15,
          marginTop: 15,
          //   height: 'auto',
          //   flex: 0,
        }}>
        {loading ? (
          placeHolderARR.map((x, index) => (
            <CommentSectionPlaceholder key={x} />
          ))
        ) : comments.length > 0 ? (
          comments?.map(x => (
            <View key={x._id} styles={{flexDirection: 'row'}}>
              {[undefined, null, ''].includes(x.userId?.profilePictureUrl) ||
              [undefined, null, ''].includes(x.userId?.photo) ? (
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
                  <CustomText style={styles.initialText} type="mlabel">
                    {x.userId?.name[0] || ''}
                  </CustomText>
                </View>
              ) : (
                <Image
                  source={{uri: x.userId?.profilePictureUrl || x.userId?.photo}}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    resizeMode: 'contain',
                    marginRight: 20,
                  }}
                />
              )}

              <View
                style={{
                  backgroundColor: 'rgba(203, 203, 203, 0.2)',
                  width: '70%',
                  marginLeft: 50,
                  marginTop: -30,
                  borderRadius: 6,
                  padding: 10,
                }}
                // onPress={() => {
                //   setCommentIdToDeleteOrEdit(x._id);
                //   bottomSheetRef.current.open();
                // }}
              >
                <View style={{flexDirection: 'column'}} pointerEvents="none">
                  <CustomText style={styles.userName} type="sh">
                    {x?.userId?.name || ''}
                  </CustomText>
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
                      type="sm">
                      {getDurationOfComment(x)}
                    </CustomText>
                  </View>
                  <CustomText style={styles.comment} type="sh">
                    {x.comment}
                  </CustomText>
                </View>
              </View>
              <TouchableOpacity
                style={{
                  flexDirection: 'column',
                  alignSelf: 'flex-end',
                  right: 10,
                  position: 'absolute',
                  alignItems: 'center',
                  top: 10,
                }}
                disabled={x?.userId?._id !== userInfo?._id}
                onPress={() => {
                  setCommentIdToDeleteOrEdit(x._id);
                  bottomSheetRef.current.open();
                }}>
                {x?.userId?._id === userInfo?._id ? (
                  <Image
                    source={require('../../../assets/images/More.png')}
                    style={{width: 20, height: 20}}
                  />
                ) : null}
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: 'column',
                  alignSelf: 'flex-end',
                  right: 10,
                  position: 'relative',
                  alignItems: 'center',

                  justifyContent: 'center',
                  bottom: 40,
                }}>
                <TouchableOpacity onPress={() => likeComment(x._id)}>
                  {x.liked === true ? (
                    <Image
                      source={require('../../../assets/images/Like_active.png')}
                      style={{width: 25, height: 25}}
                    />
                  ) : (
                    <Image
                      source={require('../../../assets/images/Like_inactive.png')}
                      style={{width: 25, height: 25}}
                    />
                  )}
                </TouchableOpacity>
                <CustomText style={styles.likeCount} type="xs">
                  {x.likes}
                </CustomText>
              </View>

              <View style={{flexDirection: 'column'}}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginLeft: 60,
                    marginTop: 10,
                    marginBottom: 8,
                    alignItems: 'center',
                    position: 'absolute',
                    top: -40,
                  }}>
                  <Image
                    source={require('../../../assets/images/Reply.png')}
                    style={{width: 20, height: 20}}
                  />
                  <TouchableOpacity onPress={() => handleReplyPress(x._id)}>
                    <CustomText style={styles.text} type="sh">
                      {t('reply')}
                    </CustomText>
                  </TouchableOpacity>
                </View>
                {x.replyCount > 0 ? (
                  showReplies !== x?._id ? (
                    <TouchableOpacity
                      onPress={() => setShowReplies(x?._id)}
                      style={{marginLeft: 60, marginBottom: 10}}>
                      <CustomText style={styles.text} type="sh">
                        {t('view')} {x.replyCount}{' '}
                        {x.replyCount > 1 ? `${t('replies')}` : `${t('reply')}`}
                      </CustomText>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => setShowReplies(null)}
                      style={{marginLeft: 60, marginBottom: 18}}>
                      <CustomText style={styles.text} type="sh">
                        {t('hide')}{' '}
                        {x.replyCount > 1 ? `${t('replies')}` : `${t('reply')}`}
                      </CustomText>
                    </TouchableOpacity>
                  )
                ) : null}
              </View>
              {showReplies === x?._id ? (
                <VideoCommentReplies
                  handleReplyPress={() => handleReplyPress(x._id)}
                  id={x._id}
                  userInfo={userInfo}
                  likeComment={likeComment}
                />
              ) : null}
            </View>
          ))
        ) : (
          <NoComments />
        )}
      </ScrollView>

      <RBSheet
        ref={bottomSheetRef}
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
  );
};

export default VideoComments;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 35,
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
    marginRight: 12,
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
    paddingHorizontal: 24,
    borderColor: 'lightgrey',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopColor: udyamitaTheme.themeBgColor,
    borderBottomWidth: 0.5,
    paddingBottom: 12,
    marginTop: 10,
    // marginBottom:10
  },
  commentTextInput: {
    minHeight: 20,
    //height: 48,
    width: '70%',
    fontSize: udyamitaTheme.themeFontSizeLabel,
    marginTop: 5,
    //marginLeft: 10,
    flexWrap: 'wrap',
    color: 'black',
    borderWidth: 0.5,
    borderColor: udyamitaTheme.borderStyleColor,
    //backgroundColor:"#CFD8DC",
    borderRadius: 6,
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    padding: 10,
    marginRight: 8,
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
    fontSize: udyamitaTheme.themeFontSizeExtraSmall,
    alignSelf: 'center',
    //marginLeft: 5,
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
    height: 60,
    paddingHorizontal: 20,
  },
  item: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    fontSize: udyamitaTheme.themeFontSizeButton,
    color: udyamitaTheme.textColor,
  },
});
