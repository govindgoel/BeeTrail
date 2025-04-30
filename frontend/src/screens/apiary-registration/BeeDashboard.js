/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect,useRef} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  BackHandler,
  Text,
  Dimensions,
  Image,
  ActivityIndicator
} from 'react-native';
import {winHeight} from '../../helpers/dimensions';

import CustomHeaderBeeDashboard from '../../components/reusable/generic/CustomHeaderBeeDashboard';
import {useTranslation} from 'react-i18next';
import {udyamitaTheme} from '../../config/styles/udyamitaTheme';
import CustomText from '../../components/reusable/CustomText';
import HiveStats from '../../components/apiary-dashboard/HiveStats';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {getToken, getUser, getValueByKey, removeItemByKey, storeValueByKey} from '../../helpers/UserData';
import {getAllHiveInspections} from '../../helpers/services/realm/disk-data-fetch/HiveInspections';
import {getAllVisitsOfflineLogsOfAnApiary} from '../../helpers/services/realm/disk-data-fetch/ApiaryActivities';
import {getAllHarvests} from '../../helpers/services/realm/disk-data-fetch/Harvests';
import {getAllApiaries} from '../../helpers/services/realm/disk-data-fetch/Apiaries';
import Tooltip from 'react-native-walkthrough-tooltip';
import axios from 'axios';
import {APP_API_MENTOR_VAlUECHAIN_SERVICES} from '@env'

const {width}=Dimensions.get('window');

export default function BeeDashboard({navigation, route}) {
  const [hiveStatsAvailable, setHiveStatsAvailable] = useState(false);
  const {t} = useTranslation();
  const hiveDetails = [
    {
      name: 'Queen',
      count: 5,
      total: 50,
      desc: t('healthy'),
      desc2: '',
      header: t('queenHealth'),
      backImg: require('../../assets/images/QueenHealth.png'),
    },
    {
      name: 'Harvest',
      count: 10,
      total: 50,
      desc: 'Harvested',
      desc2: 'from',
      header: t('harvest'),
      backImg: require('../../assets/images/Harvest.png'),
    },
    {
      name: 'Brood Pattern',
      count: 20,
      total: 50,
      desc: t('inspected'),
      desc2: 'inspected',
      header: t('brood'),
      backImg: require('../../assets/images/Brood.png'),
    },
    {
      name: 'Diseases',
      count: 20,
      total: 50,
      desc: t('inspected'),
      desc2: 'inspected',
      header: t('diseases'),
      backImg: require('../../assets/images/Diseases.png'),
    },
  ];

  // const {apiaryId , apiaryName, hiveCount, apiaryLocation,apiaryData} = apiaries || route?.params;
  const [loadingWeatherData, setloadingWeatherData] = useState(false)
  const [formattedTimeDifference, setFormattedTimeDifference] = useState('');
  const [lastVisit, setLastVisit] = useState('');
  const [harvestData, setHarvestData] = useState([]);
  const [lastHarvest, setLastHarvest] = useState('');
  const [apiaries, setApiaries] = useState([]);
  const [totalChamberCount, setTotalChamberCount] = useState(0);
  const isFocused = useIsFocused();
  const [userInfo, setUserInfo] = useState(false);
  const [allharvesteddata, setallharvesteddata] = useState(false)
  const [tooltip, settooltip] = useState(false)
  const scrollviewref = useRef()
  const getUserInfo = async () => {
    const user = await getUser();
    if (user && user.userInfo) {
      setUserInfo(user.userInfo);
    }
  };
  const [weatherData, setweatherData] = useState(false)
  const checkToolTipObject=async()=>{
    // await removeItemByKey('ToolTipObject') 
    console.log('topic screen called');
    const toolTipObject={
      BeeDashboardHeader:false,
      BeeDashboardHiveInspection:false,
      BeeDashboardMarkYourActivity:false, 
      BeeDashboardProfitandLoss:false,
      BeeDashboardHearvestProduct:false
    }

   try { 
     let currentObject=await getValueByKey('ToolTipObject')
    //  console.log(currentObject,'current tooltip');
     if (currentObject) {
      if(currentObject.skip){
        settooltip({
          BeeDashboardHeader:true,
          BeeDashboardHiveInspection:true,
          BeeDashboardMarkYourActivity:true, 
          BeeDashboardProfitandLoss:true,
          BeeDashboardHearvestProduct:true
        })
        return
      }
       // Check if all keys from toolTipObject are present in currentObject
       const missingKeys = Object.keys(toolTipObject).filter(key => !(key in currentObject));
       
      //  console.log(missingKeys,'missing keys tooltip');
       // If there are missing keys, merge them into currentObject
       if (missingKeys.length > 0) {
        const updatedObject = { ...currentObject }; // Start with the current object

        // Iterate over the keys of toolTipObject and add missing keys
        Object.keys(toolTipObject).forEach(key => {
          if (!(key in currentObject)) {
            updatedObject[key] = toolTipObject[key]; // Add only the missing key with its default value
          }
        });
          // Update the object in AsyncStorage
          // console.log(updatedObject,'tooltip');
          await storeValueByKey('ToolTipObject', JSON.stringify(updatedObject));
          settooltip(updatedObject)
        }
        else{
          
          // console.log(currentObject,'tooltip');
          await storeValueByKey('ToolTipObject', JSON.stringify(currentObject));
          settooltip(currentObject)
       }
     } else {
       settooltip(toolTipObject)
      //  console.log(toolTipObject,'tooltip');
       // If currentObject is null, initialize it with toolTipObject
       await storeValueByKey('ToolTipObject', JSON.stringify(toolTipObject));
     }
 
   } catch (error) {
    console.log('err in tooptipObject',error);
   }
  }

  useFocusEffect(
    React.useCallback(() => {
      checkToolTipObject()
      getUserInfo();
    }, []),
  );

  useEffect(() => {
    getApiariesFromDisk();
  }, [isFocused]);
  useEffect(() => {
    const backAction = () => {
     navigation.navigate('Dashboard')

      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [ navigation, t]);
  useEffect(() => {
    if (apiaries) {
      setTotalChamberCount(
        Number(
          [undefined, null, '', 0].includes(apiaries?.broodChamberCount)
            ? 0
            : apiaries?.broodChamberCount,
        ) +
          Number(
            [undefined, null, '', 0].includes(apiaries?.broodSuperChamberCount)
              ? 0
              : apiaries?.broodSuperChamberCount,
          ) || 0,
      );
    }
  }, [apiaries]);
 
  const getWeatherData = async (apiaryId) => {
    try {
      setloadingWeatherData(true)
      const token = await getToken();
  
      const config = { headers: { Authorization: 'Bearer ' + token } }; 
     console.log(`${APP_API_MENTOR_VAlUECHAIN_SERVICES}/beekeeping/apiaries/weather`);
      const res = await axios.post(`${APP_API_MENTOR_VAlUECHAIN_SERVICES}/beekeeping/apiaries/weather`, {
        apiaryId: apiaryId
      },  
        config)
       setweatherData(res.data.weatherData)
       setloadingWeatherData(false)
       // console.log(res.data.weatherData,'weather data');
      } catch (error) { 
      setloadingWeatherData(false)
       console.log(error?.response,'err in getting weather data');
    }
   }
  const fetchInspectHiveDataFromDisk = async apiaryId => {
    const pastInspection = await getAllHiveInspections(apiaryId);
    // pastInspection?.map(it=>console.log(it.updated_at,'past inspect'))
    if (pastInspection && pastInspection.length > 0) {
      const firstItemCreatedAt = pastInspection[0].created_at;

      const formattedTimeDiff = formatUploadTime(firstItemCreatedAt);
      setFormattedTimeDifference(formattedTimeDiff); //
    } else {
      console.log('No past inspections available.');
    }
  };

  const getAllVisitsLogsOfAnApiaryFromDisk = async apiaryId => {
    const totalVisits = await getAllVisitsOfflineLogsOfAnApiary(apiaryId);
    totalVisits?.map(it=>console.log(it.updated_at,'totalVisits'))

    if (totalVisits && totalVisits.length > 0) {
      const firstItemCreatedAt = totalVisits[0].updated_at;

      const formattedTimeDiff = formatUploadTime(firstItemCreatedAt);
      setLastVisit(formattedTimeDiff); //
    } else {
      console.log('No past visits available.');
    }
  };

  const getAllHarvestLogsOfAnApiaryFromDisk = async apiaryId => {
    const harvestLogs = await getAllHarvests(apiaryId);
    // harvestLogs.sort((a, b) => a.updated_at - b.updated_at);
    const Harvests = harvestLogs;
    let sorteddata=sortHarvestProductImageOptions(harvestProductImageOptions,Harvests)
    setallharvesteddata(sorteddata.splice(0,3));
    console.log( sorteddata.splice(0,3),Harvests.map(x => x._id),'all list of harvested product');
    setHarvestData(Harvests);

    if (harvestLogs && harvestLogs.length > 0) {
      // Find latest harvest by comparing created_at timestamps
      const latestHarvest = harvestLogs.reduce((latest, current) => {
        return new Date(current.created_at) > new Date(latest.created_at) ? current : latest;
      }, harvestLogs[0]);

      const formattedTimeDiff = formatUploadTime(latestHarvest.created_at);
      setLastHarvest(formattedTimeDiff);
    } else {
      console.log('No past harvest details available.');
    }
  };

  const getApiariesFromDisk = async () => {
    const _apiaries = await getAllApiaries();
    setApiaries(_apiaries[0] || {});
    console.log('✌️_apiaries[0] --->', _apiaries[0]?.location);

    const apiaryId = _apiaries[0]?._id;
    getWeatherData(apiaryId)
    fetchInspectHiveDataFromDisk(apiaryId);
    getAllVisitsLogsOfAnApiaryFromDisk(apiaryId);
    getAllHarvestLogsOfAnApiaryFromDisk(apiaryId);
  };

  function sortHarvestProductImageOptions(harvestProductImageOptions, productQuantities) {
    // Create a mapping of product quantities
    const quantityMap = productQuantities.reduce((map, item) => {
      map[item.product_harvest] = item.quantity_harvested;
      return map;
    }, {});
    console.log(quantityMap);
    // Separate items with quantities from those without
    const itemsWithQuantities = harvestProductImageOptions.filter(item => quantityMap[item.value]);
    const itemsWithoutQuantities = harvestProductImageOptions.filter(item => !quantityMap[item.value]);
  
    // Sort items with quantities in descending order
    itemsWithQuantities.sort((a, b) => quantityMap[b.value] - quantityMap[a.value]);
  
    // Combine the sorted items with the rest
    return [...itemsWithQuantities, ...itemsWithoutQuantities];
  }

  function formatUploadTime(val) {
    const currentDate = new Date();
    const uploadDate = new Date(val);

    const timeDifferenceInSeconds = Math.floor(
      (currentDate - uploadDate) / 1000,
    );

    if (timeDifferenceInSeconds < 60) {
      return `${t('justNow')}`;
    } else if (timeDifferenceInSeconds < 3600) {
      const minutesAgo = Math.floor(timeDifferenceInSeconds / 60);
      return `${minutesAgo} ${
        minutesAgo === 1 ? t('minute') : t('minutes')
      } ${t('ago')}`;
    } else if (timeDifferenceInSeconds < 86400) {
      const hoursAgo = Math.floor(timeDifferenceInSeconds / 3600);
      return `${hoursAgo} ${hoursAgo === 1 ? t('hour') : t('hours')} ${t(
        'ago',
      )}`;
    } else if (timeDifferenceInSeconds < 604800) {
      const daysAgo = Math.floor(timeDifferenceInSeconds / 86400);
      return `${daysAgo} ${daysAgo === 1 ? t('day') : t('days')} ${t('ago')}`;
    } else if (timeDifferenceInSeconds < 2419200) {
      const weeksAgo = Math.floor(timeDifferenceInSeconds / 604800);
      return `${weeksAgo} ${weeksAgo === 1 ? t('week') : t('weeks')} ${t(
        'ago',
      )}`;
    } else if (timeDifferenceInSeconds < 29030400) {
      const monthsAgo = Math.floor(timeDifferenceInSeconds / 2419200);
      return `${monthsAgo} ${monthsAgo === 1 ? t('month') : t('months')} ${t(
        'ago',
      )}`;
    } else {
      const yearsAgo = Math.floor(timeDifferenceInSeconds / 29030400);
      return Number.isNaN(yearsAgo)
        ? ''
        : `${yearsAgo} ${yearsAgo === 1 ? t('year') : t('years')} ${t('ago')}`;
    }
  }
  let harvestProductImageOptions = [
    {
      id: '1',
      product: t('honey'),
      value: 'honey',
      image: require('../../assets/images/Honey_summary.png'),
    },
    {
      id: '2',
      product: t('beeswax'),
      value: 'beeswax',
      image: require('../../assets/images/Beeswax_summary.png'),
    },
    {
      id: '3',
      product: t('pollen'),
      value: 'pollen',
      image: require('../../assets/images/Beepollen_summary.png'),
    },
    {
      id: '4',
      product: t('propolis'),
      value: 'propolis',
      image: require('../../assets/images/Propolis_summary.png'),
    },
    {
      id: '5',
      product: t('beevenom'),
      value: 'beevenom',
      image: require('../../assets/images/BeeVenom_summary.png'),
    },
    {
      id: '6',
      product: t('royalJelly'),
      value: 'royalJelly',
      image: require('../../assets/images/RoyalJelly.png'),
    },
  ];

  return (
    <View style={{flex: 1, backgroundColor: udyamitaTheme.themeBgColor}}>
      <CustomHeaderBeeDashboard
        allowChildInteraction={false}
        tooltipActive={tooltip && !tooltip.BeeDashboardHeader}
        tooltiptext={t('headerInfo')}
        showBackIcon={true}
        tooltipaction={async (skip) => {
          if(skip){
            settooltip(prev => ({
              ...prev,
              BeeDashboardHeader: true,
              BeeDashboardHiveInspection: true,
              BeeDashboardMarkYourActivity: true,
              BeeDashboardProfitandLoss: true,
              BeeDashboardHearvestProduct: true,
              skip: true,
            }));
            const t = tooltip;
            t.BeeDashboardHeader = true;
            t.skip=true
            await storeValueByKey('ToolTipObject', JSON.stringify(t));
            return
          }
          if (winHeight / 3 + 370 > winHeight) {
            scrollviewref.current.scrollTo({
              x: 0, // Replace with desired horizontal position
              y: 100, // Replace with desired vertical position
              animated: true, // Set to false for instant scroll
            });
          }
          settooltip(prev => ({
            ...prev,
            BeeDashboardHeader: true,
          }));
          if (tooltip && !tooltip.BeeDashboardHeader) {
            const t = tooltip;
            t.BeeDashboardHeader = true;
            await storeValueByKey('ToolTipObject', JSON.stringify(t));
            await storeValueByKey('preferredLanguageChange', `true`);
          }
        }}
        title={apiaries?.name}
        onBackPress={() => {
          navigation.navigate('Dashboard');
        }}
        apiaryId={apiaries?._id}
        apiaryName={apiaries?.name}
        hiveCount={totalChamberCount}
        //apiaryLocation={apiaries?.location?.address}
        navigation={navigation}
        apiaryData={apiaries}
      />

      <ScrollView ref={scrollviewref}>
        <ImageBackground
          source={require('../../assets/images/PlaceholderForApiaryDashboard.png')}
          style={{
            width: '100%',
            height: 243,
            marginTop: -20,
          }}
          imageStyle={{
            resizeMode: 'stretch',
          }}>
          <View>
            {userInfo ? (
              <View style={{marginTop: 50}}>
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
                    userInfo?.user_husband_name +
                      ' and ' +
                      userInfo?.user_wife_name ||
                    ''}
                  !
                  {/* {t('namaste')} {transliteratedName || userInfo?.name || ''}! */}
                </CustomText>
              </View>
            )
          :
          <View
          style={{
            width: '100%',
            height: 30,
            marginTop: 50
          }}
          />}
            {weatherData ? (
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-between',
                  // alignItems: 'center',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                }}>
                <View
                  style={{flexDirection: 'row', alignItems: 'center', gap: 25}}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={{
                        color: udyamitaTheme.textColor,
                        fontSize: 12,
                        fontWeight: '400',
                      }}>
                      {t('temperature')}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'start',
                        marginTop: 2,
                        alignItems: 'flex-start',
                      }}>
                      <Text
                        style={{
                          color: udyamitaTheme.textColor,
                          fontSize: 32,
                          fontWeight: '400',
                        }}>
                        {weatherData?.current?.temperature_2m}
                      </Text>
                      <Text
                        style={{
                          color: udyamitaTheme.textColor,
                          fontSize: 18.8,
                          fontWeight: '400',
                        }}>
                        °C
                      </Text>
                    </View>
                  </View>
                  <View style={{flexDirection: 'column'}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'start',
                        marginTop: 2,
                        alignItems: 'flex-start',
                      }}>
                      <Image
                        source={require('../../assets/images/Wind.png')}
                        style={{width: 23, height: 13, marginRight: 5}}
                      />
                      <Text
                        style={{
                          color: udyamitaTheme.textColor,
                          fontSize: 12,
                          fontWeight: '400',
                        }}>
                        {t('Wind')}{' '}
                      </Text>
                      <Text
                        style={{
                          color: udyamitaTheme.textColor,
                          fontSize: 12,
                          fontWeight: '400',
                        }}>
                        {weatherData?.current?.wind_speed_10m} Km/h
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 5,
                      }}>
                      <Image
                        source={require('../../assets/images/Humidity.png')}
                        style={{width: 9, height: 13, marginRight: 5}}
                      />
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'start',
                          marginTop: 2,
                          alignItems: 'flex-start',
                        }}>
                        <Text
                          style={{
                            color: udyamitaTheme.textColor,
                            fontSize: 12,
                            fontWeight: '400',
                          }}>
                          {t('humidity')}{' '}
                        </Text>
                        <Text
                          style={{
                            color: udyamitaTheme.textColor,
                            fontSize: 12,
                            fontWeight: '400',
                          }}>
                          {weatherData?.currentTemperature?.humidity}%
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('WeatherForecast', {
                      Data: weatherData,
                      ...route?.params,
                    });
                  }}
                  style={{flexDirection: 'row', alignItems: 'start'}}>
                  <CustomText
                    type="label"
                    style={{
                      color: udyamitaTheme.primaryColor,
                      fontFamily: udyamitaTheme.mainThemeFontFamily,
                      fontSize: 12,
                      paddingRight: 5,
                      fontWeight: '600',
                    }}>
                    {t('viewAll')}
                  </CustomText>
                  <Image
                    source={require('../../assets/images/Caret_right.png')}
                    style={{width: 18, height: 24}}
                  />
                </TouchableOpacity>
              </View>
            )
            :
            loadingWeatherData?
            <>
            <View style={{
              flexDirection:'row',
              justifyContent:'center',
              alignItems:'center',
              marginTop:20

            }}>
              <View style={{
                flexDirection:'column',
              }}>
                <ActivityIndicator size="large" color={'black'} />
                <Text style={{
                  color: udyamitaTheme.textColor,
                  fontSize: 14,
                  fontWeight: '400',
                }}>
                  {t('FetchingWeatherData')}
                </Text>
              </View>
            </View>
            </>
            :null       
            }
          </View>
        </ImageBackground>

        <View style={styles.topRow}>
          {tooltip &&
          tooltip.BeeDashboardHeader &&
          !tooltip.BeeDashboardHiveInspection ? (
            <Tooltip
              allowChildInteraction={false}
              backgroundColor={'rgba(0,0,0,0.8)'}
              tooltipStyle={{marginBottom: 10, paddingBottom: 10}}
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
              childrenWrapperStyle={{
                // minWidth: width*0.45,
                width: '100%',
                borderRadius: 6,
                flexWrap: 'wrap',
                overflow: 'hidden',
              }}
              isVisible={
                tooltip &&
                tooltip.BeeDashboardHeader &&
                !tooltip.BeeDashboardHiveInspection
              }
              placement="top"
              onClose={() => console.log('closing tool')}
              // topAdjustment={-10}
              content={
                <>
                  <Text
                    style={{fontSize: 14, color: '#262626', lineHeight: 24}}>
                    {t('inspectionHiveInfo')}
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
                      onPress={async () => {
                        settooltip(prev => ({
                          ...prev,
                          BeeDashboardHeader: true,
                          BeeDashboardHiveInspection: true,
                          BeeDashboardMarkYourActivity: true,
                          BeeDashboardProfitandLoss: true,
                          BeeDashboardHearvestProduct: true,
                          skip: true,
                        }));
                        const t = tooltip;
                        t.BeeDashboardHiveInspection = true;
                        t.skip = true;
                        await storeValueByKey(
                          'ToolTipObject',
                          JSON.stringify(t),
                        );
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
                      onPress={async () => {
                        settooltip(prev => ({
                          ...prev,
                          BeeDashboardHiveInspection: true,
                        }));
                        if (tooltip && !tooltip.BeeDashboardHiveInspection) {
                          const t = tooltip;
                          t.BeeDashboardHiveInspection = true;
                          await storeValueByKey(
                            'ToolTipObject',
                            JSON.stringify(t),
                          );
                        }
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
                        {t('next')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              }>
              <TouchableOpacity
                style={{
                  height: 260,
                  borderRadius: 6,
                  flexWrap: 'wrap',
                  overflow: 'hidden',
                  width: '45%',
                }}
                onPress={() =>
                  navigation.navigate('InspectionTypeSelectionPage', {
                    hiveCount: totalChamberCount,
                    apiaryId: apiaries?._id,
                    apiaryName: apiaries?._name,
                  })
                }>
                <ImageBackground
                  source={require('../../assets/images/Inspect_bg.png')}
                  style={{
                    width: '100%',
                    maxWidth: '100%',
                    height: '100%',
                    resizeMode: 'cover',
                    flexDirection: 'column',
                    // marginTop: -10,
                  }}>
                  <CustomText
                    style={{
                      fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
                      color: udyamitaTheme.textColor,
                      fontSize: udyamitaTheme.themeFontSizeLabel,
                      lineHeight: 18,
                      margin: 5,
                      marginTop: 8,
                      marginBottom: 3,
                    }}
                    type="label">
                    {t('inspectHive')}
                  </CustomText>
                  <CustomText
                    style={{
                      fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
                      color: udyamitaTheme.textColor,
                      margin: 5,
                      marginTop: 0,
                      fontSize: udyamitaTheme.themeFontSizeLabel,
                      lineHeight: 14,
                    }}
                    type="sh">
                    {t('getSmartRecommendations')}
                  </CustomText>
                </ImageBackground>
                {/* <CustomText style={styles.titleText} type="label">
              {t('inspectHive')}
            </CustomText>
            <CustomText style={styles.subText} type="sh">
              {t('getSmartRecommendations')}
            </CustomText> */}
                {formattedTimeDifference ? (
                  <View style={styles.timeStyle}>
                    <CustomText style={styles.timeTextStyle} type="sh">
                      {formattedTimeDifference}
                    </CustomText>
                  </View>
                ) : null}

                <TouchableOpacity
                  style={[styles.button, {maxWidth: '100%', width: '100%'}]}
                  onPress={() =>
                    navigation.navigate('InspectionTypeSelectionPage', {
                      hiveCount: totalChamberCount,
                      apiaryId: apiaries?._id,
                      apiaryName: apiaries?._name,
                    })
                  }>
                  <CustomText style={styles.buttonText} type="label">
                    {t('inspectHive')}
                  </CustomText>
                </TouchableOpacity>
              </TouchableOpacity>
            </Tooltip>
          ) : (
            <TouchableOpacity
              style={styles.box}
              onPress={() =>
                navigation.navigate('InspectionTypeSelectionPage', {
                  hiveCount: totalChamberCount,
                  apiaryId: apiaries?._id,
                  apiaryName: apiaries?._name,
                })
              }
              // onPress={e=>{
              //   console.log(winHeight);
              //   scrollviewref.current.scrollTo({
              //     x: 0, // Replace with desired horizontal position
              //     y: 660, // Replace with desired vertical position
              //     animated: true // Set to false for instant scroll
              //   });
              // }}
            >
              <ImageBackground
                source={require('../../assets/images/Inspect_bg.png')}
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  height: '100%',
                  resizeMode: 'cover',
                  flexDirection: 'column',
                  // marginTop: -10,
                }}>
                <CustomText
                  style={{
                    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
                    color: udyamitaTheme.textColor,
                    fontSize: udyamitaTheme.themeFontSizeLabel,
                    lineHeight: 18,
                    margin: 5,
                    marginTop: 8,
                    marginBottom: 3,
                  }}
                  type="label">
                  {t('inspectHive')}
                </CustomText>
                <CustomText
                  style={{
                    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
                    color: udyamitaTheme.textColor,
                    margin: 5,
                    marginTop: 0,
                    fontSize: udyamitaTheme.themeFontSizeLabel,
                    lineHeight: 14,
                  }}
                  type="sh">
                  {t('getSmartRecommendations')}
                </CustomText>
              </ImageBackground>
              {/* <CustomText style={styles.titleText} type="label">
              {t('inspectHive')}
            </CustomText>
            <CustomText style={styles.subText} type="sh">
              {t('getSmartRecommendations')}
            </CustomText> */}
              {formattedTimeDifference ? (
                <View style={styles.timeStyle}>
                  <CustomText style={styles.timeTextStyle} type="sh">
                    {formattedTimeDifference}
                  </CustomText>
                </View>
              ) : null}

              <TouchableOpacity
                style={[styles.button, {maxWidth: '100%', width: '100%'}]}
                onPress={() =>
                  navigation.navigate('InspectionTypeSelectionPage', {
                    hiveCount: totalChamberCount,
                    apiaryId: apiaries?._id,
                    apiaryName: apiaries?._name,
                  })
                }>
                <CustomText style={styles.buttonText} type="label">
                  {t('inspectHive')}
                </CustomText>
              </TouchableOpacity>
            </TouchableOpacity>
          )}

          {tooltip &&
          tooltip.BeeDashboardHeader &&
          tooltip.BeeDashboardHiveInspection &&
          !tooltip.BeeDashboardMarkYourActivity ? (
            <Tooltip
              allowChildInteraction={false}
              backgroundColor={'rgba(0,0,0,0.8)'}
              tooltipStyle={{marginBottom: 10, paddingBottom: 10}}
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
              childrenWrapperStyle={{
                // minWidth: width*0.45,
                width: '100%',
                borderRadius: 6,
                flexWrap: 'wrap',
                overflow: 'hidden',
              }}
              isVisible={
                tooltip &&
                tooltip.BeeDashboardHeader &&
                tooltip.BeeDashboardHiveInspection &&
                !tooltip.BeeDashboardMarkYourActivity
              }
              placement="top"
              onClose={() => console.log('closing tool')}
              // topAdjustment={-10}
              content={
                <>
                  <Text
                    style={{fontSize: 14, color: '#262626', lineHeight: 24}}>
                    {t('markYourActivityInfo')}
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
                      onPress={async () => {
                        settooltip(prev => ({
                          ...prev,
                          BeeDashboardHeader: true,
                          BeeDashboardHiveInspection: true,
                          BeeDashboardMarkYourActivity: true,
                          BeeDashboardProfitandLoss: true,
                          BeeDashboardHearvestProduct: true,
                          skip: true,
                        }));
                        const t = tooltip;
                        t.BeeDashboardMarkYourActivity = true;
                        t.skip = true;
                        await storeValueByKey(
                          'ToolTipObject',
                          JSON.stringify(t),
                        );
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
                    onPress={async () => {
                      scrollviewref.current.scrollTo({
                        x: 0, // Replace with desired horizontal position
                        y: 460, // Replace with desired vertical position
                        animated: true, // Set to false for instant scroll
                      });
                      setTimeout(() => {
                        settooltip(prev => ({
                          ...prev,
                          BeeDashboardMarkYourActivity: true,
                        }));
                      }, 300);
                      if (tooltip && !tooltip.BeeDashboardMarkYourActivity) {
                        const t = tooltip;
                        t.BeeDashboardMarkYourActivity = true;
                        await storeValueByKey(
                          'ToolTipObject',
                          JSON.stringify(t),
                        );
                      }
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
                      {t('next')}
                    </Text>
                  </TouchableOpacity>
                  </View>
                  
                </>
              }>
              <TouchableOpacity
                style={styles.box}
                onPress={() =>
                  navigation.navigate('LogVisitsList', {
                    hiveCount: totalChamberCount,
                    apiaryId: apiaries?._id,
                    apiaryName: apiaries?._name,
                  })
                }>
                <ImageBackground
                  source={require('../../assets/images/LogActivities_bg.png')}
                  style={{
                    width: '100%',
                    height: '100%',
                    maxWidth: '100%',
                    resizeMode: 'cover',
                    //marginTop: -18,
                    flexDirection: 'column',
                  }}>
                  <CustomText
                    style={{
                      fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
                      color: udyamitaTheme.textColor,
                      fontSize: udyamitaTheme.themeFontSizeLabel,
                      lineHeight: 18,
                      margin: 5,
                      marginTop: 8,
                      marginBottom: 3,
                    }}
                    type="label">
                    {t('logActivities')}
                  </CustomText>
                  <CustomText
                    style={{
                      fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
                      color: udyamitaTheme.textColor,
                      margin: 5,
                      marginTop: 0,
                      fontSize: udyamitaTheme.themeFontSizeLabel,
                      lineHeight: 14,
                    }}
                    type="sh">
                    {t('logActivitiesKeepYourHiveHealthy')}
                  </CustomText>
                </ImageBackground>

                <TouchableOpacity
                  style={[styles.button, {maxWidth: '100%', width: '100%'}]}
                  onPress={() =>
                    navigation.navigate('LogVisitsList', {
                      hiveCount: totalChamberCount,
                      apiaryId: apiaries?._id,
                      apiaryName: apiaries?._name,
                    })
                  }>
                  <CustomText style={styles.buttonText} type="label">
                    {t('logActivities')}
                  </CustomText>
                </TouchableOpacity>
                {lastVisit ? (
                  <View style={styles.timeStyle}>
                    <CustomText style={styles.timeTextStyle} type="sh">
                      {lastVisit}
                    </CustomText>
                  </View>
                ) : null}
              </TouchableOpacity>
            </Tooltip>
          ) : (
            <TouchableOpacity
              style={styles.box}
              onPress={() =>
                navigation.navigate('LogVisitsList', {
                  hiveCount: totalChamberCount,
                  apiaryId: apiaries?._id,
                  apiaryName: apiaries?._name,
                })
              }>
              <ImageBackground
                source={require('../../assets/images/LogActivities_bg.png')}
                style={{
                  width: '100%',
                  height: '100%',
                  maxWidth: '100%',
                  resizeMode: 'cover',
                  //marginTop: -18,
                  flexDirection: 'column',
                }}>
                <CustomText
                  style={{
                    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
                    color: udyamitaTheme.textColor,
                    fontSize: udyamitaTheme.themeFontSizeLabel,
                    lineHeight: 18,
                    margin: 5,
                    marginTop: 8,
                    marginBottom: 3,
                  }}
                  type="label">
                  {t('logActivities')}
                </CustomText>
                <CustomText
                  style={{
                    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
                    color: udyamitaTheme.textColor,
                    margin: 5,
                    marginTop: 0,
                    fontSize: udyamitaTheme.themeFontSizeLabel,
                    lineHeight: 14,
                  }}
                  type="sh">
                  {t('logActivitiesKeepYourHiveHealthy')}
                </CustomText>
              </ImageBackground>

              <TouchableOpacity
                style={[styles.button, {maxWidth: '100%', width: '100%'}]}
                onPress={() =>
                  navigation.navigate('LogVisitsList', {
                    hiveCount: totalChamberCount,
                    apiaryId: apiaries?._id,
                    apiaryName: apiaries?._name,
                  })
                }>
                <CustomText style={styles.buttonText} type="label">
                  {t('logActivities')}
                </CustomText>
              </TouchableOpacity>
              {lastVisit ? (
                <View style={styles.timeStyle}>
                  <CustomText style={styles.timeTextStyle} type="sh">
                    {lastVisit}
                  </CustomText>
                </View>
              ) : null}
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
            style={styles.columnBox2}
            onPress={() =>
              navigation.navigate('buzztrack', {
                apiaryId: apiaries?._id,
              })
            }>
            <ImageBackground
              source={require('../../assets/images/BuzztrackDashboard.png')}
              style={{
                width: '100%',
                height: '100%',
                resizeMode: 'cover',
                borderRadius: 10,
              }}
            />
            <CustomText style={styles.titleTextCenter} type="label">
            {t('buzztrack')}
            </CustomText>
            <CustomText style={styles.subTextCenter} type="sh">
            {t('buzztrackdescription')}
            </CustomText>
            <TouchableOpacity
              style={[styles.button, {width: '100%'}]}
              onPress={() =>
                navigation.navigate('buzztrack', {
                  apiaryId: apiaries?._id,
                })
              }>
              <CustomText style={styles.buttonText} type="label">
              {t('Discovernow')}
              </CustomText>
            </TouchableOpacity>
          </TouchableOpacity>

        <Tooltip
          allowChildInteraction={false}
          backgroundColor={'rgba(0,0,0,0.8)'}
          tooltipStyle={{marginBottom: 10, paddingBottom: 10}}
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
          childrenWrapperStyle={{
            width: '100%',
          }}
          isVisible={
            tooltip &&
            tooltip.BeeDashboardHeader &&
            tooltip.BeeDashboardHiveInspection &&
            tooltip.BeeDashboardMarkYourActivity &&
            !tooltip.BeeDashboardProfitandLoss
          }
          placement="top"
          onClose={() => console.log('closing tool')}
          // topAdjustment={-10}
          content={
            <>
              <Text style={{fontSize: 14, color: '#262626', lineHeight: 24}}>
                {t('profitAndLossInfo')}
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
                      onPress={async () => {
                        settooltip(prev => ({
                          ...prev,
                          BeeDashboardHeader: true,
                          BeeDashboardHiveInspection: true,
                          BeeDashboardMarkYourActivity: true,
                          BeeDashboardProfitandLoss: true,
                          BeeDashboardHearvestProduct: true,
                          skip: true,
                        }));
                        const t = tooltip;
                        t.BeeDashboardProfitandLoss = true;
                        t.skip = true;
                        await storeValueByKey(
                          'ToolTipObject',
                          JSON.stringify(t),
                        );
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
                onPress={async () => {
                  scrollviewref.current.scrollTo({
                    x: 0, // Replace with desired horizontal position
                    y: winHeight, // Replace with desired vertical position
                    animated: true, // Set to false for instant scroll
                  });
                  setTimeout(() => {
                    settooltip(prev => ({
                      ...prev,
                      BeeDashboardProfitandLoss: true,
                    }));
                  }, 300);
                  if (tooltip && !tooltip.BeeDashboardProfitandLoss) {
                    const t = tooltip;
                    t.BeeDashboardProfitandLoss = true;
                    await storeValueByKey('ToolTipObject', JSON.stringify(t));
                  }
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
                  {t('next')}
                </Text>
              </TouchableOpacity>
                  </View>
              
            </>
          }>
          <TouchableOpacity
            style={styles.columnBox}
            onPress={() =>
              navigation.navigate('ListIncomeExpense', {
                apiaryId: apiaries?._id,
              })
            }>
            <ImageBackground
              source={require('../../assets/images/incomeBg.png')}
              style={{
                width: '100%',
                height: '100%',
                resizeMode: 'cover',
                borderRadius: 10,
              }}
            />
            <CustomText style={styles.titleTextRight} type="label">
              {t('profitAndLoss')}
            </CustomText>
            <CustomText style={styles.subTextRight} type="sh">
              {t('trackYourMoneyTakeControOfYourFinances')}
            </CustomText>
            <TouchableOpacity
              style={[styles.button, {width: '100%'}]}
              onPress={() =>
                navigation.navigate('ListIncomeExpense', {
                  apiaryId: apiaries?._id,
                })
              }>
              <CustomText style={styles.buttonText} type="label">
                {t('logIncomeExpense')}
              </CustomText>
            </TouchableOpacity>
          </TouchableOpacity>
        </Tooltip>

        <Tooltip
          allowChildInteraction={false}
          backgroundColor={'rgba(0,0,0,0.8)'}
          tooltipStyle={{marginBottom: 10, paddingBottom: 10}}
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
          childrenWrapperStyle={{
            width: '100%',
          }}
          isVisible={
            tooltip &&
            tooltip.BeeDashboardHeader &&
            tooltip.BeeDashboardHiveInspection &&
            tooltip.BeeDashboardMarkYourActivity &&
            tooltip.BeeDashboardProfitandLoss &&
            !tooltip.BeeDashboardHearvestProduct
          }
          placement="top"
          onClose={() => console.log('closing tool')}
          // topAdjustment={-10}
          content={
            <>
              <Text style={{fontSize: 14, color: '#262626', lineHeight: 24}}>
                {t('harvestHiveInfo')}
              </Text>
              <TouchableOpacity
                onPress={async () => {
                  settooltip(prev => ({
                    ...prev,
                    BeeDashboardHearvestProduct: true,
                  }));
                  if (tooltip && !tooltip.BeeDashboardHearvestProduct) {
                    const t = tooltip;
                    t.BeeDashboardHearvestProduct = true;
                    await storeValueByKey('ToolTipObject', JSON.stringify(t));
                  }
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
                  {t('next')}
                </Text>
              </TouchableOpacity>
            </>
          }>
          <TouchableOpacity
            style={styles.columnBoxBig}
            onPress={() =>
              navigation.navigate('HarvestListingScreen', {
                apiaryId: apiaries?._id,
              })
            }>
            <ImageBackground
              source={require('../../assets/images/LogHarvest_combined.png')}
              style={{
                width: '100%',
                height: '100%',
              }}
            />
            <CustomText style={styles.titleText} type="label">
              {t('logHarvest')}
            </CustomText>
            {lastHarvest ? (
              <View style={[styles.timeStyle, {top: '15%'}]}>
                <CustomText style={styles.timeTextStyle} type="sh">
                  {lastHarvest}
                </CustomText>
              </View>
            ) : null}

            <View
              style={{
                position: 'absolute',
                marginTop: '20%',
                flexDirection: 'row',
                alignSelf: 'center',
              }}>
              {allharvesteddata &&
                allharvesteddata?.map(item => (
                  <TouchableOpacity
                    key={item._id}
                    style={styles.harvestCard}
                    onPress={() =>
                      navigation.navigate('HarvestListingScreen', {
                        apiaryId: apiaries?._id,
                      })
                    }>
                    {harvestData.length > 0 && (
                      <View>
                        {harvestData.length > 0 && (
                          <CustomText style={styles.quantityText} type="label">
                            {harvestData.some(
                              log =>
                                log.product_harvest === item.value &&
                                log.quantity_harvested > 0,
                            )
                              ? harvestData
                                  .filter(
                                    log =>
                                      log.product_harvest === item.value &&
                                      log.quantity_harvested > 0,
                                  )
                                  .reduce(
                                    (total, log) =>
                                      total +
                                      parseFloat(log.quantity_harvested),
                                    0,
                                  )
                              : '0'}{' '}
                            {['honey', 'beeswax'].includes(item?.value)
                              ? 'kg'
                              : item?.value === 'pollen'
                              ? 'g'
                              : 'g'}
                          </CustomText>
                        )}
                      </View>
                    )}
                    <CustomText
                      type="label"
                      style={[styles.dummyText, {textTransform: 'capitalize'}]}>
                      {item?.product}
                    </CustomText>
                  </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity
              style={[styles.button, {width: '100%'}]}
              onPress={() =>
                navigation.navigate('HarvestListingScreen', {
                  apiaryId: apiaries?._id,
                })
              }>
              <CustomText style={styles.buttonText} type="label">
                {t('logHarvest')}
              </CustomText>
            </TouchableOpacity>
          </TouchableOpacity>
        </Tooltip>

        {apiaries?.beeType === 'mellifera' ? (
          <TouchableOpacity
            style={styles.columnBox}
            onPress={() => navigation.navigate('ComingSoon')}>
            <ImageBackground
              source={require('../../assets/images/Migrate_combined.png')}
              style={{
                width: '100%',
                height: '100%',
                marginTop: -20,
                //resizeMode: 'contain',
                //borderRadius: 10,
              }}
            />
            <CustomText style={styles.titleTextRight} type="label">
              {t('migrate')}
            </CustomText>
            <CustomText style={styles.subTextRight} type="sh">
              {t('discoverIntelligent')}
            </CustomText>
            <TouchableOpacity
              style={[styles.button, {width: '100%'}]}
              onPress={() => navigation.navigate('ComingSoon')}>
              <CustomText style={styles.buttonText} type="label">
                {t('migrate')}
              </CustomText>
            </TouchableOpacity>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 20,
  },
  box: {
    minWidth: '45%',
    maxWidth: '45%',
    height: 260,
    borderRadius: 6,
    flexWrap: 'wrap',
    overflow: 'hidden',
  },
  titleText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color: udyamitaTheme.textColor,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    position: 'absolute',
    top: '3%', // Adjust as needed
    left: '5%',
    right: '5%',
    //textAlign: 'center',
    lineHeight: 18,
  },
  subText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    color: udyamitaTheme.textColor,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    position: 'absolute',
    top: '12%', // Adjust as needed
    left: '5%',
    right: '5%',
    //textAlign: 'center',
    lineHeight: 14,
  },
  button: {
    borderWidth: 2,
    borderColor: udyamitaTheme.beeAppColor,
    position: 'absolute',
    backgroundColor: '#fff',
    bottom: 0,
  width:'100%',
    height: 48,
    // flexWrap:'wrap',
    borderRadius: 6,
    //flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color: udyamitaTheme.beeAppColor,
    textAlign: 'center',
  },
  columnBox: {
    width: '90%',
    height: 160,
    alignSelf: 'center',
    borderRadius: 6,
    flexWrap: 'wrap',
    overflow: 'hidden',
    marginBottom: 20,
  },
  columnBox2: {
    width: '90%',
    height: 135,
    alignSelf: 'center',
    borderRadius: 6,
    flexWrap: 'wrap',
    overflow: 'hidden',
    marginBottom: 20,
  },
  titleTextRight: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color: udyamitaTheme.textColor,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    position: 'absolute',
    top: '5%', // Adjust as needed
    left: '50%',
    right: '5%',
    //textAlign: 'center',
    lineHeight: 18,
  },
  titleTextCenter: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color: udyamitaTheme.textColor,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    position: 'absolute',
    top: '5%', // Adjust as needed
    left: 100,
    //textAlign: 'center',
    lineHeight: 18,
  },
  subTextRight: {
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    color: udyamitaTheme.textColor,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    position: 'absolute',
    top: '17%', // Adjust as needed
    left: '50%',
    right: '5%',
    //textAlign: 'center',
    lineHeight: 14,
  },
  subTextCenter: {
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    color: udyamitaTheme.textColor,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    position: 'absolute',
    top: '18%', // Adjust as needed
    left: 100,
    //textAlign: 'center',
    lineHeight: 14,
  },
  columnBoxBig: {
    width: '90%',
    height: 242,
    alignSelf: 'center',
    borderRadius: 6,
    flexWrap: 'wrap',
    overflow: 'hidden',
    marginBottom: 20,
  },
  dummyCard: {
    backgroundColor: '#fff',
    // width: 220,
    // height: 105,
    position: 'absolute',
    alignSelf: 'center',
    marginTop: '20%',
    borderRadius: 6,
    // flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.3,
    borderColor: udyamitaTheme.borderColor,
    //paddingHorizontal: 20,
  },
  quantityText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color: udyamitaTheme.textColor,
    alignSelf: 'center',
  },
  harvestCard: {
    backgroundColor: '#fff',
    flexDirection: 'column',
    borderRadius: 6,
    flexWrap: 'wrap',
    alignItems: 'center',
    //padding: 10,
    margin: 10,
    justifyContent: 'center',
    borderWidth: 0.3,
    paddingLeft: 8,
    paddingRight: 8,
    borderColor: udyamitaTheme.borderColor,
  },
  dummyText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    color: udyamitaTheme.textColor,
    textAlign: 'center',
    padding: 8,
    //textTransform: 'capitalize',
  },
  timeStyle: {
    backgroundColor: '#ffff',
    //height:16,
    borderWidth: 0.5,
    position: 'absolute',
    top: '28%',
    left: '5%',
    padding: 5,
    borderRadius: 12,
    borderColor: udyamitaTheme.borderStyleColor,
  },
  timeTextStyle: {
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    color: udyamitaTheme.textColor,
    textAlign: 'center',
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
  },
});
