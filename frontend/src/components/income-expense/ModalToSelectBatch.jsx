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
import {udyamitaTheme} from '../../config/styles/udyamitaTheme';
import {PrimaryButton} from '../reusable/UIComponentsBeeApp';
import {useTranslation} from 'react-i18next';
import CustomText from '../reusable/CustomText';
const ModalToSelectBatch = ({
  visible,
  options,
  selectedValue,
  onSelect,
  onCancel,
  navigation,
  buyerModal,
  title,
  apiaryId,
  expenseCompoent,
  incomeScreen,
  isEdit,
  productInfo
}) => {
  const {t} = useTranslation();

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
            <CustomText style={styles.textMain} type="btn">
              {title}
            </CustomText>
            <TouchableOpacity onPress={onCancel}>
              <Image
                source={require('../../assets/images/Crossgreen.png')}
                style={{height: 24, width: 24}}
              />
            </TouchableOpacity>
          </View>
          <ScrollView>
            {incomeScreen === true && options.length === 0 ? (
              <View>
                <Image
                  source={require('../../assets/images/noRecord.png')}
                  style={{
                    height: 100,
                    width: 100,
                    marginLeft: '30%',
                    marginTop: 5,
                  }}
                />
                <CustomText style={styles.NoContentText} type="label">
                  {t('noHarvestsHaveBeen')}
                </CustomText>
              </View>
            ) : (
              <RadioForm formHorizontal={false} animation={true}>
                {options.map((batch, index) => (
                  <TouchableOpacity
                    key={batch.value}
                    onPress={() => onSelect(batch.value)}
                    style={styles.radioButtonContainer}>
                    <RadioButton labelHorizontal={true}>
                      <RadioButtonInput
                        initial={selectedValue}
                        obj={{label: batch.label, value: batch.value}}
                        index={index}
                        isSelected={selectedValue === batch.value}
                        borderWidth={1}
                        buttonInnerColor={udyamitaTheme.beeAppColor}
                        buttonOuterColor={udyamitaTheme.beeAppColor}
                        buttonSize={15}
                        buttonOuterSize={20}
                        onPress={() => onSelect(batch.value)}
                      />

                      <RadioButtonLabel
                        obj={{label: batch.label, value: batch.value}}
                        index={index}
                        labelStyle={styles.radioLabel}
                        labelWrapStyle={{marginLeft: 5}}
                        onPress={() => onSelect(batch.value)}
                      />
                    </RadioButton>
                  </TouchableOpacity>
                ))}
              </RadioForm>
            )}
          </ScrollView>

          <TouchableOpacity
            style={{
              ...styles.greenBtn,
              ...(!selectedValue
                ? {backgroundColor: udyamitaTheme.beeAppDisabledColor}
                : {}),
            }}
            onPress={() => {
              // if (buyerModal) {
              //   navigation.navigate('AddIncome', {
              //     buyer: selectedValue,
              //     apiaryId: apiaryId,
              //     isEdit:isEdit,
              //     productInfo:productInfo
              //   });
              // } else if (expenseCompoent) {
              //   navigation.navigate('AddExpense', {
              //     apiaryId: apiaryId,
              //     isEdit:isEdit,
              //     productInfo:productInfo
              //   });
              // } else {
              //   navigation.navigate('AddIncome', {
              //     product: selectedValue,
              //     apiaryId: apiaryId,
              //     isEdit:isEdit,
              //     productInfo:productInfo
              //   });
              // }
              onCancel();
            }}>
            <CustomText
              style={{
                color: udyamitaTheme.themeBgColor,
                textAlign: 'center',
                fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
                fontSize: udyamitaTheme.themeFontSizeButton,
              }}
              type="btn">
              {t('proceed')}
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ModalToSelectBatch;

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
    height: 328,
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
  radioButtonContainer: {
    borderBottomWidth: 0.5,
    marginBottom: 10,
    justifyContent: 'center',
    borderColor: udyamitaTheme.borderStyleColor,
    paddingBottom: 10,
  },
  greenBtn: {
    backgroundColor: udyamitaTheme.beeAppColor,
    height: 52,
    margin: 10,
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
  NoContentText: {
    fontSize: udyamitaTheme.themeFontSizeLabel,
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color: udyamitaTheme.textColor,
    textAlign: 'center',
    margin: 30,
  },
});
