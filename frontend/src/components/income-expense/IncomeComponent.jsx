import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import {useRealm, Realm} from '@realm/react';
import React, {useState, useEffect} from 'react';
import {udyamitaTheme} from '../../config/styles/udyamitaTheme';
import {useTranslation} from 'react-i18next';
import CustomText from '../reusable/CustomText';
import IncomeCard from './IncomeCard';
import {useIsFocused} from '@react-navigation/native';
import {APP_API_MENTOR_VAlUECHAIN_SERVICES} from '@env';
import {getAllIncomes} from '../../helpers/services/realm/disk-data-fetch/Incomes';
import { getToken, getUser, getValueByKey } from '../../helpers/UserData';
import { useNetInfo } from '@react-native-community/netinfo';
import axios from 'axios';
const IncomeComponent = ({navigation, apiaryId,incomeData, loading,getdata}) => {
  const [userInfo, setUserInfo] = useState(null)
  const {t} = useTranslation();
  const realm = useRealm();
  const isFocused = useIsFocused();
  const {isConnected} = useNetInfo();

  const getdata2=async()=>{
    let user =await getUser()
    setUserInfo(user?.userInfo)
  }

  useEffect(() => {
    if (apiaryId) {
      getdata2()
    }
  }, [isFocused, apiaryId,isConnected]);


  const softDeleteIncome = async _id => {
    try {
      //const realm = await realmInstance;

      realm.write(async () => {
        const updateObject = {
          is_deleted: true,
          updated_at: new Date().toISOString(),
          sync_details: {
            needSync: true, // Default value set to true
            isSynced: false, // Default isSynced to false, synchedAt to empty string
          },
        };

        realm.create('IncomeLogs', {_id, ...updateObject}, 'modified'); // Optionally update the timestamp
       
        ToastAndroid.showWithGravity(
          t('incomeDataDeleted'),
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        getdata();
        return {
          success: true,
          message: 'Income marked as deleted successfully.',
        };
      });
    } catch (error) {
      return {success: false, message: error.message};
    }
  };
  const handleDeleteIncomeLogInDisk = async id => {
    let user =await getUser()
    user=user?.userInfo
    console.log(user?.userRoles,'sacsa c sc');
    if(user?.userRoles.includes('bee_mitra') && isConnected){
      handleDeleteIncomeLog(id)
    }else{
      softDeleteIncome(id);
    }
   };

  const handleDeleteIncomeLog = async id => {
    const token = await getValueByKey('token');
    const config = {headers: {Authorization: 'Bearer ' + token}};

    axios
      .delete(
        `${APP_API_MENTOR_VAlUECHAIN_SERVICES}/beekeeper-income-log/${id}`,
        config,
      )
      .then(response => {
        // console.log(response.data);
        if (response.status === 200 && !response.data.error ) {
          ToastAndroid.showWithGravity(
            t('incomeDataDeleted'),
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
          getdata();
        }
      })
      .catch(err => console.log('ERR while deleteing harvest', err));
  };

  
  
  return (
    <View style={styles.mainContainer}>
      {loading ? (
        <ActivityIndicator
        color={udyamitaTheme.beeAppColor}
        size={40}
        style={styles.loaderStyle}
        />
      ):incomeData.length === 0 ? (
        <View style={styles.NoContent}>
        <Image source={require('../../assets/images/IncomeGreen.png')} style={styles.noContentImg}/>
        <CustomText type="mlabel" style={styles.bigText}>{t('youHavenLoggedAnyIncomeYet')}</CustomText>
        <CustomText type="label" style={styles.smallText}>{t('startLoggingToManageYourMoney')}</CustomText>
        </View>
      ):(
    
      <FlatList
        data={incomeData}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <IncomeCard
            totalAmount={item.earned_amount}
            product={item.product_details?.commodity}
            dateTime={item.date_of_earning}
            // handleDeleteIncomeLog={handleDeleteIncomeLog}
            handleDeleteIncomeLogInDisk={handleDeleteIncomeLogInDisk}
            item={item}
            apiaryId={apiaryId}
            navigation={navigation}
            userInfo={userInfo}
          />
        )}
      />
      )}
      <FlatList/>
      <TouchableOpacity
        style={styles.greenBtn}
        onPress={() => navigation.navigate('AddIncome', {apiaryId})}>
        <Image
          source={require('../../assets/images/Add_icon_white.png')}
          style={{height: 28, width: 28}}
        />
        <CustomText style={styles.greenBtnText} type="label">
          {t('addIncome')}
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

export default IncomeComponent;

const styles = StyleSheet.create({
  greenBtn: {
    backgroundColor: udyamitaTheme.beeAppColor,
    height: 52,
    margin: 20,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  greenBtnText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    color: '#fff',
    fontSize: udyamitaTheme.themeFontSizeLabel,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: udyamitaTheme.themeBgColor,
  },
  NoContent:{
    justifyContent:'center',
    alignItems:'center',
    marginTop:'30%'
  },
  bigText:{
    color:udyamitaTheme.textColor,
    fontFamily:udyamitaTheme.mainThemeFontFamilyBold,
    paddingTop:10,
    paddingBottom:5,
    textAlign:'center'
  },
  smallText:{
    color:udyamitaTheme.textColor,
    fontFamily:udyamitaTheme.mainThemeFontFamilySemiBold,
    textAlign:'center'
    
  },
  noContentImg:{
    width:154,
    height:89
  },
  loaderStyle:{
    marginTop:'50%'
  }
});
