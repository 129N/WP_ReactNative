
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getDistance } from 'geolib'; // To calculate distance between two points
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BASE_URL } from '../admin_page/newfileloader';
import getBearing from '../comp/GPXfunction';

import AsyncStorage from '@react-native-async-storage/async-storage';

//TrackPoint
import type { LocationObject } from 'expo-location';
import * as Location from "expo-location";
import type { TaskManagerError } from 'expo-task-manager';
import * as TaskManager from 'expo-task-manager';
import Svg, { Circle, Line } from 'react-native-svg';



// Location Task
  const LOCATION_TASK = 'LOCATION_TRACKING_TASK';

  TaskManager.defineTask(LOCATION_TASK, async ({data, error} : {
    data? : { locations: LocationObject[] };
    error? : TaskManagerError | null;
  })=>{
    if(error){
    console.error("Task error:", error);
    return;
    }

    if(data && data.locations && data.locations.length > 0){
      const location = data.locations[0];
      console.log("📍 Background location:", location.coords);
      await AsyncStorage.setItem('lastlocation', JSON.stringify(location.coords));
    }
  });

const execution = () => {
    const [coordinates, setCoordinates] = useState<{ latitude: number, longitude: number } | null>(null);
    const [trackPoints, setTrackPoints] = useState<TrackPoint[]>([]);
    const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
    const [fileUri, setFileUri] = useState<string | null>(null);
    const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
    const [distanceToNext, setDistanceToNext] = useState(0);
    const [bearing, setBearing] = useState(0);
    const [eta, setEta] = useState(0);
    const [speed, setSpeed] = useState(10); // Example speed in km/h

    // const [interval, setInterval] = useState<number[] | null>([]);
    //toggle mode 
    const [viewmode, setViewMode] = useState<'waypoints'| 'trackpoints'>('waypoints');

type Waypoint = {
  name: string;
  latitude: number;
  longitude: number;
}
type TrackPoint = {
  // '@_lat': string;
  // '@_lon': string;
  latitude : number;
  longitude : number;
};

  type Position = {
    latitude: number;
    longitude: number;
  };


  //Trackpoints function
  useEffect(()=>{
    const startTracking = async() => {
      const {status:fg} = await Location.requestForegroundPermissionsAsync();
      const {status:bg} = await Location.requestBackgroundPermissionsAsync();

      if (fg !== 'granted' || bg !== 'granted') {
        alert('Permission denied');
        return;
      }

      const isTaskRunning = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK);
      if(!isTaskRunning){
        await Location.startLocationUpdatesAsync(LOCATION_TASK, {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, 
          distanceInterval: 5, 
          foregroundService:{
            notificationTitle: 'Waypoint Tracker Active',
            notificationBody: 'Tracking your progress even when app is closed',
          },
        });
      }
    };


    startTracking();
  }, []);
  

const BEPass = async () => {
    try{

      console.log('Preparing fetching...');
          //preapring fetching here (also trackpoints are included)
          const response = await fetch(`${BASE_URL}/filefetch`);
    
          if(response.ok){
          const result = await response.json();
          console.log('Upload success:');

          //convert data shape
          const wpArray = result.waypoints?.map((wp: any)=>({
            name: wp.name || "Unnamed",
            latitude: parseFloat(wp.lat),
            longitude: parseFloat(wp.lon),
          })) || [];

          const TrkArray = result.trackpoints?.map((tp:any) => ({
            latitude: parseFloat(tp.lat),
            longitude: parseFloat(tp.lon),
          })) || [];


          setWaypoints(wpArray);
          setTrackPoints(TrkArray);

          // console.log("Waypoints parsed:", wpArray);
          console.log("Waypoints parsed:", true);
          console.log("Trackpoints parsed:", true);
          alert('Fetching is success!');
          }else{
        console.log('Upload failed:');
          alert('Fetching is fail!');
          }

    }
    
    catch(jsonErr){
      console.error('Upload error:', jsonErr);
      alert('Server did not return valid JSON. Check Laravel logs.');
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
      setBearing(bearing);
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
  

    //positon updating
useEffect( () => { 
   
    if (currentPosition && waypoints.length > 1 && trackPoints.length > 1) {
    console.log('waypoints:',true );
    console.log('trackpints', true);
    if (waypoints.length < 2) {
      console.warn('Not enough waypoints to calculate distance!');
    }
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

  //interval 
  useEffect(()=> {
    const interval = setInterval(async () =>{
      const saved = await AsyncStorage.getItem('lastLocation');
      if (saved) setCurrentPosition(JSON.parse(saved));
    }, 5000 ); //every 5 seconds

    return () => clearInterval(interval);
  }, []);


    return (
      <View style={styles.container}>

    <View style={styles.toggleContainer}>
      <TouchableOpacity
        style={[
          styles.toggleButton,
          viewmode === 'waypoints' && styles.activeButton,
        ]}
        onPress={() => setViewMode('waypoints')}
      >
        <Text
          style={[
            styles.toggleText,
            viewmode === 'waypoints' && styles.activeText,
          ]}
        >
          Waypoints
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.toggleButton,
          viewmode === 'trackpoints' && styles.activeButton,
        ]}
        onPress={() => setViewMode('trackpoints')}
      >
        <Text
          style={[
            styles.toggleText,
            viewmode === 'trackpoints' && styles.activeText,
          ]}
        >
          Track Points
        </Text>
      </TouchableOpacity>
    </View>
        {/* Display Distance, ETA, and Speed */}

        <Text style={styles.title}>Direction to Next WP:</Text>
        {/* <Button title="Load GPX File" onPress={fileload_map} /> */}
  
        <TouchableOpacity style={[styles.button, { backgroundColor: '#DC2626' }]}>
            <Text style={styles.buttonText} onPress={BEPass} >fetch the route</Text>
        </TouchableOpacity>


          <Text>Bearing: {bearing ? bearing.toFixed(1) : '---'}°</Text>
          <Text>Distance: {distanceToNext ? distanceToNext.toFixed(2) : '---'} km</Text>
          <Text>ETA: {eta ? eta.toFixed(1) : '---'} minutes</Text>

        {/* Waypoints */}
        { viewmode === 'waypoints' ? (
        <>
          <Text style={styles.title}>🟢 Waypoints Mode</Text>
          {bearing !== null && (
          <View style={styles.arrowContainer}>
            <Ionicons
              name="arrow-up-outline"
              size={40}
              color="blue"
              style={{ transform: [{ rotate: `${bearing}deg` }] }}
            />
            <Text>Bearing: {bearing.toFixed(1)}°</Text>
            <Text style={{ textAlign: 'center' }}>Direction</Text>
          </View>
          )}
        </>
            ) : (
              // TrackPoints
              <>                
                <Text style={styles.title}>🔵 Track Point Mode</Text>

              {Array.isArray(trackPoints) && trackPoints.length>1 && (
                <>

                  <Svg height="300" width="100%">
                      {trackPoints.map((tp, index) => {
                        if (index === 0) return null;
                        const prev = trackPoints[index - 1];

                        const currLat = tp.latitude;
                        const currLon = tp.longitude;
                        const prevLat = prev.latitude;
                        const prevLon = prev.longitude;


                        if (isNaN(currLat) || isNaN(currLon) || isNaN(prevLat) || isNaN(prevLon)) {
                          return null; // skip invalid data
                        }

                                // Normalize coordinates
                          const baseLat = trackPoints[0].latitude;
                          const baseLon = trackPoints[0].longitude;

                          const x1 = (prevLon - baseLon) * 100000 + 50;  // scale & offset
                          const y1 = 150 - (prevLat - baseLat) * 100000;
                          const x2 = (currLon - baseLon) * 100000 + 50;
                          const y2 = 150 - (currLat - baseLat) * 100000;

                        return (
                          <Line
                            key={`line-${index}`}
                            x1={index * 10}
                            y1={150 + Math.sin(index / 5) * 20}
                            x2={(index - 1) * 10}
                            y2={150 + Math.sin((index - 1) / 5) * 20}
                            stroke="#1E90FF"
                            strokeWidth="3"
                          />
                        );
                      })}

                      {trackPoints.map((tp, index) => {
                        const baseLat = tp.latitude;
                        const baseLon = tp.longitude;
                        if (isNaN(baseLat) || isNaN(baseLon)) return null;
                        return (
                          <Circle
                            key={`tp-${index}`}
                            cx={index * 10}
                            cy={150 + Math.sin(index / 5) * 20}
                            r="4"
                            fill="#1E90FF"
                          />
                        );
                      })}
                    </Svg>
                </>
              )}

       
            
              </>
            )}
              
                {/* Current position marker */}
{currentPosition && trackPoints.length > 0 && (
  <Circle
    cx={
      (currentPosition.longitude - trackPoints[0].longitude) * 100000 + 50
    }
    cy={
      150 - (currentPosition.latitude - trackPoints[0].latitude) * 100000
    }
    r="5"
    fill="red"
  />
)}

                <TouchableOpacity style={[styles.button, { backgroundColor: '#DC2626' }]}>
                    <MaterialCommunityIcons name="alert-circle-outline" size={20} color="white" />
                    <Text style={styles.buttonText}>HELP</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button, { backgroundColor: '#6B7280' }]}>
                    <MaterialCommunityIcons name="exit-run" size={20} color="white" />
                    <Text style={styles.buttonText}>Surrender</Text>
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

export default execution;

{/**
    
     useEffect( () => {

    let subscriber: Location.LocationSubscription;

    const startTracking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }



    subscriber = await Location.watchPositionAsync(
        {
        accuracy: Location.Accuracy.High,
        timeInterval: 3000,  // every 3 seconds
        distanceInterval: 1, // or every 1 meter
      },
      (location) => {
        const { latitude, longitude } = location.coords;
        const newPosition = { latitude, longitude };
        setCurrentPosition(newPosition);

        // Calculate distance, bearing, ETA
        if (waypoints.length > 1) {
          const nextWaypoint = waypoints[1]; // or your next target
          const distance = getDistance(newPosition, {
            latitude: nextWaypoint.latitude,
            longitude: nextWaypoint.longitude,
          });

          setDistanceToNext (distance/1000);

            const bearingToNext = getBearing(
                        latitude,
                        longitude,
                        nextWaypoint.latitude,
                        nextWaypoint.longitude
                    );
                setBearing(bearingToNext);

          const etaInHours = distance / 1000 / speed;
          setEta(etaInHours * 60); // ETA in minutes
            } 
        } 
        );
        }; 

        startTracking();

        return() => {
             if (subscriber) {
      subscriber.remove();
    }
        };

}, [waypoints, speed]);
    */}