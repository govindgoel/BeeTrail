import React from 'react';
import { View, Image, TouchableOpacity, Modal, StyleSheet,Text } from 'react-native';
import { udyamitaTheme } from '../../../config/styles/udyamitaTheme';

const FullScreenImage = ({ imageUri, onClose }) => {
  return (
    <Modal animationType="slide" transparent={true} visible={!!imageUri}>
      <View style={styles.container}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#fff',
   width:30,
   height:30,
   borderRadius:15,
   justifyContent:'center',
   alignItems:'center'
  },
  closeButtonText: {
    fontSize: udyamitaTheme.themeFontSizeHeader,
    fontWeight: 'bold',
    color:udyamitaTheme.textColor
  },
});

export default FullScreenImage;
