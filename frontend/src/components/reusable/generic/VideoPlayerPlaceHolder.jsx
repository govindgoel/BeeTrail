import React from 'react'
import ContentLoader, { Rect, Circle, Path } from "react-content-loader/native"
import { Dimensions } from "react-native";

const VideoPlayerPlaceHolder = (props) => {
    
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    return <ContentLoader
        speed={2}
        width={windowWidth}
        height={270}
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        {...props}
    >
        <Rect x="0" y="10" rx="0" ry="0" width={windowWidth} height="200" />
        
       
    </ContentLoader>
}

export default VideoPlayerPlaceHolder