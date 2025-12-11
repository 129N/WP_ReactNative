
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDistance } from 'geolib'; // To calculate distance between two points
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BASE_URL } from '../admin_page/newfileloader';
import getBearing from '../comp/GPXfunction';

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
const [visibleTrackPoints, setVisibleTrackPoints] = useState<TrackPoint[]>([]);

    // const [interval, setInterval] = useState<number[] | null>([]);
    //toggle mode 
    const [viewmode, setViewMode] = useState<'waypoints'| 'trackpoints'>('waypoints');


    // 1. Find nearest trackpoint to the user ---
    let nearestIndex = 0;

    if(currentPosition && trackPoints.length > 0){
      let nearestDistance = Infinity;

      trackPoints.forEach((tp, i) => {
          const dist = getDistance(
            currentPosition,
            { latitude: tp.latitude, longitude: tp.longitude }
          );
          if (dist < nearestDistance) {
            nearestDistance = dist;
            nearestIndex = i;
          }
      });

    }

    // --- 2. Pick next 5 trackpoints ONLY ---
    // const visible = trackPoints.slice(nearestIndex, nearestIndex + 5);

    //Normalize GPS coordinates 
    const lats = visibleTrackPoints.map(tp => tp.latitude);
    const lons = visibleTrackPoints.map(tp => tp.longitude);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);



const R = 6378137; // Earth radius in meters

function lonToX(lon: number) {
  return R * (lon * Math.PI / 180);
}

function latToY(lat: number) {
  return R * Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360));
}


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


 useEffect(() => {
  if (!currentPosition || trackPoints.length < 2) return;

  // Find nearest trackpoint
  let nearestIndex = 0;
  let nearestDistance = Infinity;

  for (let i = 0; i < trackPoints.length; i++) {
    const dist = getDistance(
      currentPosition,
      { latitude: trackPoints[i].latitude, longitude: trackPoints[i].longitude }
    );
    if (dist < nearestDistance) {
      nearestDistance = dist;
      nearestIndex = i;
    }
  }

  // Take NEXT 5 points
  const upcoming = trackPoints.slice(nearestIndex, nearestIndex + 5);

  setVisibleTrackPoints(upcoming);
}, [currentPosition, trackPoints]);

  

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
  
        <TouchableOpacity style={[styles.button, { backgroundColor: '#DC2626' }]} >
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

{Array.isArray(trackPoints) && trackPoints.length > 1 && (
  (() => {

    const svgWidth = 360;
    const svgHeight = 400;

    const lats = visibleTrackPoints.map(tp => tp.latitude);
    const lons = visibleTrackPoints.map(tp => tp.longitude);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);
// ADD PADDING (VERY IMPORTANT)
const padding = 30;

//ranges 
    const lonRange = maxLon - minLon || 1e-6;
    const latRange = maxLat - minLat || 1e-6;
    
// MAINTAIN ASPECT RATIO (CRITICAL FIX)
const scale = Math.min(
  (svgWidth - padding * 2) / lonRange,
  (svgHeight - padding * 2) / latRange
);

// CENTERING OFFSET
const xOffset = (svgWidth - lonRange * scale) / 2;
const yOffset = (svgHeight - latRange * scale) / 2;

    const project = (lat:number, lon:number) => {
      // const x = ((lon - minLon) / lonRange) * svgWidth;
      // const y = svgHeight - ((lat - minLat) / latRange) * svgHeight;
      const x = xOffset + (lon - minLon) * scale;
      const y = svgHeight - (yOffset + (lat - minLat) * scale);
      return { x, y };
    };

    return (
      <Svg height={svgHeight} width={svgWidth}>

        {/* LINES */}
        {visibleTrackPoints.map((tp, index) => {
          if (index === 0) return null;
          const curr = project(tp.latitude, tp.longitude);
          const prev = project(
            visibleTrackPoints[index - 1].latitude,
            visibleTrackPoints[index - 1].longitude
          );
          return (
            <Line
              key={`line-${index}`}
              x1={prev.x}
              y1={prev.y}
              x2={curr.x}
              y2={curr.y}
              stroke="#1E90FF"
              strokeWidth={3}
            />
          );
        })}

        {/* BLUE DOTS */}
        {visibleTrackPoints.map((tp, idx) => {
          const p = project(tp.latitude, tp.longitude);
          return (
            <Circle
              key={`tp-${idx}`}
              cx={p.x}
              cy={p.y}
              r={4}
              fill="#1E90FF"
            />
          );
        })}

        {/* RED USER DOT */}
        {currentPosition && (() => {
          const clampedLat = Math.min(Math.max(currentPosition.latitude,  minLat), maxLat);
          const clampedLon = Math.min(Math.max(currentPosition.longitude, minLon), maxLon);
          const p = project(clampedLat, clampedLon);
          // const circleX = xOffset + (currentPosition.longitude - minLon) * scale;
          // const circleY = svgHeight; 
          
          return (
            <Circle
              cx={svgWidth / 2}
              cy={svgHeight - 10}
              r={6}
              fill="red"
            />
          );
        })()}

      </Svg>
    );
  })()    // <-- FIXED: CALL THE FUNCTION HERE
)}

            
              </>
            )}
              
                {/* Current position marker */}
{/* {currentPosition && trackPoints.length > 0 && (
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
)} */}

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

