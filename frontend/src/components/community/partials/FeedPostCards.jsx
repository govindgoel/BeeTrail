import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  TextInput,
  Modal,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Carousel, {Pagination} from 'react-native-snap-carousel-v4';
import Video from 'react-native-video';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import moment from 'moment';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
  storeValueByKey,
  storeUser,
  getToken,
  getValueByKey,
  getUser,
} from '../../../helpers/UserData';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import {APP_API_COMMUNITY_URL} from '@env';
import Toast from 'react-native-simple-toast';
import {useTranslation} from 'react-i18next';
import axios from 'axios';
import CommentSection from '../../../screens/community/CommentSection';
import CustomText from '../../reusable/CustomText';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import dynamicLinks from '@react-native-firebase/dynamic-links';

const FeedPostCard = ({
  post,
  communityId,
  communityData,
  addLike,
  handleShare,
  handleDeletePost,
  setDeletedPost,
  deletedPost,
  postId,
  handleEditPost,
  selectedEditPost,
  getCommunityPostById
}) => {
  //console.log("postt",post?.userName)
  const bottomSheetRef = useRef();
  const bottomSheetRefForMoreInfo = useRef();

  const [showCommentSection, setShowCommentSection] = useState(false);
  const [userInfo, setUserInfo] = useState(false);
  // const [deletedPost, setDeletedPost] = useState(false);
  const {t, i18n} = useTranslation();
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  const togglePlayPause = () => {
    setIsPaused(!isPaused);
  };
  const renderCarouselItem = ({item}) => {
    try {
      if (item.endsWith('.mp4')) {
        return (
          <View>
            <Video
              source={{uri: item}}
              style={styles.carouselVideo}
              fullscreen={false}
              controls={false}
              resizeMode="contain"
              hideShutterView={true}
              onEnd={() => {
                setIsPaused(true);
              }}
              paused={isPaused} // You can set it to false to autoplay
            />
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity onPress={togglePlayPause}>
                <Image
                  source={
                    isPaused
                      ? require('../../../assets/images/Play.png')
                      : require('../../../assets/images/Pause.png')
                  }
                  style={{width: 50, height: 50}}
                />
              </TouchableOpacity>
            </View>
          </View>
        );
      } else {
        return <Image source={{uri: item}} style={styles.carouselImage} />;
      }
    } catch (error) {
      console.error('Error loading media:', error);
      return null;
    }
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
      // console.log('user idddd', userInfo.name);
    }, []),
  );
  const getDurationOfPost = () => {
    const parsedDate = moment(post?.createdAt);

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
  const onClose = () => {
    bottomSheetRef.current.close();
    getCommunityPostById(communityId);
  };
  const renderCommentSheetContent = () => (
    <CommentSection
      show={showCommentSection}
      onClose={() => onClose()}
      //commentHappened={data => commentHappened(data)}
      postId={postId}
      communityId={communityId}
      //displayCommentSection={() => {
      //setShowCommentSection(!showCommentSection);
      // }}
    />
  );
const openSheet = () =>{
  bottomSheetRef.current.open();
  //getCommunityPostById(communityId);
}
  const generateLink = async () => {
    try {
      const link = await dynamicLinks().buildShortLink(
        {
          link: `https://thehumblebee.page.link/community-post?communityId=${communityId}`,
          domainUriPrefix: 'https://thehumblebee.page.link',
          android: {
            packageName: 'co.thehumblebee.beekind',
          },
        },
        dynamicLinks.ShortLinkType.DEFAULT,
      );
      // console.log('dynamic --- link ==>> >> >>>', link);
      return link;
    } catch (error) {
      console.log('Generating Link Error:', error);
    }
  };

  const copyToClipboard = async linkToCopy => {
    const deepLink = await generateLink(communityId);
    try {
      Clipboard.setString(`${deepLink}`);

      Toast.show(`${t('thisLinkIsCopiedToClipBoard')}`, Toast.LONG);

      bottomSheetRefForMoreInfo.current.close();
    } catch (error) {
      console.error('Failed to copy link to clipboard', error);
    }
  };
  const reportPost = async id => {
    const token = await getValueByKey('token');

    const config = {headers: {Authorization: 'Bearer ' + token}};
    await axios
      .post(`${APP_API_COMMUNITY_URL}/post/report/${id}`, null, config)
      .then(response => {
        if (response.status === 200) {
          Toast.show(`${t('reportReviewByTeam')}`, Toast.SHORT);
          bottomSheetRefForMoreInfo.current.close();
        }
      })
      .catch(err => {
        console.log('error while reporting post', err);
      });
  };
  const renderMoreInfo = () => (
    <View>
      <View
        style={{
          borderBottomWidth: 0.5,
          borderBottomColor: udyamitaTheme.borderStyleColor,
          height: 20,
        }}
      />
      <View style={{flexDirection: 'column', marginLeft: 30, marginRight: 30}}>
        {post.createdBy === userInfo._id ? (
          <>
            <TouchableOpacity style={styles.items} onPress={handleEditPost}>
              <Image
                source={require('../../../assets/images/Editicon.png')}
                style={styles.itemIcon}
              />
              <View style={{flexDirection: 'column'}}>
                <CustomText style={styles.itemLabel} type="btn">
                  {t('editPost')}
                </CustomText>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.items}
              onPress={() => {
                setDeletedPost(postId);
              }}>
              <Image
                source={require('../../../assets/images/Deleteicon.png')}
                style={styles.itemIcon}
              />
              <CustomText style={styles.itemLabel} type="btn">
                {t('deletePost')}
              </CustomText>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* <TouchableOpacity
              style={styles.items}
              onPress={() => reportPost(postId)}>
              <Image
                source={require('../../../assets/images/Reportpost.png')}
                style={styles.itemIcon}
              />
              <View style={{flexDirection: 'column'}}>
                <CustomText style={styles.itemLabel}>{t("reportPost")}</CustomText>
                <CustomText
                  numberOfLines={3}
                  style={{
                    fontFamily: udyamitaTheme.mainThemeFontFamily,
                    fontSize: udyamitaTheme.themeFontSizeLabel,
                    paddingTop: 3,
                    marginRight: '10%',
                  }}>
                 {t("weWontLet")} {post.userName?.name} {t("knowWhoReportedThis")}
                </CustomText>
              </View>
            </TouchableOpacity> */}

            <TouchableOpacity
              style={styles.items}
              onPress={() => copyToClipboard()}>
              <Image
                source={require('../../../assets/images/Copy.png')}
                style={styles.itemIcon}
              />
              <CustomText style={styles.itemLabel} type="btn">
                {t('copyLink')}
              </CustomText>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
  //console.log("kjhgfd",post?.userName?.profilePictureUrl)
  return (
    <View style={styles.postCard}>
      <View style={styles.userInfo}>
        {[undefined, null, ''].includes(post?.userName?.profilePictureUrl) &&
        [undefined, null, ''].includes(post?.userName?.photo) ? (
          <View style={styles.userInitial}>
            <CustomText style={styles.initialText} type="mlabel">
              {post?.userName?.name?.charAt(0)}
            </CustomText>
          </View>
        ) : (
          <Image
            source={{
              uri: post?.userName?.profilePictureUrl || post?.userName?.photo,
            }}
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              resizeMode: 'contain',
              marginRight: 20,
            }}
          />
        )}

        <View style={styles.userNameAndTime}>
          <CustomText style={styles.userName} type="label">
            {post?.userName?.name}{' '}
          </CustomText>

          <View style={{flexDirection: 'row'}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={require('../../../assets/images/Active.png')}
                style={{width: 14, height: 14}}
              />
              <CustomText style={styles.postTime} type="sm">
                {post?.createdAt ? getDurationOfPost() : null}
              </CustomText>
            </View>
            {post?.createdBy === communityData?.createdBy ? (
              <View
                style={{
                  flexDirection: 'row',
                  marginLeft: '2%',
                  alignItems: 'center',
                }}>
                <Image
                  style={{height: 12, width: 12}}
                  source={require('../../../assets/images/Admin.png')}
                />
                <CustomText
                  style={{
                    fontSize: udyamitaTheme.themeFontSizeSmall,
                    fontFamily: udyamitaTheme.mainThemeFontFamily,
                    color: udyamitaTheme.textColor,
                  }}
                  type="sm">
                  {t('admin')}
                </CustomText>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  marginLeft: '2%',
                  alignItems: 'center',
                }}>
                <Image
                  style={{height: 13, width: 13}}
                  source={require('../../../assets/images/user.png')}
                />
                <CustomText
                  style={{
                    fontSize: udyamitaTheme.themeFontSizeSmall,
                    fontFamily: udyamitaTheme.mainThemeFontFamily,
                    marginLeft: 3,
                  }}
                  type="sm">
                  {t('member')}
                </CustomText>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity
          onPress={() => bottomSheetRefForMoreInfo.current.open()}>
          <Image
            source={require('../../../assets/images/More.png')}
            style={{width: 24, height: 25}}
          />
        </TouchableOpacity>
        <RBSheet
          ref={bottomSheetRefForMoreInfo}
          closeOnDragDown={true}
          closeOnPressBack
          height={200}
          duration={250}
          customStyles={{
            container: {
              borderTopLeftRadius: 40,
              borderTopRightRadius: 40,
            },
          }}>
          {renderMoreInfo()}
        </RBSheet>
      </View>
      <CustomText style={styles.postText} type="btn">
        {post?.caption}
      </CustomText>
      {post?.mediaUrls.length >= 1 ? (
        <View style={styles.postContent}>
          {post?.mediaUrls?.length > 1 ? (
            <>
              <Carousel
                data={post.mediaUrls}
                renderItem={renderCarouselItem}
                sliderWidth={windowWidth}
                itemWidth={windowWidth}
                onSnapToItem={index => setCarouselIndex(index)}
                pagination={true}
                dotStyle={styles.paginationDot}
                inactiveDotStyle={styles.inactivePaginationDot}
              />
            </>
          ) : (
            <>
              {post?.mediaUrls[0]?.endsWith('.mp4') ? (
                <View>
                  <Video
                    source={{uri: post.mediaUrls[0]}}
                    style={styles.postVideo}
                    fullscreen={false}
                    controls={false}
                    resizeMode="contain"
                    hideShutterView={true}
                    onEnd={() => {
                      setIsPaused(true);
                    }}
                    paused={isPaused} // You can set it to false to autoplay
                  />
                  <View
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity onPress={togglePlayPause}>
                      <Image
                        source={
                          isPaused
                            ? require('../../../assets/images/Play.png')
                            : require('../../../assets/images/Pause.png')
                        }
                        style={{width: 50, height: 50}}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <Image
                  source={{uri: post.mediaUrls[0]}}
                  style={styles.postImage}
                />
              )}
            </>
          )}
          {post.mediaUrls && post?.mediaUrls.length > 1 && (
            <View style={styles.imageCounter}>
              <CustomText style={styles.imageCounterText} type="sh">
                {carouselIndex + 1}/{post.mediaUrls.length}
              </CustomText>
            </View>
          )}
        </View>
      ) : (
        <View
          style={{
            borderBottomColor: udyamitaTheme.borderStyleColor,
            borderBottomWidth: 0.5,
            marginBottom: 10,
            marginTop: 10,
          }}
        />
      )}
      {post?.mediaUrls?.length > 1 && post?.mediaUrls?.length <=3  ? (
        <Pagination
          dotsLength={post.mediaUrls.length}
          activeDotIndex={carouselIndex}
          containerStyle={styles.paginationContainer}
          dotStyle={styles.paginationDot}
          inactiveDotStyle={styles.inactivePaginationDot}
        />
      ):post?.mediaUrls?.length >= 4 && (
        <Pagination
          dotsLength={post.mediaUrls.length}
          activeDotIndex={carouselIndex}
          containerStyle={styles.paginationContainerForMoreImages}
          dotStyle={styles.paginationDotStyle}
          inactiveDotStyle={styles.inactivePaginationDotStyle}
        />
      )}

      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 10,
          //paddingTop:10
          borderBottomWidth: 0.5,
          borderColor: udyamitaTheme.borderStyleColor,
          paddingTop: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('../../../assets/images/LikesNew.png')}
            style={{width: 20, height: 20, marginRight: 5}}
          />
          <CustomText style={styles.responseText} type="ml">
            {post?.likeCount}
          </CustomText>
        </View>

        {/* <CustomText style={styles.responseText}>
          {' '}
          {post?.likeCount !== 1
            ? `${post?.likeCount} Likes`
            : `${post?.likeCount} Like`}
        </CustomText> */}
        <View style={{flexDirection: 'row'}}>
          <CustomText style={styles.responseText} type="ml">
            {' '}
            {post.totalCommentCount !== 1
              ? `${post.totalCommentCount} ${t('comments')} . `
              : `${post.totalCommentCount} ${t('comment')} . `}
          </CustomText>
          <CustomText style={styles.responseText} type="ml">
            {post.totalSharedCount}{' '}
            {post?.totalSharedCount <= 1
              ? `${t('shareOne')}`
              : `${t('shares')}`}{' '}
          </CustomText>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => addLike()}>
          {post?.isLikedByUser === 1 ? (
            <Image
              source={require('../../../assets/images/Like_active.png')}
              style={{width: 28, height: 28}}
            />
          ) : (
            <Image
              source={require('../../../assets/images/Like_inactive.png')}
              style={{width: 28, height: 28}}
            />
          )}

          <CustomText
            style={[
              styles.actionText,
              {
                color:
                  post.isLikedByUser === 1
                    ? udyamitaTheme.primaryColor
                    : udyamitaTheme.textColor,
              },
            ]}
            type="ml">
            {post.isLikedByUser === 1 ? t('liked') : t('like')}
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => openSheet()}>
          <Image
            source={require('../../../assets/images/Comment.png')}
            style={{width: 28, height: 28}}
          />
          <CustomText style={styles.actionText} type="ml">
            {t('comment')}
          </CustomText>
        </TouchableOpacity>
        <RBSheet
          ref={bottomSheetRef}
          closeOnDragDown={false}
          closeOnPressBack
          height={windowHeight}
          duration={250}
          customStyles={{
            container: {
              borderTopLeftRadius: 40,
              borderTopRightRadius: 40,
            },
          }}>
          {renderCommentSheetContent()}
        </RBSheet>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleShare()}>
          <Image
            source={require('../../../assets/images/Send_post.png')}
            style={{width: 28, height: 28}}
          />
          <CustomText style={styles.actionText} type="ml">
            {t('share')}
          </CustomText>
        </TouchableOpacity>
      </View>
      <Modal
        visible={deletedPost !== false}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setDeletedPost(false);
          // setActionSnackbar(false);
        }}>
        <View style={styles.modalWrap}>
          <View style={styles.modalContainer}>
            <CustomText style={styles.warningDeleteText} type="btn">
              {t('areYouSureWantToDeleteThisPost')}
            </CustomText>
            <View style={styles.btnWrap}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => {
                  handleDeletePost(deletedPost).then(() => {
                    bottomSheetRefForMoreInfo.current.close();
                  });
                  // bottomSheetRef.current.close();
                }}>
                <CustomText style={styles.btnTxt} type="btn">
                  {t('delete')}
                </CustomText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, {backgroundColor: 'grey'}]}
                onPress={() => {
                  setDeletedPost(false);
                  // setActionSnackbar(false);
                }}>
                <CustomText style={styles.btnTxt} type="btn">
                  {t('cancel')}
                </CustomText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FeedPostCard;

const styles = {
  postVideo: {
    width: windowWidth, // Adjust width as needed
    height: 360, // Adjust height as needed
    backgroundColor: 'black', // Background color while loading
    resizeMode: 'cover',
  },
  btnWrap: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '10%',
    justifyContent: 'space-between',
  },
  btn: {
    backgroundColor: udyamitaTheme.primaryColor,
    height: 35,
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderRadius: 5,
  },
  btnTxt: {
    color: 'white',
    fontSize: udyamitaTheme.themeFontSizeButton,
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    textTransform: 'capitalize',
  },
  warningDeleteText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    fontSize: udyamitaTheme.themeFontSizeButton,
  },
  modalContainer: {
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    minHeight: 100,
    backgroundColor: 'white',
    borderRadius: 6,
    // paddingBottom: 40
  },
  modalWrap: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    height: '90%',
    justifyContent: 'center',
  },
  responseText: {
    color: udyamitaTheme.textColor,
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    // fontSize: udyamitaTheme.themeFontSizeSmallHeader,
    fontSize: RFValue(10),
  },
  postCard: {
    backgroundColor: '#fff',
    paddingTop: 10,
    //padding: 10,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: udyamitaTheme.borderStyleColor,
    marginTop: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingLeft: 20,
    paddingRight: 20,
  },
  userInitial: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderColor: udyamitaTheme.borderStyleColor,
    borderWidth: 1,
  },
  initialText: {
    fontSize: udyamitaTheme.themeFontSizeModalLabel,

    color: udyamitaTheme.primaryColor,
  },
  userNameAndTime: {
    flex: 1,
  },
  userName: {
    // fontSize: udyamitaTheme.themeFontSizeLabel,
    fontSize: RFValue(12),
    color: udyamitaTheme.textColor,
    // marginTop: 10,
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
  },
  postTime: {
    color: '#888',
    fontSize: udyamitaTheme.themeFontSizeSmall,
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    paddingLeft: 5,
  },
  postContent: {
    marginTop: 10,
    //marginLeft: -10,
  },
  postImage: {
    width: windowWidth,
    height: 360,
    marginBottom: 5,
    resizeMode: 'cover',
    alignItems: 'center',
  },
  carouselImage: {
    // width: 300,
    height: 200,

    resizeMode: 'cover',
  },
  carouselVideo: {
    //width: '100%',
    height: 200,
    backgroundColor: 'black',
  },
  imageCounter: {
    position: 'absolute',
    top: 10,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 6,
    // paddingHorizontal: 6,
    // paddingVertical: 2,
    width: 45,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageCounterText: {
    color: '#fff',
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
  },
  postText: {
    fontSize: RFValue(14),
    // fontSize: udyamitaTheme.themeFontSizeLabel,
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    marginTop: 15,
    paddingLeft: 25,
    paddingRight: 20,
    color: udyamitaTheme.textColor,
  },
  actions: {
    flexDirection: 'row',

    //marginTop: 10,

    paddingBottom: 10,
    paddingTop: 5,
    marginHorizontal: 10,
    justifyContent: 'space-between',
  },

  actionButton: {
    //flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginHorizontal: 5,
  },
  actionText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    // fontSize: udyamitaTheme.themeFontSizeLabel,
    fontSize: RFValue(10),
    textTransform: 'capitalize',
    color: udyamitaTheme.textColor,
  },
  paginationContainer: {
    alignSelf: 'center',
    //paddingVertical: 5,
   // paddingHorizontal: 20,
    marginTop:10,
  },
 
  paginationDot: {
    width: 15,
    height: 5,
    borderRadius: 6,
    marginHorizontal: 5,
    backgroundColor: udyamitaTheme.primaryColor,
  },
  
  inactivePaginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: 'grey',
  },
  paginationContainerForMoreImages:{
    alignSelf: 'center',
    flexDirection: 'row', // Align dots horizontally
    alignItems: 'center', // Center dots vertically
    paddingVertical: 5,
    marginTop: 10,
    width: '20%',
   
  },
  paginationDotStyle: {
    width: 8,
    height: 5,
    borderRadius: 6,
    marginHorizontal: -35,
    backgroundColor: udyamitaTheme.primaryColor,
  },
  inactivePaginationDotStyle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: -35,
    backgroundColor: 'grey',
  },
  items: {
    flexDirection: 'row',
    marginTop: 25,
    alignItems: 'center',
  },
  itemLabel: {
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    fontSize: udyamitaTheme.themeFontSizeButton,
    color: '#000000',
  },
  iconstyle: {
    height: 15,
    width: 29,
    marginRight: 10,
  },
  iconstyle2: {
    height: 18,
    width: 18,
    marginRight: 10,
  },
  itemIcon: {
    width: 32,
    height: 32,
    marginRight: 10,
  },
  itemIcon2: {
    width: 23,
    height: 28,
    marginRight: 12,
    marginLeft: 5,
  },
};
