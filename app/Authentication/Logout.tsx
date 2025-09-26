import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Alert, Text, TouchableOpacity } from 'react-native';
import { BASE_URL } from '../admin_page/newfileloader';

const router = useRouter();

const handleLogout = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      Alert.alert('No token found', 'You are already logged out.');
      router.replace('../Authentication/Login'); 
      return;
    }

    // Call backend logout
    const response = await fetch(`${BASE_URL}/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (response.ok) {
      // Clear local storage
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userRole');
      Alert.alert('Logged out successfully');
      router.replace('../Authentication/Login'); // back to login screen
    } else {
      const err = await response.json();
      console.error('Logout failed:', err);
      Alert.alert('Logout failed');
    }
  } catch (err) {
    console.error(err);
    Alert.alert('Error logging out');
  }
};


export default function Logout() {
<TouchableOpacity onPress={handleLogout}>
  <Text style={{ color: 'white' }}>Logout</Text>
</TouchableOpacity>

}