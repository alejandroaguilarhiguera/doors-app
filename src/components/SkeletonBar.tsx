// SkeletonBar.tsx
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';

type Props = {
  width?: number | string;   // ej. 200 o '100%'
  height?: number;           // alto de la barra
  radius?: number;           // border radius
  style?: ViewStyle;         // estilos extra
};

export default function SkeletonBar({
  width = '100%',
  height = 12,
  radius = 8,
  style,
}: Props) {
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.6, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
<Animated.View
  style={[
    styles.base,
    { width, height, borderRadius: radius, opacity } as ViewStyle,
    style,
  ]}
/>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: '#E1E3E8', // gris claro tipo skeleton
    overflow: 'hidden',
  },
});