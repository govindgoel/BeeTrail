/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
} from 'react-native';
import {APP_API_LIBRARY_URL} from '@env';
import React, {useState} from 'react';
import axios from 'axios';
import RecomendedVidPlaceHolder from '../../reusable/generic/RecomendedVidPlaceHolder';
// import {userContext} from '../../../helpers/AuthContext';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import CustomText from '../../reusable/CustomText';
import {useTranslation} from 'react-i18next';
import {getValueByKey, getUser} from '../../../helpers/UserData';
import YoutubeCard from '../resuable/YoutubeCard';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {useNetInfo} from '@react-native-community/netinfo';

export default function EDPModuleCard({navigation}) {
  const {isConnected} = useNetInfo();

  const {t} = useTranslation();
  const tabs = [
    t('recommended'),
    t('latest'),
    t('popular'),
    t('liked'),
    t('watched'),
    t('saved'),
  ];
  const placeHolderARR = [1, 2, 3, 4, 5];
  const isFocused = useIsFocused();

  const [activeTab, setActiveTab] = useState(0);

  const [loading, setLoading] = useState(true);
  const [initialVideos, setInitialVideos] = useState([]);

  const getWatchLater = async () => {
    setLoading(true);
    const token = await getValueByKey('token');
    const config = {headers: {Authorization: 'Bearer ' + token}};
    await axios
      .get(`${APP_API_LIBRARY_URL}/watch-later`, config)
      .then(response => {
        if (response.status == 200) {
          const newArr = response.data.saved.slice(0, 5);

          setInitialVideos(newArr);
          // setSaved(newArr)

          // setSavedPage(savedPage + 1);
          setLoading(false);
        }
      })
      .catch(err => console.log('ERR while getting saved videosssss', err));
  };
  const getFeed = async (bias = 'latest') => {
    const token = await getValueByKey('token');
    setLoading(true);

    const config = {headers: {Authorization: 'Bearer ' + token}};

    await axios
      .get(
        `${APP_API_LIBRARY_URL}/media/feed-suggestions?sortOrder=${bias}`,
        config,
      )
      .then(response => {
        if (response.status === 200) {
          const sliced = response?.data?.recommendedVideos.slice(0, 5);
          setInitialVideos(sliced);
          setLoading(false);
        }
      })
      .catch(err => {
        console.log('Error fetching feed', err);
      });
  };
  const getLikedVideos = async () => {
    setLoading(true);
    const token = await getValueByKey('token');
    const config = {headers: {Authorization: 'Bearer ' + token}};
    await axios
      .get(`${APP_API_LIBRARY_URL}/like/videos/user`, config)
      .then(response => {
        if (response.status == 200) {
          const newArr = response?.data?.likes.slice(0.5);
          setInitialVideos(newArr);

          setLoading(false);
        }
      })
      .catch(err => console.log('error while getting liked videos', err));
  };

  const getWatchHistory = async () => {
    const token = await getValueByKey('token');
    const config = {headers: {Authorization: 'Bearer ' + token}};
    await axios
      .get(`${APP_API_LIBRARY_URL}/media/history/byUser`, config)
      .then(response => {
        if (response.status == 200) {
          const newArr = response.data.history.slice(0, 5);
          setInitialVideos(newArr);
        }
      })
      .catch(err => console.log('ERR while getting watch history', err));
  };

  useFocusEffect(
    React.useCallback(() => {
      if (isConnected) {
        switch (tabs[activeTab]) {
          case t('recommended'):
            getFeed('recommended');
            break;
          case t('latest'):
            getFeed('latest');
            break;
          case t('popular'):
            getFeed('popular');
            break;
          case t('liked'):
            getLikedVideos();
            break;
          case t('watched'):
            getWatchHistory();
            break;
          case t('saved'):
            getWatchLater();
            break;
        }
      }
    }, [activeTab, isFocused, isConnected]),
  );
  const ShowVideos = () => {
    let videos = initialVideos;

    return (
      <FlatList
        data={videos}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={item => (
          <YoutubeCard
            key={item?._id}
            video={item}
            navigation={navigation}
          />
        )}
        keyExtractor={item => item?._id}
      />
    );
  };
  return (
   initialVideos.length>0?
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingBottom: 10,
          marginTop: 16,
          marginBottom: 12,
        }}>
        <CustomText
          style={{
            fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
            fontSize: udyamitaTheme.themeFontSizeLabel,
            color: udyamitaTheme.textColor,
          }}
          type="btn">
          {t('watchAndLearn')}
        </CustomText>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Migration_dashboard', {screen: 'ListVideos'});
          }}
          style={{flexDirection: 'row'}}>
          <CustomText
            style={{
              color: udyamitaTheme.primaryColor,
              fontFamily: udyamitaTheme.mainThemeFontFamily,
              fontSize: udyamitaTheme.themeFontSizeLabel,
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

      <View>
        <ScrollView
          contentContainerStyle={{marginBottom: 10}}
          horizontal={true}
          showsHorizontalScrollIndicator={false}>
          <View style={styles.tabContainer}>
            {tabs.map((tab, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.tabItem,
                  activeTab === index && styles.activeTab,
                ]}
                onPress={() => setActiveTab(index)}>
                <CustomText
                  style={[
                    styles.tabText,
                    activeTab === index && styles.activeTabText,
                  ]}
                  type="sh">
                  {tab}
                </CustomText>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        {loading ? (
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {placeHolderARR.map((x, index) => (
              <RecomendedVidPlaceHolder key={x} />
            ))}
          </ScrollView>
        ) : (
          <ShowVideos />
        )}
      </View>
    </View>
    :null
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    // marginBottom: 100,
    marginTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 15,

    //paddingBottom: 10,
  },

  text: {
    textAlign: 'center',
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
    fontFamily: udyamitaTheme.mainThemeFontFamily,
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
