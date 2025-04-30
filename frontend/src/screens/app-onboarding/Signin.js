import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  View,
  StatusBar,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Linking,
  Clipboard,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import {getHash, requestHint, startOtpListener} from 'react-native-otp-verify';
import axios from 'axios';
import { getUser, getValueByKey, storeUser, storeValueByKey } from '../../helpers/UserData';
import { useNavigation, useRoute } from '@react-navigation/native';
import {APP_API_USER_URL} from '@env'


export const Signin = () => {
 

  return (
    <>
     <Text>agdfaef </Text>
    </>
  );
};


// const styles = StyleSheet.create({
//   // container: {
//   //   flex: 1,
//   // },
//   lableStyle: {
//     marginBottom: 5,
//     marginTop: 15,
//     fontSize: udyamitaTheme.themeFontSizeButton,
//   },
//   textInputStyle: {
//     height: 50,
//     fontSize: udyamitaTheme.themeFontSizeButton,
//     fontFamily: udyamitaTheme.mainThemeFontFamily,
//     paddingLeft: 10,
//     alignSelf: 'center',

//     letterSpacing: 1.5,
//     width: '75%',
//     color: 'black',
//   },
//   textInputWrap: {
//     marginHorizontal: 20,
//     marginBottom: 10,
//     height: 50,
//     borderRadius: 6,
//     borderWidth: 1,
//     // borderColor: udyamitaTheme.primaryColor,
//     flexDirection: 'row',
//     //flex:1,
//   },
//   Inputlabel: {
//     fontSize: udyamitaTheme.themeFontSizeModalLabel,
//     marginTop: 32,
//     marginBottom: 16,
//     // marginHorizontal: 75,
//     textAlign: 'center',

//     fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
//     color: udyamitaTheme.textColor,
//   },
//   tandCWrapper: {
//     flexDirection: 'row',
//     marginHorizontal: 25,
//     marginVertical: 5,
//     marginTop: 50,
//     alignSelf: 'center',
//   },
//   tandCText: {
//     fontSize: udyamitaTheme.themeFontSizeSmallHeader,
//     fontFamily: udyamitaTheme.mainThemeFontFamily,
//     lineHeight: 20,
//     textAlign: 'center',
//     color: udyamitaTheme.textColor,
//   },
//   tandCLink: {
//     color: udyamitaTheme.primaryColor,
//     textDecorationLine: 'underline',
//     fontFamily: udyamitaTheme.mainThemeFontFamily,
//     fontSize: udyamitaTheme.themeFontSizeLabel,
//   },
//   nientyOne: {
//     alignSelf: 'center',
//     fontSize: udyamitaTheme.themeFontSizeButton,
//     marginLeft: 5,
//     fontFamily: udyamitaTheme.mainThemeFontFamily,
//     color: udyamitaTheme.textColor,
//   },

//   // arrowButtonStyle: {
//   //  // margin: 10,
//   //   backgroundColor: udyamitaTheme.primaryColor,
//   //   width: '90%',
//   //   height: 52,
//   //   borderRadius: 5,
//   //   alignSelf: 'center',
//   //   //flexDirection: 'row',

//   //   justifyContent: 'center',
//   //   alignItems: 'center',
//   // },
//   arrowButtonLabel: {
//     color: 'white',
//     fontSize: udyamitaTheme.themeFontSizeButton,
//     alignSelf: 'center',
//     marginLeft: 10,
//     fontFamily: udyamitaTheme.mainThemeFontFamily,
//   },

//   // on Boarding template CSS
//   welcomeToUdyamitaContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: -2,
//     flexDirection: 'row',
//     // marginTop:30,
//   },
//   container: {
//     flex: 1,
//     // backgroundColor: 'white',

//     position: 'relative',
//     bottom: 0,
//     backgroundColor: '#FFF',
//   },
//   image: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   text: {
//     color: 'white',
//     fontSize: 42,
//     lineHeight: 84,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     backgroundColor: '#000000c0',
//     fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
//   },
//   dropDown: {
//     height: 30,
//     backgroundColor: '#f7f7f7',
//     minWidth: 110,
//     justifyContent: 'center',
//     paddingHorizontal: 5,
//     borderWidth: 1.2,
//     borderColor: udyamitaTheme.primaryColor,
//     borderRadius: 5,
//   },
//   dropDownText: {
//     fontSize: udyamitaTheme.themeFontSizeButton,
//     alignSelf: 'center',
//     textTransform: 'capitalize',
//     fontWeight: 'bold',
//   },
//   buttonStyle: {
//     position: 'absolute',
//     bottom: 5,
//     margin: 10,
//     backgroundColor: udyamitaTheme.primaryColor,
//     width: '80%',
//     height: 45,
//     borderRadius: 25,
//     alignSelf: 'center',
//     justifyContent: 'space-between',
//     flexDirection: 'row',
//     elevation: 5,
//   },

//   title: {
//     fontSize: udyamitaTheme.themeFontSizeBigHeader,
//     alignSelf: 'center',
//     fontFamily: udyamitaTheme.mainThemeFontFamily,
//   },

//   languageListWrap: {
//     marginHorizontal: '5%',
//     marginTop: 10,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     flexWrap: 'wrap',
//   },
//   languageCard: {
//     height: 52,
//     // width: 130,
//     width: '100%',
//     alignSelf: 'center',
//     borderRadius: 10,
//     backgroundColor: 'white',
//     justifyContent: 'center',
//     marginVertical: 5,
//     borderWidth: 1,
//     borderColor: udyamitaTheme.borderStyleColor,
//     // elevation: 8,
//   },
//   languageCardSelected: {
//     height: 52,
//     // width: 140,
//     width: '100%',
//     borderRadius: 10,
//     alignSelf: 'center',
//     borderColor: udyamitaTheme.primaryColor,
//     borderWidth: 2,
//     justifyContent: 'center',
//     marginVertical: 5,
//     elevation: 8,
//     backgroundColor: 'white',
//   },
//   languageText: {
//     alignSelf: 'center',
//     fontSize: udyamitaTheme.themeFontSizeButton,
//     fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
//     color: udyamitaTheme.textColor,
//   },
//   languageTextSelected: {
//     alignSelf: 'center',
//     fontSize: udyamitaTheme.themeFontSizeButton,
//     fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
//     color: udyamitaTheme.textColor,
//   },
//   logo: {
//     width: 200,
//     height: 79,
//     alignSelf: 'center',
//     resizeMode: 'contain',
//     marginTop: -25,
//   },

//   modalContainer: {
//     backgroundColor: 'white',
//   },
//   arrowButtonStyle: {
//     backgroundColor: udyamitaTheme.primaryColor,
//     width: '90%',
//     height: 52,
//     borderRadius: 5,
//     alignSelf: 'center',
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'absolute',
//     bottom: 0,
//     marginBottom: 10,
//     flexDirection: 'row',
//   },
//   arrowButtonLabel: {
//     color: 'white',
//     fontSize: udyamitaTheme.themeFontSizeButton,
//     alignSelf: 'center',
//     marginLeft: 10,
//     fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
//   },
//   welcomeText: {
//     // textTransform: 'capitalize',
//     fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
//     fontSize: udyamitaTheme.themeFontSizeModalLabel,
//     color: udyamitaTheme.textColor,
//   },
//   udyamitaText: {
//     // textTransform: 'capitalize',
//     fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
//     fontSize: udyamitaTheme.themeFontSizeModalLabel,
//     color: udyamitaTheme.textColor,
//   },
// });
