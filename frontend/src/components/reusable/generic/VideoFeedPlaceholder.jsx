import React from 'react'
import ContentLoader, { Rect, Circle, Path } from "react-content-loader/native"
import { Dimensions } from "react-native";

const VideoFeedPlaceholder = (props) => {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    return <ContentLoader
        speed={1}
        width={windowWidth}
        height={270}
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        {...props}
    >
        <Rect x="0" y="10" rx="0" ry="0" width={windowWidth} height="200" />
        <Rect x="10" y="252" rx="6" ry="6" width="40" height="12" />
        <Rect x="86" y="252" rx="6" ry="6" width="42" height="12" />
        <Rect x="10" y="220" rx="5" ry="5" width={windowWidth - 20} height="10" />
        <Rect x="10" y="235" rx="5" ry="5" width={windowWidth / 2} height="10" />
       
    </ContentLoader>
}

export default VideoFeedPlaceholder