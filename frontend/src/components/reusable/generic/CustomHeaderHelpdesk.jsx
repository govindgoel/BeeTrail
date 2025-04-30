import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, Dimensions} from 'react-native';
import {SearchInput} from '../UIComponentsUdyamApp';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import {defaultStyles} from '../../../config/styles/defaultStyles';
import {BackIcon, PastQuestionsIcon} from '../../../assets/Icons/IconSvg';
import {useTranslation} from 'react-i18next';
import CustomText from '../CustomText';
import Tooltip from 'react-native-walkthrough-tooltip';

const {width}=Dimensions.get('window')

const CustomHeaderHelpdesk = ({
  title,
  showBackIcon,
  onBackPress,
  searchShown,
  pastQuestShown,
  placeholder,
  initialList,
  handleSearch,
  setUpdatedList,
  navigation,
  faq,
  tooltipactive,
  tooltiptext,
  tooltipaction,
  height=70
}) => {
  const {t} = useTranslation();
  return (
    <Tooltip
    backgroundColor={'rgba(0,0,0,0.8)'}
    tooltipStyle={{marginBottom:10, paddingBottom:10,top:100}}
    arrowStyle={{width: 20, height: 20}}
    contentStyle={{
      paddingHorizontal: 30,
      paddingVertical: 10,
      width: '100%',
      height: 'fit',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#CBCBCB',
    }}
    childrenWrapperStyle={{marginTop:10, width:width}}
    isVisible={tooltipactive==true}
    // placement="top"
    onClose={() => console.log('closing tool')}
    topAdjustment={-10}
    content={
      <>
        <Text style={{fontSize: 14, color: '#262626', lineHeight: 24}}>
          {tooltiptext}
        </Text>
      </>
    }
    >
    <View style={[styles.mainContainer, {height: searchShown ? 130 : height}]}>
        <View style={styles.headerContainer}>
        {showBackIcon && ( 
          <TouchableOpacity onPress={e=>{
            tooltipactive==true?tooltipaction():onBackPress()
          }} style={styles.backButton} >
            <BackIcon />
          </TouchableOpacity>
        )}
        <CustomText style={styles.title} type="h">
          {title}
        </CustomText>
        {pastQuestShown && (
          <TouchableOpacity
            onPress={() => navigation.navigate('PastQuestions')}
            style={[defaultStyles.flexRow, {position: 'absolute', right: 14}]}>
            <PastQuestionsIcon />
            <CustomText
              style={{
                fontFamily: udyamitaTheme.mainThemeFontFamily,
                fontSize: udyamitaTheme.themeFontSizeSmall,
                lineHeight: 24,
                color: udyamitaTheme?.primaryColor,
                marginLeft: 2,
              }}
              type="sm">
              {t('viewPastQuestions')}
            </CustomText>
          </TouchableOpacity>
        )}
      </View>
      {searchShown && (
        <SearchInput
        placeholder={placeholder}
        initialList={initialList}
        handleSearch={handleSearch}
        setUpdatedList={setUpdatedList}
        faq={faq}
        />
      )}
    </View>
      </Tooltip>
  );
};

export default CustomHeaderHelpdesk;

const styles = StyleSheet.create({
  mainContainer: {
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 16,
    elevation: 10,
    width:'100%',
    backgroundColor: udyamitaTheme.themeBgColor,
    justifyContent: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: udyamitaTheme.textColor,
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    fontSize: udyamitaTheme.themeFontSizeModalLabel,
    // marginLeft: 12,
  },
  backButton: {
    // position: 'absolute',
    // left: 20,
    // marginRight: 20,
    width:40,
    height:40,
  
    justifyContent:'center',
    alignItems:'center'
  },
});
