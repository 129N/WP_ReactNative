import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Screen from '../comp/ScreenWrapper';
export default function HomeScreen() {

  const router = useRouter();
  
 return (
<Screen>
 <View style={styles.container}>
      <ThemedText type="subtitle">Here is index.tsx</ThemedText>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#10B981" }]}
        onPress={() => router.push("/admin_page/admin")}
      >
        <Text style={styles.buttonText}>Event Organizer (Admin)</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#ff0000ff" }]}
        onPress={() => router.push("/audience_folder/audience")}
      >
        <Text style={styles.buttonText}>Audience</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#8B5CF6" }]}
        onPress={() => router.push("/comp/WPScreen")}
      >
        <Text style={styles.buttonText}>WP_Button</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#FFC0CB" }]}
        onPress={() => router.push("/Authentication/registration")}
      >
        <Text style={styles.buttonText}>Registration</Text>
      </TouchableOpacity>
    </View>

</Screen>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
