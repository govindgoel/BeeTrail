import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React,{useEffect,useState} from 'react';
import {udyamitaTheme} from '../../config/styles/udyamitaTheme';
import CustomText from '../reusable/CustomText';
import moment from 'moment';
import MoreOptions from '../harvest/partials/MoreOptions';
import {useTranslation} from 'react-i18next';
import {APP_API_MENTOR_VAlUECHAIN_SERVICES} from '@env';
import { getValueByKey } from '../../helpers/UserData';
import axios from 'axios';
import { formatIndianMoney } from '../../helpers/utils';
const IncomeCard = ({totalAmount, product,dateTime,handleDeleteIncomeLogInDisk,item,navigation,apiaryId,userInfo}) => {

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
  const productOptions = [
    {
      id: '1',
      label: t('honey'),
      value: 'honey',
    
    },
    {
      id: '2',
      label: t('beeswax'),
      value: 'beeswax',
    
    },
    {
      id: '3',
      label: t('pollen'),
      value: 'pollen',
     
    },
    {
      id: '4',
      label: t('propolis'),
      value: 'propolis',
      
    },
    {
      id: '5',
      label: t('beevenom'),
      value: 'beevenom',
      
    },
    {
      id: '6',
      label: t('royalJelly'),
      value: 'royal-jelly',
      
    },
  ];
  const matchingOption = productOptions.find(option => option.value === product);
  const productLabel = matchingOption ? matchingOption.label : product;
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
  const handleEdit = (item,viewonly=false) => {
    setIsEdit(true);
    setSelectedItem(item); // Set the selected item
    handleCloseMoreOptions()
    navigation.navigate('AddIncome', {productInfo: item, isEdit: true,apiaryId,viewonly});
  };
  const matchingOptionLabel = productOptions.find(option => option.value === selectedItem?.product_details?.commodity);
  const productLabelForModal = matchingOptionLabel ? matchingOptionLabel.label : selectedItem?.product_details?.commodity;
  return (
    <>
       <TouchableOpacity style={styles.cardContainer} onPress={() =>userInfo && (userInfo._id == item.created_by || userInfo?.userRoles.includes('bee_mitra') ) ?  handleOpenMoreOptions(item) : handleEdit(item,true)}>
      <View>
        <View style={styles.rowStyle}>
          <Image
            source={require('../../assets/images/IncomeGreen.png')}
            style={styles.moneyIcon}
          />

          <CustomText style={styles.amountText} type="mlabel">
            {' '}
            {formattedAmount}
          </CustomText>
        </View>
        <CustomText type="label" style={styles.productText}>{t('saleOf', {productLabel})}</CustomText>
        <CustomText type="label" style={styles.productText}>{moment(item?.created_at).format('hh:mm A')}{' '},{' '}{moment(dateTime).format('DD MMM YYYY')}</CustomText>
      </View>

     {userInfo && (userInfo._id == item.created_by || userInfo?.userRoles.includes('bee_mitra') ) &&  <TouchableOpacity onPress={() => handleOpenMoreOptions(item)}>
        <Image
          source={require('../../assets/images/MoreGreen.png')}
          style={{width: 20, height: 20}}
        />
      </TouchableOpacity>}
    </TouchableOpacity>
    <MoreOptions
        visible={isMoreOptionsModalVisible}
        title={t('forSaleOfProduct', {
          amount: selectedItem?.earned_amount,
          product: productLabelForModal
        }) || ''}
        
        onCancel={() => handleCloseMoreOptions()}
        otherTextColor={
          isMoreOptionsModalVisible ? '#ff0000' : udyamitaTheme.beeAppColor
        }
       
        subTitle={`${moment(selectedItem?.created_at).format(
          'hh:mm A',
        )}, ${moment(selectedItem?.harvested_date).format('DD MMM YYYY')}`}
      
        otherText={t('delete')}
        onEdit={() => handleEdit(selectedItem)}
        onDelete={() => {handleDeleteIncomeLogInDisk(selectedItem?._id)
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

export default IncomeCard;

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
    color: udyamitaTheme.beeAppColor,
    marginLeft: 10,
    fontSize: udyamitaTheme.themeFontSizeModalLabel,
  },
  rowStyle: {
    flexDirection: 'row',
   // justifyContent: 'center',
  },
  productText:{
    color:udyamitaTheme.textColor,
    fontSize:udyamitaTheme.themeFontSizeModalLabel,
    fontFamily:udyamitaTheme.mainThemeFontFamilySemiBold,
    marginTop:8
  }
});
