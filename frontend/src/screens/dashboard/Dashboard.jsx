import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  BackHandler,
  Alert,
  ImageBackground,
  Dimensions
} from 'react-native';
import React, {useState, useEffect, useCallback, useRef} from 'react';
import HeaderForDashBoard from '../../components/dashboard/resuable/HeaderForDashBoard';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import QuickLinks from '../../components/dashboard/partials/QuickLinks';
import MarketplaceCard from '../../components/dashboard/partials/MarketplaceCard';
import CommunityCard from '../../components/dashboard/partials/CommunityCard';
import EDPModuleCard from '../../components/dashboard/partials/EDPModuleCard';
import {APP_API_CATALOG_SERVICES} from '@env';
import {APP_API_LIBRARY_URL, APP_API_MENTOR_VAlUECHAIN_SERVICES} from '@env';
import TipOfTheDayModal from '../../components/reusable/generic/TipOfTheDayModal';
import axios from 'axios';
import {getToken, getUser, getValueByKey, removeItemByKey, storeValueByKey} from '../../helpers/UserData';
import {udyamitaTheme} from '../../config/styles/udyamitaTheme';
import {useTranslation} from 'react-i18next';
import CustomText from '../../components/reusable/CustomText';
import {getCommunityChatByParticipantId} from '../../store/services/messaging-services';
import {useDispatch, useSelector} from 'react-redux';
import {syncAllInfoWhileOnline} from '../../helpers/services/realm';
import {getAllAssignedBeekeepers} from '../../helpers/services/realm/disk-data-fetch/Beekeepers';
import { useNetInfo } from '@react-native-community/netinfo';
import Tooltip from 'react-native-walkthrough-tooltip';

const {width,height}=Dimensions.get('window');

export default function Dashboard({ navigation }) {
  const {isConnected} = useNetInfo();
  
  const [subcategories, setSubCategories] = useState([]);
  const [userInfo, setUserInfo] = useState(false);
  const [isImageViewModalVisible, setIsImageViewModalVisible] = useState(false);
  const [imageData, setImageData] = useState('');
  const [beekeeepersData, setBeekeepersData] = useState('-');
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const {t} = useTranslation();
  const basicInfo = useSelector(state => state?.entrepreneur?.basicInfo);
  const [tooltip, settooltip] = useState(false)
  const countBeekeeper = useRef(0)
  // useEffect(() => {
  // if(userInfo && userInfo?.mobileNumber && userInfo?.preferredLanguage)
  //   {getQuoteOfTheDay();}
  // }, [userInfo])

  const syncData = async () => {
    await syncAllInfoWhileOnline(userInfo?.userType);
  };

  // useFocusEffect(
  //   React.useCallback(() => {
  //     syncData();
  //   }, [userInfo]),
  // );

  const showImageViewModal = imageData => {
    setImageData(imageData);
    setIsImageViewModalVisible(true);
  };

  const closeImageViewModal = () => {
    setIsImageViewModalVisible(false);
    setImageData('');
  };
  // const getQuoteOfTheDay = async () => {
  //   const token = await getToken();

  //   const config = {headers: {Authorization: 'Bearer ' + token}};

  //   await axios
  //     .get(
  //       `${APP_API_LIBRARY_URL}/quotes/user-quote/${userInfo.mobileNumber}/${userInfo.preferredLanguage}`,
  //       config,
  //     )
  //     .then(response => {
  //       if (response.status === 200) {
  //         // Assuming that the API response contains an image field
  //         const imageData = response.data.message;

  //         showImageViewModal(imageData);
  //       }
  //     })
  //     .catch(err => console.log('error in getting quotes:', err));
  // };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (isFocused) {
          Alert.alert(`${t('holdOn')}`, `${t('areYouSureYouWantToGoBack')}`, [
            {
              text: `${t('cancel')}`,
              onPress: () => null,
              style: 'cancel',
            },
            {text: `${t('yes')}`, onPress: () => BackHandler.exitApp()},
          ]);
          //return true;
        } else {
          navigation.goBack();
          //return false;
        }
        return true;
      };
      const getUserInfo = async () => {
        const user = await getUser();

        if (user && user.userInfo) {
          setUserInfo(user.userInfo);
        }
        //get userchat
      };
      getUserInfo();
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
      return () => backHandler.remove();
    }, [isFocused]),
  );
  const getProductCategories = async () => {
    const token = await getValueByKey('token');

    const config = {headers: {Authorization: 'Bearer ' + token}};

    await axios
      .get(`${APP_API_CATALOG_SERVICES}/categories`, config)
      .then(response => {
        if (response.status === 200) {
          const reversedCategories = response?.data?.categories;

          setSubCategories(reversedCategories);
        }
      })
      .catch(err => {
        console.log('error getting categories ++', err);
      });
  };
  useEffect(() => {
    if (isConnected) {
      getProductCategories();
      if (userInfo && userInfo?.userRoles?.includes('bee_mitra')) {
        getBeekeepersFromDisk();
      }
    }
  }, [isFocused, userInfo, isConnected]);

  // const getAllBeekeepers = async () => {
  //   const token = await getValueByKey('token');

  //   const config = {headers: {Authorization: 'Bearer ' + token}};

  //   axios
  //     .get(
  //       `${APP_API_MENTOR_VAlUECHAIN_SERVICES}/beekeeping/apiaries/bee-mitra/get-all-beekeepers`,
  //       config,
  //     )
  //     .then(async res => {
  //       if (res.status === 200) {
  //         setBeekeepersData(res?.data?.allBeekeeper?.length || 0);
  //       }
  //     })
  //     .catch(err => {
  //       console.log('error in response', err);
  //     });
  // };

  const getBeekeepersFromDisk = async () => {
    const _beekeepers = await getAllAssignedBeekeepers();
    
      setBeekeepersData(_beekeepers?.length || 0);
      console.log(_beekeepers?.length,countBeekeeper?.current,'beekeeper length');
      if(_beekeepers?.length==0 && countBeekeeper?.current<9){
        setTimeout(() => {
        countBeekeeper.current+=1
        getBeekeepersFromDisk()
      },1000);
    }
  };

  const fetchChats = async id => {
    if (isConnected) {
      const token = await getToken();
      dispatch(
        getCommunityChatByParticipantId({
          dispatch: dispatch,
          id: id,
          token: token,
        }),
      );
    }
  };

  useEffect(() => {
    if (basicInfo) {
      setTimeout(() => {
        fetchChats(basicInfo?._id);
      }, 300);
    }
  }, [basicInfo]);

  useFocusEffect(
    React.useCallback(() => {
      
      const checkToolTipObject=async()=>{
        await removeItemByKey('ToolTipObject')
        const toolTipObject={
          DashboardchatBot:false,
          Dashboardapiaryintro:false,
          Dashboardapiary:false,
          Dashboardlearn:false,
          skip:true
        }
    
       try {
         let currentObject=await getValueByKey('ToolTipObject')
         console.log(currentObject,'current tooltip');
         if (currentObject) {
          console.log('skip skip');
          // if(currentObject.skip){
          if(true){
            settooltip({
              DashboardchatBot:true,
              Dashboardapiaryintro:true,
              Dashboardapiary:true,
              Dashboardlearn:true,
            })
            return
          }
           // Check if all keys from toolTipObject are present in currentObject
           const missingKeys = Object.keys(toolTipObject).filter(key => !(key in currentObject));
           
           console.log(missingKeys,'missing keys tooltip');
           // If there are missing keys, merge them into currentObject
           if (missingKeys.length > 0) {
            const updatedObject = { ...currentObject }; // Start with the current object
    
            // Iterate over the keys of toolTipObject and add missing keys
            Object.keys(toolTipObject).forEach(key => {
              if (!(key in currentObject)) {
                updatedObject[key] = toolTipObject[key]; // Add only the missing key with its default value
              }
            });
              // Update the object in AsyncStorage
              console.log(updatedObject,'tooltip');
              await storeValueByKey('ToolTipObject', JSON.stringify(updatedObject));
              settooltip(updatedObject)
            }
            else{
              
              console.log(currentObject,'tooltip');
              await storeValueByKey('ToolTipObject', JSON.stringify(currentObject));
              settooltip(currentObject)
           }
         } else {
           settooltip(toolTipObject)
           console.log(toolTipObject,'tooltip');
           // If currentObject is null, initialize it with toolTipObject
           await storeValueByKey('ToolTipObject', JSON.stringify(toolTipObject));
         }
     
       } catch (error) {
        console.log('err in tooptipObject',error);
       }
      }
    
      checkToolTipObject()
    }, [isFocused]),
  );
  

  return (
    <View style={{flex: 1}}>
      <HeaderForDashBoard navigation={navigation} userInfo={userInfo} 
      // tooltip2={isFocused && tooltip && tooltip.Dashboardapiaryintro && tooltip.Dashboardlearn &&  tooltip.DashboardchatBot && !tooltip.Dashboardapiary}
      // tooltip={(isFocused && tooltip && !tooltip.Dashboardapiaryintro)}
      tooltip2={false}
      tooltip={false}
      tooltipobject={tooltip}
      tooltip2action={async(skip=false)=>{
        if(skip){
          settooltip(prev=>({
            ...prev,
            Dashboardapiaryintro: true,
            Dashboardlearn: true,
            DashboardchatBot: true,
            Dashboardapiary: true,
            skip:true
          }))
          const t=tooltip
          t.Dashboardapiaryintro=true
          t.skip=true
          await storeValueByKey('ToolTipObject', JSON.stringify(t));
          return
        }
        settooltip(prev=>({
          ...prev,
          Dashboardapiary: true
        }))
      }}
      tooltipaction={async(skip=false)=>{
        console.log(skip);
        if(skip){
          settooltip(prev=>({
            ...prev,
            Dashboardapiaryintro: true,
            Dashboardlearn: true,
            DashboardchatBot: true,
            Dashboardapiary: true,
            skip:true
          }))
          const t=tooltip
          t.Dashboardapiaryintro=true
          t.skip=true
          await storeValueByKey('ToolTipObject', JSON.stringify(t));
          return
        }
        settooltip(prev=>({
          ...prev,
          Dashboardapiaryintro: true
        }))
        if(tooltip && !tooltip.Dashboardapiaryintro){
          const t=tooltip
          t.Dashboardapiaryintro=true
          await storeValueByKey('ToolTipObject', JSON.stringify(t));
        }
        console.log('tooltipaction');
      }}
      />

      

      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}>
        
        <QuickLinks
          navigation={navigation}
          userInfo={userInfo}
          beekeeepersData={beekeeepersData}
        />

        {userInfo &&
        userInfo?.userRoles?.includes('bee_mitra') &&
        subcategories?.length > 0 ? (
          <MarketplaceCard navigation={navigation} />
        ) : null}

        <EDPModuleCard navigation={navigation} />
        <CommunityCard navigation={navigation} />
        {/* <MyModulesCard navigation={navigation} /> */}
      </ScrollView>
      <Tooltip
        backgroundColor={'rgba(0,0,0,0.8)'}
        tooltipStyle={{ top: height - 370 }}
        arrowStyle={{ width: 20, height: 20,marginLeft:(width/2)-90 }}
        contentStyle={{
          paddingHorizontal: 30,
          paddingVertical: 10,
          width: '100%',
          height: 'fit',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#CBCBCB',
        }}        childrenWrapperStyle={{ width: '100%', marginTop: 30 }}
        isVisible={tooltip && tooltip.Dashboardapiaryintro && tooltip.Dashboardlearn &&!tooltip.DashboardchatBot}
        content={
          <>
            <Text style={{ fontSize: 14, color: '#262626', lineHeight: 24 }} >
              {t('askAQuestionInfo')} 
                         </Text>
            {/* <TouchableOpacity 
            onPress={e=>{
              settooltip(prev=>({
                ...prev,
                DashboardchatBot: true
              }))
            }}
            style={{paddingHorizontal:18,paddingVertical:8,borderRadius:8, borderWidth:1, borderColor:udyamitaTheme.borderStyleColor,alignSelf:'flex-end',marginTop:10}}>
              <Text style={{ fontSize: 18, color: '#262626', lineHeight: 20}}>
                {t('next')}
              </Text>
            </TouchableOpacity> */}
          </>
        }
        placement="top"
        onClose={() => console.log('closing tool')}
        topAdjustment={-30}
      >

        

      <TouchableOpacity
        style={styles.chatbotIcon}
        onPress={async() => {
          if(tooltip && !tooltip.DashboardchatBot){
            const t=tooltip
            t.DashboardchatBot=true
            await storeValueByKey('ToolTipObject', JSON.stringify(t));
            await storeValueByKey('preferredLanguageChange', `true`);
            navigation.navigate('RecordingScreen');
          }
          else{
            navigation.navigate('RecordingScreen');
          }
          // navigation.navigate('WhisperScreenTest');
        }}>
        <ImageBackground
          source={require('../../assets/images/chatbotstatic.png')}
          style={{width: 100, height: 100, marginTop: 8,    position:'relative'
          }}
          >
        {/* <CustomText style={styles.botAsk} type="xs">
          {t('askAQuest')}
        </CustomText> */}

        </ImageBackground>
      </TouchableOpacity>
      </Tooltip>

      <Tooltip
        backgroundColor={'rgba(0,0,0,0.8)'}
        // tooltipStyle={{ top: height - 290 }}
        arrowStyle={{ width: 20, height: 20 }}
        contentStyle={{
          paddingHorizontal: 30,
          paddingVertical: 10,
          width: '100%',
          height: 'fit',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#CBCBCB',
        }}        childrenWrapperStyle={{ width: '100%'}}
        isVisible={tooltip && tooltip.Dashboardapiaryintro && !tooltip.Dashboardlearn}
        content={
          <>
            <Text style={{ fontSize: 14, color: '#262626', lineHeight: 24 }} >
              {t('learnsectionInfo')}
            </Text>
            <View style={{flexDirection:'row',justifyContent:'flex-end',gap:10,width:'100%',alignItems:'center'}}>
            <TouchableOpacity 
             onPress={async()=>{
              settooltip(prev=>({
                ...prev,
                Dashboardapiaryintro: true,
                Dashboardlearn: true,
                DashboardchatBot: true,
                Dashboardapiary: true,
                skip:true
              }))
              const t=tooltip
              t.Dashboardlearn=true
              t.skip=true
              await storeValueByKey('ToolTipObject', JSON.stringify(t));
             }}
             style={{paddingHorizontal:18,paddingVertical:8,borderRadius:8, borderWidth:1, borderColor:udyamitaTheme.borderStyleColor,alignSelf:'flex-end',marginTop:10}}>
               <Text style={{ fontSize: 14,fontWeight:'600', color: '#262626', lineHeight: 20}}>
                 {t('skip')}
               </Text>
             </TouchableOpacity>
            <TouchableOpacity 
            onPress={async()=>{
              settooltip(prev=>({
                ...prev,
                Dashboardlearn: true
              }))
              if(tooltip && !tooltip.Dashboardlearn){
                const t=tooltip
                t.Dashboardlearn=true
                await storeValueByKey('ToolTipObject', JSON.stringify(t));
              }
            }}
            style={{paddingHorizontal:18,paddingVertical:8,borderRadius:8, borderWidth:1, borderColor:udyamitaTheme.borderStyleColor,alignSelf:'flex-end',marginTop:10}}>
              <Text style={{ fontSize: 14,fontWeight:'600', color: '#262626', lineHeight: 20}}>
                {t('next')}
              </Text>
            </TouchableOpacity>
            </View>
          </>
        }
        placement="top"
        onClose={() => console.log('closing tool')}
        topAdjustment={-30}
      >

          <View style={{backgroundColor:'#ffffff',paddingVertical:10,borderRadius:10,position:'absolute',bottom:-114,flexDirection:'column',zIndex:100,left:width*0.25, justifyContent:'center',alignItems:'center', width:width*0.25}}>
          <Image
                source={
                     require('../../assets/images/Learn_inactive.png')
                }
                style={{width: 32,
                  height: 32,
                  marginTop:12,}}
              />

              <Text style={{fontSize:10 ,fontWeight:'400',marginTop:4}}>{ t('learn')}</Text>
          </View>
      </Tooltip>
      
      <TipOfTheDayModal
        isVisible={isImageViewModalVisible}
        onClose={closeImageViewModal}
        imageData={imageData}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    backgroundColor: udyamitaTheme.themeBgColor,
    //flexGrow: 1,
    //paddingBottom: 10,

    //height: 'auto',
    //flex: 0,
  },
  botAsk: {
    fontSize: udyamitaTheme.themeFontSizeExtraSmall,
    lineHeight: 14,
    color: 'white',
    position: 'absolute',
    alignSelf:'center',
    bottom:20,
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
  },
  chatbotIcon: {
    position: 'absolute',
    bottom: 10,
    right: 0,
    height:100,
    width:100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
