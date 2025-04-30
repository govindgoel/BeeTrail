import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import {Badge} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {NotificationsIcon} from '../../../assets/Icons/IconSvg';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import {BackIcon} from '../../../assets/Icons/IconSvg';
import {APP_API_COMMUNITY_URL, APP_API_LIBRARY_URL} from '@env';
import axios from 'axios';
// import analytics from '@react-native-firebase/analytics';
import {
  // getToken,
  getValueByKey,
} from '../../../helpers/UserData';
import {useTranslation} from 'react-i18next';
import useDebounce from '../../../helpers/hooks/useDebounce';
import {useFocusEffect} from '@react-navigation/native';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import CustomText from '../CustomText';

const CustomHeader = ({
  title,
  showBackIcon,
  onBackPress,
  showRightSideIcons,
  logo,
  tapToViewInfo,
  navigation,
  communityDetails,
  search,
  placeholderText,
  logoTrue,
  module,
  results,
  setResults,
  searchText,
  setSearchText,
  rightSideScreen,
  marketPlaceIcons,
  totalItems,
  communityId,
  setMemberSearchResuls,
  memberSearchResults,
  migration,
  addBeekeeper,
  feed,
  secondTitle,
  secondTitleText
}) => {
  const {t, i18n} = useTranslation();
  const [members, setMembers] = useState([]);
  const currTheme = 'en'
  const [userMemberRole, setUserMemberRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adminRole, setAdminRole] = useState(null);
  const [notifLen, setNotifLen] = useState(0);
  const [msgLen, setMsgLen] = useState(0);
  const [actLangTheme, setActLangTheme] = useState({});
  useEffect(() => {
    setActLangTheme(currTheme);
  }, [currTheme]);

 
  
  const handleSearch = async (CustomText = searchText) => {
    const token = await getValueByKey('token');

    const config = {headers: {Authorization: 'Bearer ' + token}};

    if (CustomText) {
      
      if (module === 'community') {
        await axios
          .get(
            `${APP_API_COMMUNITY_URL}/community/members/search/${communityId}?q=${CustomText}`,
            config,
          )
          .then(response => {
            if (response.status === 200) {
              setResults(response.data.members || []);
            }
          })
          .catch(err =>
            console.log('Error getting member search results', err),
          );
      } else if (module === 'learn') {
        setLoading(true);
        await axios
          .get(`${APP_API_LIBRARY_URL}/media/search?q=${CustomText}`, config)
          .then(response => {
            if (response.status === 200) {
              setResults(response.data.searchResult || []);
              setLoading(false);
            }
          })
          .catch(err => console.log('Error getting search results', err));
      }
    }
  };

  // DeBounce Function
  useDebounce(
    () => {
      handleSearch(searchText);
    },
    [searchText],
    800,
  );

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        {showBackIcon && (
          <TouchableOpacity
            onPress={onBackPress}
            style={styles.backButton}
            hitSlop={40}>
            <BackIcon />
          </TouchableOpacity>
        )}

        {logoTrue &&
          (logo ? (
            <Image
              source={{uri: logo}}
              style={{width: 44, height: 45, borderRadius: 40, marginLeft: 15}}
            />
          ) : (
            <Image
              source={require('../../../assets/images/communityPlaceholderImage.png')}
              style={{width: 44, height: 45, borderRadius: 40, marginLeft: 15}}
            />
          ))}
        <View
          style={{
            flexDirection: 'column',
            // alignItems: 'center',
            flex: 1,
          }}>
          <View
            // onPress={
            //   module === 'communityFeed'
            //     ? navigation.navigate('CommunityInfo', {
            //         communityData: communityDetails,
            //         members,
            //         admins: adminRole,
            //       })
            //     : onBackPress 
            // }
            onPress={()=>onBackPress()}
            >
            <Text
              style={styles?.title(actLangTheme)}
              numberOfLines={1}
              ellipsizeMode="tail"
              type="h">
              {title}
            </Text>
            {secondTitle && <CustomText
              style={{color:udyamitaTheme.textColor,marginLeft: 10,
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
              type="label">
              {secondTitleText}
            </CustomText>}

          </View>

          {showRightSideIcons && (
            <View
              style={{
                flexDirection: 'row',
                right: 0,
                position: 'absolute',
                alignItems: 'center',
              }}>
              {migration ? (
                <TouchableOpacity
                  style={{marginRight: 20}}
                  onPress={() => navigation.navigate('PastMigration')}>
                  <Image
                    source={require('../../../assets/images/pastMigration.png')}
                    style={{width: 46, height: 26, resizeMode: 'contain'}}
                  />
                </TouchableOpacity>
              ) : null}
              {/* <TouchableOpacity
                style={{marginRight: 20}}
                onPress={() => navigation.navigate('MessageListing')}>
                <Image source={require('../../../assets/images/msg.png')} />
              </TouchableOpacity> */}

              <TouchableOpacity
                style={{marginRight: 20}}
                onPress={() => navigation.navigate('MessageListing')}>
                {msgLen ? (
                  <Badge style={styles.notifBadge} size={18}>
                    {msgLen}
                  </Badge>
                ) : null}
                <MaterialCommunityIcons
                  name="message-processing-outline"
                  size={24}
                  color={udyamitaTheme.textColor}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('notifications')}>
                {notifLen ? (
                  <Badge style={styles.notifBadge} size={18}>
                    {notifLen}
                  </Badge>
                ) : null}
                <NotificationsIcon />
              </TouchableOpacity>
            </View>
          )}
          {marketPlaceIcons && (
            <View
              style={{flexDirection: 'row', right: 0, position: 'absolute'}}>
              <TouchableOpacity
                style={{marginRight: 20}}
                onPress={() => navigation.navigate('Cart')}>
                <Image
                  source={require('../../../assets/images/Mybag.png')}
                  style={styles.smallIcons}
                />
              </TouchableOpacity>
              {totalItems > 0 && (
                <View style={styles.cartBadge}>
                  <CustomText style={styles.cartBadgeText} type="sh">
                    {totalItems}
                  </CustomText>
                  {/* <CustomText style={styles.cartBadgeText}>{totalItems}</CustomText> */}
                </View>
              )}
            </View>
          )}
        </View>

        {rightSideScreen && (
          <TouchableOpacity
            style={{flexDirection: 'row', marginLeft: 110}}
            // onPress={() => navigation.navigate('ViewVideoHistory')}
          >
            <Image
              source={require('../../../assets/images/History_1.png')}
              style={{width: 18, height: 18, marginRight: 2}}
            />
            {/* lang supp todo */}
            <CustomText
              style={{
                fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
                color: udyamitaTheme.primaryColor,
                fontSize: udyamitaTheme.themeFontSizeSmallHeader,
              }}
              type="sh">
              My Video History
            </CustomText>
          </TouchableOpacity>
        )}
      </View>
      {search && (
        <View
          style={{
            flexDirection: 'row',
            // marginLeft: 10,
            //justifyContent: 'space-between',
            borderWidth: 0.5,
            borderColor: udyamitaTheme.borderStyleColor,
            borderRadius: 6,
            width: '90%',
            alignItems: 'center',
            paddingLeft: 5,
            paddingRight: 10,
            alignSelf: 'center',
            marginTop: 10,
          }}>
          <TextInput
            //multiline
            placeholder={placeholderText}
            placeholderTextColor={udyamitaTheme.textColor}
            style={{
              fontFamily: udyamitaTheme.mainThemeFontFamily,
              fontSize: udyamitaTheme.themeFontSizeSmallHeader,
              opacity: 0.8,
              width: '90%',
            }}
            onChangeText={text => {
              setSearchText(text);
              // handleSearch(CustomText);
            }}
            value={searchText}
          />
        {searchText ?  <TouchableOpacity onPress={() =>{
              setSearchText('');
              setResults(feed)}}>
            <Image
              source={require('../../../assets/images/Cross.png')}
              style={{width: 24, height: 24}}
            /> 
            </TouchableOpacity>:
            <TouchableOpacity
            onPress={() => handleSearch()}
            style={{position: 'absolute', right: 10}}>
            {addBeekeeper ? (
              <Image
                source={require('../../../assets/images/SearchGreen.png')}
                style={{width: 24, height: 24}}
              />
            ) : 
              <Image
                source={require('../../../assets/images/Search.png')}
                style={{width: 24, height: 24}}
              />
            }
          </TouchableOpacity>
           }
        </View>
      )}
      {tapToViewInfo && (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('CommunityInfo', {
              communityData: communityDetails,
              members,
              admins: adminRole,
            })
          }
          style={{
            flexDirection: 'row',
            marginLeft: 112,
            marginTop: -7,
            alignItems: 'center',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={
                (communityDetails?.visibility || '').toLowerCase() === 'private'
                  ? require('../../../assets/images/Private.png')
                  : require('../../../assets/images/Public.png')
              }
              style={{height: 24, width: 24, marginRight: 6}}
            />
            <CustomText
              style={{
                fontFamily: udyamitaTheme.mainThemeFontFamily,
                // fontSize: udyamitaTheme.themeFontSizeSmallHeader,
                fontSize: RFValue(10),
                textTransform: 'capitalize',
                color: udyamitaTheme.textColor,
              }}
              type="sh">
              {t(communityDetails?.visibility?.toLowerCase())}
            </CustomText>
          </View>
          <View style={styles.overlappingContainer}>
            {members?.slice(0, 3)?.map(memberObj =>
              [undefined, null, ''].includes(
                memberObj?.member?.profilePictureUrl,
              ) && [undefined, null, ''].includes(memberObj?.member?.photo) ? (
                <View
                  key={memberObj?.member?._id}
                  style={styles.avatarContainer}>
                  <Text style={styles.avatarText}>
                    {memberObj?.member?.name?.charAt(0) || ''}
                  </Text>
                </View>
              ) : (
                <Image
                  key={memberObj?.member?._id}
                  source={{
                    uri:
                      memberObj?.member?.profilePictureUrl ||
                      memberObj?.member?.photo,
                  }}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    marginLeft: -4,
                  }}
                />
              ),
            )}

            {adminRole &&
              (adminRole[0]?.member?.profilePictureUrl !== '' ? (
                <Image
                  key={adminRole[0]?.member?._id}
                  source={{uri: adminRole[0]?.member?.profilePictureUrl}}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    marginLeft: -4,
                  }}
                />
              ) : (
                <View
                  key={adminRole[0]?.member?._id}
                  style={styles.avatarContainer}>
                  <Text style={styles.avatarText}>
                    {adminRole[0]?.member?.name?.charAt(0) || ''}
                  </Text>
                </View>
              ))}
          </View>

          <CustomText
            style={{
              fontFamily: udyamitaTheme.mainThemeFontFamily,
              fontSize: udyamitaTheme.themeFontSizeSmallHeader,
              color: udyamitaTheme.textColor,
            }}
            type="sh">
            {' '}
            {members?.length - 3 > 0
              ? `+${members?.length - 3} ${t('more')}`
              : null}
          </CustomText>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'white',

    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    elevation: 10,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 10,
    // alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
    paddingTop: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: props => ({
    color: udyamitaTheme.textColor,
    // fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    fontSize: 18,
    fontWeight:'600',
    // fontSize: RFValue(20),
    marginLeft: 10,
  }),
  backButton: {
    // position: 'absolute',
    left: 20,
    width:36,
    height:36,
    marginRight: 20,
    //backgroundColor:'red',
    justifyContent:'center',
    alignItems:'center'
  },
  placeholder: {
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    color: 'red',
  },
  avatarContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',

    borderColor: udyamitaTheme.borderStyleColor,
    borderWidth: 1,
    marginLeft: -4,
  },
  avatarText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: udyamitaTheme.primaryColor,
  },

  overlappingContainer: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  smallIcons: {
    height: 32,
    width: 32,
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: 40,
    backgroundColor: 'red',
    borderRadius: 50,

    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
  },
  notifBadge: {
    position: 'absolute',
    top: -7,
    right: -3,
    zIndex: 3,
    backgroundColor: udyamitaTheme?.primaryColor,
  },
});
