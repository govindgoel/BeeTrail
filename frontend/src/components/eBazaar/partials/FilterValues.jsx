import React, {useState, useEffect} from 'react';
import {TouchableOpacity, Text, View, StyleSheet} from 'react-native';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import {Checkbox} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import CustomText from '../../reusable/CustomText';
const FilterValues = ({
  filterValues,
  selectedValues,
  toggleSelection,
  selectAll,
  selectedFilterKey,
  handleValuePress,
}) => {
  const {t} = useTranslation();
  return (
    <View style={styles.valuesContainer}>
      <View style={styles.selectAllContainer}>
        <Checkbox
          color={udyamitaTheme.primaryColor}
          status={selectAll ? 'checked' : 'unchecked'}
          //value={selectAll}
          onPress={toggleSelection}
        />
        <TouchableOpacity
          style={styles.selectAllContainer}
          onPress={toggleSelection}>
          <CustomText style={styles.selectAllText} type='btn'>
            {selectAll ? `${t('deselectAll')}` : `${t('selectAll')}`}
          </CustomText>
        </TouchableOpacity>
      </View>

      {filterValues.map((valueObj, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.valueItemContainer]}
          onPress={() => handleValuePress(selectedFilterKey, valueObj.value)}>
          <Checkbox
            color={
              selectedValues.includes(valueObj.value)
                ? udyamitaTheme.primaryColor
                : udyamitaTheme.borderStyleColor
            }
            status={
              selectedValues.includes(valueObj.value) ? 'checked' : 'unchecked'
            }
            onPress={() => handleValuePress(selectedFilterKey, valueObj.value)}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <CustomText
            type='sh'
              style={[
                styles.valueText,
                selectedValues.includes(valueObj.value) &&
                  styles.selectedValueItem,
              ]}>
              {valueObj.value}
            </CustomText>
            {/* <Text style={styles.countText}>({valueObj.count})</Text> */}
            {/* <Text style={styles.countText}></Text> */}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default FilterValues;

const styles = StyleSheet.create({
  valuesContainer: {
    marginLeft: 15,
    marginRight: 20,
  },
  valueItemContainer: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: udyamitaTheme.borderStyleColor,
    paddingBottom: 10,
    paddingTop: 10,
    alignItems: 'center',
  },
  valueItem: {
    paddingLeft: 5,
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    textTransform: 'capitalize',
  },
  selectedValueItem: {
    fontWeight: '600',
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    textTransform: 'capitalize',
  },
  selectAllText: {
    //marginLeft: 15,
    fontSize: udyamitaTheme.themeFontSizeButton,
    color: udyamitaTheme.textColor,
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
  },
  selectAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  valueText: {
    paddingLeft: 5,
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    textTransform: 'capitalize',
    color: udyamitaTheme.textColor,
  },
  countText: {
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
    paddingLeft: 10,
  },
});
