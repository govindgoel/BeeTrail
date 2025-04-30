import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import Card from '../resuable/Card';
import axios from 'axios';
import {APP_API_COMMUNITY_URL} from '@env';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import {useTranslation} from 'react-i18next';
import DummyDataForEvents from '../data/DummyDataForEvents';
import CommunityPostCard from '../resuable/CommunityPostCard';
import CustomText from '../../reusable/CustomText';
import {getValueByKey} from '../../../helpers/UserData';
import PostPlaceholder from '../../reusable/generic/PostPlaceholder';
import {useNetInfo} from '@react-native-community/netinfo';
export default function CommunityCard({navigation}) {
  const {isConnected} = useNetInfo();

  const {t} = useTranslation();
  const Data = DummyDataForEvents;
  const [activeTab, setActiveTab] = useState(0);
  const [adminPosts, setAdminPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const getCommunityPostsOfUser = async () => {
    const token = await getValueByKey('token');

    const config = {headers: {Authorization: 'Bearer ' + token}};
    setLoading(true);
    await axios
      .get(`${APP_API_COMMUNITY_URL}/post/dashboard/posts`, config)
      .then(response => {
        if (response.status === 200) {
          setAllPosts(response?.data?.posts || []);

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

  const getCommunityAdminPosts = async () => {
    const token = await getValueByKey('token');

    const config = {headers: {Authorization: 'Bearer ' + token}};
    setLoading(true);
    await axios
      .get(`${APP_API_COMMUNITY_URL}/post/dasboard/admin-post`, config)
      .then(response => {
        if (response.status == 200) {
          setAdminPosts(response.data.post);

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
  const getDurationOfPost = postTime => {
    const parsedDate = moment(postTime);

    const currentDate = moment();

    const duration = moment.duration(currentDate.diff(parsedDate));
    let dateTimeText = '';

    if (duration.years() > 0) {
      dateTimeText =
        `${duration.years()} ` +
        `${duration.years() > 1 ? t('years') : t('year')} ` +
        `${t('ago')}`;
    } else if (duration.months() > 0) {
      dateTimeText =
        `${duration.months()} ` +
        `${duration.months() > 1 ? t('months') : t('month')} ` +
        `${t('ago')}`;
    } else if (duration.weeks() > 0) {
      dateTimeText =
        `${duration.weeks()} ` +
        `${duration.weeks() > 1 ? t('weeks') : t('week')} ` +
        `${t('ago')}`;
    } else if (duration.days() > 0) {
      dateTimeText =
        `${duration.days()} ` +
        `${duration.days() > 1 ? t('days') : t('day')} ` +
        `${t('ago')}`;
    } else if (duration.hours() > 0) {
      dateTimeText =
        `${duration.hours()} ` +
        `${duration.hours() > 1 ? t('hours') : t('hour')} ` +
        `${t('ago')}`;
    } else if (duration.minutes() > 0) {
      dateTimeText =
        `${duration.minutes()} ` +
        `${duration.minutes() > 1 ? t('minutes') : t('minute')} ` +
        `${t('ago')}`;
    } else if (duration.seconds() > 0) {
      dateTimeText =
        `${duration.seconds()} ` +
        `${duration.seconds() > 1 ? t('seconds') : t('second')} ` +
        `${t('ago')}`;
    } else if (duration.seconds() <= 0) {
      dateTimeText = `${t('justNow')}`;
    }
    return dateTimeText;
  };
  useEffect(() => {
    if (isConnected) {
      getCommunityPostsOfUser();
      getCommunityAdminPosts();
    }
  }, [isFocused, isConnected]);
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingBottom: 10,
          marginTop: 16,
        }}>
        <CustomText
          style={{
            fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
            fontSize: udyamitaTheme.themeFontSizeButton,
            color: udyamitaTheme.textColor,
            marginBottom: 12,
          }}
          type="btn">
          {t('myCommunity')}
        </CustomText>
        <TouchableOpacity
          style={{flexDirection: 'row'}}
          onPress={() =>
            navigation.navigate(
              'CommunityHomeScreen',
              {screen: 'CommunityHomeScreen'},
              {getCommunityPostsOfUser},
            )
          }>
          <CustomText
            style={{
              color: udyamitaTheme.primaryColor,
              fontFamily: udyamitaTheme.mainThemeFontFamily,
              fontSize: udyamitaTheme.themeFontSizeLabel,
              marginRight: 5,
            }}
            type="label">
            {t('viewAll')}
          </CustomText>
          <Image
            source={require('../../../assets/images/Caret_right.png')}
            style={{width: 18, height: 20}}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        {/* <TouchableOpacity
          style={[styles.tabItem, activeTab === 0 && styles.activeTab]}
          onPress={() => setActiveTab(0)}>
          <Text
            style={[
              styles.tabText,
              activeTab === 0 ? styles.activeTabText : null,
            ]}>
            {t('events')}
          </Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 0 && styles.activeTab]}
          onPress={() => setActiveTab(0)}>
          <CustomText
            style={[
              styles.tabText,
              activeTab === 0 ? styles.activeTabText : null,
            ]}
            type="sh">
            {t('posts')}
          </CustomText>
        </TouchableOpacity>

        {/* Admin Posts Tab */}
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 1 && styles.activeTab]}
          onPress={() => setActiveTab(1)}>
          <CustomText
            style={[
              styles.tabText,
              activeTab === 1 ? styles.activeTabText : null,
            ]}
            type="sh">
            {t('adminPosts')}
          </CustomText>
        </TouchableOpacity>
      </View>
      {/*
      {activeTab === 0 && (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {Data.map((data, index) => (
            <Card
              eventTitle={data.eventTitle}
              date={data.date}
              eventType={data.eventType}
              location={data.location}
              distanceInMetres={data.distanceInMetres}
              signupCounts={data.signupCounts}
              eventImageUrl={data.eventImageUrl}
              key={index}
            />
          ))}
        </ScrollView>
      )} */}

      {activeTab === 0 &&
        (loading ? (
          <PostPlaceholder />
        ) : allPosts.length === 0 ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 10,
              marginBottom: 10,
            }}>
            <Image
              source={require('../../../assets/images/nopostsToShow.png')}
              style={{width: 20, height: 20, marginRight: 5}}
            />
            <CustomText style={styles.noPostToShowText} type="xs">
              {t('noPost')}
            </CustomText>
          </View>
        ) : (
          <FlatList
            data={allPosts}
            horizontal={true}
            keyExtractor={item => item?.post?._id}
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => (
              <CommunityPostCard
                navigation={navigation}
                caption={item?.post?.caption}
                memberName={item?.userDetail?.name}
                postImages={item?.post?.mediaUrls}
                postedTime={
                  item?.post?.createdAt
                    ? getDurationOfPost(item?.post?.createdAt)
                    : null
                }
                communityId={item?.post?.communityId}
              />
            )}
          />
        ))}

      {activeTab === 1 &&
        (loading ? (
          <PostPlaceholder />
        ) : adminPosts.length === 0 ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 10,
              marginBottom: 10,
            }}>
            <Image
              source={require('../../../assets/images/nopostsToShow.png')}
              style={{width: 20, height: 20, marginRight: 5}}
            />
            <CustomText style={styles.noPostToShowText} type="xs">
              {t('noPost')}
            </CustomText>
          </View>
        ) : (
          <FlatList
            data={adminPosts}
            horizontal={true}
            keyExtractor={item => item?.posts?._id}
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => (
              <CommunityPostCard
                navigation={navigation}
                caption={item?.caption}
                memberName={item?.userDetail?.name}
                postImages={item?.mediaUrls}
                postedTime={
                  item?.createdAt ? getDurationOfPost(item?.createdAt) : null
                }
                communityId={item?.communityId}
              />
            )}
          />
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  noPostToShowText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color: udyamitaTheme.textColor,
    fontSize: udyamitaTheme.themeFontSizeExtraSmall,
  },
  container: {
    backgroundColor: '#fff',
    marginTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    justifyContent: 'center',
    paddingBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between',

    paddingBottom: 16,
    //marginBottom:16
  },
  tabItem: {
    // paddingVertical: 10,
    // paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: udyamitaTheme.borderStyleColor,
    marginRight: 10,
    paddingTop: 14,
    paddingBottom: 14,
    paddingRight: 16,
    paddingLeft: 16,
    //height:52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: udyamitaTheme.primaryColor,
    borderWidth: 0,
  },
  tabText: {
    color: udyamitaTheme.textColor,
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
  },
  activeTabText: {
    color: 'white',
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
  },
});
