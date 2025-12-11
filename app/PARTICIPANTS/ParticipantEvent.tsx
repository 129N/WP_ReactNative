import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { BASE_URL } from "../admin_page/newfileloader";
//use Route::get('/events/{event_code}/participants', [EventController::class, 'getParticipant']);
// 
 export type Waypoint = {
  name: string;
  latitude: number;
  longitude: number;
}
export type TrackPoint = {
  latitude : number;
  longitude : number;
};

 export  type Position = {
    latitude: number;
    longitude: number;
  };    


  const ParticipantinEvent = () => {
    const [coordinates, setCoordinates] = useState<{ latitude: number, longitude: number } | null>(null);
    const [trackPoints, setTrackPoints] = useState<TrackPoint[]>([]);
    const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
    const [fileUri, setFileUri] = useState<string | null>(null);
    const [currentPosition, setCurrentPosition] = useState<Position | null>(null);

    const [visibleTrackPoints, setVisibleTrackPoints] = useState<TrackPoint[]>([]);
    const [routeready ,setRouteReady] = useState(false);

const [viewmode, setViewMode] = useState<'waypoints'| 'trackpoints'>('waypoints');

    const [eventCode, setEventCode] = useState<string>("");

    const router = useRouter();


// ⛓ Auto-init if event_code already exists in storage
useEffect(() => {
  const init = async () => {
      try {
        const storedCode = await AsyncStorage.getItem("event_code");
        if (!storedCode) return;

        setEventCode(storedCode);

        const ok = await validateParticipant(storedCode);
        if (!ok) return;

        await fetchEventRoute(storedCode);
      } catch (err) {
        console.error("init error:", err);
      }
    };

  init();
}, []);

const validateParticipant = async(event_code: string): Promise<boolean> => {
    try{
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

//after the validation 
        await AsyncStorage.setItem("event_code", event_code);
        
        return true;
    }
    catch (err) {
    console.error("validateParticipant error:", err);
    alert("Error while validating participation.");
    return false;
  }
};

const fetchEventRoute = async(event_code: string) =>{
    console.log("Loading event route....");

    try{
        const token = await AsyncStorage.getItem('authToken');
        if (!token) return Alert.alert('Please log in first');

        const wpRes = await fetch(`${BASE_URL}/events/${event_code}/waypoints`);
        const tpRes = await fetch(`${BASE_URL}/events/${event_code}/trackpoints`);

        if (!wpRes.ok || !tpRes.ok) throw new Error("Failed route fetch");

        const wpJSON = await wpRes.json();
        const tpJSON = await tpRes.json();

        const parsedWpts = wpJSON.waypoints.map((wp: any) => ({
            latitude: wp.lat,
            longitude: wp.lon,
            name: wp.name || "WP",
        }));

        const parsedTrks = tpJSON.trackpoints.map((tp: any) => ({
            latitude: tp.lat,
            longitude: tp.lon,
        }));

        setWaypoints(parsedWpts);
        setTrackPoints(parsedTrks);

         // ✅ SAVE ROUTE FOR direction.tsx
        await AsyncStorage.setItem("waypoints", JSON.stringify(parsedWpts));
        await AsyncStorage.setItem("trackpoints", JSON.stringify(parsedTrks));
        await AsyncStorage.setItem("event_code", event_code);

        console.log("Waypoints parsed:", parsedWpts.length);
        console.log("Trackpoints parsed:", parsedTrks.length);
        alert("Route loaded successfully!");

        if (parsedWpts.length > 0 && parsedTrks.length > 0) {
            setRouteReady(true);
            router.push("/PARTICIPANTS/direction");
        }
    }
    catch (err) {
    console.error(err);
    alert("Route loading failed");
  }
};


const BEPass = async () => {
  try {
    console.log("Preparing fetching...");

    if (!eventCode || !eventCode.startsWith("EV")) {
      alert("Please enter a valid event code (e.g. EV02).");
      return;
    }

    // 1️⃣ Check if this user is registered for the event
    const ok = await validateParticipant(eventCode);
    if (!ok) return;

    // 2️⃣ Load GPX route for this event
    await fetchEventRoute(eventCode);

  } catch (jsonErr) {
    console.error("Upload error:", jsonErr);
    alert("Server did not return valid JSON. Check Laravel logs.");
  }
};

 // === RENDERING (simple, same spirit as your previous input screen) ===
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Direction to Next WP:</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter event code (e.g. EV02)"
        value={eventCode}
        onChangeText={setEventCode}
        autoCapitalize="characters"
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#DC2626" }]}
        onPress={BEPass}
      >
        <Text style={styles.buttonText}>Fetch the route</Text>
      </TouchableOpacity>
    </View>
  );
};



  export default ParticipantinEvent;


  const styles = StyleSheet.create({
 container: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a",
  },
    title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    },
    
    input: {
  width: "100%",
  borderWidth: 1,
  borderColor: "#ccc",
  padding: 8,
  borderRadius: 8,
  marginBottom: 10,
},
    button: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 8 },
buttonText: { color: 'white', marginLeft: 8, fontWeight: 'bold' },
toggleText :{    
  color: '#fff',
  fontWeight: 'bold',
},
toggleButton :{
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    marginHorizontal: 5,
},
activeButton : {
  backgroundColor: '#2563eb',
  borderColor: '#2563eb',
}, 
activeText : {
    color: '#fff',
},
toggleContainer : {
    flexDirection: 'row',
  justifyContent: 'center',
  marginVertical: 10,
}, 
});