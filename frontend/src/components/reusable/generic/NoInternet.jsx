import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
const NoInternet = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/NoNet.png')}
        style={{width: 148, height: 121}}
      />
      <Text style={styles.boldText}>No Internet Connectivity</Text>
      <Text style={styles.text} numberOfLines={2}>
        You need to be connected to the internet to continue.
      </Text>
    </View>
  );
};

export default NoInternet;
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'column',
    flex: 1,
  },
  boldText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color: udyamitaTheme.primaryColor,
    marginTop: 20,
    marginBottom: 15,
    fontSize: udyamitaTheme.themeFontSizeModalLabel,
  },
  text: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    textAlign: 'center',
    marginLeft: 50,
    marginRight: 50,
    fontSize: udyamitaTheme.themeFontSizeLabel,
  },
});
