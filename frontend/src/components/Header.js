import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {BackIcon} from './IconSvgs';
import {udyamitaTheme} from '../config/styles/udyamitaTheme';

const Header = ({navigation, title,style={}}) => {
  return (
    <View
      style={{
        elevation: 10,
        backgroundColor: '#fff',
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        flexDirection:'row',
        alignItems:'center',
        ...style
      }}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => navigation.goBack()}>
        {/* <ArrowLeft
					height={25}
					width={25}
					alignSelf='center'
					color={'black'}
					onPress={() => navigation.goBack()}
				/> */}
        <BackIcon />
      </TouchableOpacity>
        <Text style={styles.titleStyle}>{title}</Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    marginVertical: 20,
    marginLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
    // borderBottomWidth: 1,
    // borderColor: 'grey',
  },
  titleStyle: {
    fontSize: udyamitaTheme.themeFontSizeModalLabel,
    marginLeft: 20,
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color:udyamitaTheme.textColor
  },
});
