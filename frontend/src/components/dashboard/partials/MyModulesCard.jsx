import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import Card from '../resuable/Card';
import {useTranslation} from 'react-i18next';
import DummyCoursesData from '../data/DummyCoursesData';
export default function MyModulesCard({navigation}) {
  const {t} = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const Data = DummyCoursesData;

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingBottom: 10,
        }}>
        <CustomText
          style={{
            fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
            fontSize: udyamitaTheme.themeFontSizeLabel,
            color: udyamitaTheme.textColor,
          }} type='label'>
          {t('courses')}
        </CustomText>
        <TouchableOpacity
          // onPress={() => {
          //   navigation.navigate('ProductHomePage');
          // }}
          style={{flexDirection: 'row'}}>
          <CustomText
            style={{
              color: udyamitaTheme.primaryColor,
              fontFamily: udyamitaTheme.mainThemeFontFamily,
              fontSize: udyamitaTheme.themeFontSizeLabel,
            }} type='label'>
            {t('viewAll')}
          </CustomText>
          <Image
            source={require('../../../assets/images/Caret_right.png')}
            style={{width: 18, height: 20}}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 0 && styles.activeTab]}
          onPress={() => setActiveTab(0)}>
          <CustomText
            style={[
              styles.tabText,
              activeTab === 0 ? styles.activeTabText : null,
            ]} type='sh'>
            Continue watching
          </CustomText>
        </TouchableOpacity>

        {/* Posts Tab */}
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 1 && styles.activeTab]}
          onPress={() => setActiveTab(1)}>
          <CustomText
            style={[
              styles.tabText,
              activeTab === 1 ? styles.activeTabText : null,
            ]} type='sh'>
            Trending
          </CustomText>
        </TouchableOpacity>

        {/* Admin Posts Tab */}
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 2 && styles.activeTab]}
          onPress={() => setActiveTab(2)}>
          <CustomText
            style={[
              styles.tabText,
              activeTab === 2 ? styles.activeTabText : null,
            ]} type='sh'>
            Latest
          </CustomText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 3 && styles.activeTab]}
          onPress={() => setActiveTab(3)}>
          <CustomText
            style={[
              styles.tabText,
              activeTab === 3 ? styles.activeTabText : null,
            ]} type='sh'>
            For you
          </CustomText>
        </TouchableOpacity>
      </View>
      {activeTab === 0 && (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {Data.map((data, index) => (
            <Card
              key={index}
              courseTitle={data.courseTitle}
              completedModules={data.completedModules}
              totalModules={data.totalModules}
              estimatedRemainingMins={data.estimatedRemainingMins}
              totalUsersCompleted={data.totalUsersCompleted}
              signupCounts={data.signupCounts}
              videoCoverUrl={data.videoCoverUrl}
            />
          ))}
        </ScrollView>
      )}
      {activeTab === 1 && <CustomText>Posts Content</CustomText>}
      {activeTab === 2 && <CustomText>Admin Posts Content</CustomText>}
      {activeTab === 3 && <CustomText>For you Content</CustomText>}
      {/* <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
    {Data.map((data, index) => (
        <>
          <Cards
            courseTitle={data.courseTitle}
            completedModules={data.completedModules}
            totalModules={data.totalModules}
            estimatedRemainingMins={data.estimatedRemainingMins}
            totalUsersCompleted={data.totalUsersCompleted}
            signupCounts={data.signupCounts}
            videoCoverUrl={data.videoCoverUrl}
          />
        </>
      ))}
      </ScrollView> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',

    //marginTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,

    paddingBottom: 5,
  },

  text: {
    textAlign: 'center',
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
    fontFamily: udyamitaTheme.mainThemeFontFamily,
  },

  tabContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between',

    paddingBottom: 10,
  },
  tabItem: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: udyamitaTheme.borderStyleColor,
    marginRight: 10,
    marginLeft: -5,

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
