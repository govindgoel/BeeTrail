import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React, {useState, useEffect} from 'react';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import axios from 'axios';
import {getValueByKey} from '../../../helpers/UserData';
import {useTranslation} from 'react-i18next';
import CustomText from '../../reusable/CustomText';
import { winWidth } from '../../../helpers/dimensions';

const DiscoverComunities = ({
  logoUrl,
  title,
  item,
  membersCount,
  communityId,

  navigation,
  activeTab
}) => {
 
  const {t} = useTranslation();
 
  const visibility = item.visibility;


  return (
    <View style={styles.mainCard2}>
      {!logoUrl ? (
        <Image
          style={styles.communityLogoForNew}
          source={require('../../../assets/images/communityPlaceholderImage.png')}
          resizeMode="contain"
        />
      ) : (
        <Image style={styles.communityLogoForNew} source={{uri: logoUrl}} />
      )}
      <View>
        <CustomText
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
            fontSize: udyamitaTheme.themeFontSizeLabel,
            marginLeft: 10,
            marginTop: 15,
            color: udyamitaTheme.textColor,
          }}
          type="label">
          {title}
        </CustomText>
        <View
          style={{
             justifyContent: 'space-between',
            marginTop: 10,
            //display: 'flex',
            flexDirection: 'row',
            // alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              marginRight: 10,
              alignItems: 'center',
              marginLeft:10
            }}>
            {visibility === 'Public' || visibility === 'public' ? (
              <>
                <Image
                  source={require('../../../assets/images/Public.png')}
                  style={{
                    width: 12,
                    height: 12,
                     resizeMode: 'contain',
                     marginRight:5
                  }}
                />
                <CustomText style={styles.communityVisibilityText} type="xs">
                  {t(item?.visibility?.toLowerCase())}
                </CustomText>
              </>
            ) : (
              <>
                <Image
                  source={require('../../../assets/images/Private.png')}
                  style={{
                    width: 15,
                    height: 15,
                    resizeMode: 'contain',
                  }}
                />
                <CustomText style={styles.communityVisibilityText} type="xs">
                  {t(visibility?.toLowerCase())}
                </CustomText>
              </>
            )}
          </View>
          {membersCount ? (
            <View style={styles.memberBox3}>
              <Image
                source={require('../../../assets/images/Members.png')}
                style={{
                  width: 20,
                  height: 18,
                  resizeMode: 'contain',
                }}
              />
              <CustomText style={styles.membrsCountText} type="sh">
                {membersCount}
              </CustomText>
            </View>
          ) : null}
         
        </View>


   
      </View>
      { item?.isUserRegisterd?.status === 'Inactive' ? <TouchableOpacity
              style={{
                borderWidth: 1,
                padding: 5,
                position: 'absolute',
                right: 8,
                height:36,
                top: '57%',
                justifyContent:'center',
                borderColor:
                  item?.isUserRegisterd?.status &&
                  ['Inactive', 'Active'].includes(item?.isUserRegisterd?.status)
                    ? udyamitaTheme.primaryColor
                    : udyamitaTheme.primaryColor,
                borderRadius: 6,
              }}
              // disabled={
              //   item?.isUserRegisterd?.status &&
              //   ['Inactive', 'Active'].includes(item?.isUserRegisterd?.status)
              // }
              onPress={() => {
                visibility === 'Public' || visibility === 'public'
                  ? navigation.navigate('CommunityFeed', {
                      communityData: item,
                      navigation,
                      activeTab
                    })
                  : navigation.navigate('RequestJoining', {
                      communityData: item,
                      navigation,
                      activeTab
                    });
              }}>
              <CustomText
                style={{
                  fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
                  fontSize: udyamitaTheme.themeFontSizeLabel,
                  color:
                    item?.isUserRegisterd?.status &&
                    ['Inactive', 'Active'].includes(
                      item?.isUserRegisterd?.status,
                    )
                      ? udyamitaTheme.primaryColor
                      : udyamitaTheme.primaryColor,
                }}
                type="xs">
                {item?.isUserRegisterd?.status  && 
                ['Inactive', 'Active'].includes(item?.isUserRegisterd?.status)
                  ? t('rejoin')
                  : null }
              </CustomText>
            </TouchableOpacity> : (
            <TouchableOpacity
              style={{
                borderWidth: 1,
                position: 'absolute',
                right: 8,
                height:36,
                top: '57%',
                justifyContent:'center',
                padding: 5,
                borderColor:
                  item?.isUserRegisterd?.status &&
                  ['Inactive', 'Active'].includes(item?.isUserRegisterd?.status)
                    ? 'grey'
                    : udyamitaTheme.primaryColor,
                borderRadius: 6,
              }}
              disabled={
                item?.isUserRegisterd?.status &&
                ['Inactive', 'Active'].includes(item?.isUserRegisterd?.status)
              }
              onPress={() => {
                visibility === 'Public' || visibility === 'public'
                  ? navigation.navigate('CommunityFeed', {
                      communityData: item,
                      navigation,
                      activeTab
                    })
                  : navigation.navigate('RequestJoining', {
                      communityData: item,
                      navigation,
                      activeTab
                    });
              }}>
              <CustomText
                style={{
                  fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
                  fontSize: udyamitaTheme.themeFontSizeLabel,
                  color:
                    item?.isUserRegisterd?.status &&
                    ['Inactive', 'Active'].includes(
                      item?.isUserRegisterd?.status,
                    )
                      ? 'grey'
                      : udyamitaTheme.primaryColor,
                }}
                type="xs">
                {item?.isUserRegisterd?.status &&
                ['Inactive', 'Active'].includes(item?.isUserRegisterd?.status)
                  ? t('requested')
                  : t('joinNow')}
              </CustomText>
            </TouchableOpacity>
          )}
    </View>
  );
};

export default DiscoverComunities;

const styles = StyleSheet.create({

  communityName: {
    color: '#000000',
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    marginTop: 5,
    //marginBottom: 5,
  },
  joinNowBtn: {
    backgroundColor: '#fff',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    height: 34,
    borderWidth: 1,
    position:'absolute',
    right:0,
    borderColor: udyamitaTheme.primaryColor,
  },
  joinNowBtnText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    color: udyamitaTheme.primaryColor,
    fontSize: udyamitaTheme.themeFontSizeLabel,
  },
  row: {
    flexDirection: 'row',
    marginTop: 2,
    marginBottom: 2,
    alignItems: 'center',
  },
  detailsText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
    color: udyamitaTheme.textColor,
    opacity: 0.8,
    textTransform: 'capitalize',
  },
  mainCard2: {
    marginTop: 5,
    marginBottom: 5,
    width: winWidth * 0.9,
    //display: 'flex',
    flexDirection: 'row',
    borderColor: udyamitaTheme.borderStyleColor,
    borderWidth: 0.5,
    // justifyContent: 'space-between',
    // marginLeft: 10,
    borderRadius: 6,
    backgroundColor: '#fff',
    // paddingRight:10
  },
  communityLogoForNew: {
    borderRadius: 4,
    // borderColor: 'blue',
    height: 80,
    width: 80,
    marginLeft: 8,
    // alignSelf: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  memberBox3: {
    //width: '25%',
    //display: 'flex',
    flexDirection: 'row',
    marginTop: 2,
    marginRight: 20,
    alignItems:'center',
    //justifyContent:'center'
  },
  membrsCountText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
    marginLeft: 5,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  communityVisibilityText: {
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    fontSize: udyamitaTheme.themeFontSizeExtraSmall,
    marginLeft: 3,
    marginTop: 2,
    textTransform: 'capitalize',
    color: udyamitaTheme.textColor,
  },
});
