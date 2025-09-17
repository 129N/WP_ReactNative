import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import 'react-native-reanimated';

export default function RootLayout() {

  const [loaded] = useFonts({
    //SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
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
  container: { flex: 1,  width: width, height: height},
  header: {  height: height * 0.1, backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center' },
  headerText: { color: 'white', fontSize: fontScale },
});

  return (

    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      {/* This header appears on every screen in this layout */}
      <View style={styles.header}>
        <Text style={styles.headerText}>My Global Header</Text>
      </View>

      {/* Child routes go here */}
      <Slot />
    </ScrollView>
   
     



  );
  
}
