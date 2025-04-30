import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
// import {CalenderIcon} from '../../../assets/Icons/IconSvg';
import {useTranslation} from 'react-i18next';

const CustomDropdown = ({
  selectedValue,
  items,
  onValueChange,
  label,
  disabled = false,
  type,
}) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const {t, i18n} = useTranslation();
  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleItemPress = item => {
    toggleDropdown();
    onValueChange(item);
  };

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        disabled={disabled}
        style={styles.selectedItem}
        onPress={toggleDropdown}>
        <Text style={styles.selectedItemText}>{selectedValue || label}</Text>
        {/* {type === 'calendar' ? <CalenderIcon /> : null}
        {type === 'dropdown' ? (
          <Image source={require('../../../assets/images/Caretdown.png')} style={{width:24,height:24}}/>
        ) : null} */}
      </TouchableOpacity>
      {isDropdownVisible && (
        <View contentContainerStyle={styles.dropdownList}>
          {items.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.dropdownItem}
              onPress={() => handleItemPress(item.value || item)}>
              <Text style={styles.dropdownItemText}>{item.label || item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    position: 'relative',
    backgroundColor: '#fff',
    marginTop: 10,
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 0.5,
    //height:54,
  },

  selectedItem: {
    padding: 10,
    borderRadius: 5,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedItemText: {
    fontSize: udyamitaTheme.themeFontSizeLabel,
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    color: udyamitaTheme.textColor,
    opacity: 0.5,
    
  },
  dropdownList: {
    position: 'absolute',
    bottom: '100%', // Change 'top' to 'bottom'
    left: 0,
    right: 0,
    backgroundColor: 'white',

    borderRadius: 5,
    maxHeight: 150,
    zIndex: 999,
  },

  dropdownItem: {
    padding: 10,
  },
  dropdownItemText: {
    fontSize: udyamitaTheme.themeFontSizeButton,
    fontFamily: udyamitaTheme.mainThemeFontFamily,
  },
});

export default CustomDropdown;
