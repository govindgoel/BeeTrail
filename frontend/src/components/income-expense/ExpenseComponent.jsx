/* eslint-disable react-hooks/exhaustive-deps */
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
import ExpenseCard from './ExpenseCard';
import { getAllExpenses } from '../../helpers/services/realm/disk-data-fetch/Expenses';
import {getToken, getUser, getValueByKey} from '../../helpers/UserData';
import axios from 'axios';
import {useIsFocused} from '@react-navigation/native';
import {APP_API_MENTOR_VAlUECHAIN_SERVICES} from '@env';
import { useNetInfo } from '@react-native-community/netinfo';
const ExpenseComponent = ({navigation, apiaryId,expenseData,loading, getdata}) => {
  const isFocused = useIsFocused();
  const realm = useRealm();
  const {t} = useTranslation();
  const {isConnected} = useNetInfo();
  const [userInfo, setUserInfo] = useState(null)

  const getdata2=async()=>{
    let user =await getUser()
    setUserInfo(user?.userInfo)
    user=user?.userInfo
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

        realm.create('ExpenseLogs', {_id, ...updateObject}, 'modified'); // Optionally update the timestamp
       
        ToastAndroid.showWithGravity(
          t('expenseDataDeleted'),
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        getdata();
        return {
          success: true,
          message: 'Expense marked as deleted successfully.',
        };
      });
    } catch (error) {
      return {success: false, message: error.message};
    }
  };

  const handleDeleteExpenseLogInDisk = async id => {
    let user =await getUser()
    user=user?.userInfo
   
    if(user?.userRoles.includes('bee_mitra') && isConnected){
      handleDeleteIncomeLog(id)
    }else{
      softDeleteIncome(id)
    }
   };

   const handleDeleteIncomeLog = async id => {
    const token = await getValueByKey('token');
    const config = {headers: {Authorization: 'Bearer ' + token}};

    axios
      .delete(
        `${APP_API_MENTOR_VAlUECHAIN_SERVICES}/beekeeping/expense-log/${id}`,
        config,
      )
      .then(response => {
        console.log(response.data);
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
          color="#F55959"
          size={40}
          style={styles.loaderStyle}
        />
      ) : expenseData.length === 0 ? (
        <View style={styles.NoContent}>
          <Image
            source={require('../../assets/images/Expense.png')}
            style={styles.noContentImg}
          />
          <CustomText type="mlabel" style={styles.bigText}>
            {t('youHavenLoggedAnyExpenseYet')}
          </CustomText>
          <CustomText type="label" style={styles.smallText}>
            {t('startLoggingToManageYourMoney')}
          </CustomText>
        </View>
      ) : (
        <FlatList
          data={expenseData}
          keyExtractor={item => item._id}
          renderItem={({item}) => (
            <ExpenseCard
              totalAmount={item.sum_spent}
              category={item.spent_on}
              dateTime={item.date_of_expense}
              apiaryId={apiaryId}
              item={item}
              handleDeleteExpenseLogInDisk={handleDeleteExpenseLogInDisk}
              navigation={navigation}
              userInfo={userInfo}
            />
          )}
        />
      )}
      <FlatList />
      <TouchableOpacity
        style={styles.greenBtn}
        onPress={() => navigation.navigate('AddExpense', {apiaryId})}>
        <CustomText
          style={[styles.greenBtnText, {marginRight: 10}]}
          type="mlabel">
          -
        </CustomText>
        <CustomText style={styles.greenBtnText} type="label">
          {t('addExpense')}
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

export default ExpenseComponent;

const styles = StyleSheet.create({
  greenBtn: {
    backgroundColor: '#F55959',
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
  loaderStyle: {
    marginTop: '50%',
  },
  noContentImg: {
    width: 154,
    height: 89,
  },
  NoContent: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '30%',
    marginLeft:10,
    marginRight:10,
  },
  bigText: {
    color: udyamitaTheme.textColor,
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    paddingTop: 10,
    paddingBottom: 5,
    textAlign:'center'
  },
  smallText: {
    color: udyamitaTheme.textColor,
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    textAlign:'center'
  },
});
