import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { udyamitaTheme } from '../../../config/styles/udyamitaTheme';

const CustomTextInput = ({ placeholder, value, onChangeText }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <View style={styles.inputContainer}>
      {(value) ? null : (
        <Text style={styles.placeholder}>{placeholder}</Text>
      )}

      <TextInput
        multiline
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: 'rgba(203, 203, 203, 0.1)',
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: udyamitaTheme.borderStyleColor,
    borderRadius: 10,
    marginTop: 10,
  },
  input: {
    fontSize: udyamitaTheme.themeFontSizeLabel,
    lineHeight: 24,
    minHeight: 80,
   // paddingTop: 8,
  },
  placeholder: {
    position: 'absolute',
    left: 12,
    top: 12,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    color: '#999',
    fontFamily: udyamitaTheme.mainThemeFontFamily,
  },
});

export default CustomTextInput;
