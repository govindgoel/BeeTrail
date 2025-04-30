import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Dimensions} from 'react-native';
import ContentLoader, {Rect, Circle} from 'react-content-loader/native';

const CategoryPlaceholder = props => {
  const windowWidth = Dimensions.get('window').width;

  return (
    <ContentLoader
      speed={2}
      width={windowWidth}
      height={100}
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      {...props}>
      {/* <Circle cx="50" cy="50" r="35" /> */}

      <Circle x="10" y="5" cx="50" cy="50" r="35" width="80" height="60" />
      <Circle x="110" y="5" cx="50" cy="50" r="35" width="80" height="60" />
      <Circle x="210" y="5" cx="50" cy="50" r="35" width="80" height="60" />
      <Circle x="310" y="5" cx="50" cy="50" r="35" width="80" height="60" />
    </ContentLoader>
  );
};

export default CategoryPlaceholder;
