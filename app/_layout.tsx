import Header from '@/components/Header';
import Responsive from '@/components/Responsive';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import { Dimensions, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';
import { AuthProvider } from './Authentication/AuthProvider';

export default function RootLayout() {

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return <Slot />;
  }

const { width, height, fontScale } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    outer: {
      height: height * 0.2,
      backgroundColor: '#29497cff',
      justifyContent: 'center',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      marginTop: 15,
    },
  });
  return (
    <AuthProvider>
      <View style={styles.container}>
        {/* Global header area */}
        <View style={styles.outer}>
          <View style={styles.header}>
            <Header />
          </View>
          <Responsive />
        </View>

        {/* Screen content */}
        <Slot />
      </View>
    </AuthProvider>
  );
  
}
