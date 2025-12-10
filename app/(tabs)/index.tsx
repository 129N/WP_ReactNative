import { ThemedText } from '@/components/ThemedText';
import HomeBTN from '@/components/ui/Home_BTN';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
export default function HomeScreen() {

  const router = useRouter();
  
 return (


   <View style={styles.container}>

         <ThemedText type="subtitle"> Here is index.tsx </ThemedText>.

    <HomeBTN title="Participant" color="#3B82F6" to="participant" />
      <HomeBTN title="Event Organizer (Admin)" color="#10B981" to="/admin_page/admin" />
      <HomeBTN title="Audience" color="#8B5CF6" to="/audience_folder/audience" />
     <HomeBTN title="WP_Button" color="#8B5CF6" to="/comp/WPScreen" />
        

      <TouchableOpacity
      style={[styles.button, { backgroundColor: '#FFC0CB' }]} // blue
      onPress={() => router.push('../Authentication/registration')}>
      <Text style={styles.buttonText}> Regsitration</Text>
      </TouchableOpacity>
    </View>

  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  container: {
    padding: 48,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }, 
  
  button: {
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      marginBottom: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
});
