import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {APP_API_COMMUNITY_URL} from '@env';
import React, {useState, useRef, useEffect} from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import axios from 'axios';
import Video from 'react-native-video';
import {getValueByKey} from '../../../helpers/UserData';
import {useTranslation} from 'react-i18next';
// import useTransliteratedName from '../../../helpers/hooks/useTransliteratedName';
// const [showCommentSection, setShowCommentSection] = useState(false);
import CommentSection from '../../../screens/community/CommentSection';
import {
  udyamitaTheme,
  udyamitaThemeSm,
  udyamitaThemeLg,
} from '../../../config/styles/udyamitaTheme';
import Carousel, {Pagination} from 'react-native-snap-carousel-v4';
import {useDynamicTheme} from '../../../helpers/hooks/useDynamicTheme';

import {useSelector} from 'react-redux';
import CustomText from '../../reusable/CustomText';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ForYouPostCard = ({
  userName,
  caption,
  communityName,
  communityLogo,
  postImages,
  navigation,
  postedTime,
  likeCount,
  totalCommentCount,
  isLikedByUser,
  addLike,
  onShare,
  postId,
  communityId,
  totalSharedCount,
  partOfCommunity,
  activeTab
}) => {
  // const transliteratedName = useTransliteratedName(communityName);
  // const transliteratedUserName = useTransliteratedName(userName);
  // console.log("total",totalCommentCount)
  const {t} = useTranslation();
  const bottomSheetRef = useRef();
  const currTheme = useDynamicTheme();
  // console.log('currTheme: ', currTheme);
  const themeType = useSelector(state => state?.entrepreneur?.themeType);
  // console.log('themeType: ', themeType);
  // console.log('currDynTheme: ', currDynTheme);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [communityData, setCommunityData] = useState([]);
  const [actTheme, setActTheme] = useState({});
  const [actLangTheme, setActLangTheme] = useState(udyamitaTheme);
  const [isPaused, setIsPaused] = useState(true);

  useEffect(() => {
    // console.log('useEffect themeType', themeType);
  }, [themeType]);

  useEffect(() => {
    if (currTheme) {
      setActLangTheme(currTheme);
    }
  }, [currTheme]);

  useEffect(() => {
    const {height, width} = Dimensions.get('screen');

    if (height < 800) {
      setActTheme(udyamitaThemeSm);
    } else {
      setActTheme(udyamitaTheme);
    }
  }, []);

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
  const getCommunityById = async () => {
    const token = await getValueByKey('token');
    const config = {headers: {Authorization: 'Bearer ' + token}};

    await axios
      .get(`${APP_API_COMMUNITY_URL}/community/${communityId}`, config)
      .then(response => {
        if (response.status === 200) {
          setCommunityData(response.data.community);
        }
      })
      .catch(err => {
        console.log(
          'error getting community details',
          err,
          err?.response?.errorMessage,
        );
      });
  };
  useEffect(() => {
    getCommunityById();
  }, []);
  const getCommunityPosts = async () => {
    const token = await getValueByKey('token');

    const config = {headers: {Authorization: 'Bearer ' + token}};

    await axios
      .get(`${APP_API_COMMUNITY_URL}/post`, config)
      .then(response => {
        if (response.status == 200) {
        }
      })
      .catch(err => {
        console.log(
          'error getting community post',
          err,
          err?.response?.errorMessage,
        );
      });
  };
  const getCommunityPostById = async id => {
    const token = await getValueByKey('token');

    const config = {headers: {Authorization: 'Bearer ' + token}};

    await axios
      .get(`${APP_API_COMMUNITY_URL}/post/${id}`, config)
      .then(response => {
        if (response.status == 200) {
        }
      })
      .catch(err => {
        console.log(
          'error getting community post',
          err,
          err?.response?.errorMessage,
        );
      });
  };
  const onClose = () => {
    bottomSheetRef.current.close();
    getCommunityPosts();
    getCommunityPostById(communityId);
  };
  const renderCommentSheetContent = () => (
    <CommentSection
      onClose={() => onClose()}
      // show={showCommentSection}
      commentHappened={data => commentHappened(data)}
      postId={postId}
      communityId={communityId}
      // displayCommentSection={() => {
      //   setShowCommentSection(!showCommentSection);
      // }}
    />
  );
  return (
    <View
      style={styles.cardContainer}
      onPress={() =>
        navigation.navigate('CommunityFeed', {communityData: communityData})
      }>
      <View style={styles.firstSection}>
        <TouchableOpacity
          style={[styles.row]}
          onPress={() =>
            navigation.navigate('CommunityFeed', {communityData: communityData,activeTab})
          }>
          {communityLogo ? (
            <Image source={{uri: communityLogo}} style={styles.profileImg} />
          ) : (
            <Image
              source={require('../../../assets/images/communityPlaceholderImage.png')}
              style={styles.profileImg}
            />
          )}
          <View style={{marginLeft: 10,paddingRight:50,}}>
            <View style={[styles.row]}>
         
              <CustomText style={styles?.communityTitle(actTheme)} type="btn">
                {communityName}
              </CustomText>
              {!partOfCommunity ? (
                <View style={styles.joinCommunity}>
                  <TouchableOpacity
                    style={{
                      //width: 80,
                      //height: 32,

                      borderWidth: 1,

                      padding: 5,
                      borderColor: udyamitaTheme.primaryColor,
                      borderRadius: 6,

                      // marginTop: -20,
                    }}
                    // disabled={
                    //   item?.isUserRegisterd?.status &&
                    //   ['Inactive', 'Active'].includes(
                    //     item?.isUserRegisterd?.status,
                    //   )
                    // }
                    onPress={() => {
                      navigation.navigate('CommunityFeed', {
                        communityData,activeTab
                      });
                    }}>
                    {/* <Text style={styles?.joinNow(actLangTheme)}>
                      {t('joinNow')}
                    </Text> */}
                    <CustomText
                      style={styles?.joinNow(actLangTheme)}
                      type="label">
                      {t('joinNow')}
                    </CustomText>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>

            <View style={styles.row}>
              <Image
                source={require('../../../assets/images/Public.png')}
                style={styles.smallIcons}
              />
              {/* <Text style={styles.postDetailText}>{t('public')}</Text> */}
              <CustomText style={styles.postDetailText} type="sh">
                {t('public')}
              </CustomText>
              <Image
                source={require('../../../assets/images/History.png')}
                style={styles.smallIcons}
              />
              <CustomText style={styles.postDetailText} type="sh">
                {postedTime}
              </CustomText>
              {/* <Text style={styles.postDetailText}>{postedTime}</Text> */}
            </View>
            <View style={styles.row}>
              <Image
                style={styles.smallIcons}
                source={require('../../../assets/images/user.png')}
              />
              {/* <Text style={styles.postDetailText}>{userName}</Text> */}
              <CustomText style={styles.postDetailText} type="sh">
                {userName}
              </CustomText>
            </View>
          </View>
        </TouchableOpacity>
        {caption ? (
          // <Text style={styles.postCaption(actLangTheme)}>{caption}</Text>
          <CustomText style={styles.postCaption(actLangTheme)} type="label">
            {caption}
          </CustomText>
        ) : null}
      </View>
      {postImages?.length >= 1 ? (
        <View style={styles.postContent}>
          {postImages?.length > 1 ? (
            <>
              <Carousel
                data={postImages}
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
              {postImages[0].endsWith('.mp4') ? (
                <View>
                  <Video
                    source={{uri: postImages[0]}}
                    style={styles.carouselVideo}
                    fullscreen={false}
                    controls={false}
                    resizeMode="contain"
                    hideShutterView={true}
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
                <Image source={{uri: postImages[0]}} style={styles.postImage} />
              )}
            </>
          )}
          {postImages && postImages?.length > 1 && (
            <View style={styles.imageCounter}>
              {/* <Text style={styles.imageCounterText}>
                {carouselIndex + 1}/{postImages?.length}
              </Text> */}
              <CustomText style={styles.imageCounterText} type="sh">
                {carouselIndex + 1}/{postImages?.length}
              </CustomText>
            </View>
          )}
        </View>
      ) : null}
      {postImages?.length > 1 && (
        <Pagination
          dotsLength={postImages?.length}
          activeDotIndex={carouselIndex}
          containerStyle={styles.paginationContainer}
          dotStyle={styles.paginationDot}
          inactiveDotStyle={styles.inactivePaginationDot}
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
          paddingTop:10
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
          <CustomText style={styles.responseText} type='ml'>{likeCount}</CustomText>
        </View>

   
        <View style={{flexDirection: 'row'}}>
          <CustomText style={styles.responseText} type='ml'>
            {' '}
            {totalCommentCount !== 1
              ? `${totalCommentCount} ${t('comments')} . `
              : `${totalCommentCount} ${t('comment')} . `}
          </CustomText>
          <CustomText style={styles.responseText} type='ml'>
            {totalSharedCount}{' '}
            {totalSharedCount <= 1
              ? `${t('shareOne')}`
              : `${t('shares')}`}{' '}
          </CustomText>
        </View>
      </View>
      {/* <View style={styles.actionsView}>
        <View style={styles.row}>
          <Image
            source={require('../../../assets/images/LikesPrimaryColor.png')}
            style={styles.iconStyle}
          />

          <CustomText style={styles.actionText} type="sh">
            {likeCount} {t('likes')}
          </CustomText>
        </View>
        <View style={[styles.row]}>
          <Image
            source={require('../../../assets/images/CommentsPrimaryColor.png')}
            style={styles.iconStyle}
          />
     
          <CustomText style={styles.actionText} type="sh">
            {totalCommentCount} {t('comments')}
          </CustomText>
        </View>
        <View style={[styles.row]}>
         
           
          <CustomText style={styles.actionText} type="sh">
            {' '}
            {totalSharedCount}{' '}
            {totalSharedCount <= 1 ? `${t('shareOne')}` : `${t('shares')}`}{' '}
          </CustomText>
        </View>
      </View> */}
      <View style={styles.actionable}>
        <TouchableOpacity style={styles.action} onPress={() => addLike()}>
          <Image
            source={
              isLikedByUser === 1
                ? require('../../../assets/images/Like_active.png')
                : require('../../../assets/images/Like_inactive.png')
            }
            style={styles.actionImg}
          />
    
          <CustomText style={styles.actionText} type="sh">
            {isLikedByUser === 1 ? t('liked') : t('like')}
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.action}
          onPress={() => bottomSheetRef.current.open()}>
          <Image
            source={require('../../../assets/images/Comment.png')}
            style={styles.actionImg}
          />
        
          <CustomText style={styles.actionText} type="sh">
            {t('comment')}
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.action} onPress={onShare}>
          <Image
            source={require('../../../assets/images/Send_post.png')}
            style={styles.actionImg}
          />
       
          <CustomText style={styles.actionText} type="sh">
            {t('share')}
          </CustomText>
        </TouchableOpacity>
      </View>
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
    </View>
  );
};

export default ForYouPostCard;

const styles = StyleSheet.create({
  carouselVideo: {
    //width: '100%',
    height: 200,
    backgroundColor: 'black',
  },
  postVideo: {
    width: windowWidth, // Adjust width as needed
    height: 360, // Adjust height as needed
    backgroundColor: 'black', // Background color while loading
    resizeMode: 'cover',
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderTopColor: udyamitaTheme.borderStyleColor,
    borderBottomColor: udyamitaTheme.borderStyleColor,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    marginTop: 10,
    
  },
  firstSection: {
    paddingLeft:20,
    paddingTop:8,
   paddingRight:10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  communityTitle: props => ({
    fontFamily: props.mainThemeFontFamilyBold,
    color: udyamitaTheme.primaryColor,
    fontSize: props.themeFontSizeButton,
    lineHeight: 24,
  }),
  profileImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: 'contain',
  },
  smallIcons: {
    width: 11,
    height: 11,
    marginRight: 5,
  },
  postDetailText: {
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
    color: udyamitaTheme.textColor,
    marginRight: 5,
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
  },
  postCaption: props => ({
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    color: udyamitaTheme.textColor,
    marginTop: 20,
    fontSize: props?.themeFontSizeLabel,
  }),
  paginationContainer: {
    alignSelf: 'center',
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  paginationDot: {
    width: 8,
    height: 5,
    borderRadius: 6,
    marginHorizontal: -25,
    backgroundColor: udyamitaTheme.primaryColor,
  },
  inactivePaginationDot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    marginHorizontal: -25,
    backgroundColor: 'grey',
  },
  postImage: {
    width: windowWidth,
    height: 360,
    marginBottom: 5,
    resizeMode: 'cover',
    //alignItems: 'center',
  },
  postContent: {
    marginTop: 10,
    //marginLeft: -10,
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
  carouselImage: {
    // width: 300,
    height: 200,

    resizeMode: 'cover',
  },
  actionsView: {
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingBottom: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: udyamitaTheme.borderStyleColor,
  },
  actionText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
    marginRight: 5,
    color: udyamitaTheme.textColor,
  },
  actionable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginTop: 5,

    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  action: {
    //flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginHorizontal: 5,
  },
  iconStyle: {
    width: 13,
    height: 13,
    marginRight: 5,
  },
  actionImg: {
    height: 23,
    width: 23,
  },
  joinCommunity: {
    alignItems: 'flex-end',
    right: 0,
    marginLeft: '10%',
    position: 'relative',
  },
  joinNow: props => ({
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    fontSize: props?.themeFontSizeLabel,
    color: udyamitaTheme.primaryColor,
  }),
});
