// components/Screen.tsx
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
};

export default function Screen({ children, scroll = true }: Props) {
  if (scroll) {
    return (
      <ScrollView contentContainerStyle={styles.scroll}>
        {children}
      </ScrollView>
    );
  }

  return <View style={styles.view}>{children}</View>;
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    padding: 16,
  },
  view: {
    flex: 1,
    padding: 16,
  },
});
