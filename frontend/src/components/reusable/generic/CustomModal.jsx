import {View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Image} from 'react-native';
import React, {useState} from 'react';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import CustomText from '../CustomText';

const CustomModal = ({
  title,
  options,
  visible,
  requestClose,
  selectedOption,
  setSelectedOption,
}) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={() => {
        requestClose();
      }}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
          <CustomText style={styles.title} type="btn">
            {title}
          </CustomText>
          <TouchableOpacity onPress={()=>requestClose()}>
            <Image source={require('../../../assets/images/Cross.png')} style={{width:24,height:24}}/>
          </TouchableOpacity>
          </View>
         
          <ScrollView showsVerticalScrollIndicator={true}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
               
                onPress={() => setSelectedOption(option.value)}>
                <View style={styles.radioButtonContainer}>
                  <RadioButton labelHorizontal={true}>
                    <RadioButtonInput
                      obj={option}
                      index={index}
                      isSelected={selectedOption === option.value}
                      onPress={() => setSelectedOption(option.value)}
                      borderWidth={1}
                      buttonInnerColor={
                        selectedOption === option.value
                          ? udyamitaTheme.primaryColor
                          : '#e74c3c'
                      }
                      buttonOuterColor={
                        selectedOption === option.value
                          ? udyamitaTheme.primaryColor
                          : udyamitaTheme.borderStyleColor
                      }
                      buttonSize={9}
                      buttonOuterSize={20}
                      buttonWrapStyle={{ marginLeft: 10 }}
                    />
                    <RadioButtonLabel
                      obj={option}
                      index={index}
                      onPress={() => setSelectedOption(option.value)}
                      labelHorizontal={true}
                      labelStyle={{
                        color:
                          selectedOption === option.value
                            ? udyamitaTheme.primaryColor
                            : '#000',
                        fontSize: udyamitaTheme.themeFontSizeLabel,
                        fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
                      }}
                      labelWrapStyle={{
                        marginLeft: 5,
                        marginBottom: 10,
                      }}
                    />
                  </RadioButton>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;



const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
   
  },
  modalContent: {
    width: 312,
    borderRadius: 24,
    backgroundColor: '#fff',
    padding: 20,
    //alignItems: 'center',
    height:240,
    
    
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  title: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color: udyamitaTheme.textColor,
    fontSize: udyamitaTheme.themeFontSizeButton,
    marginBottom: 10,
    marginLeft: 10,
  },
  radioButtonContainer:{
    borderBottomWidth:0.5,
    marginBottom:10,
    justifyContent:'center',
    borderColor:udyamitaTheme.borderStyleColor
  }
});
