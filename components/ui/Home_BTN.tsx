// components/HomeBTN.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type HomeBTNProps = {
  title: string;
  color: string;
  to: string;
};

export default function HomeBTN({ title, color, to }: HomeBTNProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }]}
      onPress={() => router.push(to)}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});
