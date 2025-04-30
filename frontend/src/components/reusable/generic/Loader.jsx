/* eslint-disable react-hooks/exhaustive-deps */
import {View, Text, Image, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import {getToken, storeUser} from '../../../helpers/UserData';
import axios from 'axios';
import {APP_API_USER_URL} from '@env';
import {useTranslation} from 'react-i18next';
import {useFocusEffect} from '@react-navigation/native';
import { APP_NAME, BEEKIND_APP_NAME } from '../../../config/app.config';


export default function Loader({navigation, route}) {
  const {t} = useTranslation();
  const {
    firstText: FIRST_TEXT,
    secondText: SECOND_TEXT,
    loader: LOADER,
    usercreation,
    initFunction: INIT_FUNCTION,
    initFunctionParams: INIT_FUNCTION_PARAMS,
    PAGE_ACTION = 'CREATION',
    LOADER_ACTION,
    reqBody: REQ_BODY,
    businessIdea: BUSINESS_IDEA,
    navigateAfter: NAVIGATE_AFTER,
  } = route?.params;

  const firstText = FIRST_TEXT;
  const [isusercreation, setusercreation] = useState(usercreation)
  const [secondText, setSecondText] = useState(SECOND_TEXT);
  const [loader, setLoader] = useState(LOADER);
  const [initFunction, setInitFunction] = useState(INIT_FUNCTION);
  const [initFunctionParams, setInitParams] = useState(INIT_FUNCTION_PARAMS);
  const [pageAction, SET_pageAction] = useState(PAGE_ACTION);

  const [loaderAction, setLoaderAction] = useState(LOADER_ACTION);
  const [reqBody, setReqBody] = useState(REQ_BODY);
  const [businessIdea, setBusinessIdea] = useState(BUSINESS_IDEA);


  const updateUserProfile = async () => {
    const token = await getToken();
    const config = {headers: {Authorization: 'Bearer ' + token}};
    await axios
      .put(`${APP_API_USER_URL}/user/profile`, REQ_BODY, config)
      .then(data => {
        const userInfo = JSON.parse(JSON.stringify(data.data));
        storeUser(userInfo);
        const userInfoDoc = userInfo.userInfo;

        let PROFILE_STAGE = APP_NAME===BEEKIND_APP_NAME?'':'ENTERPRISE_SELECTION';
        if (userInfoDoc && userInfoDoc.businessIdea) {
          PROFILE_STAGE = 'PROFILE_CREATION';
          console.log("line 52",PROFILE_STAGE);
          console.log("userInfoDoc == >>>>>> ",userInfoDoc);
        
          if (
            userInfoDoc.name || (userInfoDoc.user_wife_name && userInfoDoc.user_husband_name)  &&
            userInfoDoc.gender &&
            userInfoDoc.operatingEnterpriseSince &&
            userInfoDoc.address &&
            userInfoDoc.address.state &&
            userInfoDoc.address.district && userInfoDoc.businessIdea
          ) {
            console.log("profile: complete",PROFILE_STAGE)
            PROFILE_STAGE = 'COMPLETE';
          }
        }
        switch (PROFILE_STAGE) {
          case 'COMPLETE':    
          // console.log("inside")  
          console.log("profile: complete 2",PROFILE_STAGE)
            navigation.navigate('DrawerTabs');
            break;
          case 'ENTERPRISE_SELECTION':
            navigation.navigate('EnterpriseSelection');
            break;
          case 'PROFILE_CREATION':
            console.log("profile:75 2",PROFILE_STAGE)
            navigation.navigate('ProfileCreationForm', {
              title: t('createYourAccount'),
            });
            break;
        }
      })
      .catch(err => {
        console.log('Error while updating enterprise:', err);
      });
  };
  useFocusEffect(
    React.useCallback(() => {
      if (reqBody) {
        updateUserProfile();
      } else if (NAVIGATE_AFTER) {
        setTimeout(() => {
          navigation.navigate("CommunityHomeScreen",{screen:'CommunityHomeScreen'});
        }, NAVIGATE_AFTER * 1000);
      } else if (
        INIT_FUNCTION &&
        INIT_FUNCTION_PARAMS &&
        INIT_FUNCTION_PARAMS.length
      ) {
        INIT_FUNCTION(...(INIT_FUNCTION_PARAMS || []));
      } else if (INIT_FUNCTION) {
        INIT_FUNCTION();
      }
    }, []),
  );
  return (
    <View style={styles.container}>
      {loader ? (
        <Image
          source={require('../../../assets/images/Beekeepers_app_loader.gif')}
          style={{
            width: 150,
            height: 150,
          }}
        />
      ) : (
        <Image
          source={require('../../../assets/images/Joinrequest.png')}
          style={{width: 100, height: 88, resizeMode: 'contain'}}
        />
      )}
      {isusercreation?
      <>
      <Text
        style={{
          paddingHorizontal:30,
          color: udyamitaTheme.textColor,
          fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
          fontSize: udyamitaTheme.themeFontSizeButton,
          textAlign: 'center',
        }}>
        {secondText}
      </Text>
      </>
      :<>
      <Text
        style={{
          color: udyamitaTheme.primaryColor,
          fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
          fontSize: udyamitaTheme.themeFontSizeButton,
          textAlign: 'center',
        }}>
        {firstText}
      </Text>
      <Text
        style={{
          textAlign: 'center',
          fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
          fontSize: udyamitaTheme.themeFontSizeLabel,
          lineHeight: 24,
          color: udyamitaTheme.textColor,
        }}>
        {secondText}
      </Text>
      </>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    top: 220,
    paddingLeft: 20,
    paddingRight: 20,
  },
});
