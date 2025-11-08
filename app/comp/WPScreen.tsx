
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getDistance } from 'geolib'; // To calculate distance between two points
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BASE_URL } from '../admin_page/newfileloader';
import getBearing from '../comp/GPXfunction';



const execution = () => {

    const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
    const [fileUri, setFileUri] = useState<string | null>(null);
    const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
    const [distanceToNext, setDistanceToNext] = useState(0);
    const [bearing, setBearing] = useState(0);
    const [eta, setEta] = useState(0);
    const [speed, setSpeed] = useState(10); // Example speed in km/h

type Waypoint = {
  name: string | null;
  latitude: number;
  longitude: number;
}
type TrackPoint = {
  '@_lat': string;
  '@_lon': string;
};

  type Position = {
    latitude: number;
    longitude: number;
  };



//fetch the waypoint 

  const fetchWaypoints  = async () => {
    try{

      console.log('Preparing fetching...');

          const response = await fetch(`${BASE_URL}/waypoints`);
          const result = await response.json();
          console.log('Fetched result:', result);

           if (result?.waypoints  && Array.isArray(result.waypoints) ) {
           
              const normalized = result.waypoints.map((w: any) => ({
                name: w.name ?? null,
                latitude: parseFloat(w.lat),
                longitude: parseFloat(w.lon),
              }));

              setWaypoints(normalized);
              alert('Waypoints fetched successfully!');

          } else {
            alert('No waypoints found.');
          }

    }catch(jsonErr){
      console.error('Fetching error:', jsonErr);
      alert('Server did not return valid JSON. Check Laravel logs.');
    }
  };

  const surrender_notification = async() => {
     try {
 await fetch(`${BASE_URL}/api/notify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'surrender',
        participant_id: 23, // or get from auth/token
        message: 'Participant has surrendered',
      }),
    });
    alert('Surrender notification sent');
  } catch (error) {
    console.error('Surrender error:', error);
    alert('Failed to send surrender notification');
  }
  };

   const help_notification = async() => {
  try {
    await fetch(`${BASE_URL}/api/notify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'help',
        participant_id: 23,
        message: 'Participant needs help',
      }),
    });
    alert('Help notification sent');
  } catch (error) {
    console.error('Help error:', error);
    alert('Failed to send help notification');
  }
  };


  const calculateBearingToNextWaypoint = () => {
      if(currentPosition && waypoints.length > 0){
        const nextWaypoint = waypoints[1];
        if (nextWaypoint) {
          const bearing = getBearing(
                    currentPosition.latitude,
                    currentPosition.longitude,
                    nextWaypoint.latitude,
                    nextWaypoint.longitude
                  );
          return bearing;
        }
      }
  
      return 0;
    };


  useEffect( ()=>{
      const bearing = calculateBearingToNextWaypoint();
      console.log('Bearing:', bearing);
  }, [currentPosition, waypoints] );

    const updatePosition = () => {
      // Simulate current position (e.g., GPS or mock data)
      
      setCurrentPosition({
        latitude: 46.928,
        longitude: 17.867,
      });
    };
  
    useEffect(() => {
      updatePosition();
    }, []);
  

useEffect( () => { 
   
    if (currentPosition && waypoints.length > 1) {

        console.log('Current Position:', currentPosition);
        console.log('Next WP:', waypoints[1]);

      const nextWaypoint = waypoints[1]; // Assume the next waypoint is the second one

      if (nextWaypoint) {
        const bearingToNextWaypoint = getBearing(
          currentPosition.latitude,
          currentPosition.longitude,
          nextWaypoint.latitude,
          nextWaypoint.longitude
        );
        setBearing(bearingToNextWaypoint);

        const distance = getDistance(
          { latitude: currentPosition.latitude, longitude: currentPosition.longitude },
          { latitude: nextWaypoint.latitude, longitude: nextWaypoint.longitude }
        );
        setDistanceToNext(distance / 1000); // Convert meters to kilometers

        const etaInHours = distance / 1000 / speed; // ETA in hours
        setEta(etaInHours * 60); // Convert to minutes
      }
    }
  }, [currentPosition, waypoints, speed]);

  const router = useRouter();
    return (
        <View style={styles.container}>
            
            <Text style={styles.title}>Direction to Next WP in1:</Text>
               
                <TouchableOpacity style={[styles.button, { backgroundColor: '#DC2626' }]}>
                    <Text style={styles.buttonText} onPress={fetchWaypoints} >fetch the route</Text>
                  </TouchableOpacity>

          {/* Display Distance, ETA, and Speed */}
            <Text>Bearing: {bearing.toFixed(1)}°</Text>
            <Text>Distance: {distanceToNext.toFixed(2)} km</Text>
            <Text>ETA: {eta.toFixed(1)} minutes</Text>

          {bearing !== null && (
            <View style={styles.arrowContainer}>
              <Ionicons
                name="arrow-up-outline"
                size={40}
                color="blue"
                style={{ transform: [
                  { 
                   rotate: isNaN(bearing) ? '0deg' : `${bearing.toFixed(1)}deg`,
                  },], 
                }}
              />
              <Text>Bearing: {bearing.toFixed(1)}°</Text>
              <Text style={{ textAlign: 'center' }}>Direction</Text>
            </View>
          )}

            <TouchableOpacity style={[styles.button, { backgroundColor: '#DC2626' }]}>

                  <MaterialCommunityIcons name="alert-circle-outline" size={20} color="white" />
                  <Text style={styles.buttonText} onPress={help_notification}>HELP</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { backgroundColor: '#6B7280' }]}>
                  <MaterialCommunityIcons name="exit-run" size={20} color="white" />
                  <Text style={styles.buttonText} onPress={surrender_notification}>Surrender</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                 style={[styles.button, { backgroundColor: '#EF4444' }]} // red
                 onPress={() => router.push('/')}> 

                <Text style={styles.buttonText}>Back to Login</Text>
                </TouchableOpacity>


        </View>

    );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    outlineColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: 300,
    marginTop: 20,
  },
  dataContainer: {
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 10,
    flex: 1,
  }, 
  text: {
    fontSize: 16,
    marginVertical: 5,
  },  
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  arrowContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
    button: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 8 },
    buttonText: { color: 'white', marginLeft: 8, fontWeight: 'bold' },


});

export default execution;

