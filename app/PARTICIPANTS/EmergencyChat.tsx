import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import Echo from "laravel-echo";
import Pusher from "pusher-js/react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, StyleSheet, Text, TextInput, View, } from "react-native";
import { BASE_URL } from "../admin_page/newfileloader";


type EmergencyChatRouteParams = {
  event_code: string;
  participant_id: number;
};

// type EmergencyChatProps = {
//   route: {
//     params: EmergencyChatRouteParams;
//   };
// };

type ChatMessage = {
  from: number;
  message: string;
  time: string;
  lat?: number;
  lon?: number;
};

(global as any).Pusher = Pusher;

export default function EmergencyChat() {

    const {event_code, participant_id} = useLocalSearchParams<{
        event_code: string;
        participant_id: string;
    }>();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInputs] = useState("");

//LOADING SCREEN    
const [loading, setLoading] = useState(true);

    useEffect(() => {
        let echo: Echo<any> | undefined;

        const initEcho = async() => {

            try{
                const token = await AsyncStorage.getItem("authToken");
        
                echo = new Echo({
                    broadcaster: "reverb",
                    key: "local",
                    wsHost: "YOUR_SERVER_IP",
                    wsPort: 8080,
                    forceTLS: false,
                    encrypted: false,
                    authEndpoint: `${BASE_URL}/broadcasting/auth`,
                    auth: {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            },
                        },
                    });

                const channel = `emergency.event.${event_code}.participant.${participant_id}`;

                echo.private(channel).listen(".emergency.message", (e: any) => {
                    setMessages(prev => [...prev, e.payload]);
                });
                setLoading(false);
            }
            catch(err){
                console.error("Echo init failed:", err);
                Alert.alert("Failed to connect to emergency chat");
            }
        };
            initEcho();

        return() => {
            if(echo) echo.disconnect();
        };

    }, [event_code, participant_id]);

// SEND Message 

const sendMessage = async() => {
    const trimmed = input.trim();
    if (!trimmed) return;

  try{

    const token = await AsyncStorage.getItem("authToken");
    if(!token){
        Alert.alert("Authentication missing");
    };

    const res = await fetch(`${BASE_URL}/event/${event_code}/emergency/${participant_id}/message`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: trimmed }),
    });

    if(!res.ok) {throw new Error("Failed to send message");}

    setInputs("");

  }
  catch(err){
    console.error("sendMessage error:", err);
    Alert.alert("Failed to send message");
  }
};

 // === RENDERING (simple, same spirit as your previous input screen) ===

 if (loading) {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#DC2626" />
      <Text style={styles.loadingText}>Connecting to emergency chat…</Text>
    </View>
  );
}

    return (
    <View style={styles.container}>
        {messages.map((m, i) => (
        <Text key={i} style={styles.msg}>
            {m.message}
        </Text>
        ))}

        <TextInput
        value={input}
        onChangeText={setInputs}
        placeholder="Type message..."
        style={styles.input}
        />

        <Button title="Send" onPress={() => {sendMessage}}  disabled = {loading}/>
    </View>
    );

};


/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  msg: { paddingVertical: 4 },
  input: {
    borderWidth: 1,
    padding: 8,
    marginVertical: 8,
    borderRadius: 6,
  },
  loadingContainer: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
},
loadingText: {
  marginTop: 12,
  fontSize: 16,
  color: "#6B7280",
},

});