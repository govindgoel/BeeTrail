import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Dimensions } from 'react-native';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';

const CommunityPostPlaceholder = (props) => {
  const windowWidth = Dimensions.get('window').width;

  return (
    <ContentLoader
      speed={2}
      width={windowWidth}
      height={510} 
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      {...props}
    >
      
      <Circle cx="50" cy="50" r="35" />

     
      <Rect x="0" y="100" rx="5" ry="5" width={windowWidth} height="510" />

      
      <Rect x="95" y="30" rx="5" ry="5" width="100" height="12" />

     
      <Rect x="95" y="65" rx="5" ry="5" width="200" height="12" />
    </ContentLoader>
  );
};

export default CommunityPostPlaceholder;

const styles = StyleSheet.create({});
