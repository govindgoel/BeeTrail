import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React,{useEffect,useState} from 'react';
import {udyamitaTheme} from '../../config/styles/udyamitaTheme';
import CustomText from '../reusable/CustomText';
import moment from 'moment';
import {useTranslation} from 'react-i18next';
import MoreOptions from '../harvest/partials/MoreOptions';
import { formatIndianMoney } from '../../helpers/utils';
const ExpenseCard = ({totalAmount, category,dateTime,handleDeleteExpenseLogInDisk,apiaryId,item,navigation,userInfo}) => {
  const {t} = useTranslation();
  const [isEdit, setIsEdit] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isMoreOptionsModalVisible, setMoreOptionsModalVisible] =
  useState(false);
  const handleCloseMoreOptions = () => {
    setMoreOptionsModalVisible(false);
  };
  const handleOpenMoreOptions = item => {
    setMoreOptionsModalVisible(true);
    setSelectedItem(item);
  };
  const handleEdit = (item,viewonly=false) => {
    console.log('viewonly',viewonly);
    
    setIsEdit(true);
    setSelectedItem(item); // Set the selected item
    handleCloseMoreOptions()
    navigation.navigate('AddExpense', {productInfo: item, isEdit: true,apiaryId,viewonly});
  };
  // const formatIndianMoney = amount => {
  //   const amountStr = String(amount);
  //   const hasDecimal = amountStr.includes('.');

  //   if (amountStr.length > 2) {
  //     const [integerPart, decimalPart] = amountStr.split('.');

  //     const formattedIntegerPart = integerPart.replace(
  //       /\B(?=(\d{2})+(?!\d))/g,
  //       ',',
  //     );

  //     return `₹ ${formattedIntegerPart}`;
  //   }

  //   return `₹ ${amount}`;
  // };

  const formattedAmount = formatIndianMoney(totalAmount);
  const categoryOptions = [
    {
      id: '1',
      label: t('equipmentTools'),
      value: 'Equipment-Tools',
    },
    {
      id: '2',
      label: t('feedForColony'),
      value: 'Feed-for-colony',
    },

    {
      id: '3',
      label: t('beeHives'),
      value: 'Bee-Hives',
    },
    {
      id: '4',
      label: t('hiveRepair'),
      value: 'Hive-Repair',
    },
    {
      id: '5',
      label: t('medicine'),
      value: 'Medicine',
    },
    {
      id: '6',
      label: t('travelTransport'),
      value: 'Travel/Transport',
    },
  ];
  const matchingOption = categoryOptions.find(option => option.value === category);
  const categoryLabel = matchingOption ? matchingOption.label : category;

  const matchingOptionLabel = categoryOptions.find(option => option.value === selectedItem?.spent_on);
  const categoryTitle = matchingOptionLabel ? matchingOptionLabel.label : selectedItem?.spent_on;
  return (
    <>
      <TouchableOpacity style={styles.cardContainer} onPress={() => userInfo && (userInfo._id == item.created_by || userInfo?.userRoles.includes('bee_mitra') )?handleOpenMoreOptions(item):handleEdit(item,true)}>
      <View>
        <View style={styles.rowStyle}>
          <Image
            source={require('../../assets/images/Expense.png')}
            style={styles.moneyIcon}
          />

          <CustomText style={styles.amountText} type="mlabel">
            {' '}
            {formattedAmount}
          </CustomText>
        </View>
        <CustomText type="label" style={styles.productText}>{categoryLabel}</CustomText>
        <CustomText type="label" style={styles.productText}>{moment(item?.created_at).format('hh:mm A')}{' '},{' '}{moment(dateTime).format('DD MMM YYYY')}</CustomText>
      </View>

     {userInfo && (userInfo._id == item.created_by || userInfo?.userRoles.includes('bee_mitra') ) &&  <TouchableOpacity onPress={() => handleOpenMoreOptions(item)}>
        <Image
          source={require('../../assets/images/MorePink.png')}
          style={{width: 20, height: 20}}
        />
      </TouchableOpacity>}
    </TouchableOpacity>
    <MoreOptions  
      visible={isMoreOptionsModalVisible}
      title={t('forCategory', {
        amount: selectedItem?.sum_spent,
        category: categoryTitle
      }) || ''}
      onCancel={() => handleCloseMoreOptions()}
      otherTextColor={
        isMoreOptionsModalVisible ? '#ff0000' : udyamitaTheme.beeAppColor
      }
      subTitle={`${moment(selectedItem?.created_at).format(
        'hh:mm A',
      )}, ${moment(selectedItem?.date_of_expense).format('DD MMM YYYY')}`}
    
      otherText={t('delete')}
      onEdit={() => handleEdit(selectedItem)}
      onDelete={() =>{ handleDeleteExpenseLogInDisk(selectedItem?._id)
        handleCloseMoreOptions()
      }}
      cancelInGrey={isMoreOptionsModalVisible ? false : true}
      otherBackgroundColor={
        isMoreOptionsModalVisible
          ? 'rgba(255, 0, 0, 0.1)'
          : udyamitaTheme.beeAppPrimaryBgColor
      }
      userInfo={userInfo}
      selectedItem={selectedItem}
      />

    </>
  
  );
};

export default ExpenseCard;

const styles = StyleSheet.create({
  cardContainer: {
    borderWidth: 1,
    borderColor: udyamitaTheme.borderStyleColor,

    marginLeft: 20,
    marginRight: 20,
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 16,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moneyIcon: {
    height: 25,
    width: 43,
  },
  amountText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    color: '#F12F2F',
    marginLeft: 10,
    fontSize: udyamitaTheme.themeFontSizeModalLabel,
  },
  rowStyle: {
    flexDirection: 'row',
    //justifyContent: 'center',
  },
  productText:{
    color:udyamitaTheme.textColor,
    fontSize:udyamitaTheme.themeFontSizeModalLabel,
    fontFamily:udyamitaTheme.mainThemeFontFamilySemiBold,
    marginTop:8
  }
});
