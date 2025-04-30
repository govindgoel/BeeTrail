import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';

import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import {useTranslation} from 'react-i18next';
import CustomText from '../../reusable/CustomText';
const ModalForHarvester = ({
  visible,
  options,
  selectedValue,
  onSelect,
  onCancel,
  navigation,
  title,
  onSubmit,
  apiaryId,
  harvestProductSelection,
}) => {
  const {t} = useTranslation();

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={() => onCancel(selectedValue)}>
      <View style={styles.container}>
        <View style={styles.alertBox}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              //marginBottom: 10,
              padding: 16,
            }}>
            <CustomText style={styles.textMain} type="btn">
              {title}
            </CustomText>
            <TouchableOpacity onPress={onCancel}>
              <Image
                source={require('../../../assets/images/Cross.png')}
                style={{height: 24, width: 24}}
              />
            </TouchableOpacity>
          </View>
          <ScrollView>
            {options.map((option, index) => (

              <TouchableOpacity
                key={index}
                style={[
                  styles.optionItem,
                  selectedValue?.value === option.value && styles.selectedOption,
                ]}
                onPress={() => onSelect(option)}>
                {harvestProductSelection ? (
                  <Image source={option.image} style={styles.productImage} />
                ) : (
                  // <View style={[{backgroundColor:udyamitaTheme.beeAppColor,
                  //   width: 42,height: 42,borderRadius: 21,marginRight: 10},selectedValue === option.value && {backgroundColor : 'white'}] }>
                  //   <Text style= { selectedValue === option.value && {backgroundColor:"blue"} } >{option.name[0]}</Text>

                  // </View>
                  <View style={styles.userPicContiner}>
                    {option.image ? (
                      <Image
                        source={{uri: option.image || ''}}
                        style={styles.productImage}
                      />
                    ) : (
                      <Text style={[styles.initialStyle]}>{(option?.name || '')[0]}</Text>
                    )}
                  </View>
                )}

                <CustomText
                  style={[
                    styles.radioLabel,
                    selectedValue?.value === option.value && styles.optionTextSelected,
                  ]}
                  type="label">
                  {option.name}
                </CustomText>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={{
              ...styles.greenBtn,
              ...(!selectedValue
                ? {backgroundColor: udyamitaTheme.beeAppDisabledColor}
                : {}),
            }}
            onPress={() => {
              onCancel(selectedValue);
            }}
            disabled={!selectedValue}>
            <CustomText style={styles.greenBtnText} type="label">
              {t('proceed')}
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ModalForHarvester;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    backgroundColor: 'white',
    width: 312,
    borderRadius: 6,

    height: 413,
  },
  textMain: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color: udyamitaTheme.textColor,
    fontSize: udyamitaTheme.themeFontSizeButton,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderBottomColor: udyamitaTheme.borderStyleColor,
    paddingHorizontal: 16,
  },
  radioLabel: {
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    color: udyamitaTheme.textColor,
    fontSize: udyamitaTheme.themeFontSizeLabel,
  },
  greenBtn: {
    backgroundColor: udyamitaTheme.beeAppColor,
    height: 52,
    margin: 20,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  greenBtnText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    color: '#fff',
    fontSize: udyamitaTheme.themeFontSizeLabel,
  },
  selectedOption: {
    backgroundColor: udyamitaTheme.beeAppColor,
  },
  optionTextSelected: {
    color: '#fff',
  },
  productImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 10,
  },
  initialStyle: {
    color: udyamitaTheme.beeAppColor,
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    fontSize: udyamitaTheme.themeFontSizeModalLabel,
    textTransform: 'capitalize',
  },
  userPicContiner: {
    borderWidth: 0.5,
    borderColor: udyamitaTheme.beeAppColor,
    width: 42,
    height: 42,
    borderRadius: 50,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});
