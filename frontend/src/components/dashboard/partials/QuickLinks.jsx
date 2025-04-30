/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import {useTranslation} from 'react-i18next';
import {useFocusEffect} from '@react-navigation/native';
import {setBasicInfo} from '../../../store/reducers/entrepreneurReducer';
import {useDispatch, useSelector} from 'react-redux';
import {getToken, getUser} from '../../../helpers/UserData';
import SendIntentAndroid from 'react-native-send-intent';
import {Linking} from 'react-native';
import CustomText from '../../reusable/CustomText';
import {getTransliterationNames} from '../../../store/services/entrepreneurServices';
/**
 *
 * Component that displays a list of quick link widgets
 */
const img = require('../../../assets/images/noImg.png');
const communityIcon = require('../../../assets/images/CommunityDashboard.png');

const Learn = require('../../../assets/images/Learn.png');
const Loan = require('../../../assets/images/Loan11.png');
const Expert = require('../../../assets/images/Expert4.png');
const beekeepersIcon = require('../../../assets/images/dashboard_beeKeepers.png');
const onlineShoppineE_bazaar = require('../../../assets/images/Onlineshopping.png');

export default function QuickLinks({
  navigation,
  userInfo,
  route,
  beekeeepersData,
}) {
  const dispatch = useDispatch();
  // const prefLang = useSelector(state => state?.entrepreneur?.prefLang);
  const [transliteratedName, setTransliteratedName] = useState('');
  const {t, i18n} = useTranslation();

  const Data = [
    {
      title:
        userInfo && userInfo?.userRoles?.includes('bee_mitra')
          ? t('myBeekeepers') + ' (' + `${beekeeepersData}` + ')'
          : t('community'),
      thumbnail:
        userInfo && userInfo?.userRoles?.includes('bee_mitra')
          ? beekeepersIcon
          : communityIcon,
      compLink:
        userInfo && userInfo?.userRoles?.includes('bee_mitra') ? null : 'CommunityHomeScreen',
      navLink:
        userInfo && userInfo?.userRoles?.includes('bee_mitra')
          ? 'BeeKeepersListing'
          : 'CommunityHomeScreen',
    },
    {
      title: t('learn'),
      thumbnail: Learn,
      compLink: 'learn',
      navLink: 'ListVideos',
    },
    {
      title: t('loan'),
      thumbnail: Loan,
      compLink: '',
      navLink: 'SchemaListing',
      //navLink:'MandatoryUpdateScreen'
    },

    {
      title:
        userInfo && userInfo?.userRoles?.includes('bee_mitra')
          ? t('eBazaar')
          : t('expert'),
      thumbnail:
        userInfo && userInfo?.userRoles?.includes('bee_mitra')
          ? onlineShoppineE_bazaar
          : Expert,
      compLink:
        userInfo && userInfo?.userRoles?.includes('bee_mitra') ? 'eBazaar' : null,
      navLink:
        userInfo && userInfo?.userRoles?.includes('bee_mitra')
          ? 'ListCategories'
          : 'ExpertHomeScreen',
      //phoneNumber: '918898752416'
    },
  ];

  // const [userInfo, setUserInfo] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const getUserInfo = async () => {
        const user = await getUser();
        const token = await getToken();
        if (user && user.userInfo) {
          // setUserInfo(user.userInfo);

          dispatch(setBasicInfo(user?.userInfo));
        }
      };
      getUserInfo();
    }, []),
  );
  useEffect(() => {
    if (userInfo) {
      if (
        true ||
        userInfo.preferredLanguage === 'en' ||
        userInfo.preferredLanguage === 'english'
      ) {
        setTransliteratedName(userInfo?.name);
      } else {
        let reqObj = {};
        reqObj.text = userInfo?.name;
        reqObj.script = 'Latn';
        let data = [];
        data.push(reqObj);
        dispatch(
          getTransliterationNames({
            data: data,
            lang: userInfo.preferredLanguage,
          }),
        )
          .unwrap()
          .then(res => {
            setTransliteratedName(res);
          })
          .catch(err => {
            console.log('err: ', err);
          });
      }
    }
  }, [userInfo]);

  // const handleExpertPress = async phoneNumber => {
  //   // const whatsappUrl = whatsapp://send?phone=${phoneNumber};
  //   const whatsappUrl = 'https://wa.me/' + phoneNumber;
  //   await Linking.openURL(whatsappUrl);

  //   // const canOpen = await Linking.canOpenURL(whatsappUrl);

  //   // if (canOpen) {
  //   //   // WhatsApp is installed, open the URL
  //   //   Linking.openURL(whatsappUrl).catch(err =>
  //   //     console.error('Error opening WhatsApp:', err),
  //   //   );
  //   // } else {
  //   //   // WhatsApp is not installed, navigate to the store to install
  //   //   const storeUrl =
  //   //     'https://play.google.com/store/apps/details?id=com.whatsapp';

  //   //   Linking.openURL(storeUrl).catch(err =>
  //   //     console.error('Error opening store:', err),
  //   //   );
  //   // }
  // };
  return (
    <View style={styles.container}>
      <CustomText
        style={{
          fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
          color: udyamitaTheme.textColor,
          fontSize: udyamitaTheme.themeFontSizeButton,
          paddingBottom: 10,
          paddingLeft: 20,
          //textTransform: 'capitalize',
        }}
        type="btn">
        {t('namaste')}{' '}
        {userInfo?.name ||
          userInfo?.user_husband_name + ' and ' + userInfo?.user_wife_name ||
          ''}
        !{/* {t('namaste')} {transliteratedName || userInfo?.name || ''}! */}
      </CustomText>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <FlatList
          data={Data}
          numColumns={2}
          renderItem={({item, index}) => {
            const titleLines = item.title;

            return (
              <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => {
                  if (item.compLink) {
                    navigation.navigate(item.compLink, {
                      screen: item.navLink,
                    });
                  } else {
                    navigation.navigate(item.navLink);
                  }
                }}>
                <Image source={item.thumbnail} style={styles.catImg} />
                <View
                  // onPress={() => navigation.navigate(item?.navLink)}
                  style={{
                    borderWidth: 1,
                    width: 148,
                    justifyContent: 'center',
                    alignItems: 'center',
                    //height: 30,
                    borderRadius: 6,
                    backgroundColor: '#fff',
                    borderColor: udyamitaTheme.beeAppColor,
                    paddingTop: 6,
                    paddingBottom: 6,
                  }}>
                  <CustomText style={styles.text} type="label">
                    {titleLines}
                  </CustomText>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingBottom: 10,
  },
  catImg: {
    width: '100%',
    height: '81%',
    //borderRadius: 8,
    resizeMode: 'contain',
    marginTop: -10,
    zIndex: 1,
  },

  itemContainer: {
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: udyamitaTheme.quickLinkBgColor,
    width: 148,
    alignItems: 'center',
    height: 109,
    borderRadius: 6,
    marginLeft: 10,
    marginTop: 10,
  },

  text: {
    textAlign: 'center',
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    color: '#000000',
  },
});
