import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import {defaultStyles} from '../../../config/styles/defaultStyles';
import {BackIcon, PastQuestionsIcon} from '../../../assets/Icons/IconSvg';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';

const CustomHeaderInspection = ({
  title,
  showBackIcon,
  onBackPress,
  searchShown,
  pastQuestShown,
  placeholder,
  initialList,
  handleSearch,
  setUpdatedList,
  navigation,
}) => {
  const {t} = useTranslation();
  const lastSaved = useSelector(state => state.hive.lastSaved);
  const [renderSaved, setRenderSaved] = useState('');
  const [renderSaved2, setRenderSaved2] = useState('');
  useEffect(() => {
    const temp = new Date(lastSaved)
      .toLocaleString(undefined, {
        timeZone: 'Asia/Kolkata',
      })
      .split(', ');
    setRenderSaved(temp[0]);
    setRenderSaved2(temp[1]);
  }, [lastSaved]);
  return (
    <View style={[styles.mainContainer, {height: searchShown ? 130 : 70}]}>
      <View style={styles.headerContainer}>
        {showBackIcon && (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <BackIcon />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{title}</Text>
        {/* TodoAutosave inspection */}
        {/* <View style={{position: 'absolute', right: 10, alignItems: 'flex-end'}}>
          <Text
            style={{
              fontFamily: udyamitaTheme?.mainThemeFontFamily,
              fontSize: udyamitaTheme.themeFontSizeSmall,
            }}>
            {t('autosavedAt')}: {renderSaved}
          </Text>
          <Text
            style={{
              fontFamily: udyamitaTheme?.mainThemeFontFamily,
              fontSize: udyamitaTheme.themeFontSizeSmall,
            }}>
            {renderSaved2}
          </Text>
        </View> */}
      </View>
    </View>
  );
};

export default CustomHeaderInspection;

const styles = StyleSheet.create({
  mainContainer: {
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 16,
    elevation: 10,
    backgroundColor: udyamitaTheme.themeBgColor,
    justifyContent: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: udyamitaTheme.textColor,
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    fontSize: udyamitaTheme.themeFontSizeModalLabel,
    marginLeft: 12,
  },
  backButton: {
    // position: 'absolute',
    left: 20,
    marginRight: 20,
  },
});
