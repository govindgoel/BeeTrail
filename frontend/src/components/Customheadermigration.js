import React, {useState, useEffect} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {BackIcon} from './IconSvgs';
import CustomTitle from './CustomTitle';
import ProgressSteps from './ProgressSteps';
import {useTranslation} from 'react-i18next';
import {udyamitaTheme} from '../config/styles/udyamitaTheme';
import {useSelector} from 'react-redux';
import CustomText from './reusable/CustomText';

const CustomHeaderMigration = ({navigation, title,handleBack,clock,messageicon}) => {
  const {t} = useTranslation();
    const [message, setmessage] = useState(10)
  
  return (
    <View style={{backgroundColor: '#fff',borderBottomLeftRadius:20,elevation: 10,borderBottomRightRadius:20,marginBottom:10}}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => handleBack()}>
        <BackIcon />
        <CustomText style={styles.titleStyle} type='mlabel'>{title}</CustomText>
        <View style={{position: 'absolute', right: 10, alignItems: 'flex-end',flex:1,gap:30,flexDirection:'row',marginRight:20}}>

        {clock &&  <TouchableOpacity>
          <Image 
                source={require('../assets/images/clock.png')}
                style={{width: 22.6, height: 22.6 }}
              />
          </TouchableOpacity>}
       {messageicon && <TouchableOpacity style={{position:'relative'}} onPress={() => navigation.navigate('MessageListing')}>
            <Text style={{position:'absolute',top:-8,right:-3,borderRadius:100, padding:2,backgroundColor:'#028454',color:'#FFFFFF',fontSize:8}}>{message}</Text>
          <Image
                source={require('../assets/images/message.png')}
                style={{width: 29.8, height: 22.6 }}
              />
          </TouchableOpacity>}
        </View>
      </TouchableOpacity>

    </View>
  );
};

export default CustomHeaderMigration;

const styles = StyleSheet.create({
  header: {
    paddingVertical: 20,
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleStyle: {
    flex: 1,
    flexWrap: 'wrap',
    fontWeight:600,
    // fontSize: udyamitaTheme.themeFontSizeModalLabel,
    marginLeft: 20,
    maxWidth: 180,
    // fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    color:udyamitaTheme.textColor
  },
});
