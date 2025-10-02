import { BASE_URL } from '@/app/admin_page/newfileloader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';


export default function EventTableLists(){

const [events, setEvents] = useState<any[]>([]);


const fetchEvents = async ()=>{

  const token = await AsyncStorage.getItem('authToken');
  try{

    const response = await fetch(`${BASE_URL}/events`, {
      headers:{
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    const data = await response.json();
    if (response.ok) {
        setEvents(data); // your EventController@index should return a list
      } else {
        console.warn('Failed to fetch:', data);
      }

  }catch(error){
    console.error("Error ", error);
  }
};


const deleteEvent = async (id: number) => {
    const token = await AsyncStorage.getItem('authToken');
    try {
      const res = await fetch(`${BASE_URL}/events/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert('Success', 'Event deleted successfully');
        // Refresh the list
        fetchEvents();
      } else {
        Alert.alert('Failed', data.error || 'Could not delete event');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Something went wrong');
    }
  };


  useEffect(() => {
  
  }, []);

  return(
    <ScrollView style={styles.container}>
      <Text>Fetched event list</Text>
      {/* DELETE BUTTON */}


      {/* FETCH BUTTON */}

      
      {/* Registration BUTTON */}


         {events.length > 0 ? (
        events.map((event, index) => (
          <TouchableOpacity
            key={index}
            style={styles.eventCard}
            onPress={() =>
              Alert.alert(
                'Delete Event',
                `Are you sure you want to delete ${event.event_title}?`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'OK', onPress: () => deleteEvent(event.id) },
                ]
              )
            }
          >
            <Text style={styles.eventText}>📌 {event.event_title}</Text>
            <Text style={styles.eventText}>📝 {event.description}</Text>
            <Text style={styles.eventText}>👤 {event.event_creatorName}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text>No events yet</Text>
      )}


    </ScrollView>


  );



};



const styles = StyleSheet.create({
container: { padding: 20 },
  eventCard: {
    backgroundColor: '#2c2c2e',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  eventText: { color: '#fff' },
})
