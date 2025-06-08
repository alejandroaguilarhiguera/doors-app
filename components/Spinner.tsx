// GearSpinner.tsx
import React, { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';

const GearSpinner = ({ size = 100, color = '#333' }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={{ transform: [{ rotate: spin }] }}>
      <Svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
      >
        <G fill={color}>
          <Path d="M50 30a20 20 0 1 0 0.001 40.001A20 20 0 0 0 50 30zm0-30l5 15h10l5-15 10 10-10 10 5 10 15-5v20l-15-5-5 10 10 10-10 10-5-15h-10l-5 15-10-10 10-10-5-10-15 5V40l15 5 5-10-10-10 10-10z" />
        </G>
      </Svg>
    </Animated.View>
  );
};

export default GearSpinner;
