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
import {PrimaryButton} from '../UIComponentsBeeApp';
import { useTranslation } from 'react-i18next';
import CustomText from '../CustomText';
const CustomModalWithRadio = ({
  visible,
  options,
  imagerecognition,
  setimagerecognition,
  selectedValue,
  onSelect,
  onCancel,
  navigation,
  inspectHive,
  onSubmit,
  apiaryId,
  apiaryName,
  hiveCount,
  bottomSheetRef
}) => {
  const {t}=useTranslation();
  const radio_props = options.map((option, index) => ({
    label: option,
    value: index,
  }));

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onCancel}>
      <View style={styles.container}>
        <View style={styles.alertBox}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}>
            <CustomText style={styles.textMain} type='btn'>{t('selectHive')}</CustomText>
            <TouchableOpacity onPress={onCancel}>
              <Image
                source={require('../../../assets/images/Crossgreen.png')}
                style={{height: 24, width:24}}
        />
            </TouchableOpacity>
          </View>
          <ScrollView>
            <RadioForm formHorizontal={false} animation={true}>
              {radio_props.map((obj, i) => (
                <TouchableOpacity  onPress={() => onSelect(i)} style={styles.radioButtonContainer}>
                  <RadioButton labelHorizontal={true} key={i}>
                    <RadioButtonInput
                      initial={selectedValue}
                      obj={obj}
                      index={i}
                      isSelected={selectedValue === i}
                      borderWidth={1}
                      buttonInnerColor={udyamitaTheme.beeAppColor}
                      buttonOuterColor={udyamitaTheme.beeAppColor}
                      buttonSize={9}
                      buttonOuterSize={20}
                      onPress={() => onSelect(i)}
                    />

                    <RadioButtonLabel
                      obj={obj}
                      index={i}
                      labelStyle={styles.radioLabel}
                      labelWrapStyle={{marginLeft: 5}}
                      onPress={() => onSelect(i)}
                    />
                  </RadioButton>
                </TouchableOpacity>
              ))}
            </RadioForm>
          </ScrollView>

          <PrimaryButton
         
            onPress={() => {
              if (inspectHive) {
                console.log('hive selected',imagerecognition);
                if(imagerecognition){
                  onCancel()
                  bottomSheetRef?.current?.open()
                  setimagerecognition(false)
                }
                else{
                  onCancel()
                navigation.navigate('SymptomMapping', {
                  hiveNumber: options[selectedValue],
                  apiaryId,
                  apiaryName,
                  hiveCount
                });
              }
              } else {
                onSubmit();
              }
            }}>
            <CustomText
              style={{
                color: udyamitaTheme.themeBgColor,
                textAlign: 'center',
                fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
                fontSize: udyamitaTheme.themeFontSizeButton,
              }} type='btn'>
              {/* {t('proceedWith')} {options[selectedValue]} */}
              {t('proceed')}
            </CustomText>
          </PrimaryButton>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModalWithRadio;

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
    padding: 16,
    height:328
  },
  textMain: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color: udyamitaTheme.textColor,
    fontSize: udyamitaTheme.themeFontSizeButton,
  },
  radioLabel: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
    color: udyamitaTheme.textColor,
    fontSize: udyamitaTheme.themeFontSizeLabel,
  },
  radioButtonContainer:{
    borderBottomWidth:0.5,
    marginBottom:10,
    justifyContent:'center',
    borderColor:udyamitaTheme.borderStyleColor,
    paddingBottom:10,
  }
});
