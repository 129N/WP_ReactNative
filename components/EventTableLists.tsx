import { BASE_URL } from '@/app/admin_page/newfileloader';
import { Colors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';




// {
//   "id": 1,
//   "event_code": "EV01",
//   "event_title": "Dummy event",
//   "description": "adm description",
//   "event_date": "2025-10-07T19:17:09.545Z",
//   "creator_name": "Administrator"
// }

type Event = {
  id: number;
  event_title: string;
  description: string;
  event_date: string;
  creator_name: string;
};


export default function EventTableLists(){

const [events, setEvents] = useState<any[]>([]);

//another const 
  const { id } = useLocalSearchParams<{ id: string }>(); 
 const [event, setEvent] = useState <Event | null>(null);

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


  // useEffect(() => {
  //  fetch(`${BASE_URL}/events/${id}`)
  //     .then((res) => res.json())
  //     .then(setEvent);
  // }, [id]);


//  if (!event) return <Text>Loading...</Text>;

  return(
    <ScrollView style={styles.container}>
      <Text>Fetched event list</Text>

      <TouchableOpacity style={styles.fetchbutton} onPress={fetchEvents}>
          <Text style={styles.fetchbuttonText}>Reload</Text>
        </TouchableOpacity>

{/* Does the map fetch the eventList automatically? */}
         {events.length > 0 ? (
        events.map((event, index) => (
          <View>

            <View style={styles.eventInfo}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>{event.event_title}</Text>
                    <Text>{event.description}</Text>
                    <Text>{new Date(event.event_date).toLocaleString()}</Text>
                    <Text>Created by: {event.creator_name}</Text>
                    <Text>Event Code {event.event_code}</Text>
            </View>


{/* View details */}
            <TouchableOpacity
                style={[styles.button, styles.viewButton]}
                onPress={() =>
                  router.push({
                    pathname: "/comp/Event_Registration",
                    params: { id: event.id },
                  })
                }
              >
                <Text style={styles.buttonText}>View</Text>
              </TouchableOpacity>


{/* Delete button */}
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
              <Text style = {styles.buttonText}> Delete</Text>
            </TouchableOpacity>
          </View>


        ))
      ) : (
        <Text>No events yet</Text>
      )}


    </ScrollView>


  );



};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor:  Colors.light.background,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.pallete.black,
    marginBottom: 16,
    textAlign: "center",
  },
  eventCard: {
    backgroundColor: Colors.dark.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  eventInfo: {
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: 'black',
    marginBottom: 4,
  },
  eventText: {
    fontSize: 15,
    color: Colors.textPrimary.gray,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  viewButton: {
    backgroundColor: Colors.orange.background, // e.g., blue
  },
  buttonText: {
    color: 'white',
    fontWeight: "600",
    fontSize: 15,
  },
  emptyText: {
    textAlign: "center",
    color: Colors.textPrimary.gray,
    fontSize: 16,
    marginTop: 40,
  },
     fetchbutton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
      },
      fetchbuttonText  :{
           color: 'white',
        fontSize: 16,
        fontWeight: '600',
      }
});