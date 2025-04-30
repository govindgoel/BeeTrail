/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {udyamitaTheme} from '../../config/styles/udyamitaTheme';
import CustomHeader from '../../components/reusable/generic/CustomHeader';
import {useTranslation} from 'react-i18next';
import {
  getToken,
  getUser,
  getValueByKey,
  storeUser,
} from '../../helpers/UserData';
 import {APP_API_USER_URL} from '@env';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';
import CustomText from '../../components/reusable/CustomText';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const EnterpriseSelection = ({navigation, route}) => {
  const PAGE_ACTION =
    route?.params?.PAGE_ACTION === 'CREATION' ? 'CREATION' : 'UPDATION';

  const {t, i18n} = useTranslation();

  const enterpriseData = [
    {
      id: '0',
      name: t('beekeeping'),
      imageSource: require('../../assets/images/Beekeeping.png'),
      value: 'Beekeeping/Apiculture',
    },
    {
      id: '1',
      name: t('otherEnterprise'),
      imageSource: require('../../assets/images/Otherenterprises2.png'),
      value: 'Other Enterprise',
    },
  ];

  useFocusEffect(
    React.useCallback(() => {
      const getEnterprise = async () => {
        const userInfo = await getUser();
        if (userInfo && userInfo.userInfo && userInfo.userInfo.businessIdea) {
          setSelectedEnterprise(userInfo.userInfo.businessIdea);
        }
      };
      if (PAGE_ACTION !== 'CREATION') {
        getEnterprise();
      }
    }, []),
  );

  const [selectedEnterprise, setSelectedEnterprise] = useState(null);

  const updateEnterpriseSelection = async businessIdea => {
    const token = await getValueByKey('token');
    const config = {headers: {Authorization: 'Bearer ' + token}};
    await axios
      .put(`${APP_API_USER_URL}/user/profile`, {businessIdea}, config)
      .then(data => {
        const userInfo = JSON.parse(JSON.stringify(data.data));
        storeUser(userInfo);
        const userInfoDoc = userInfo.userInfo;

        let PROFILE_STAGE = 'ENTERPRISE_SELECTION';
        if (userInfoDoc && userInfoDoc.businessIdea) {
          PROFILE_STAGE = 'PROFILE_CREATION';
          if (
            userInfoDoc.name &&
            userInfoDoc.gender &&
            userInfoDoc.operatingEnterpriseSince &&
            userInfoDoc.address &&
            userInfoDoc.address.state &&
            userInfoDoc.address.district
          ) {
            PROFILE_STAGE = 'COMPLETE';
          }
        }
        navigation.goBack();
      })
      .catch(err => {
        console.log('Error while updating enterprise:', err);
      });
  };
  const handleEnterpriseSelect = async id => {
    setSelectedEnterprise(id);
    const businessIdea = enterpriseData[id].value;
    if (PAGE_ACTION === 'CREATION') {
      navigation.navigate('EnterpriseSelectionLoader', {
        firstText: t('justAFewMoments'),
        secondText: t('weAreStoringYourData'),
        loader: true,
        LOADER_ACTION: 'UPDATE_ENTERPRISE_SELECTION',
        // initFunction: updateEnterpriseSelection,
        // initFunctionParams: [businessIdea],
        reqBody: {businessIdea},
      });
    } else {
      updateEnterpriseSelection(businessIdea);
    }
  };
  const handleBackPress = () => {
    navigation.goBack();
  };
  const splitNameIntoLines = name => {
    const words = name.split(' ');
    if (words.length > 1) {
      return words.join('\n');
    } else if (name.includes('/')) {
      const [firstWord, rest] = name.split('/');
      return `${firstWord}\n${rest}`;
    } else {
      return name;
    }
  };

  return (
    <View
      style={{
        backgroundColor: udyamitaTheme.themeBgColor,
        height: windowHeight,
      }}>
      <CustomHeader
        title={t('selectEnterprise')}
        showBackIcon={true}
        onBackPress={handleBackPress}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={styles.scrollContent}>
        {enterpriseData.map(enterprise => (
          <TouchableOpacity
            key={enterprise.id}
            style={[
              styles.enterpriseCard,
              selectedEnterprise === enterprise.value && {
                backgroundColor: udyamitaTheme.primaryColor,
              },
            ]}
            onPress={() => handleEnterpriseSelect(enterprise.id)}>
            <Image
              source={enterprise.imageSource}
              style={styles.enterpriseImage}
            />
            <View style={styles.textContainer}>
              <CustomText
                style={[
                  styles.enterpriseName,
                  selectedEnterprise === enterprise.value && {color: 'white'},
                ]}
                type="btn"
                >
                {splitNameIntoLines(enterprise.name)}
              </CustomText>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: udyamitaTheme.themeBgColor,
    //alignItems:'center'
  },
  scrollContent: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  enterpriseCard: {
    width: '100%',
    marginVertical: 10,
    flexDirection: 'row',
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: udyamitaTheme.borderStyleColor,
    alignSelf: 'center',
    paddingRight: 10,
    //height: 128,
    backgroundColor: '#fff',
  },
  enterpriseImage: {
    width: 180,
    height: 151,
    //resizeMode: 'contain',
  },
  enterpriseName: {
    color: udyamitaTheme.textColor,
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    fontSize: udyamitaTheme.themeFontSizeButton,
    paddingLeft: 30,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',

    flexWrap: 'wrap',
  },
});

export default EnterpriseSelection;
