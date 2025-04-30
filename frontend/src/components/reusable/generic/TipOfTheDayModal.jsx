import React from 'react';
import { Modal, View, Image, StyleSheet, Dimensions, Text } from 'react-native';
import { udyamitaTheme } from '../../../config/styles/udyamitaTheme';

const { width } = Dimensions.get('window');

const TipOfTheDayModal = ({ isVisible, onClose, imageData }) => {
  return (
    <Modal transparent animationType="fade" visible={isVisible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.contentContainer}>
        <Image source={{ uri: `data:image/png;base64,${imageData}` }} style={styles.image} />
        
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    borderRadius: 8,
   
  },

});

export default TipOfTheDayModal;
