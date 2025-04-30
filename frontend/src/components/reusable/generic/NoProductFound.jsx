import { StyleSheet, Text, View,Image } from 'react-native'
import React from 'react'
import { udyamitaTheme } from '../../../config/styles/udyamitaTheme'

const NoProductFound = ({mainText,imgUrl,subText}) => {
  return (
    <View style={styles.mainContainer}>
        <Image source={imgUrl} style={{width:120,height:120}}/>
      <Text style={styles.mainText}>{mainText}</Text>
      <Text style={styles.subText}>{subText}</Text>
    </View>
  )
}

export default NoProductFound

const styles = StyleSheet.create({
    mainContainer:{
        flex:1,
        backgroundColor:udyamitaTheme.themeBgColor,
        justifyContent:'center',
        alignItems:'center',
        marginTop:40
    },
    mainText:{
        fontFamily:udyamitaTheme.mainThemeFontFamilyBold,
        color:udyamitaTheme.primaryColor,
        fontSize:udyamitaTheme.themeFontSizeModalLabel
    },
    subText:{
        fontFamily:udyamitaTheme.mainThemeFontFamilySemiBold,
        color:udyamitaTheme.textColor,
        fontSize:udyamitaTheme.themeFontSizeLabel
    }
})