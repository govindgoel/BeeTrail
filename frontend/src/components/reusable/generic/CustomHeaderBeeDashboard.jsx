import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {SearchInput} from '../UIComponentsUdyamApp';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import {defaultStyles} from '../../../config/styles/defaultStyles';
import {BackIcon, PastQuestionsIcon} from '../../../assets/Icons/IconSvg';
import {useTranslation} from 'react-i18next';
import CustomText from '../CustomText';
import {getTransliterationNames} from '../../../store/services/entrepreneurServices';
import {useSelector, useDispatch} from 'react-redux';
import {HistoryIcon} from '../../../assets/Icons/IconSvg';
import Tooltip from 'react-native-walkthrough-tooltip';

const CustomHeaderBeeDashboard = ({
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
  apiaryId,
  apiaryName,
  hiveCount,
  inspectHive,
  apiaryLocation,
  apiaryData,
  tooltipActive,
  tooltiptext,
  tooltipaction,
  allowChildInteraction
}) => {

  const {t} = useTranslation();
  const dispatch = useDispatch();

  const TRIMMING_CHECK_LENGTH = 19;
  const TRIMMING_LENGTH = 12;
  const prefLang = useSelector(state => state?.entrepreneur?.prefLang);
  const [transliteratedName, setTransliteratedName] = useState('');
  const modifyTitle = (title) => {

    
    const parts = title?.split(' and ');
   
    const firstNames = parts?.map(part => part.split(' ')[0]);
    
    return firstNames?.join(' and ') + "'s Apiary";
  };

// const modifyTitle = (title) => {
//   console.log('✌️title --->', title);
  
//   const parts = title?.split(' and ');
 
//   let firstNames = [];

//   if (parts?.length === 1) {
//     // If only one part is present, use it directly
//     firstNames = parts[0].split(' ');
//   } else if (parts?.length === 2) {
//     // Handle the case when only one name is present in the second part
//     const names = parts[1].split(' ');
//     if (names.length > 1) {
//       firstNames = parts[0].split(' ');
//     } else {
//       firstNames = parts[0].split(' ');
//     }
//   } else if (parts.length > 2) {
//     firstNames = parts[0].split(' ');
//     firstNames.push(parts[parts.length - 1].split(' ')[0]);
//   }
  
//   return firstNames.join(' ') + "'s Apiary";
// };



  // Modify the title using the modifyTitle function
  const modifiedTitle = modifyTitle(title);
  return (
    <Tooltip
          allowChildInteraction={allowChildInteraction}
          backgroundColor={'rgba(0,0,0,0.8)'}
          tooltipStyle={{marginBottom:10, paddingBottom:10}}
          arrowStyle={{width: 20, height: 20}}
          contentStyle={{
            top:100,
            paddingHorizontal: 30,
            paddingVertical: 10,
            width: '100%',
            height: 'fit',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#CBCBCB',
          }}
          childrenWrapperStyle={{
            width:'100%'
           }}
          isVisible={tooltipActive}
          placement="top"
          onClose={() => console.log('closing tool')}
          // topAdjustment={-10}
          content={
            <>
              <Text style={{fontSize: 14, color: '#262626', lineHeight: 24}}>
                {tooltiptext}
              </Text>
              <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      gap: 10,
                      width: '100%',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      onPress={ () => {
                        tooltipaction(true)
                      }}
                      style={{
                        paddingHorizontal: 18,
                        paddingVertical: 8,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: udyamitaTheme.borderStyleColor,
                        alignSelf: 'flex-end',
                        marginTop: 10,
                      }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: '600',
                          color: '#262626',
                          lineHeight: 20,
                        }}>
                        {t('skip')}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={async()=>{
                          tooltipaction()
                        }}
                        style={{paddingHorizontal:18,paddingVertical:8,borderRadius:8, borderWidth:1, borderColor:udyamitaTheme.borderStyleColor,alignSelf:'flex-end',marginTop:10}}>
                          <Text style={{ fontSize: 14,fontWeight:'600', color: '#262626', lineHeight: 20}}>
                            {t('next')}
                          </Text>
                        </TouchableOpacity>
                  </View>
               
           
            </>
          }
          >

    <View style={[styles.mainContainer, {height: searchShown ? 130 : 96}]}>
      <View style={styles.headerContainer}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            // width: '60%',
            //flexWrap: 'wrap',
          }}>
          {showBackIcon && (
            <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
              <BackIcon />
            </TouchableOpacity>
          )}
          <View>
            <CustomText
              ellipsizeMode="tail"
              numberOdLines={1}
              style={styles.title}
              type="mlabel">
                {inspectHive ? title : (modifiedTitle && modifiedTitle.length > TRIMMING_CHECK_LENGTH ? `${modifiedTitle.slice(0, TRIMMING_CHECK_LENGTH)}...` : modifiedTitle)}
              
              {/* {title} */}
            </CustomText>
            {inspectHive ? null : (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  //marginLeft: 12,
                  marginTop: 8,
                }}>
                {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={require('../../../assets/images/Location.png')}
                    style={styles.smallIcons}
                  />
                  <CustomText type="sh" style={styles.smallText}>
                    {apiaryLocation?.length > TRIMMING_LENGTH
                      ? `${apiaryLocation.slice(0, TRIMMING_LENGTH)}...`
                      : ''}
                  </CustomText>
                </View> */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    //marginLeft: 10,
                  }}>
                  <Image
                    source={require('../../../assets/images/Hive_grey.png')}
                    style={styles.smallIcons}
                  />

                  <CustomText type="sh" style={styles.smallText}>
                    {hiveCount} {t('hives')}
                  </CustomText>
                </View>
              </View>
            )}
          </View>
        </View>
        {inspectHive ? (
          // <TouchableOpacity
          //   style={{flexDirection: 'row', marginTop: 10, marginRight: 10}}
          //   onPress={() => {
          //     navigation.navigate('PastInspections', {
          //       apiaryId,
          //       hiveCount,
          //       apiaryName,
          //     });
          //   }}>
          //   <HistoryIcon />
          //   <CustomText style={styles.histText} type="sh">
          //     {t('viewPastInspections')}
          //   </CustomText>
          // </TouchableOpacity>
          null
        ) : (
         
          apiaryData && (
            <TouchableOpacity
              style={[
                styles.editBtn,
                {flexDirection: 'row', marginTop: 10, marginRight: 10,alignItems:'center'},
              ]}
              onPress={() =>
                navigation.navigate('BeeLandingPageScreen', {
                  editApiary: apiaryData,
                })
              }>
              <Image
                source={require('../../../assets/images/Edit_button_green.png')}
                style={{
                  width: 27,
                  height: 20,
                  marginRight: 5,
                  resizeMode: 'contain',
                }}
              />
              <CustomText style={styles.histText} type="sh">
                {t('edit')}
              </CustomText>
            </TouchableOpacity>
          )
        )}
      </View>
    </View>

    </Tooltip>
  );
};

export default CustomHeaderBeeDashboard;

const styles = StyleSheet.create({
  mainContainer: {
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingLeft: 20,
    paddingRight: 20,
    // marginBottom: 16,
    elevation: 10,
    backgroundColor: udyamitaTheme.themeBgColor,
    justifyContent: 'center',
    //marginBottom: 16,
    //alignItems:'center'
    zIndex: 2,
    width:'100%'
  },
  headerContainer: {
    flexDirection: 'row',
    //alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: udyamitaTheme.textColor,
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    fontSize: udyamitaTheme.themeFontSizeModalLabel,
    //marginLeft: 10,
  },
  backButton: {
    // position: 'absolute',
    //left: 10,
    width:36,
    height:36,
    marginRight: 10,
    //backgroundColor:'red',
    justifyContent:'center',
    alignItems:'center'
  },
  histText: {
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color: udyamitaTheme.beeAppColor,
    marginLeft: 4,
    flexShrink: 1,
  },
  smallText: {
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color: udyamitaTheme.textColor,
  },
  smallIcons: {
    width: 14,
    height: 14,
    marginRight: 6,
  },
});
