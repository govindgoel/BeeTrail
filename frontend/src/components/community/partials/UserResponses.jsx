import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import CustomHeader from '../../reusable/generic/CustomHeader';
import Toast from 'react-native-simple-toast';
import axios from 'axios';
import {APP_API_COMMUNITY_URL} from '@env';
import {getValueByKey} from '../../../helpers/UserData';
import CustomText from '../../reusable/CustomText';
const UserResponses = ({navigation, route}) => {
  const {t} = useTranslation();
  const [qAndAns, setQandAns] = useState([]);
  const [communityId, setCommunityId] = useState(null);
  const [requestedUserId, setRequestedUserId] = useState(null);

  const handleBackPress = () => {
    navigation.goBack();
  };

  useEffect(() => {
    setQandAns(route?.params?.data?.responseToQuestions);
    setCommunityId(route?.params?.data?.communityId);
    setRequestedUserId(route?.params?.data?.userId?._id);
  }, []);
  const handleReject = async userId => {
    const token = await getValueByKey('token');
    const config = {headers: {Authorization: 'Bearer ' + token}};

    await axios
      .put(
        `${APP_API_COMMUNITY_URL}/community/approveReq/${communityId}/${userId}/reject`,
        {},
        config,
      )
      .then(response => {
    
        if (response.status === 200) {
          Toast.show('You declined user request', Toast.SHORT);
          navigation.goBack();
        }
      })
      .catch(err => {
        console.log('error while approving request', err?.response?.data);
      });
  };
  const handleAccept = async id => {
    const token = await getValueByKey('token');
    const config = {headers: {Authorization: 'Bearer ' + token}};
 
    await axios
      .put(
        `${APP_API_COMMUNITY_URL}/community/approveReq/${communityId}/${id}/approve`,
        {},
        config,
      )
      .then(response => {
        if (response.status === 200) {
          Toast.show('You accepted joining request', Toast.SHORT);
          navigation.goBack();
        }
      })
      .catch(err => {
        console.log('error while approving request', err?.response?.data);
      });
  };
  return (
    <View style={styles.mainConatiner}>
      <CustomHeader
        showBackIcon={true}
        onBackPress={handleBackPress}
        title="User response"
      />
      <ScrollView contentContainerStyle={styles.container}>
        {qAndAns.map(qa => (
          <View key={qa.id} style={styles.qaContainer}>
            <CustomText style={styles.questionText} type='label'>{qa.question}</CustomText>
            <CustomText style={styles.answerText} type='label'>{qa.response}</CustomText>
          </View>
        ))}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.rejectButton]}
            onPress={() => handleReject(requestedUserId)}>
            <CustomText style={[styles.buttonText, {color: '#FF0000'}]} type='label'>
            {t('decline')}
            </CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.acceptButton]}
            onPress={() => handleAccept(requestedUserId)}>
            <CustomText style={styles.buttonText} type='label'>{t('accept')}</CustomText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default UserResponses;

const styles = StyleSheet.create({
  mainConatiner: {
    flex: 1,
    backgroundColor: udyamitaTheme.themeBgColor,
  },
  communityName: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    fontSize: udyamitaTheme.themeFontSizeModalLabel,
    textAlign: 'center',
    // marginTop: 7,
    color: 'white',
    marginLeft: 10,
  },
  communityProfileImage: {
    height: 35,
    width: 35,
    borderRadius: 20,
    // borderColor: colors.primaryColor,
    // borderWidth: 1,
    alignSelf: 'center',
    // marginRight: 5,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',

    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 14,
    paddingHorizontal: 16,
    backgroundColor: udyamitaTheme.primaryColor,
  },
  container: {
    padding: 20,
  },
  qaContainer: {
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5,
  },
  questionText: {
    fontSize: udyamitaTheme.themeFontSizeLabel,
    marginBottom: 5,
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    color: udyamitaTheme.textColor,
  },
  answerText: {
    fontSize: udyamitaTheme.themeFontSizeLabel,
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    color: udyamitaTheme.textColor,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    //flex: 1,
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
  },
  acceptButton: {
    backgroundColor: udyamitaTheme.beeAppPrimaryBgColor,
    marginRight: 5,
  },
  rejectButton: {
    backgroundColor: '#FFE5E5',
    marginLeft: 5,
  },
  buttonText: {
    color: udyamitaTheme.beeAppColor,
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    fontSize: udyamitaTheme.themeFontSizeLabel,
  },
});
