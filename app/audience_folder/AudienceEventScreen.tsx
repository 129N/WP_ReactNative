import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { BASE_URL } from "../admin_page/newfileloader";
import AudienceMapView from "./AudienceMapView";
import AudienceParticipantList from "./AudienceParticipantList";
// Types copied from your adminPanel.tsx (simplified)
type Event = {
  id: number;
  event_title: string;
  description: string;
  event_date: string;
  creator_name: string;
  event_code: string;
};

export interface Waypoint {
  id: number;
  name: string | null;
  lat: number;
  lon: number;
}

export interface TrackPoint {
  id: number;
  lat: number;
  lon: number;
  ele?: number;
}

export interface Participant {
  id: number;
  user_id: number;
  name: string;
  email: string;
  team: string | null;
  status: string;
}


export default function AudienceEventScreen() {

    const [eventCode, setEventCode] = useState("");
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    const [participants, setParticipants] = useState<Participant[]>([]);
    const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
    const [trackpoints, setTrackpoints] = useState<TrackPoint[]>([]);

    const [loading, setLoading] = useState(false);


    const handleloadEvent = async() => {
        if(!eventCode.trim()){
            Alert.alert("Error", "Please enter an event code (e.g. EV01)."); return;
        }
        try{
            setLoading(true);
            
            const res = await fetch(`${BASE_URL}/events/${eventCode}`);
            if (!res.ok) {
                throw new Error("Event not found");
            }

      const eventData: Event = await res.json();
      Alert.alert(
        "Load Event?",
        `Title: ${eventData.event_title}\nAdmin: ${eventData.creator_name}\nDate: ${eventData.event_date}`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "OK",
            onPress: async () => {
              setSelectedEvent(eventData);
              // kick off first data fetch
              await fetchParticipants(eventData.event_code);
              await fetchRouteData(eventData.event_code);
              Alert.alert("Success", "Event loaded for audience view.");
            },
          },
        ]
      );

        } catch (err: any) {
            console.error("handleLoadEvent error:", err);
            Alert.alert("Error", err.message || "Failed to load event.");
        } finally {
        setLoading(false);
        }
    };

const fetchParticipants = async(event_code: string) => {
     try {
      const res = await fetch(`${BASE_URL}/events/${event_code}/participants`);
      if (!res.ok) throw new Error("Failed to fetch participants");

      const data: Participant[] = await res.json();
      setParticipants(data);
    } catch (err) {
      console.error("fetchParticipants error:", err);
    }
};

const fetchRouteData = async(event_code:string) => {
    try {
      const wRes = await fetch(`${BASE_URL}/events/${event_code}/waypoints`);
      const tRes = await fetch(`${BASE_URL}/events/${event_code}/trackpoints`);

      if (!wRes.ok || !tRes.ok) throw new Error("Route fetch failed");

      const wJson = await wRes.json();
      const tJson = await tRes.json();

      const wp: Waypoint[] = wJson.waypoints;
      const tr: TrackPoint[] = tJson.trackpoints;

      setWaypoints(wp);
      setTrackpoints(tr);
    } catch (err) {
      console.error("fetchRouteData error:", err);
    }
};

  // Auto-refresh loop (only when event loaded)
  useEffect(() => {
    if (!selectedEvent) return;
    const code = selectedEvent.event_code;

    const interval = setInterval(() => {
      fetchParticipants(code);
      fetchRouteData(code);
    }, 5000); // 5 seconds for audience

    return () => clearInterval(interval);
  }, [selectedEvent]);

// RENDERING ZONE  
    return(
<View style={styles.container}>
      {/* Event info bar */}
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>
          {selectedEvent ? selectedEvent.event_title : "No event loaded"}
        </Text>
        <Text style={styles.eventSubtitle}>
          {selectedEvent
            ? `Code: ${selectedEvent.event_code} · Admin: ${selectedEvent.creator_name}`
            : "Enter event code below"}
        </Text>
      </View>

      {/* Event code input */}
      <View style={styles.codeRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter event code (e.g. EV02)"
          value={eventCode}
          onChangeText={setEventCode}
        />
        <Button title="Load" onPress={handleloadEvent} />
      </View>

      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator />
          <Text>Loading event...</Text>
        </View>
      )}

      {/* Map + List layout for mobile: map on top, list below */}
      <View style={styles.mapArea}>
        <AudienceMapView waypoints={waypoints} trackpoints={trackpoints} />
      </View>

      <View style={styles.listArea}>
        <AudienceParticipantList participants={participants} />
      </View>
    </View>
    );
};


const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  eventInfo: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#f2f2f2",
  },
  eventTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  eventSubtitle: {
    fontSize: 12,
    color: "#555",
    marginTop: 2,
  },
  codeRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingBottom: 8,
    alignItems: "center",
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
  },
  loading: {
    paddingHorizontal: 12,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  mapArea: {
    flex: 2,
  },
  listArea: {
    flex: 1.5,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
});