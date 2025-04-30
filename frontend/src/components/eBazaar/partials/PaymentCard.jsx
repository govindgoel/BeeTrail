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

const PaymentCard = ({paymentLabel,selectedDetail,handleSelectedOption,navigation}) => {
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
            {paymentLabel}
          </CustomText>
        </>
      ),
      value: paymentLabel,
    },
  ];

 
  return (
    <>
      <View style={styles.mainContainer}>
        <View style={styles.addressInfo}>
          <RadioForm animation={true}>
            {radioOptions.map((option, index) => (
              <>
               <RadioButton labelHorizontal={true} key={index} >
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
              
              </>
             
            ))}
            
          </RadioForm>
          
        </View>
       
      </View>
      
    </>
  );
};

export default PaymentCard;

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
