import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    FlatList,
    BackHandler
  } from 'react-native';
  import React, {useState, useEffect,useCallback} from 'react';
  import {useTranslation} from 'react-i18next';
  import {udyamitaTheme} from '../../config/styles/udyamitaTheme';
  import {useFocusEffect,useIsFocused} from '@react-navigation/native';
  import { getUser } from '../../helpers/UserData';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import {storeValueByKey} from '../../helpers/UserData';
import CustomText from '../../components/reusable/CustomText';
  const RoleSelection = ({navigation}) => {

    const {t} = useTranslation();
  
    const [selectedRole, setSelectedRole] = useState(null);
    const  isFocused = useIsFocused();

    useEffect(() => {
      getInitialUserRole();
     
    }, []);
    const cardData = [
      {
        id: '1',
        imageUrl: require('../../assets/images/BeekeeperOnboarding.png'),
      text: t('iAmABeekeeper'),
      navigateTo: 'RequestOtp',
      borderclr: '#FEC251',
      onSelectingColor: '#FEC251',
      imgHeight: 151,
      role: 'beekeeper',
    },
    // {
    //   id: '2',
    //   imageUrl: require('../../assets/images/BeeMitra.png'),
    //   text: t('iAmABeeMitra'),
    //   navigateTo: 'TryAgain',
    //   // navigateTo: 'DashboardForBeeMitra',
    //   borderclr: '#E56869',
    //   onSelectingColor: '#E56869',
    //   imgHeight: 125,
    //   role: 'bee-mitra',
    // },
    {
      id: '3',
      imageUrl: require('../../assets/images/Farmer.png'),
      text: t('iNeedBeesForCropPollination'),
      navigateTo: 'RequestOtp',
      borderclr: udyamitaTheme.beeAppColor,
      onSelectingColor: udyamitaTheme.beeAppColor,
      imgHeight: 120,
      role: 'farmer',
    },
    ];

    const getInitialUserRole = async () => {
      try {
        const storedUserRole = await AsyncStorage.getItem('selectedRole');
        setSelectedRole(storedUserRole || null)
       
        return storedUserRole || ""; 
      } catch (error) {
        console.error('Error retrieving initial user role:', error);
        return ''; 
      }
    };
    const renderItem = ({item, index}) => {
      const isSelected = selectedRole === item.role;
  
      return (
        <TouchableOpacity
          style={[
            styles.cardContainer,
            {
              borderColor: item.borderclr,
              backgroundColor: isSelected ? item.onSelectingColor : '#fff',
            },
          ]}
          onPress={() => {
            setSelectedRole(item.role);
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              marginLeft: 3,
              borderRadius: 6,
              marginRight: 5,
              height: 120,
            }}>
            <Image
              source={item.imageUrl}
              style={[styles.cardImage, {height: item.imgHeight}]}
            />
          </View>
  
          <CustomText
          type='label'
            style={[
              styles.cardText,
              {color: isSelected ? '#fff' : udyamitaTheme.textColor},
            ]}>
            {item.text}
          </CustomText>
        </TouchableOpacity>
      );
    };
  
    const handleContinue = async () => {
      if (selectedRole !== null) {
        const selectedRoleData = cardData.find(
          item => item.role === selectedRole,
        );
        await storeValueByKey('selectedRole', selectedRoleData.role);
        navigation.navigate(selectedRoleData.navigateTo, {role:selectedRoleData.role});
      } else {
        console.error("Please select a role before continuing.");
      }
    };

    useFocusEffect(
      React.useCallback(() => {
        const onBackPress = () => {
          navigation.navigate('RequestOtp')
          return true;
        };
      
        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          onBackPress,
        );
        return () => backHandler.remove();
      }, [isFocused]),
    );
  
    return (
      <View style={styles.mainContainer}>
        <CustomText style={styles.mainTitle} type='bh'> {t('whoAreYou')}</CustomText>
        <FlatList
          data={cardData}
          renderItem={renderItem}
          keyExtractor={item => item.id?.toString()}
        />
        <TouchableOpacity
          style={[
            styles.arrowButtonStyle,
            {
              backgroundColor:
                (selectedRole === null )
                  ? udyamitaTheme.disabledButtonColor
                  : udyamitaTheme.primaryColor,
            },
          ]}
          onPress={handleContinue}
          disabled={selectedRole === null}>
          <CustomText style={styles.arrowButtonLabel} type='btn'>{t('continue')}</CustomText>
        </TouchableOpacity>
      </View>
    );
  };
  
  export default RoleSelection;
  
  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: '#fff',
      paddingTop: 60,
      paddingLeft: 20,
      paddingRight: 20,
      paddingBottom: 10,
    },
    mainTitle: {
      fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
      color: udyamitaTheme.textColor,
      fontSize: 22,
      lineHeight: 29,
      marginBottom: 10,
    },
    cardContainer: {
      borderWidth: 1,
      borderRadius: 6,
      paddingRight: 10,
      marginBottom: 30,
      height: 128,
      flexDirection: 'row',
      alignItems: 'center',
    },
    cardImage: {
      width: 123,
      height: 128,
      // resizeMode:'contain',
  
      zIndex: 1,
    },
    cardText: {
      fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
      fontSize: udyamitaTheme.themeFontSizeModalLabel,
      color: udyamitaTheme.textColor,
      flexShrink: 1,
    },
    arrowButtonStyle: {
      margin: 10,
      backgroundColor: udyamitaTheme.primaryColor,
      width: '100%',
      height: 52,
      borderRadius: 5,
      alignSelf: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    arrowButtonLabel: {
      color: 'white',
      fontSize: udyamitaTheme.themeFontSizeButton,
      alignSelf: 'center',
      marginLeft: 10,
      fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    },
  });
  