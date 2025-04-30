import React, {useState, useContext, useEffect, useRef} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  // Platform,
  // FlatList,
  // TextInput,
  RefreshControl,
  // Modal,
  ActivityIndicator,
  // Linking,
  Dimensions,
  ScrollView,
  Share
} from 'react-native';
import CustomText from '../../reusable/CustomText';
import {useTranslation} from 'react-i18next';
import RBSheet from 'react-native-raw-bottom-sheet';
import {APP_API_COMMUNITY_URL} from '@env';
import axios from 'axios';

import {useFocusEffect, useIsFocused} from '@react-navigation/native';

import Toast from 'react-native-simple-toast';

import {udyamitaTheme, udyamitaThemeSm} from '../../../config/styles/udyamitaTheme';



import FeedPostCard from './FeedPostCards';
import CreatePost from '../../../screens/community/CreatePost';
import {

  getValueByKey,
  getUser,
} from '../../../helpers/UserData';
import CustomAlertToDelete from '../../reusable/generic/CustomAlertToDelete';
import dynamicLinks from '@react-native-firebase/dynamic-links';

const windowHeight = Dimensions.get('window').height;
const CommunityPostsFeed = ({navigation, route, community_id,activeTab}) => {
  const {t} = useTranslation();
  const bottomSheetRef = useRef();
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [leaveCommunityConfirm, setLeaveCommunityConfirm] = useState(false);
  const [isUserMember, setIsUserMember] = useState(false);
  const [communityData, setCommunityData] = useState(null);
  const [postToEdit, setPostToEdit] = useState(null);
  const bottomSheetRefForMembers = useRef();
  // const [postData, setPostData] = useState({caption: '', image: ''});
  const [allPost, setAllPost] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userInfo, setUserInfo] = useState(false);
  // const [addLikeByUser, setAddLikeByUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deletedPost, setDeletedPost] = useState(false);
  const [selectedEditPost, setSelectedEditPost] = useState(false);
  const [editDone, setEditDone] = useState(null);
  const [actTheme, setActTheme] = useState({});
  const isFocused = useIsFocused();

  useFocusEffect(
    React.useCallback(() => {
      const getUserInfo = async () => {
        const user = await getUser();
        if (user && user.userInfo) {
          setUserInfo(user.userInfo);


      
        }
      };
      getUserInfo();
      
    }, [isFocused]),
  );

  const getCommunityById = async id => {
    const token = await getValueByKey('token');
    const config = {headers: {Authorization: 'Bearer ' + token}};
    setLoading(true);
    await axios
      .get(`${APP_API_COMMUNITY_URL}/community/${id}`, config)
      .then(response => {
        if (response.status === 200) {
          setCommunityData(response.data.community);
          setIsUserAdmin(response.data.isUserAdmin);
          setIsUserMember(response.data.isUserMember);
          setLoading(false);
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
  const handleCancel = () => {
    setLeaveCommunityConfirm(false);
  };
  const handleConfirmLeaveCommunity = () => {

    setLeaveCommunityConfirm(true);
  };
  const LeaveCommunity = async id => {
    const token = await getValueByKey('token');

    const config = {headers: {Authorization: 'Bearer ' + token}};
    await axios
      .post(
        `${APP_API_COMMUNITY_URL}/community/leave-community/${id}`,
        null,
        config,
      )
      .then(response => {
        if (response.status === 200) {
          Toast.show(`${t('leftTheCommunitySuccessfully')}`, Toast.SHORT);
          bottomSheetRefForMembers.current.close();
          setLeaveCommunityConfirm(false);
          navigation.navigate('CommunityHomeScreen',{activeTab});
        }
      })
      .catch(err => {
        console.log('error while leaving community', err);
      });
  };
  const getCommunityPostById = async id => {
    
    const token = await getValueByKey('token');

    const config = {headers: {Authorization: 'Bearer ' + token}};

    await axios
      .get(`${APP_API_COMMUNITY_URL}/post/${id}`, config)
      .then(response => {
        if (response.status === 200) {
          setAllPost(response?.data?.posts || []);


          setLoading(false);
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
  useEffect(() => {
    if (community_id) {
      getCommunityPostById(community_id);
      getCommunityById(community_id);
    }
  }, [community_id,isFocused]);
  const onClose = () => {
    bottomSheetRef.current.close();
    getCommunityPostById(community_id);
  };
  const renderCommentSheetContent = () => (
    <View>
      <CreatePost
        community_id={community_id}
        onClose={onClose}
        getCommunityPostById={getCommunityPostById}
        selectedEditPost={selectedEditPost}
        postToEdit={postToEdit}
        setSelectedEditPost={setSelectedEditPost}
      />
    </View>
  );
  const renderMembersAction = () => (
    <>
      <View
        style={{
          borderBottomWidth: 0.5,
          borderBottomColor: udyamitaTheme.borderStyleColor,
          height: 20,
        }}
      />
      <View style={{flexDirection: 'column', marginLeft: 30}}>
        <TouchableOpacity
          style={styles.items}
          onPress={() => LeaveCommunity(community_id)}>
          <Image
            source={require('../../../assets/images/Leavegroup.png')}
            style={styles.itemIcon}
          />
          <CustomText style={styles.itemLabel} type='btn'>{t('leaveGroup')}</CustomText>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.items}>
          <Image
            source={require('../../../assets/images/NotificationIcon.png')}
            style={styles.itemIcon}
          />
          <Text style={styles.itemLabel}>{t('notifications')}</Text>
        </TouchableOpacity> */}
        {/* <TouchableOpacity style={styles.items}>
          <Image
            source={require('../../../assets/images/Reportpost.png')}
            style={styles.itemIcon}
          />
          <Text style={styles.itemLabel}>{t('reportCommunity')}</Text>
        </TouchableOpacity> */}
      </View>
    </>
  );

  const JoinRequestForPublicCommunity = async id => {
    setLoading(true);
    const token = await getValueByKey('token');
    const config = {
      headers: {Authorization: 'Bearer ' + token},
    };
   
    try {
      const response = await axios.post(
        `${APP_API_COMMUNITY_URL}/community/joinExisting/${id}`,
        null,
        config,
      );

      if (response.status === 200) {
        Toast.show(
          `${t('nowYouAreAPartOfThisCommunity')}`,
          Toast.SHORT,
        );
        setIsUserMember(true);
       
        setLoading(false);
      } else {
        console.log('Failed to join public community');
      }
    } catch (error) {
      console.error('Error while joining to public community', error);
    }
  };
  const generateLink = async () => {

    try {
      const link = await dynamicLinks().buildShortLink(
        {
          link: `https://thehumblebee.page.link/community-post?communityId=${community_id}`,
          domainUriPrefix: 'https://thehumblebee.page.link',
          android:{
            packageName:'co.thehumblebee.beekind'
          }
        },
        dynamicLinks.ShortLinkType.DEFAULT,
      );
      // console.log('dynamic --- link ==>> >> >>>', link);
      return link;
    } catch (error) {
      console.log('Generating Link Error:', error);
    }
}
  const handleShare = async (id) => {
    try {
      const deepLink = await generateLink(id);
      const result = await Share.share({
        title: 'Share Post',
        message: `Check out this post ${deepLink}`,
         // You can provide an image URL or file path
      });

      if (result.action === Share.sharedAction) {
        console.log('Post shared successfully');
        sharePost(id);
      } else if (result.action === Share.dismissedAction) {
        console.log('Sharing dismissed');
      }
      // console.log("deeplink:: ==>>>>  deeplinlk fsdhkjgsjb in communityPosts",deepLink);
    } catch (error) {
      console.error('Error sharing post:', error.message);
    }
  };
  
  const addLike = async id => {
    
    const token = await getValueByKey('token');
    const config = {headers: {Authorization: 'Bearer ' + token}};
    
    const _postData = allPost.map(post =>
      post._id === id && !post.isLikedByUser
        ? {...post, isLikedByUser: 1, likeCount: post.likeCount + 1}
        : post._id === id && post.isLikedByUser
        ? {...post, isLikedByUser: 0, likeCount: post.likeCount - 1}
        : {...post},
    );

    setAllPost(_postData);
    axios
      .post(
        `${APP_API_COMMUNITY_URL}/post/like/${id}/${community_id}`,
        null,
        config,
      )
      .then(response => {
        if (response.status == 200) {
          // if (addLikeByUser) {
          // sendDataToParent(false);
          // setAddLikeByUser(false);
          // } else {
          // sendDataToParent(true);
          // setAddLikeByUser(true);
          // }
        }
      })
      .catch(err => console.log('ERR', err));
  };

  useEffect(() => {
    const {height, width} = Dimensions.get('screen');
 
    if (height < 800) {
      setActTheme(udyamitaThemeSm);
   
    } else {
      setActTheme(udyamitaTheme);
    }
  }, []);

  const handleDeletePost = async id => {
    const token = await getValueByKey('token');
    const config = {headers: {Authorization: 'Bearer ' + token}};

    axios
      .delete(`${APP_API_COMMUNITY_URL}/post/${id}`, config)
      .then(response => {
        if (response.status === 200) {
          // setActionSnackbar(false);
          // Snackbar.show({text: 'Post deleted successFully'});
          // getDeletePost(true);

          setDeletedPost(false);
          setEditDone(true);
          getCommunityPostById(community_id);
        }
      })
      .catch(err =>
        console.log(
          'ERR while deleteing post',
          err,
          'err?.response',
          err?.response,
        ),
      );
  };

  const sharePost = async id => {
    const token = await getValueByKey('token');
    const config = {headers: {Authorization: 'Bearer ' + token}};
    axios
      .post(`${APP_API_COMMUNITY_URL}/post/share-post/${id}`, null, config)
      .then(response => {
        if (response.status == 200) {
          getSharedPost(id);
          // getCommunityPosts();
        }
      })
      .catch(err => console.log('ERR', err));
  };

  const getSharedPost = async id => {
    const token = await getValueByKey('token');
    const config = {headers: {Authorization: 'Bearer ' + token}};
    axios
      .get(`${APP_API_COMMUNITY_URL}/post/share-post/${id}`, config)
      .then(response => {
        if (response.status == 200) {
          const _postData = allPost.map(post =>
            post._id === id
              ? {...post, totalSharedCount: response?.data?.count}
              : post,
          );
          setAllPost(_postData);
        }
      })
      .catch(err => console.log('ERR', err));
  };

  const handleEditPost = postDetails => {
    setSelectedEditPost(true);
    setPostToEdit(postDetails);
    bottomSheetRef.current.open();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.postSection}>
        {isUserAdmin || isUserMember ? (
          <View style={styles.membersAction}>
            {isUserMember ? (
              <TouchableOpacity
                style={styles.memberButton}
                onPress={() => handleConfirmLeaveCommunity()}>
                <Image
                  source={require('../../../assets/images/Leavegroup.png')}
                  style={{width: 20, height: 20}}
                />
                <CustomText style={[styles.buttonLabel, {marginRight: 0}]} type='label'>
                  {t('leaveGroup')}
                </CustomText>
                {/* <Image
                source={require('../../../assets/images/Caretdown.png')}
                style={{width: 24, height: 24}}
              /> */}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.memberButton}
                onPress={() =>
                  navigation.navigate('AdminPanel', {community_id, navigation})
                }>
                <Image
                  source={require('../../../assets/images/Admin.png')}
                  style={{width: 20, height: 20}}
                />
                <CustomText style={[styles.buttonLabel, {marginRight: 0}]} type='label'>
                  {t('adminDashboard')}
                </CustomText>
                {/* <Image
                source={require('../../../assets/images/Caretdown.png')}
                style={{width: 24, height: 24}}
              /> */}
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={()=>handleShare()}
              style={[
                styles.memberButton,
                {backgroundColor: udyamitaTheme.primaryColor},
              ]}>
              <Image
                source={require('../../../assets/images/Inviteuser.png')}
                style={styles.iconstyle2}
              />
              <CustomText
                numberOfLines={2}
                style={[
                  styles.buttonLabel,
                  {
                    color: '#fff',
                    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
                  },
                ]} type='label'>
                {t('inviteMembers')}
              </CustomText>
            </TouchableOpacity>
          </View>
        ) 
        : loading ? ( null
          // <ActivityIndicator
          //   color={udyamitaTheme.primaryColor}
          //   size={40}
          //   //style={styles.postIndicator}
          // />
        ) : (
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity
              style={{
                backgroundColor: udyamitaTheme.primaryColor,
                width: 312,
                height: 43,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 6,
                marginBottom: 20,
              }}
              onPress={() => JoinRequestForPublicCommunity(community_id)}>
              <CustomText
                style={{
                  fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
                  color: '#fff',
                  fontSize: udyamitaTheme.themeFontSizeLabel,
                }
              }
              type="label"
              >
                {t('joinNow')}
              </CustomText>
            </TouchableOpacity>
          </View>
        )}

        <RBSheet
          ref={bottomSheetRefForMembers}
          closeOnDragDown={true}
          closeOnPressBack
          height={180}
          duration={250}
          customStyles={{
            container: {
              borderTopLeftRadius: 40,
              borderTopRightRadius: 40,
            },
          }}>
          {renderMembersAction()}
        </RBSheet>
        <View style={styles.postCreationContainer}>
        {
  [undefined, null, ''].includes(userInfo?.profilePictureUrl) && [undefined, null, ''].includes(userInfo?.photo) ? (
    <View style={styles.initialsContainer}>
      <CustomText
        style={{
          color: udyamitaTheme.primaryColor,
          fontSize: udyamitaTheme.themeFontSizeModalLabel,
          textTransform: 'uppercase',
        }}
        type='mlabel'
      >
        {(userInfo?.name && userInfo?.name[0]) || ''}
      </CustomText>
    </View>
  ) : (
    <Image
      source={{ uri: userInfo?.profilePictureUrl || userInfo?.photo }}
      style={{ height: 50, width: 50, borderRadius: 25, resizeMode: 'contain' }}
    />
  )
}


     
          <TouchableOpacity
            style={{
              width: '80%',
              height: 48,
              borderColor: udyamitaTheme.borderStyleColor,
              backgroundColor: '#fff',
              flexDirection: 'row',
              paddingLeft: 10,
              borderRadius: 6,
              borderWidth: 0.5,
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingRight: 10,
            }}
            onPress={() => bottomSheetRef.current.open()}>
            <CustomText
              style={{
                fontFamily: udyamitaTheme.mainThemeFontFamily,
                color: udyamitaTheme.borderStyleColor,
                fontSize: udyamitaTheme.themeFontSizeLabel,
              }}
              type="label"
              >
              {t('createPost')}
            </CustomText>
            <TouchableOpacity
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                // flex:1,
                backgroundColor: udyamitaTheme.primaryColor,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => bottomSheetRef.current.open()}>
              <CustomText
                style={{
                  color: '#fff',
                  fontSize: udyamitaTheme.themeFontSizeHeader,
                  textAlign: 'center',
                }}
                type="h"
                >
                +
              </CustomText>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
        <RBSheet
          ref={bottomSheetRef}
          closeOnDragDown={true}
          closeOnPressBack
          height={windowHeight}
          duration={250}
          customStyles={{
            container: {
              // borderTopLeftRadius: 20,
              //  borderTopRightRadius: 20,
            },
          }}>
          {renderCommentSheetContent()}
        </RBSheet>
        {loading ? (
          <ActivityIndicator
            color={udyamitaTheme.primaryColor}
            size={40}
            style={styles.postIndicator}
          />
        ) :  allPost && allPost.length > 0 ? (
          allPost.map((post, index) => (
            <FeedPostCard
              key={index}
              post={post}
              postId={post._id}
              communityId={community_id}
              communityData={communityData}
              addLike={() => addLike(post._id)}
              handleShare={() => handleShare(post._id)}
              handleDeletePost={handleDeletePost}
              handleEditPost={() => handleEditPost(post)}
              setDeletedPost={setDeletedPost}
              deletedPost={deletedPost}
              getCommunityPostById={getCommunityPostById}
              selectedEditPost={selectedEditPost}
            />
          ))
        ) : (
          <>
          { allPost?.length === 0 ? (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '30%',
            }}>
              <Image
                source={require('../../../assets/images/noPostBigIcon.png')}
                style={{width: 120, height: 120}}
              />
              <CustomText style={styles.noPostToShowText} type="mlabel">
                {t('noPost')}
              </CustomText>
            </View>
          ):null}
        </>
        
         
        )}

        <RefreshControl
          colors={[udyamitaTheme.themeColor, udyamitaTheme.primaryColor]}
          refreshing={refreshing}
          onRefresh={() => getCommunityPostById(community_id)}
        />
      </ScrollView>
      <CustomAlertToDelete
        visible={leaveCommunityConfirm}
        title={t('leaveGroup')}
        message={t('areYouSureWantToLeave')}
        onCancel={handleCancel}
        onConfirm={() => LeaveCommunity(community_id)}
        otherText={t('yesProceed')}
      />
    </View>
  );
};

export default CommunityPostsFeed;

const styles = StyleSheet.create({
  postSection: {
    marginTop: 10,
    // height: 'auto',
    marginBottom: 20,

    // flexGrow:1
    // flex:1
  },
  initialsForAllMembersContainer: {
    width: 35,
    height: 35,
    borderRadius: 50,
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 3,
  },
  initialsTextForAllMembers: {
    color: 'white',
    fontSize: udyamitaTheme.themeFontSizeModalLabel,
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
  },
  initialsContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: udyamitaTheme.borderStyleColor,
    borderWidth: 1,
  },
  initialsText: {
    color: 'white',
    fontSize: udyamitaTheme.themeFontSizeModalLabel,
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
  },
  container: {
    flex: 1,
    backgroundColor: udyamitaTheme.themeBgColor,
    //height: 'auto',
    //flex: 0,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 14,
    paddingHorizontal: 16,
    backgroundColor: udyamitaTheme.primaryColor,
  },
  bottomSheetHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 14,
    paddingHorizontal: 16,
    // backgroundColor: udyamitaTheme.primaryColor,
  },
  postText: {
    // marginTop:5,
    color: 'black',
    fontSize: udyamitaTheme.themeFontSizeLabel,
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    textAlign: 'left',
    width: '90%',
  },
  communityName: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    fontSize: udyamitaTheme.themeFontSizeModalLabel,
    textAlign: 'center',
    // marginTop: 7,
    color: 'white',
    marginLeft: 10,
  },
  members: {
    fontSize: udyamitaTheme.themeFontSizeLabel,
    color: 'grey',
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    textAlign: 'left',
    // textTransform: 'capitalize',
    marginTop: 5,
    marginLeft: 20,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    // justifyContent: 'left',
    marginTop: 10,
    marginLeft: 15,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  plus: {
    fontSize: udyamitaTheme.themeFontSizeBigHeader,
    // fontWeight: 'bold',
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color: 'grey',
    marginTop: -2,
    marginLeft: 10,
  },
  centeredAvatarContainer: {
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarWrapper: {
    // backgroundColor: 'lightgrey',
    borderRadius: 15,
  },

  horizontalLine: {
    // borderBottomWidth: 1,
    // borderColor: '#E5E8E8',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  horizontalLine2: {
    borderBottomWidth: 5,
    borderColor: '#E5E8E8',
    marginHorizontal: 20,
    marginVertical: 20,
  },
  postCreationContainer: {
    flexDirection: 'row',
    //  alignItems: 'center',
    marginHorizontal: 20,
    justifyContent: 'space-between',
    // marginTop: 10,
    marginBottom: 10,
    // flex:1,
    // position:'absolute'
  },
  profileImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    // borderWidth:0.5,
    borderColor: 'black',
  },

  textInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  cameraIcon: {
    width: 30,
    height: 30,
    marginLeft: 10,
  },
  row: {
    flexDirection: 'row',
  },

  postContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    elevation: 20,
    marginTop: 3,
  },

  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  postAuthor: {
    fontSize: udyamitaTheme.themeFontSizeButton,
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    marginTop: '1%',
  },

  postActions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  postActionText: {
    marginTop: 3,
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    color: 'grey',
  },
  postAction: {
    flex: 1,
    // paddingVertical: 4,
    marginLeft: 10,
    marginTop: 5,
  },
  postImage: {
    width: '100%',
    height: 250,
    borderRadius: 20,
    marginTop: 8,
    // marginBottom:5
  },
  icon: {
    marginRight: 5,
    color: 'green',
    marginTop: 2,
  },
  postTime: {
    color: 'gray',
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    fontSize: udyamitaTheme.themeFontSizeMediumHeader,
    marginLeft: 5,
    marginTop: '2%',
  },
  communityProfileImage: {
    height: 35,
    width: 35,
    borderRadius: 20,
    // borderColor: colors.primaryColor,
    // borderWidth: 1,
    alignSelf: 'center',
    // marginRight: 5,
  },
  richEditorContainer: {
    //flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 10,
  },
  richEditor: {
    flex: 1,
    width: 80,
  },
  noPostToShowText: {
    fontSize: udyamitaTheme.themeFontSizeLabel,
    // textTransform:"capitalize",
    //textAlign: 'center',
    color: udyamitaTheme.primaryColor,
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,

    //marginVertical: '50%',
  },
  carouselItem: {
    width: '93%',
    height: 250,
    borderRadius: 10,
    // backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
    // marginHorizontal:20
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    width: 50,
    height: 50,
    backgroundColor: '#F4F6F6',
    marginLeft: 23,
    marginRight: 10,
    // alignSelf: 'center',
  },
  iconImage: {
    width: 30,
    height: 30,
  },

  bottomSheetBottomContainer: {
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5E7E9',
    height: 90,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'flex-end',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  wrap: {
    flexDirection: 'row',
    // marginTop: 20,
  },
  inputWrap: {
    justifyContent: 'space-between',
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    elevation: 2,
    // marginLeft: 20,
  },
  inputStyle: {
    fontSize: udyamitaTheme.themeFontSizeButton,
    paddingLeft: 20,
    borderRadius: 5,
    width: '90%',
    height: 60,
  },
  profileImage: {
    height: 40,
    width: 40,
    elevation: 2,
    borderRadius: 20,
    alignItems: 'center',
    borderColor: 'white',
    backgroundColor: udyamitaTheme.primaryColor,
    // marginLeft: 15,
    justifyContent: 'center',
    marginRight: 10,

    marginTop: 10,
  },
  addButton: {
    padding: 2,
    backgroundColor: udyamitaTheme.primaryColor,
    borderRadius: 20,
    elevation: 2,
    justifyContent: 'center',
    height: 40,
    width: 40,
    alignSelf: 'center',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0.5, height: 0.5},
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  clock: {
    marginLeft: 20,
    marginTop: '2.5%',
  },
  popupPost: {
    elevation: 5,
    backgroundColor: 'white',
    position: 'absolute',
    height: 60,
    width: 120,
    left: '65%',
    top: 35,
    paddingHorizontal: 6,
    borderRadius: 10,
    // paddingVertical: 6,
  },
  editPost: {
    // textAlign: 'left',
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    // textTransform: 'capitalize',
  },
  postbuttonText: {
    color: 'white',
    fontSize: udyamitaTheme.themeFontSizeLabel,
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    textAlign: 'center',
  },
  activtyIndicatorCss: {
    backgroundColor: 'lightgrey',
    paddingVertical: 5,
    paddingHorizontal: 35,
    borderRadius: 5,
    alignSelf: 'center',
  },
  createPostText: {
    fontSize: udyamitaTheme.themeFontSizeButton,
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color: 'black',
  },
  postTextInput: {
    color: 'grey',
    marginTop: 20,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
  },
  clockTimeBox: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    marginTop: -30,
    marginLeft: '11%',
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
  selectedTitle: {
    fontSize: udyamitaTheme.themeFontSizeLabel,
    // color: 'black',
    color: udyamitaTheme.primaryColor,
    alignSelf: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  label: {
    color: 'grey',
    marginTop: 10,
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
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
  modalImageStyle: {
    minWidth: 100,
    minHeight: 100,
    margin: 5,
    //  resizeMode:"center",
    aspectRatio: 1,
    borderRadius: 25,
  },
  btnWrap: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '10%',
    justifyContent: 'space-between',
  },
  postIndicator: {
    marginTop: '50%',
  },
  likesText: {
    marginLeft: 3,
    marginTop: 5,
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    color: 'grey',
    fontSize: udyamitaTheme.themeFontSizeLabel,
    marginBottom: 4,
  },
  postBottomsheetTextInput: {
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    marginLeft: 20,
    backgroundColor: '#F8F9F9',
    borderRadius: 5,
    width: '90%',
    height: 100,
    color: 'black',
    fontSize: udyamitaTheme.themeFontSizeLabel,
  },
  addMediaText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    fontSize: udyamitaTheme.themeFontSizeCardMiniLabel,
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 20,
  },
  deleteImageBox: {
    position: 'absolute',
    top: '18%',
    right: '8%',
    height: '18%',
    width: '18%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 10,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteSymbol: {
    color: 'white',
    fontSize: udyamitaTheme.themeFontSizeCardMiniLabel,
    alignItems: 'center',
    marginTop: -2,
  },
  bigImageModal: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 15,
  },
  bigImageDeleteSymbol: {
    color: 'white',
    fontSize: udyamitaTheme.themeFontSizeHeader,
    width: '100%',
  },
  postImageModalStyle: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 15,
  },
  udyamitaAdminLogo: {
    width: '95%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 50,
    backgroundColor: 'white',
  },
  userRoleText: {
    textAlign: 'center',
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    color: 'green',
  },
  bulletBoxUserRole: {
    height: 20,
    borderColor: 'green',
    borderWidth: 1,
    marginLeft: '6%',
    marginTop: '2%',
    borderRadius: 25,
  },
  linkText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    color: 'blue',
    textDecorationLine: 'underline',
  },
  vimeoPlayerStyles: {
    height: 220,
    width: '105%',
    marginTop: 10,
    marginLeft: -10,
  },
  titleText: {
    fontSize: udyamitaTheme.themeFontSizeBigHeader,
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    marginLeft: 20,
    marginTop: 10,
  },
  greetingText: {
    fontSize: udyamitaTheme.themeFontSizeButton,
    marginLeft: 20,
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    marginBottom: 0,
  },
  memberNameText: {
    fontSize: udyamitaTheme.themeFontSizeButton,
    marginLeft: 10,
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    marginBottom: 0,
  },
  nolinkText: {
    // fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    color: 'blue',
    textDecorationLine: 'underline',
    marginLeft: 10,
    marginTop: 10,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    textAlign: 'left',
    marginBottom: 10,
    width: '90%',
  },
  previewLinkText: {
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    fontSize: udyamitaTheme.themeFontSizeMediumHeader,
    width: '90%',
    marginLeft: 10,
    marginTop: 5,
    color: 'black',
  },
  previewlinkLinkText: {
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    width: '90%',
    marginLeft: 10,
    // marginTop: 5,
    // color: 'black',
    fontSize: udyamitaTheme.themeFontSizeCardMiniLabel,
    color: 'grey',
    marginTop: 10,
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
  linkPreviewImage: {
    height: 120,
    width: '80%',
    marginLeft: '10%',
    resizeMode: 'contain',
    marginBottom: 10,
  },
  imageModalStyles: {
    position: 'absolute',
    height: 25,
    width: 25,
    borderRadius: 25,
    backgroundColor: 'black',
    top: '24%',
    left: '75%',
  },
  membersAction: {
    flexDirection: 'row',
    marginLeft: 20,
    marginRight: 10,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  memberButton: {
    borderWidth: 0.5,
    borderColor: udyamitaTheme.borderStyleColor,
    borderRadius: 6,
flex:1,
    flexDirection: 'row',
   
    height: 43,
    padding: 10,
    alignItems: 'center',
    justifyContent:'center',
    marginRight: 10,
    backgroundColor:'#fff'
  },
  buttonLabel: {
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    fontSize: udyamitaTheme?.themeFontSizeLabel,
    color: udyamitaTheme.textColor,
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
    marginRight: 5,
  },
  itemIcon: {
    width: 32,
    height: 32,
    marginRight: 10,
  },
});
