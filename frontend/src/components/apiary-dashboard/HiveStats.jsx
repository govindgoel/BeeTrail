import React from 'react';
import {StyleSheet, Text, View, FlatList, Image} from 'react-native';
import {useTranslation} from 'react-i18next';
import {udyamitaTheme} from '../../config/styles/udyamitaTheme';
import CustomText from '../reusable/CustomText';

const HiveStats = ({hiveDetails}) => {
  const {t} = useTranslation();

  const renderItem = ({item}) => (
    <View style={styles.cardContainer}>
      <CustomText style={styles.headerText} type="label">
        {item.header}
      </CustomText>
      <View style={styles.smallCards}>
        <Image source={item.backImg} style={styles.imgeStyle} />
        <CustomText type="label" style={styles.countTextStyle}>{item.count}/{item.total}</CustomText>
        <CustomText type="label" style={styles.descTextStyle}>{item.desc}</CustomText>
      </View>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <FlatList
        data={hiveDetails}
        renderItem={renderItem}
        keyExtractor={item => item.name}
        numColumns={2}
      />
    </View>
  );
};

export default HiveStats;

const styles = StyleSheet.create({
  mainContainer: {
    //padding: 20,
    backgroundColor: '#ffffff',
    marginTop:16,
  },
  cardContainer: {
    flex: 1,
    marginLeft: 20,
    //padding: 16,
marginRight:20,
marginBottom:12,
marginTop:12,
    borderRadius: 8,
  },
  headerText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    color: '#000000',
  },
  smallCards: {
    borderWidth: 0.5,
    borderColor: udyamitaTheme.borderStyleColor,
    height: 64,
    borderRadius: 6,
    marginTop: 8,
    marginLeft: 20,
    flexWrap:'wrap',
   
  },
  imgeStyle: {
    width: 64,
    height: 64,
    position: 'absolute',
    marginLeft: -20,
  },
  descTextStyle:{
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    color: udyamitaTheme.textColor,
    position:'absolute',
    marginLeft:50,
    marginTop:30   
  },
  countTextStyle:{
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    color: udyamitaTheme.textColor,
    position:'absolute',
    marginLeft:50,
    marginTop:10,

  },
});
