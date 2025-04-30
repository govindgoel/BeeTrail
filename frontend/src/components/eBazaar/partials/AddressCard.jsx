import React,{useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity,Image} from 'react-native';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import { useTranslation } from 'react-i18next';
import CustomAlertToDelete from '../../reusable/generic/CustomAlertToDelete';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import { getToken } from '../../../helpers/UserData';
import Toast from 'react-native-simple-toast';
import axios from 'axios';
import {APP_API_ORDER_SERVICES} from '@env';
import CustomText from '../../reusable/CustomText';


const AddressCard = ({homeLabel, nameLabel, addressLabel,selectedDetail,handleSelectedOption,addressData,navigation}) => {
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const {t} = useTranslation()
  const radioOptions = [
    {
      label: (
        <>
          <CustomText
          type='btn'
            style={{
              color: udyamitaTheme.textColor,
              fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
              fontSize: udyamitaTheme.themeFontSizeButton,
              lineHeight: 24,
            }}>
            {homeLabel}
          </CustomText>
          {"\n"}
          <CustomText
          type='label'
            style={{
              color: udyamitaTheme.textColor,
              fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
              fontSize: udyamitaTheme.themeFontSizeLabel,
              lineHeight: 24,
            }}>
            {nameLabel}
          </CustomText>
          {"\n"}
          <CustomText
          type='label'
          numberOfLines={2}
            style={{
              color: udyamitaTheme.textColor,
              fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
              fontSize: udyamitaTheme.themeFontSizeLabel,
              lineHeight: 24,
            
            }}>
              {addressLabel.address},{addressLabel.town},{addressLabel.district},{addressLabel.state},{addressLabel.pincode}
             
          </CustomText>
        </>
      ),
      value: addressData,
    },
  ];

  const handleCancel = () => {
    setDeleteModalVisible(false);
  };
  const deleteAddress = async () => {
    
    const token = await getToken();
    const config = {headers: {Authorization: 'Bearer ' + token}};
    await axios
      .put(`${APP_API_ORDER_SERVICES}/address/delete/${addressData?._id}`, {},config)
      .then(data => {
            navigation.navigate("PlaceOrder");

          }).catch((err) => {console.log("Error in delete address:",err)})

  }
  return (
    <>
      <View style={styles.mainContainer}>
        <View style={styles.addressInfo}>
          <RadioForm animation={true}>
            {radioOptions.map((option, index) => (
              <>
               <RadioButton labelHorizontal={true} key={index}>
                <RadioButtonInput
                  obj={option}
                  index={index}
                  isSelected={selectedDetail === option.value}
                  onPress={() => handleSelectedOption(option.value)}
                  buttonSize={9}
                  buttonOuterSize={20}
                  borderWidth={1}
                  buttonInnerColor={
                    selectedDetail === option.value
                      ? udyamitaTheme.primaryColor
                      : '#e74c3c'
                  }
                  buttonOuterColor={
                    selectedDetail === option.value
                      ? udyamitaTheme.primaryColor
                      : udyamitaTheme.borderStyleColor
                  }
                />
                <RadioButtonLabel
                  obj={{label: option.label, value: option.value}}
                  index={index}
                  labelHorizontal={true}
                  onPress={() => handleSelectedOption(option.value)}
                />
              </RadioButton>
              {selectedDetail === option.value && (
                <View style={styles.iconContainer}>
                  <TouchableOpacity style={styles.iconBtn} onPress={() => setDeleteModalVisible(true)}>
                   
                   <Image source={require('../../../assets/images/Delete.png')} style={{width:24,height:24}}/>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate("AddAddress",{ data:addressData })}>
                   <Image source={require('../../../assets/images/Edit_black.png')} style={{width:24,height:24}}/>
                    <Text style={styles.iconText}>{t('editAddress')}</Text>
                  </TouchableOpacity>
                </View>
              )}
              </>
             
            ))}
            
          </RadioForm>
          
        </View>
       
      </View>
      <CustomAlertToDelete
        visible={isDeleteModalVisible}
        title={t('deleteAddress')}
        message={t('areYouSureWantToDeleteAddress')}
        onCancel={handleCancel}
        onConfirm={() => deleteAddress()}
        otherText={t('yesProceed')}
      />
    </>
  );
};

export default AddressCard;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: udyamitaTheme.borderStyleColor,
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 6,
    padding: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginLeft:40,
    marginRight:40
  },
  iconBtn:{
    backgroundColor:'#F1F1F1',
    padding:10,
    borderRadius:6,
    flexDirection:'row',
    alignItems:'center'
  },
  iconText:{
    fontFamily:udyamitaTheme.mainThemeFontFamilySemiBold,
    color:'#000'
  }
});
