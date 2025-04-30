import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    FlatList,
} from 'react-native';
import { Linking } from 'react-native';
import React from 'react';
import { udyamitaTheme } from '../../config/styles/udyamitaTheme';
import CustomHeader from '../../components/reusable/generic/CustomHeader';
import { useTranslation } from 'react-i18next';

import { ArrowLgIcon } from '../../assets/Icons/IconSvg';
import CustomText from '../../components/reusable/CustomText';
import { EXPORT_WHATSAPP_CONTACT_NUMBER } from '../../config/app.config';
const ExpertHomeScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const handleBackPress = () => {
        navigation.goBack();
    };
    const CardDetails = [
        // {
        //     title: t('askAQuest'),
        //     desc: t('askAQuestionSecond'),
        //     nav: t('askAQuest'),
        //     navScreen: 'TopicsScreen',
        //     img: require('../../assets/images/chatbot2.png'),
        // },
        {
            title: t('connectWithExpert'),
            desc: t('getGuidance'),
            nav: t('connectWithExpert'),

            img: require('../../assets/images/Expert4.png'),
            phoneNumber: EXPORT_WHATSAPP_CONTACT_NUMBER,
        },
    ];
    const handleExpertPress = async (phoneNumber) => {
        // const whatsappUrl = `whatsapp://send?phone=${phoneNumber}`;
        const whatsappUrl = 'https://wa.me/' + phoneNumber;


        // const canOpen =
            await Linking.openURL(whatsappUrl);
        // const canOpen = await Linking.canOpenURL(whatsappUrl);

        // if (canOpen) {
        //     // WhatsApp is installed, open the URL
        //     Linking.openURL(whatsappUrl).catch(err => console.error('Error opening WhatsApp:', err));
        // } else {
        //     // WhatsApp is not installed, navigate to the store to install
        //     const storeUrl = 'https://play.google.com/store/apps/details?id=com.whatsapp';

        //     Linking.openURL(storeUrl).catch(err => console.error('Error opening store:', err));
        // }
    };
    const renderCardItem = ({ item, index }) => (
        <>
            {index !== 0 && <View >
                {/* <Text style={styles.orText}>{t('or')}</Text> */}
                 <CustomText style={styles.orText}>{t('or')}</CustomText>
                </View>}
            <TouchableOpacity
               onPress={() => (item?.navScreen ? navigation.navigate(item?.navScreen) : handleExpertPress(item?.phoneNumber))}
                style={styles.cardContainer}>
                <View
                    style={{
                        flexDirection: 'row',
                        padding: 15,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Image source={item.img} style={styles.cardImage} />
                    <View style={styles.cardTextContainer}>
                        {/* <Text style={styles.cardTitle}>{item.title}</Text>
                        <Text style={styles.cardDesc}>{item.desc}</Text> */}
                        <CustomText style={styles.cardTitle} type='btn' >{item.title}</CustomText>
                        <CustomText style={styles.cardDesc} type='sh'>{item.desc}</CustomText>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.greenbtn}
                    onPress={() => (item?.navScreen ? navigation.navigate(item?.navScreen) : handleExpertPress(item?.phoneNumber))}
                >
                    {/* <Text style={styles.cardNav}>{item.nav}</Text> */}
                    <CustomText style={styles.cardNav} type='label'>{item.nav}</CustomText>
                    <ArrowLgIcon />
                </TouchableOpacity>
            </TouchableOpacity>
        </>
    );

    return (
        <View style={styles.mainContainer}>
            <CustomHeader
                showBackIcon={true}
                onBackPress={handleBackPress}
                title={t('connectWithExpert')}
                navigation={navigation}
            />
            <FlatList
                data={CardDetails}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderCardItem}
            />
            {/* <TouchableOpacity
                style={styles.chatbotIcon}
                onPress={() => navigation.navigate('TopicsScreen')}>
                <Image
                    source={require('../../assets/images/chatbotstatic.png')}
                    style={{ width: 90, height: 108, marginTop: 8 }}
                />
                {/* <Text style={styles.botAsk}>{t('askAQuest')}</Text> */}
                  {/* <CustomText style={styles.botAsk} type='xs'>{t('askAQuest')}</CustomText>
            </TouchableOpacity> */} 
        </View>
    );
};

export default ExpertHomeScreen;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: udyamitaTheme.themeBgColor,
    },
    cardContainer: {
        alignItems: 'center',
        backgroundColor: 'white',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,

        borderRadius: 6,
        borderWidth: 0.5,
        borderColor: udyamitaTheme.borderStyleColor,
    },
    cardImage: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        marginRight: 15,
    },
    cardTextContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: udyamitaTheme.themeFontSizeButton,
        fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
        marginBottom: 5,
        color: udyamitaTheme.textColor,
    },
    cardDesc: {
        fontSize: udyamitaTheme.themeFontSizeSmallHeader,

        color: udyamitaTheme.textColor,
        fontFamily: udyamitaTheme.mainThemeFontFamily,
        lineHeight: 14,
    },
    cardNav: {
        fontSize: udyamitaTheme.themeFontSizeLabel,
        color: '#fff',
    },
    greenbtn: {
        backgroundColor: udyamitaTheme.beeAppColor,
        height: 48,
        width: '100%',
        marginTop: -15,

        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 6,
    },
    separator: {
        height: 1,
        backgroundColor: udyamitaTheme.borderStyleColor,
        marginLeft: 20,
        marginRight: 20,
    },
    orText: {
        textAlign: 'center',
        margin: 30,
        fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
        color: udyamitaTheme.textColor,
        textTransform: 'uppercase'
    },
    chatbotIcon: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    botAsk: {
        fontSize: udyamitaTheme.themeFontSizeExtraSmall,
        lineHeight: 14,
        color: 'white',
        position: 'absolute',
        bottom: 6,
        fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    },
});