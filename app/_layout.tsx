import Header from '@/components/Header';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';

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
  container: { flex: 1,  width: width, height: height},
  outer: {  height: height * 0.1, backgroundColor: '#29497cff', justifyContent: 'center', alignItems: 'center' },
  headerText: { color: 'white', fontSize: fontScale },
  header:{flexDirection: 'row',
 justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16, // add space between icons
    paddingHorizontal: 16,
    marginTop : 15}
});

  return (

    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      {/* This header appears on every screen in this layout */}
      <View style={styles.outer}>

          <View style= {styles.header}>
                <Header/>
          </View>

      </View>

      {/* Child routes go here */}
      <Slot />
    </ScrollView>
   
     



  );
  
}
