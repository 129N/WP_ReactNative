import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { BASE_URL } from "../admin_page/newfileloader";


export const validateParticipant = () => {
    
    const router = useRouter();

 const validateParticipant = async(event_code: string) => {
    const token = await AsyncStorage.getItem("token");
    const userId = await AsyncStorage.getItem("userId");

    if (!token || !userId) {
    Alert.alert("Not logged in");
    router.push("/participant");
    return false;
  }

    const res = await fetch(`${BASE_URL}/events/${event_code}/participants`);
    if (!res.ok) {
        Alert.alert("Event not found");
        return false;
    }
    const data = await res.json();

  const isRegistered = data.some((p: any) => p.user_id == userId);

  if (!isRegistered) {
    alert("You are not registered for this event.");
    router.push("/participant");
    return false;
  }

  return true;
};
}