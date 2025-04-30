import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ArrowLgIcon } from '../../components/IconSvgs';
import CustomHeader from '../../components/reusable/generic/CustomHeader';
import { udyamitaTheme } from '../../config/styles/udyamitaTheme';
import CustomText from '../../components/reusable/CustomText';

const MigrationHomeScreen = ({ navigation }) => {
  const { t } = useTranslation();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const CardDetails = [
    {
      title: t('migrate'),
      desc: t('findThePerfectBloomsForYourBees'),
      nav: t('migrateNow'),
      navScreen: 'MigrationForm',
      img: require('../../assets/images/Migrate1.png'),
    },
    {
      title: t('myMigrations'),
      desc: t('viewAllUpcomingAndPastMigrations'),
      nav: t('viewLogs'),
      navScreen: 'PastMigration',
      img: require('../../assets/images/MyMigration_1.png'),
    },
  ];

  const renderCardItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate(item.navScreen)} style={styles.cardContainer}>
        <View style={{flexDirection:'row',padding:15,   justifyContent:'center',alignItems:'center'}}>
        <Image source={item.img} style={styles.cardImage} />
      <View style={styles.cardTextContainer}>
        <CustomText style={styles.cardTitle} type='btn'>{item.title}</CustomText>
        <CustomText style={styles.cardDesc} type='sh'>{item.desc}</CustomText>
    
      </View>
        </View>
        <TouchableOpacity style={styles.greenbtn} onPress={() => navigation.navigate(item.navScreen)}>
        <CustomText style={styles.cardNav} type='label'>{item.nav}</CustomText>
        <ArrowLgIcon/>
        </TouchableOpacity>
       
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
      <CustomHeader
        showBackIcon={true}
        onBackPress={handleBackPress}
        title={t('migrate')}
        showRightSideIcons={true}
        navigation={navigation}
      />
      <FlatList
        data={CardDetails}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderCardItem}
      />
    </View>
  );
};

export default MigrationHomeScreen;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: udyamitaTheme.themeBgColor,
    flex: 1,
  },
  cardContainer: {
   
    alignItems: 'center',
    backgroundColor: 'white',
    marginLeft: 20,
    marginRight:20,
    marginTop:20,

    borderRadius: 6,
  borderWidth:0.5,
  borderColor:udyamitaTheme.borderStyleColor
  },
  cardImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginRight: 15,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: udyamitaTheme.themeFontSizeButton,
   fontFamily:udyamitaTheme.mainThemeFontFamilyBold,
    marginBottom: 5,
    color:udyamitaTheme.textColor
  },
  cardDesc: {
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
   
    color:udyamitaTheme.textColor,
    fontFamily:udyamitaTheme.mainThemeFontFamily,
    lineHeight:14
  },
  cardNav: {
    fontSize: udyamitaTheme.themeFontSizeLabel,
    color: '#fff',
  },
  greenbtn:{
    backgroundColor:udyamitaTheme.beeAppColor,
    height:48,
  width:'100%',

alignItems:'center',
paddingLeft:20,
paddingRight:20,
  flexDirection:'row',
  justifyContent:'space-between',
  borderRadius:6
  }
});
