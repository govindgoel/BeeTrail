import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Dimensions} from 'react-native';
import ContentLoader, {Rect, Circle} from 'react-content-loader/native';

const PostPlaceholder = props => {
  const windowWidth = Dimensions.get('window').width;
  return (
    <ContentLoader
      speed={2}
      width={windowWidth}
      height={210}
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      {...props}>
    
      <Rect x="0" y="15" rx="5" ry="5" width="200" height="210" />
      <Rect x="210" y="15" rx="5" ry="5" width="200" height="210" />
    </ContentLoader>
  );
};

export default PostPlaceholder;

const styles = StyleSheet.create({});
