// components/EventSelector.tsx
import { BASE_URL } from "@/app/admin_page/newfileloader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Picker, StyleSheet, Text, View } from "react-native";


interface Event {
  id: number;
  event_title: string;
  event_code: string;
}

interface Props {
  onSelect: (eventId: number) => void;
}

export default function EventSelector({ onSelect }: Props) {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const token = await AsyncStorage.getItem("authToken");
      try {
        const res = await fetch(`${BASE_URL}/events`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setEvents(data);
        } else {
          console.error("Failed to fetch events:", data);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select an Event:</Text>
      <Picker
        selectedValue={selectedEvent}
        onValueChange={(value) => {
          setSelectedEvent(value);
          onSelect(value);
        }}
      >
        <Picker.Item label="-- Choose Event --" value={null} />
        {events.map((event) => (
          <Picker.Item
            key={event.id}
            label={`${event.event_code} - ${event.event_title}`}
            value={event.id}
          />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10 },
  label: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 5 },
});
