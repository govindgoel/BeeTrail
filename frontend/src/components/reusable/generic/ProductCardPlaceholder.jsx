import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { Dimensions } from 'react-native';
import { udyamitaTheme } from '../../../config/styles/udyamitaTheme';

const ProductCardPlaceholder = (props) => {
  const windowWidth = Dimensions.get('window').width;
  return (
    <ContentLoader
      speed={2}
      width={windowWidth}
      height={130}
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      {...props}
    >
      <Rect x="10" y="10" rx="0" ry="0" width="130" height="100" />
      <Rect x="150" y="10" rx="0" ry="0" width="150" height="20" />
      <Rect x="150" y="40" rx="0" ry="0" width="180" height="10" />
      <Rect x="150" y="60" rx="0" ry="0" width="40" height="20" />
      <Rect x="200" y="60" rx="0" ry="0" width="50" height="20" />
      <Rect x="260" y="60" rx="0" ry="0" width="50" height="20" />
      <Rect x="150" y="90" rx="0" ry="0" width="180" height="10" />
    </ContentLoader>
  );
};

export default ProductCardPlaceholder;
