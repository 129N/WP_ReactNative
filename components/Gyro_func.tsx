import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Magnetometer } from 'expo-sensors';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

export default function CompassArrow() {
  const [heading, setHeading] = useState(0);
  const rotation = useRef(new Animated.Value(0)).current;

  // Calculate heading from magnetometer data
  const calculateHeading = (data: { x: number; y: number; z: number }) => {
    let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
    angle = angle >= 0 ? angle : angle + 360;
    return angle;
  };

  useEffect(() => {
    const subscription = Magnetometer.addListener((data) => {
      const angle = calculateHeading(data);
      setHeading(Math.round(angle));

      // Animate rotation
      Animated.timing(rotation, {
        toValue: angle,
        duration: 100,
        useNativeDriver: true,
      }).start();
    });

    return () => subscription.remove();
  }, []);

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { backgroundColor: 'lightgray' }]}>
      <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
        <MaterialCommunityIcons name="arrow-up-bold" size={100} color="black" />
      </Animated.View>
      <Text style={styles.text}>Heading: {heading}°</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  text: { fontSize: 20, marginTop: 20 },
});
