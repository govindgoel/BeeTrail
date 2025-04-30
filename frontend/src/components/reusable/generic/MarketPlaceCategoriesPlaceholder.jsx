import React from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import ContentLoader, { Rect } from 'react-content-loader/native';

const MarketPlaceCategoriesPlaceholder = (props) => {
  const windowWidth = Dimensions.get('window').width;

  return (
    <ContentLoader
      speed={1}
      width={windowWidth}
      height={120}
      
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      {...props}>
    
      
        <Rect x="10" y="10" rx="0" ry="0" width="100" height="160" />
        <Rect x="10" y="95" rx="0" ry="0" width="100" height="10" />
     

      
     
        <Rect x="130" y="10" rx="0" ry="0" width="100" height="160" />
        <Rect x="130" y="95" rx="0" ry="0" width="100" height="10" />
      
     
        <Rect x="250" y="10" rx="0" ry="0" width="100" height="160" />
        <Rect x="250" y="95" rx="0" ry="0" width="100" height="10" />
      
      

     
      
    
    </ContentLoader>
  );
};

export default MarketPlaceCategoriesPlaceholder;
