import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import Echo from "laravel-echo";
import Pusher from "pusher-js/react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
        const pid = Number(participant_id);

                echo = new Echo({
                    broadcaster: "pusher",
                    key: "local",
                    cluster:"mt1",
                    wsHost: "192.168.0.103",
                    wsPort: 8080,
                    forceTLS: false,
                    encrypted: false,
                    Pusher: Pusher,
                    authEndpoint: `${BASE_URL}/broadcasting/auth`,
                    auth: {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            },
                        },
                    });

console.log("📡 Connecting to Reverb at", "192.168.0.103:8080");

                const channel = `emergency.event.${event_code}.participant.${pid}`;
console.log("📡 Subscribing to", channel);

                echo.private(channel)
                .listen(".emergency.message", (e: any) => {
                    console.log("🔥 RECEIVED:", e);
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
console.log(trimmed);
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
console.log("Message is fine");
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

  <SafeAreaView style={styles.safe}> 

    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
    <Text style={styles.title}>🚨 Emergency Chat</Text>
{/* Message List  */}
      {/* {messages.map((m, i) => (
      <Text key={i} style={styles.msg}>
          {m.message}
      </Text>
      ))} */}

    <FlatList
      data={messages}
      keyExtractor={(_, i) => i.toString()}
      contentContainerStyle={styles.chatArea}
      renderItem={({ item }) => (
      <View style={styles.msgBubble}>
        <Text style={styles.msgText}>{item.message}</Text>
      </View>
    )}
    />
{/* Input bar */}
  <View style={styles.inputBar}>
      <TextInput
        value={input}
        onChangeText={setInputs}
        placeholder="Type message..."
        style={styles.input}
        multiline
      />

      <TouchableOpacity
        onPress={sendMessage}
        disabled={loading}
        style={[
          styles.sendButton,
          loading && { opacity: 0.5 },
        ]}
      >
        <Text style={styles.sendText}>SEND</Text>
      </TouchableOpacity>
  </View>

    </KeyboardAvoidingView>

  </SafeAreaView>
   
    );

};


/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  msg: { paddingVertical: 4 },
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
button: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 8 },
buttonText: { color: 'white', marginLeft: 150, fontWeight: 'bold' },
  safe: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 8,
  },

  /* Chat area */
  chatArea: {
    paddingVertical: 8,
  },
  msgBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#E5E7EB",
    padding: 10,
    borderRadius: 12,
    marginVertical: 4,
    maxWidth: "80%",
  },
  msgText: {
    fontSize: 15,
    color: "#111827",
  },

  /* Input bar */
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 8,
    backgroundColor: "#FFFFFF",
    maxHeight: 120,
  },
  sendButton: {
    backgroundColor: "#DC2626",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});