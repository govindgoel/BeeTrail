
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import {APP_API_USER_URL} from '@env';
import VersionNumber from 'react-native-version-number';
import {setInitialEntState} from '../store/reducers/entrepreneurReducer';
import RBSheet from 'react-native-raw-bottom-sheet';
import ImagePicker from 'react-native-image-crop-picker';
import CustomAlert from '../components/reusable/generic/CustomAlert';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import {udyamitaTheme} from '../config/styles/udyamitaTheme';
import ProfileCreationForm from '../screens/app-onboarding/ProfileCreationForm';
import ChangeLanguage from '../screens/app-settings/ChangeLanguage';
import {useTranslation} from 'react-i18next';
import {
  getUser,
  getValueByKey,
  storeUser,
  // storeValueByKey,
  // removeItemByKey,
} from '../helpers/UserData';
import {setLoggedIn} from '../store/reducers/userReducer';
import axios from 'axios';
import {useDispatch} from 'react-redux';
import CustomText from '../components/reusable/CustomText';
import { clearAsyncStorage } from '../helpers/AsyncHelper';
import { useRealm } from '@realm/react';
import StackNavigator from './StackNavigator';
import ExpertHomeScreen from '../screens/dashboard/ExpertHomeScreen';
import BeeLandingPageScreen from '../screens/apiary-registration/BeeLandingPageScreen';
import Listfarm_form from '../screens/Farmer/ListFarm_form';
import FarmerNavigation from './FarmerNavigation';
// import { Images } from 'react-native-compressor';

const Drawer = createDrawerNavigator();

const DrawerTabs = props => {

  // const realm = useRealm();
  // const deleteAllRealmData = () => {
  //   realm.write(() => {
  //     realm.deleteAll();
  //   });
  // };

  const navigation = useNavigation();
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const bottomSheetRef = useRef(null);
  const [user, setuser] = useState(false)
  const [showadminfeature, setshowadminfeature] = useState(false)
  const [transliteratedName, setTransliteratedName] = useState('');
  const getFileItem = image => ({
    uri: image.path,
    type: image.mime,
    name:
      image.filename ||
      `profile_pic.${image.path.split('.')[image.path.split('.').length - 1]}`,
  });

  const getRequestBody = () => {
    let temp = new FormData();
    temp.append('pictureFile', profilePhoto);
    return temp;
  };

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(null);

  useEffect(() => {
    if (profilePhoto) {
      updateProfilePicture();
    }
  }, [profilePhoto]);

  const handleCameraPress = () => {
    // Open the bottom sheet when the camera icon is pressed
    if (bottomSheetRef.current) {
      bottomSheetRef.current.open();
    }
  };
  const handleChooseFromLibrary = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300, // Adjust these options as needed
        height: 400,
        // cropping: true,
        multiple: false,
        compressImageQuality:0.2
      });

      setProfilePhoto(getFileItem(image));
      if (bottomSheetRef.current) {
        bottomSheetRef.current.close();
      }
    } catch (error) {
      console.error('Error picking an image:', error);
    }
  };
  const updateProfilePicture = async () => {
    if (!profilePhoto) {
      Toast.show('Please select a photo first', Toast.LONG);
      return;
    }
    const data = getRequestBody();
    const token = await getValueByKey('token');
    const config = {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'multipart/form-data',
      },
    };

    await axios
      .post(`${APP_API_USER_URL}/user/profile-picture`, data, config)
      .then(response => {
        if (response.status === 200) {
          storeUser(response.data);
          setProfilePhoto(null);
          Toast.show(`${t('profilePhotoUpdated')}`, Toast.LONG);
        }
      })
      .catch(err => {
        console.log('error while updating profile picture', err);
      });
  };

  const removeProfilePicture = async () => {
    // if (!profilePhoto) {
    //   Toast.show('Please select a photo first', Toast.LONG);
    //   return;
    // }
    // const data = getRequestBody();
    const token = await getValueByKey('token');
    const config = {
      headers: {
        Authorization: 'Bearer ' + token,
        // 'Content-Type': 'multipart/form-data',
      },
    };

    await axios
      .delete(`${APP_API_USER_URL}/user/profile-picture`, config)
      .then(response => {
        if (response.status === 200) {
          storeUser(response.data);
          setProfilePhoto('');
          Toast.show(`${t('photoRemoved')}`, Toast.LONG);
          if (bottomSheetRef.current) {
            bottomSheetRef.current.close();
          }
        }
      })
      .catch(err => {
        console.log('error while removing profile picture', err);
      });
  };

  const handleTakePhoto = async () => {
    try {
      const image = await ImagePicker.openCamera({
        width: 300,
        height: 400,
        // cropping: true,
        compressImageQuality:0.2
      });

      setProfilePhoto(getFileItem(image));
      if (bottomSheetRef.current) {
        bottomSheetRef.current.close();
      }
    } catch (error) {
      console.error('Error taking a photo:', error);
    }
  };

  const [userInfo, setUserInfo] = useState(false);
// console.log('✌️userInfo --->', userInfo);

  const [isLogoutVisible, setLogoutVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const getUserInfo = async () => {
        const user = await getUser();
        if (user && user.userInfo) {
          setUserInfo(user.userInfo);
        
          // if(userInfo?.profilePictureUrl){
          //   setProfilePhotoUrl(userInfo?.profilePictureUrl);
          // }
        }
      };
      getUserInfo();
    }, [props, profilePhoto]),
  );
  // useEffect(() => {
  //   if (userInfo) {
  //     if (userInfo.preferredLanguage === 'en' || userInfo.preferredLanguage === 'english') {
  //       setTransliteratedName(userInfo?.name);
  //     } else {
  //       let reqObj = {};
  //       reqObj.text = userInfo?.name;
  //       reqObj.script = 'Latn';
  //       let data = [];
  //       data.push(reqObj);
  //       dispatch(getTransliterationNames({data: data, lang: userInfo.preferredLanguage}))
  //         .unwrap()
  //         .then(res => {
  //           console.log('res: ', res);
  //           setTransliteratedName(res);
  //         })
  //         .catch(err => {
  //           console.log('err: ', err);
  //         });
  //     }
  //   }
  // }, [userInfo]);
  const handleLogout = () => {
    setLogoutVisible(true);
  };

  const clearAuthCookies = () => {
  
    setLogoutVisible(false);
    storeUser({});
    dispatch(setLoggedIn(false));
    // storeValueByKey('token', null);
    // removeItemByKey('apiaryObj');
    // removeItemByKey('token');
    // removeItemByKey('userInfo');
    // removeItemByKey('fcmToken');
    // removeItemByKey('InspectionData-');
    // //clear store
    // removeItemByKey('selectedRole');
    clearAsyncStorage();
    // deleteAllRealmData();
    dispatch(setInitialEntState());
  };

  const makeLogoutCall = async () => {
    clearAuthCookies();
          Toast.show(`${t('loggedOutSuccessfully')}`, Toast.LONG);
          navigation.navigate('RoleSelection');
  };

  const handleLogoutConfirm = () => {
    // Handle the logout logic here
    console.log('logout called--');
    makeLogoutCall();
  };

  const handleLogoutCancel = () => {
    setLogoutVisible(false);
  };
  const check = async (validno) => {
    try {
      const user = await getUser();
      // console.log(user?.userInfo);
      setuser(user?.userInfo);
      const exist = validno.includes(user?.userInfo?.mobileNumber);
      // console.log(exist,'no exist');
      if (exist) {
        setshowadminfeature(true);
      }
    } catch (error) {
      console.log('err in checking no',error);
    }
  };
  

  const RBSheetBottomOptionsComponent = () => {
    return (
      <React.Fragment>
        <TouchableOpacity
          style={{
            padding: 20,
            borderBottomWidth: 0.5,
            borderBottomColor: udyamitaTheme.borderStyleColor,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <CustomText
            type="btn"
            style={{
              fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
              fontSize: udyamitaTheme.themeFontSizeButton,
              color: udyamitaTheme.textColor,
            }}>
            {t('changeProfilePhoto')}
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            borderBottomWidth: 0.5,
            borderBottomColor: udyamitaTheme.borderStyleColor,

            alignItems: 'center',
            height: 70,
            flexDirection: 'row',
          }}
          onPress={handleChooseFromLibrary}>
          <Image
            source={require('../assets/images/Addmedia.png')}
            style={{width: 31, height: 26, marginLeft: 60}}
          />
          <CustomText style={styles.text} type="btn">
            {t('chooseFromLibrary')}
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            alignItems: 'center',
            height: 70,
            borderBottomWidth: 0.5,
            borderBottomColor: udyamitaTheme.borderStyleColor,
            flexDirection: 'row',
          }}
          onPress={handleTakePhoto}>
          <Image
            source={require('../assets/images/Camera2.png')}
            style={{width: 31, height: 26, marginLeft: 60}}
          />
          <CustomText style={styles.text} type="btn">
            {t('takePhoto')}
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!userInfo?.profilePictureUrl}
          onPress={removeProfilePicture}
          style={{
            alignItems: 'center',
            height: 70,
            flexDirection: 'row',
            opacity: userInfo?.profilePictureUrl ? 1 : 0.3,
          }}>
          <Image
            source={require('../assets/images/Delete.png')}
            style={{width: 31, height: 26, marginLeft: 60}}
          />
          <CustomText style={styles.text} type="btn">
            {t('removeCurrentPhoto')}
          </CustomText>
        </TouchableOpacity>
      </React.Fragment>
    );
  };

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerActiveBackgroundColor: '#fff',
        drawerInactiveBackgroundColor: '#fff',
        activeTintColor: '#fff',
        inactiveTintColor: udyamitaTheme.textColor,
        labelStyle: {
          fontSize: udyamitaTheme.themeFontSizeButton,
          fontFamily: udyamitaTheme.mainThemeFontFamily,
          marginVertical: 8,
        },
      }}
      drawerContent={props => {
        return (
          <>
            <View
              style={{
                flexDirection: 'row',
                height: 128,
                backgroundColor: udyamitaTheme.beeAppColor,
                marginBottom: 20,
                alignItems: 'flex-end',
              }}>
              {console.log(userInfo, 'asc ca sc')}
              <TouchableOpacity
                style={{position: 'relative'}}
                onPress={() => handleCameraPress()}>
                  <Text></Text>
                {userInfo && userInfo.profilePictureUrl ? (
                  <Image
                    source={{uri: userInfo.profilePictureUrl}}
                    style={styles.beekeeperImage}
                  />
                ) : userInfo &&
                  userInfo.gender &&
                  userInfo.gender === 'female' ? (
                  <Image
                    source={require('../assets/images/Female_beekeeper2.png')}
                    style={styles.beekeeperImage}
                  />
                ) : (
                  <Image
                    source={require('../assets/images/Male_beekeeper.png')}
                    style={styles.beekeeperImage}
                  />
                )}
                <TouchableOpacity
                  style={styles.cameraIcon}
                  onPress={() => handleCameraPress()}>
                  <Image
                    source={require('../assets/images/camera.png')}
                    style={{}}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
              <RBSheet
                ref={bottomSheetRef}
                closeOnDragDown={true}
                closeOnPressMask={true}
                height={300}
                customStyles={{
                  wrapper: {
                    backgroundColor: 'rgba(0,0,0,0.5)',
                  },
                  draggableIcon: {
                    backgroundColor: udyamitaTheme.borderStyleColor,
                  },
                  container: {
                    borderTopLeftRadius: 40,
                    borderTopRightRadius: 40,
                    backgroundColor: '#fff',
                  },
                }}>
                <RBSheetBottomOptionsComponent />
              </RBSheet>
              <View
                style={{
                  marginLeft: 95,
                  height: 50,
                }}>
                <CustomText
                  numberOfLines={2}
                  style={styles.userNameText}
                  type="label">
                  {userInfo?.isCouple === true
                    ? userInfo?.primary_beekeeper === 'husband'
                      ? userInfo?.user_husband_name
                      : userInfo?.user_wife_name
                    : userInfo?.name}
                </CustomText>
                <CustomText
                  type="sh"
                  style={{
                    color: udyamitaTheme.udyamAppTertiaryColor,
                    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
                    fontSize: udyamitaTheme.themeFontSizeLabel,
                    opacity: 0.7,
                    //paddingBottom: 8,
                  }}>
                  {userInfo?.mobileNumber || userInfo?.mobile || ''}
                </CustomText>
              </View>
            </View>
            <DrawerContentScrollView
              {...props}
              style={{fontFamily: udyamitaTheme.mainThemeFontFamily}}>
              <DrawerItemList {...props} />
              <DrawerItem
                label={t('logout')}
                labelStyle={{
                  fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
                  color: udyamitaTheme.textColor,
                  fontSize: udyamitaTheme.themeFontSizeLabel,
                }}
                onPress={handleLogout}
                icon={({focused, color, size}) => (
                  <Image
                    source={require('../assets/images/Logout2.png')}
                    style={{
                      width: size,
                      height: size,
                      tintColor: udyamitaTheme.beeAppColor,
                      marginLeft: 30,
                    }}
                  />
                )}
              />

              <CustomAlert
                visible={isLogoutVisible}
                title={t('logout')}
                message={t('doYouReallyWantToLogOut')}
                onCancel={handleLogoutCancel}
                onConfirm={handleLogoutConfirm}
                otherText={t('logout')}
              />
            </DrawerContentScrollView>
            <View style={styles.appVersionDiv}>
              <CustomText style={styles.appVersion} type="sh">
                {t('appVersion')}: {VersionNumber.appVersion}
              </CustomText>
            </View>
          </>
        );
      }}
    >
      <Drawer.Screen
        name="Home"
        component={userInfo?.userRole=='farmer'? FarmerNavigation :StackNavigator}
        options={() => ({
          drawerLabel: '',
          title: '',
          drawerIcon: () => null,
          headerShown: false,
          drawerItemStyle: {height: 0},
        })}
      />
     {userInfo && userInfo?.userRole && userInfo?.userRole!=='farmer' &&  <Drawer.Screen
        name="EditProfile"
        component={userInfo?.userRole=='farmer' ? Listfarm_form :BeeLandingPageScreen }
        options={{
          drawerLabel: t('myProfile'),
          title: '',
          drawerLabelStyle: {
            fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
            fontSize: udyamitaTheme.themeFontSizeLabel,
            color: udyamitaTheme.textColor,
          },
          headerShown: false,
          drawerIcon: ({color, size}) => (
            <Image
              source={require('../assets/images/UserProfile.png')}
              style={styles.drawerIcon}
            />
          ),
        }}
      />}
      <Drawer.Screen
        name="changeLanguage"
        component={ChangeLanguage}
        options={{
          drawerLabel: t('language'),
          title: '',
          drawerLabelStyle: {
            fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
            fontSize: udyamitaTheme.themeFontSizeLabel,
            color: udyamitaTheme.textColor,
          },
          headerShown: false,
          drawerIcon: ({color, size}) => (
            <Image
              source={require('../assets/images/Language2.png')}
              style={styles.drawerIcon}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="ExpertHomeScreen"
        component={ExpertHomeScreen}
        options={{
          drawerLabel: t('getSupport'),
          title: '',
          headerShown: false,
          drawerLabelStyle: {
            fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
            fontSize: udyamitaTheme.themeFontSizeLabel,
            color: udyamitaTheme.textColor,
          },
          drawerIcon: ({color, size}) => (
            <Image
              source={require('../assets/images/Getsupport2.png')}
              style={styles.drawerIcon}
            />
          ),
        }}
      />
       
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  beekeeperImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    position:'absolute',
    bottom: -25,
    left: 20,
  },
  cameraIcon: {
    width: 22,
    height: 22,
    position: 'absolute',
    //top: -10,
    left: 70,
    bottom:-25, 
  },
  text: {
    textAlign: 'center',
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    fontSize: udyamitaTheme.themeFontSizeButton,
    // marginLeft: 10,
    marginLeft: 30,
    color: udyamitaTheme.textColor,
  },
  topContainer: {
    backgroundColor: udyamitaTheme.beeAppColor,
    flexDirection: 'row',
    alignItems: 'center',

    height: 82,
    top: -10,

    paddingLeft: 30,
    //paddingTop:60,
    paddingRight: 20,
    //width: windowWidth,
    justifyContent: 'space-between',
    position: 'relative',
  },
  profilePictureContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,

    borderWidth: 1,
    borderColor: udyamitaTheme.beeAppColor,
    alignItems: 'center',
    justifyContent: 'center',
    //marginRight: 10,
    top: 30,
    marginBottom: 15,
    position: 'absolute',
    marginLeft: 30,
  },
  profileImage: {
    width: 44,
    height: 46,
    resizeMode: 'cover',
    zIndex: 7,
  },
  userNameText: {
    color: '#fff',
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    //textTransform: 'capitalize',
    position: 'relative',
    flexWrap: 'wrap',
    maxWidth: 160 ,
    flexShrink: 1,
  },
  userName: {
    color: '#fff',
    fontSize: udyamitaTheme.themeFontSizeModalLabel,
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    marginTop: 20,
    marginLeft: 110,
    position: 'absolute',
  },
  drawerIcon: {
    width: 24,
    height: 24,
    marginLeft: 30,
    //marginTop:30,
  },
  appVersion:{
    fontFamily:udyamitaTheme.mainThemeFontFamily,
    fontSize:udyamitaTheme.themeFontSizeLabel,
    color:udyamitaTheme.textColor,
   // textAlign:'center',
  
   
  
  },
  appVersionDiv:{
    position:'absolute',
   bottom:14,
   alignSelf:'center',
   //borderWidth:1,
  // borderColor:'#000',
   padding:10,
   borderRadius:6,
   justifyContent:'center',
   alignItems:'center',
   zIndex:8,
   backgroundColor: '#fff',
  }
});

export default DrawerTabs;

