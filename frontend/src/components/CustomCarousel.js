import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Image} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {defaultStyles} from '../config/styles/defaultStyles';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

export default function CustomCarousel() {
  const [currSlide, setCurrSlide] = useState();
  const [movLeft, setMovLeft] = useState(false);
  const pressed = useSharedValue(false);
  // highlight-next-line
  const offset = useSharedValue(0);
  const changeX = useSharedValue(0);

  const pan = Gesture.Pan()
    .onBegin(() => {
      pressed.value = true;
     
    })
    // highlight-start
    .onChange(event => {
   
      changeX.value = event.changeX;
      offset.value = event.translationX;
    })
    .onFinalize(() => {
      // offset.value = withSpring(0);
      if (changeX.value > 0) {

        //  offset.value = offset.value + 120 - offset.value
      } else {

        // offset.value = withSpring(offset.value + 120 - offset.value);
       
      }
      // pressed.value = false;
    });

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      {translateX: offset.value},
      //   {scale: withTiming(pressed.value ? 1.2 : 1)},
    ],
    backgroundColor: pressed.value ? '#FFE04B' : '#b58df1',
  }));

  const Images = [
    {
      source: require('./png1.png'),
    },
    {
      source: require('./png2.png'),
    },
    {
      source: require('./png3.png'),
    },
  ];

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* <View style={styles.container}>
        <GestureDetector gesture={pan}>
          <Animated.View style={[styles.circle, animatedStyles]} />
        </GestureDetector>
      </View> */}
      <GestureDetector gesture={pan}>
        <View style={[styles.containerImages, defaultStyles.flexRow]}>
          {Images.map((el, ind) => {
            return (
              <Animated.Image
                source={el?.source}
                style={[
                  animatedStyles,
                  {
                    minHeight: 150,
                    maxHeight: 150,
                    minWidth: 150,
                    maxWidth: 150,
                  },
                ]}
              />
            );
          })}
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '90%',
  },
  containerImages: {
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
    maxWidth: 250,
    overflow: 'hidden',
  },
  circle: {
    height: 120,
    width: 120,
    backgroundColor: '#b58df1',
    borderRadius: 500,
    cursor: 'grab',
  },
});
