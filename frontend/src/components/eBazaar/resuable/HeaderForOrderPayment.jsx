import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import React from 'react'
import { BackIcon } from '../../../assets/Icons/IconSvg'
import CustomTitle from '../../community/reusable/CustomTitle'
import { udyamitaTheme } from '../../../config/styles/udyamitaTheme'
import OrderPaymentSteps from './OrderPaymentSteps'
import { useTranslation } from 'react-i18next'
import CustomText from '../../reusable/CustomText'
const HeaderForOrderPayment = ({navigation,title, stepNo}) => {
  const {t} = useTranslation();
  return (
    <View style={{elevation: 10, backgroundColor: '#FFF',borderBottomLeftRadius:40,borderBottomRightRadius:40}}>
       <TouchableOpacity
        style={styles.header}
        onPress={() => navigation.goBack()}>
     
        <BackIcon />
        <CustomText style={styles.titleStyle} type='mlabel'>{title}</CustomText>
        </TouchableOpacity>
        <OrderPaymentSteps stepNo={stepNo}/>
        <CustomTitle
        title={
          stepNo === 1
            ? t('address')
            : stepNo === 2
            ? t('selectAPaymentMethod')
            : t('confirmOrder')
           
        }
      />
      
    </View>
  )
}

export default HeaderForOrderPayment

const styles = StyleSheet.create({
    header: {
      paddingVertical: 20,
      paddingLeft: 20,
      flexDirection: 'row',
     
      //alignItems: 'center',
      // borderBottomWidth: 1,
      // borderColor: 'grey',
    },
    titleStyle: {
      fontSize:udyamitaTheme.themeFontSizeModalLabel,
      marginLeft: 20,
     fontFamily:udyamitaTheme.mainThemeFontFamilyBold,
     color:udyamitaTheme.textColor,
     marginTop:-5
    },
  });