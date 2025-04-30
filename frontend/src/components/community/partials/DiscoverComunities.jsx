import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React, {useState, useEffect} from 'react';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import axios from 'axios';
import {getValueByKey} from '../../../helpers/UserData';
import {useTranslation} from 'react-i18next';
import CustomText from '../../reusable/CustomText';
import {winWidth} from '../../../helpers/dimensions';

const DiscoverComunities = ({
  logoUrl,
  title,
  item,
  membersCount,
  communityId,

  navigation,
  activeTab,
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
      <View style={{flex: 1, marginLeft: 8}}>
        <CustomText
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
            fontSize: udyamitaTheme.themeFontSizeLabel,
            marginLeft: 10,

            color: udyamitaTheme.textColor,
          }}
          type="label">
          {title}
        </CustomText>
        <View style={styles.rowContainer}>
          <View
            style={[
              styles.rowContainer,
              {margin: 10, justifyContent: 'center'},
            ]}>
            <Image
              source={
                visibility.toLowerCase() === 'public'
                  ? require('../../../assets/images/Public.png')
                  : require('../../../assets/images/Private.png')
              }
              style={{
                width: 12,
                height: 12,
                resizeMode: 'contain',
                marginRight: 5,
              }}
            />

            <CustomText style={styles.communityVisibilityText} type="xs">
              {t(item?.visibility?.toLowerCase())}
            </CustomText>
          </View>

          {membersCount ? (
            <View
              style={[
                styles.rowContainer,
                {margin: 10, justifyContent: 'center'},
              ]}>
              <Image
                source={require('../../../assets/images/Members.png')}
                style={{
                  width: 20,
                  height: 18,
                  resizeMode: 'contain',
                  marginRight: 5,
                }}
              />
              <CustomText style={styles.membrsCountText} type="sh">
                {membersCount}
              </CustomText>
            </View>
          ) : null}
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View></View>

          {item?.isUserRegisterd?.status === 'Inactive' ? (
            <TouchableOpacity
              style={{
                borderWidth: 1,
                padding: 5,
                alignItems:'center',
                justifyContent:'center',
minWidth:80,
minHeight:36,
                borderColor:
                  item?.isUserRegisterd?.status &&
                  ['Inactive', 'Active'].includes(item?.isUserRegisterd?.status)
                    ? udyamitaTheme.primaryColor
                    : udyamitaTheme.primaryColor,
                borderRadius: 6,
              }}
              onPress={() => {
                visibility === 'Public' || visibility === 'public'
                  ? navigation.navigate('CommunityFeed', {
                      communityData: item,
                      navigation,
                      activeTab,
                    })
                  : navigation.navigate('RequestJoining', {
                      communityData: item,
                      navigation,
                      activeTab,
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
                {item?.isUserRegisterd?.status &&
                ['Inactive', 'Active'].includes(item?.isUserRegisterd?.status)
                  ? t('rejoin')
                  : null}
              </CustomText>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                borderWidth: 1,
                minWidth:80,
                minHeight:36,
                padding: 5,
                alignItems:'center',
                justifyContent:'center',
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
                      activeTab,
                    })
                  : navigation.navigate('RequestJoining', {
                      communityData: item,
                      navigation,
                      activeTab,
                    });
              }}
              >
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
      </View>
    </View>
  );
};

export default DiscoverComunities;

const styles = StyleSheet.create({
  mainCard2: {
    marginTop: 5,
    marginBottom: 5,
    width: winWidth * 0.9,
    padding: 8,
    flexDirection: 'row',
    borderColor: udyamitaTheme.borderStyleColor,
    borderWidth: 0.5,

    borderRadius: 6,
    backgroundColor: '#fff',
  },
  communityLogoForNew: {
    borderRadius: 4,

    height: 80,
    width: 80,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
