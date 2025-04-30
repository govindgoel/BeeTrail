import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ScrollView,

} from 'react-native';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import {Checkbox} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import CustomText from '../../reusable/CustomText';

const FarmFilterValues = ({
  filterValues,
  handleValuePress,
  filterState,
  filterName,
}) => {
  const [sliderValue, setSliderValue] = useState(0);
  const {t} = useTranslation();

  return (
    <>
      {filterName === 'distance' ? (
        filterValues ? (
          <View
            style={[styles.valuesContainer, {width: '75%', paddingTop: 15}]}>
            {/* <CustomText
              style={[
                styles.valueText,
                {paddingLeft: 0, textTransform: 'none'},
              ]}>
              {t('useTheSliderToChooseYourDesiredTravelDistance')}
            </CustomText>
            <CustomText style={styles.bigText}>0 km to 100 km away</CustomText> */}
         
            {filterValues.map((valueObj, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.valueItemContainer]}
              onPress={() => handleValuePress(valueObj.value)}>
         <RadioButton labelHorizontal={true} key={index}>
                <RadioButtonInput
                  obj={valueObj}
                  index={index}
                  isSelected={filterState && filterState.includes(valueObj.value)}
                  onPress={() => handleValuePress(valueObj.value)}
                  buttonSize={9}
                  buttonOuterSize={20}
                  borderWidth={1}
                  buttonInnerColor={
                    filterState && filterState.includes(valueObj.value)
                      ? udyamitaTheme.beeAppColor
                      : '#e74c3c'
                  }
                  buttonOuterColor={
                    filterState && filterState.includes(valueObj.value)
                      ? udyamitaTheme.beeAppColor
                      : udyamitaTheme.borderStyleColor
                  }
                />
                <RadioButtonLabel
                  obj={{label: valueObj.label, value: valueObj.value}}
                  index={index}
                  labelHorizontal={true}
                  onPress={() => handleValuePress(valueObj.value)}
                  labelStyle={{
                    color:
                    filterState && filterState.includes(valueObj.value)
                        ? udyamitaTheme.beeAppColor
                        : '#000',
                    fontSize: udyamitaTheme.themeFontSizeLabel,
                    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
                  }}
                />
              </RadioButton>
            </TouchableOpacity>
          ))}
          </View>
        ) : null
      ) : filterValues ? (
        <View style={styles.valuesContainer}>
          {filterValues.map((valueObj, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.valueItemContainer]}
              onPress={() => handleValuePress(valueObj.value)}>
              <Checkbox
                color={
                  filterState && filterState.includes(valueObj.value)
                    ? udyamitaTheme.beeAppColor
                    : udyamitaTheme.borderStyleColor
                }
                status={
                  filterState && filterState.includes(valueObj.value)
                    ? 'checked'
                    : 'unchecked'
                }
                onPress={() => handleValuePress(valueObj.value)}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <CustomText
                  style={[
                    styles.valueText,
                    filterValues.includes(valueObj.value) &&
                      styles.selectedValueItem,
                  ]} type='label'>
                  {valueObj.value}
                </CustomText>
                {/* <CustomText style={styles.countText}>({valueObj.count})</CustomText> */}
                {/* <CustomText style={styles.countText}></CustomText> */}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
    </>
  );
};

export default FarmFilterValues;

const styles = StyleSheet.create({
  distanceContainer: {
    padding: 10,
    width: '70%',
    backgroundColor: 'red',
  },
  valuesContainer: {
    marginLeft: 15,
    //marginRight: 30,
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
    fontSize: udyamitaTheme.themeFontSizeLabel,
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    textTransform: 'capitalize',
    color: udyamitaTheme.textColor,
  },
  valueText: {
    paddingLeft: 5,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    textTransform: 'capitalize',
    color: udyamitaTheme.textColor,
  },
  bigText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color: udyamitaTheme.textColor,
    fontSize: udyamitaTheme.themeFontSizeModalLabel,
    marginTop: 15,
    lineHeight: 22,
  },
  sliderThumb: {
    backgroundColor: udyamitaTheme.beeAppColor,

    width: 24,
    height: 411,
    borderRadius: 10,
  },
  sliderTrack: {
    height: 20,

    borderRadius: 6,
    // marginLeft: 10,
    // marginRight: 10,
  },
  sliderLabels: {},
  sliderLabel: {
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    color: '#6c757d',
    //marginLeft: -15,
    textAlign: 'center',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
  },

  sliderLabels: {
    marginLeft: 10, // Adjust the margin as needed
    alignItems: 'flex-start',
  },
  sliderLabel: {
    fontSize: udyamitaTheme.themeFontSizeSmallHeader,
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    color: udyamitaTheme.textColor,
    textAlign: 'center',
    marginTop: 40,
  },
  verticalSlider: {
    height: 400, // Adjust the height of the slider as needed
    transform: [{rotate: '-90deg'}],
  },
});
