import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {
  ArrowLgIcon,
  SideMenu,
  Notification,
  Communication,
  MenuIcon,
} from '../../../assets/Icons/IconSvg';
import {useTranslation} from 'react-i18next';
import axios from 'axios';
import CustomText from '../../reusable/CustomText';
import {APP_API_MENTOR_VAlUECHAIN_SERVICES} from '@env';
import {getToken, getUser} from '../../../helpers/UserData';
import {HeaderScreenLogoImage} from '../../../config/app.config';
import {useSelector} from 'react-redux';
import {NotificationsIcon} from '../../../assets/Icons/IconSvg';
import {Badge} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import { getAllApiaries } from '../../../helpers/services/realm/disk-data-fetch/Apiaries';

const HeaderForDashBoard = ({userInfo,farmer}) => {



  const navigation = useNavigation();
  const {t} = useTranslation();
  const notifications = useSelector(
    state => state?.entrepreneur?.notifications,
  );
  const messages = useSelector(state => state?.entrepreneur?.messages);
  const [apiaries, setApiaries] = useState([]);
  const [selectedEnterprise, setSelectedEnterprise] = useState(null);
  const [notifLen, setNotifLen] = useState(0);
  const [msgLen, setMsgLen] = useState(0);
  const basicInfo = useSelector(state => state.entrepreneur.basicInfo);

  useEffect(() => {
    if (notifications) {
      setNotifLen(notifications?.length);
    }
  }, [notifications]);

  useEffect(() => {
    if (messages) {
      let seenMessages = messages.filter(message => {
        return message.from !== basicInfo?._id && !message?.seen
      });
      setMsgLen(seenMessages?.length)
      
    }
  },[messages]);

  const getApiaries = async () => {
    // const _apiaries = await getAllApiaries();
    // setApiaries(_apiaries);
// console.log('✌️_apiaries --->', _apiaries);

    
  }
  // const getOnlineApiaries = async () => {

  //   const token = await getToken();

  //   const config = {headers: {Authorization: 'Bearer ' + token}};
   

  //   await axios
  //     .get(`${APP_API_MENTOR_VAlUECHAIN_SERVICES}/beekeeping/apiaries`, config)
  //     .then(response => {


  //       if (response.status === 200) {

  //         setApiaries(response?.data?.apiaries || []);
  //       }
  //     })
  //     .catch(err => console.log('error in getting apiaries:', err));
  // };

  useFocusEffect(
    React.useCallback(() => {
      const getEnterprise = async () => {
        const userInfo = await getUser();
// console.log('✌️userInfo --->', userInfo);
        if (userInfo && userInfo.userInfo && userInfo.userInfo.businessIdea) {
          setSelectedEnterprise(userInfo.userInfo.businessIdea);
         
          if (userInfo.userInfo.businessIdea === 'Beekeeping/Apiculture') {
            getApiaries();
          }
        }
      };

      getEnterprise();
    }, []),
  );

  // useFocusEffect(
  //   React.useCallback(() => {
  //     console.log(
  //       '🚀 ~ file: HeaderForDashBoard.jsx:49 ~ React.useCallback ~ selectedEnterprise:',
  //       selectedEnterprise,
  //     );

  //   }, []),
  // );

  const OpenMenu = () => {
    return (
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <MenuIcon />
      </TouchableOpacity>
    );
  };

  return (
    <View style={{backgroundColor:udyamitaTheme.themeBgColor}}>
       <View style={[styles.headerContainer,{ borderBottomLeftRadius: userInfo?.userRole=='farmer'?0:40,
    borderBottomRightRadius: userInfo?.userRole=='farmer'?0:40,height: userInfo?.userRole=='farmer'?100:80}]}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingBottom: 10,
          marginTop:8
         
        }}>
        <View style={{flexDirection: 'row'}}>
          <OpenMenu />

          {/* <Image
            source={require('../../../assets/images/BeeKindlogo_Homepage.png')}
            style={{width: 130, height: 33, marginLeft: 10, marginTop: -5}}
          /> */}
          <HeaderScreenLogoImage />
        </View>

        <View style={{flexDirection: 'row'}}>
          {/* <TouchableOpacity
            style={{marginRight: 20}}
            onPress={() => navigation.navigate('MessageListing')}>
              {msgLen && msgLen > 0 ?  <Badge style={styles.notifBadge} size={18}>
              {msgLen}
            </Badge>:null}
           
            <MaterialCommunityIcons
              name="message-processing-outline"
              size={24}
              color={udyamitaTheme.textColor}
            />
          </TouchableOpacity> */}
          {/* <TouchableOpacity
            onPress={() => navigation.navigate('notifications')}>
              {notifLen && notifLen >0 ?  <Badge style={styles.notifBadge} size={18}>
              {notifLen}
            </Badge>:null}
           
            <NotificationsIcon />
          </TouchableOpacity> */}
        </View>
      </View>

     
    </View>
    </View>
 
  );
};

export default HeaderForDashBoard;

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'white',
    //  height: userInfo?.userType=== "bee-mitra" ? 100 :150,
    elevation: 10,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 10,
    justifyContent: 'center',
    //paddingTop: 20,
    paddingBottom: 10,
  },

  button: {
    height: 62,
    // backgroundColor: udyamitaTheme.beeAppColor,
   borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop:16,
    width:'100%'
  },
  buttonText: {
    color: '#fff',
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    fontSize: udyamitaTheme.themeFontSizeButton,
    paddingRight: 20,
  },
  backgroundImage: {
    //flex: 1,
    resizeMode: 'contain',
    height: 62,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
    borderRadius:16,
    width:'100%'
  },
  notifBadge: {
    position: 'absolute',
    top: -7,
    right: -3,
    zIndex: 3,
    backgroundColor: udyamitaTheme?.primaryColor,
  },
});
