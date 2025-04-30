import { View, Text } from 'react-native'
import React from 'react'
import {Dimensions} from 'react-native';
import ContentLoader, {Rect,Circle} from 'react-content-loader/native';
const CommentSectionPlaceholder = props => {
  const windowWidth = Dimensions.get('window').width;
  return (
    <ContentLoader
    speed={2}
    width={windowWidth}
    height={70}
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}>
    
    <Circle cx="15" cy="15" r="15" />
    <Rect x="50" y="5" rx="0" ry="0" width="60" height="10" />
    <Rect x="50" y="30" rx="0" ry="10" width="250" height="20" />
  </ContentLoader>
  )
}

export default CommentSectionPlaceholder