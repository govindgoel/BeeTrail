import React from 'react';
import ContentLoader, {Rect} from 'react-content-loader/native';
import {Dimensions} from 'react-native';

const RecommendationVidPlaceholder = props => {
  const windowWidth = Dimensions.get('window').width;

  return (
    <ContentLoader
      speed={1}
      width={windowWidth}
      height={180}
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      {...props}>
       
      <Rect x="10" y="10" rx="0" ry="0" width="312" height="120" />
      <Rect x="10" y="135" rx="0" ry="0" width="200" height="10" />
       <Rect x="10" y="150" rx="0" ry="0" width="60" height="10" />

      <Rect x="75" y="150" rx="0" ry="0" width="65" height="10" /> 
    </ContentLoader>
  );
};

export default RecommendationVidPlaceholder;
