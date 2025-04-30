import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    BackHandler,
    Alert,
    ImageBackground,
    Dimensions,
    StatusBar,
    ActivityIndicator
} from 'react-native';
import Header from '../../components/Header';
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomHeaderHelpdesk from '../../components/reusable/generic/CustomHeaderHelpdesk';
import { udyamitaTheme } from '../../config/styles/udyamitaTheme';
import { getToken, getUser } from '../../helpers/UserData';
import { APP_API_MENTOR_VAlUECHAIN_SERVICES } from '@env'
import axios from 'axios';
import { useBackHandler } from '../../helpers/hooks/useBackhandler';
import { useTranslation } from 'react-i18next';

export const ThreeWaterDrop = () => {
    return (
        <View style={styles.flexrow}>
            <View style={styles.flexcol}>
                <Image
                    source={require('../../assets/images/Humidity.png')}
                    style={{ width: 4, height: 6, marginBottom: 1 }}
                />
                <Image
                    source={require('../../assets/images/Humidity.png')}
                    style={{ width: 4, height: 6, marginBottom: 0 }}
                />
            </View>
            <Image
                source={require('../../assets/images/Humidity.png')}
                style={{ width: 4, height: 6, marginLeft: 1, alignSelf: 'center' }}
            />
        </View>
    )
}

const HourlyTempInfo = ({ data }) => {
    // Function to extract time from a date string
    function extractTime(dateString) {
        // Split the date string by space
        const parts = dateString.split(' ');

        // The time is the second part of the split string
        return parts[2] + ' ' + parts[3]; // This will return "05:30"
    }

    return (
        <>
            <View style={[styles.flexcol, { borderWidth: 1, borderColor: '#CBCBCB', backgroundColor: "#fff", paddingVertical: 10, paddingHorizontal: 5, borderRadius: 15, gap: 10 }]}>
                <Text style={{ fontSize: 11, fontWeight: '600', alignSelf: 'center', color:"#6B6969" }}>
                    {extractTime(data?.time)}
                </Text>
                {data?.imgUrl?<Image source={{ uri: data?.imgUrl }} style={{ width: 36, height: 28,alignSelf:'center' }} />
                :<Text style={{ fontSize: 11, fontWeight: '600', alignSelf: 'center', color:"#6B6969" }}>
                    {data?.wind_speed_10m} Km/h
                </Text>}
                <Text style={{ fontSize: 11, fontWeight: '600', alignSelf: 'center', color:"#6B6969" }}>
                    {data?.temperature_2m}°C
                </Text>
            </View>
        </>
    )
}

export const WeatherForecast = () => {
    const {t} = useTranslation();
    const navigation = useNavigation()
    const route = useRoute()
    const [userInfo, setuserInfo] = useState(false)
    const [weatherData, setweatherData] = useState(false)
    const [nextSevenDays, setnextSevenDays] = useState(false)
    // Function to get formatted date
    const getLongFormattedDate = (currentDate) => {
        const optionsLong = { weekday: 'long', month: 'short', day: 'numeric' };
        // Format for "Saturday, 21 Dec"
        const longFormat = currentDate.toLocaleDateString('en-US', optionsLong);
        return longFormat

    };

    useBackHandler(() => {
        userInfo && userInfo?.userRoles?.includes('bee_mitra') ?
        navigation.navigate('BeeKeepersProfile',{...route?.params})
        :
        navigation.navigate('BeeDashboard',{...route?.params})
    
        return true;
       });
    
    const getShortFormattedDate = (currentDate) => {
        const optionsShort = { weekday: 'short' };
        // Format for "Sun"
        const shortFormat = currentDate.toLocaleDateString('en-US', optionsShort);

        return shortFormat

    };

    const aggregateWeatherData = (data) => {
        const summary = {};
        // console.log('Creating summary for data length:', data?.length);

        data.forEach(entry => {
            const date = entry.time.split(" ")[0] + ' ' + entry.time.split(" ")[1];

            // Initialize summary for the date if it doesn't exist
            if (!summary[date]) {
                summary[date] = {
                    minTemperature: Infinity,
                    maxTemperature: -Infinity,
                    minHumidity: Infinity,
                    maxHumidity: -Infinity,
                    minWindSpeed: Infinity,
                    maxWindSpeed: -Infinity
                };
            }

            // Update min/max values
            summary[date].minTemperature = Math.min(summary[date].minTemperature, entry.temperature_2m);
            summary[date].maxTemperature = Math.max(summary[date].maxTemperature, entry.temperature_2m);
            summary[date].minHumidity = Math.min(summary[date].minHumidity, entry.relative_humidity_2m);
            summary[date].maxHumidity = Math.max(summary[date].maxHumidity, entry.relative_humidity_2m);
            summary[date].minWindSpeed = Math.min(summary[date].minWindSpeed, entry.wind_speed_10m);
            summary[date].maxWindSpeed = Math.max(summary[date].maxWindSpeed, entry.wind_speed_10m);
        });

        // Convert summary object to an array
        const summaryArray = Object.entries(summary).map(([date, values]) => ({
            date,
            ...values
        }))?.slice(1);

        // console.log(summaryArray);
        setnextSevenDays(summaryArray);
    };

    const getWeatherData = async () => {
        try {
            let userInfo= await getUser()
            userInfo=userInfo.userInfo
            const token = await getToken();
            const apiaryId=userInfo && userInfo?.userRoles?.includes('bee_mitra') ? route?.params?.profile?.apiaries?._id : route?.params?.apiaryData?._id
            const config = { headers: { Authorization: 'Bearer ' + token } };
            const res = await axios.post(`${APP_API_MENTOR_VAlUECHAIN_SERVICES}/beekeeping/apiaries/weather`, {
                apiaryId,
            },
                config)
            setweatherData(res.data.weatherData)
            aggregateWeatherData(res.data.weatherData?.hourly)
            // console.log(res.data.weatherData, 'weather data');
        } catch (error) {
            console.log(error, 'err in getting weather data');
        }
    }

    const getUserData = async () =>{
        const user= await getUser()
        setuserInfo(user.userInfo)
    }

    useEffect(() => {
        const call= async () =>{

            await getUserData()
             if (route?.params?.Data) {
                // console.log(route.params.Data.city,'route.params.Data');
                
                 setweatherData(route.params.Data)
                 aggregateWeatherData(route.params.Data?.hourly)
             }
             else {
                 getWeatherData()
             }
        }
        call()
    }, [])

    return (

        weatherData ?
            <>
                <View style={{ backgroundColor: "#FAFAFA" }}>
                    <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
                    <CustomHeaderHelpdesk
                        showBackIcon={true}
                        title={'Weather Forecast'}
                        onBackPress={() => {
                            userInfo && userInfo?.userRoles?.includes('bee_mitra') ?
                            navigation.navigate('BeeKeepersProfile',{...route?.params})
                            :
                            navigation.navigate('BeeDashboard',{...route?.params})
                        }}
                        height={80}
                    />
                    <ScrollView
                        contentContainerStyle={styles.scrollViewContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <Text style={{ fontSize: 18, fontWeight: '600', color: '#847B7B', marginTop: 15 ,marginBottom:3,paddingHorizontal:20}}>
                            {weatherData?.city}
                        </Text>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#847B7B', marginBottom: 15,paddingHorizontal:20 }}>
                            {getLongFormattedDate(new Date())}
                        </Text>
                        <View style={[styles.flexrow, styles.alignCenter, { justifyContent: 'center', gap: 40, marginBottom: 15, paddingHorizontal: 20 }]}>
                            <View>
                                <Image source={{ uri: weatherData?.imgUrl }} style={{ width: 121, height: 94, resizeMode:'contain' }} />
                            </View>
                            <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }} >
                                <Text style={{ color: udyamitaTheme.textColor, fontSize: 12, fontWeight: '400' }}>
                                    {t('temperature')}
                                </Text>
                                <View style={{ flexDirection: 'row', alignItems: 'start', marginTop: 2, alignItems: 'flex-start' }}>

                                    <Text style={{ color: udyamitaTheme.textColor, fontSize: 45, fontWeight: '400' }}>

                                        {weatherData?.current?.temperature_2m}
                                    </Text>
                                    <Text style={{ color: udyamitaTheme.textColor, fontSize: 26, fontWeight: '400' }}>

                                        °C
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'start', marginTop: 2, alignItems: 'flex-start' }}>

                                    <Text style={{ color: udyamitaTheme.textColor, fontSize: 12, fontWeight: '400' }}>
                                        {t('min')}: {weatherData?.currentTemperature?.temp_min}°C {'   '}
                                    </Text>
                                    <Text style={{ color: udyamitaTheme.textColor, fontSize: 12, fontWeight: '400' }}>

                                    {t('max')}: {weatherData?.currentTemperature?.temp_max}°C
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.flexrow, styles.alignCenter, { justifyContent: 'center', marginVertical: 10,paddingHorizontal:20,flexWrap:'wrap',width:'100%'}]}>
                            <View style={{ flexDirection: 'row', alignItems: 'start', alignItems: 'flex-start',marginRight:15 }}>
                                <Image
                                    source={require('../../assets/images/Wind.png')}
                                    style={{ width: 23, height: 13, marginRight: 5 }}
                                />
                                <Text style={{ color: udyamitaTheme.textColor, fontSize: 12, fontWeight: '400' }}>

                                {t('Wind')}{' '}
                                </Text>
                                <Text style={{ color: udyamitaTheme.textColor, fontSize: 12, fontWeight: '400' }}>

                                    {weatherData?.current?.wind_speed_10m} Km/h
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight:15 }} >
                                <Image
                                    source={require('../../assets/images/Humidity.png')}
                                    style={{ width: 9, height: 13, marginRight: 5 }}
                                />
                                <View style={{ flexDirection: 'row', alignItems: 'start', marginTop: 2, alignItems: 'flex-start' }}>

                                    <Text style={{ color: udyamitaTheme.textColor, fontSize: 12, fontWeight: '400' }}>

                                        {t('humidity')}{' '}
                                    </Text>
                                    <Text style={{ color: udyamitaTheme.textColor, fontSize: 12, fontWeight: '400' }}>

                                        {weatherData?.currentTemperature?.humidity}%
                                    </Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }} >
                                <ThreeWaterDrop />
                                <View style={{ flexDirection: 'row', alignItems: 'start', marginTop: 2, alignItems: 'flex-start', marginLeft: 5 }}>

                                    <Text style={{ color: udyamitaTheme.textColor, fontSize: 12, fontWeight: '400' }}>

                                        {t('pressure')} {' '}
                                    </Text>
                                    <Text style={{ color: udyamitaTheme.textColor, fontSize: 12, fontWeight: '400' }}>

                                        {weatherData?.currentTemperature?.grnd_level} hPa
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View>
                            <Text style={{ fontSize: 18, fontWeight: '600', color: '#847B7B', marginVertical: 15,paddingHorizontal:20 }}>
                                {t('Next')} {weatherData && weatherData?.hourly?.length>=48 ? '48' : weatherData?.hourly?.length} hours</Text>
                            <ScrollView horizontal={true} contentContainerStyle={{ flexDirection: 'row', gap: 15, marginBottom: 20,paddingHorizontal:20 }}
                                showsHorizontalScrollIndicator={false}
                            >
                                {weatherData && weatherData?.hourly?.length>=48? weatherData?.hourly.slice(0, 48)?.map(it => {
                                    return (
                                        <HourlyTempInfo data={it} />
                                    )
                                })
                            :(
                                weatherData?.hourly?.map(it => {
                                    return (
                                        <HourlyTempInfo data={it} />
                                    )
                                })
                            )}

                            </ScrollView>
                        </View>

                        {nextSevenDays &&
                            <>
                                <View style={{paddingHorizontal:20 }}>
                                    <Text style={{ fontSize: 18, fontWeight: '600', color: '#847B7B', marginVertical: 15 }}>
                                    {t('Next')} {nextSevenDays?.length} days
                                    </Text>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F7F7F1',height:43,alignContent:'center' }}>
                                        <Text style={{ width: '25%', textAlign: 'center', fontWeight: '400', fontSize: 14, height:'100%',textAlignVertical:'center' }}>
                                            {t('Days')}
                                        </Text>
                                        <Text style={{ width: '25%', textAlign: 'center', fontWeight: '400', fontSize: 14, backgroundColor: '#D9D9D9', height:'100%',textAlignVertical:'center' }}>
                                            {t('min')}/{t('max')}
                                        </Text>
                                        <Text style={{ width: '25%', textAlign: 'center', fontWeight: '400', fontSize: 14, height:'100%',textAlignVertical:'center' }}>
                                        {t('humidity')} 
                                        </Text>
                                        <Text style={{ width: '25%', textAlign: 'center', fontWeight: '400', fontSize: 14, backgroundColor: '#D9D9D9', height:'100%',textAlignVertical:'center' }}>
                                            {t('windSpeed')}
                                        </Text>
                                    </View>
                                    <View>
                                        {nextSevenDays?.map(it =>
                                        (
                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',height:48 }}>
                                                <View style={{ width: '25%', flexDirection: 'row', justifyContent: 'center', height:'100%' }}>
                                                    {/* <Image source={require('../../assets/images/Weather.png')} style={{ width: 20, height: 16 }} /> */}

                                                    <Text style={{ textAlign: 'center', fontWeight: '400', fontSize: 14,textAlignVertical:'center' }}>
                                                        {it.date}
                                                    </Text>
                                                </View>

                                                <Text style={{ width: '25%', textAlign: 'center', fontWeight: '400', fontSize: 14, backgroundColor: '#D9D9D9', height:'100%' ,textAlignVertical:'center'}}>
                                                    {it.minTemperature}°/{it.maxTemperature}°C
                                                </Text>
                                                <Text style={{ width: '25%', textAlign: 'center', fontWeight: '400', fontSize: 14, height:'100%',textAlignVertical:'center' }}>
                                                    {((it.minHumidity + it.maxHumidity) / 2).toFixed(1)}%
                                                </Text>
                                                <Text style={{ width: '25%', textAlign: 'center', fontWeight: '400', fontSize: 14, backgroundColor: '#D9D9D9', height:'100%',textAlignVertical:'center' }}>
                                                    {((it.minWindSpeed + it.maxWindSpeed) / 2).toFixed(1)} km/h
                                                </Text>
                                            </View>
                                        )
                                        )}

                                    </View>


                                </View></>}
                        <View style={{ height: 20 }} />
                    </ScrollView>
                </View>
            </>
            :
            <>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={udyamitaTheme.primaryColor} />
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            </>
    )
}


const styles = StyleSheet.create({
    scrollViewContent: {
        // backgroundColor: udyamitaTheme.themeBgColor,
        paddingBottom:100
    },
    flexrow: {
        flexDirection: 'row',
    },
    flexcol: {
        flexDirection: 'column'
    },
    flexrowcenter: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    alignCenter: {
        alignItems: 'center'
    },
    loadingContainer: {
        backgroundColor:'#FAFAFA',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: udyamitaTheme.textColor,
    },

});