
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { XMLParser } from 'fast-xml-parser';
import { getDistance } from 'geolib'; // To calculate distance between two points
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import getBearing from '../comp/GPXfunction';



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

type Waypoint = {
  name: string;
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

  const fileload_map= async ()=> {
    try{
        const result = await DocumentPicker.getDocumentAsync({ type: 'application/gpx+xml' });


        if(
        result.assets && result.assets.length > 0 && 
        result.assets[0].name.endsWith('.gpx')
        ){
            const fileUri = result.assets[0].uri;
             setFileUri(fileUri); // Save it to state

             console.log('File URI:', fileUri);

            const gpxText = await fetch(fileUri).then(res => res.text());

            const parser = new XMLParser({
                    ignoreAttributes: false,
                    ignoreDeclaration: true,
                    ignorePiTags: true,
                  });


            const parsedData = parser.parse(gpxText);

      // Extract waypoints and use the first one as the center point
      const waypoints = parsedData?.gpx?.wpt || [];
      const trackPoints = parsedData?.gpx?.trk?.trkseg?.trkpt || [];
        
      const parsedWaypoints: Waypoint[] = (waypoints || []).map((wpt: any) => ({
        name: wpt.name?.['#text'] || 'Unnamed',
        latitude: parseFloat(wpt['@_lat']),
        longitude: parseFloat(wpt['@_lon']),
      }));

      setWaypoints(parsedWaypoints);
      setTrackPoints(trackPoints);
      

        if (parsedWaypoints.length > 0) {
          const firstWaypoint = parsedWaypoints[0];
      
          setCoordinates({ latitude: firstWaypoint.latitude, longitude: firstWaypoint.longitude });
          alert('FE: The waypoint uploaded successfully!');
        } else {
          alert('No waypoints found in the GPX file.');
        }
    }

    }catch(map_err){
         console.error('Error picking file:', map_err);
      alert('Error picking the file. Please try again.');
    }
  };
//upload function finish 

//fetch the waypoint 

  const BEPass = async () => {
    try{

      console.log('Preparing fetching...');

          const response = await fetch('http://192.168.0.101:8001/api/waypoints');
    
          const result = await response.json();
          console.log('Upload success:', result);
          alert('Fetching is success!');

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






    return (
        <View style={styles.container}>
            
            <Text style={styles.title}>Direction to Next WP:</Text>
                 <Button title="Load GPX File" onPress={fileload_map} />
            
                 <TouchableOpacity style={[styles.button, { backgroundColor: '#DC2626' }]}>
                     <Text style={styles.buttonText} onPress={BEPass} >fetch the route</Text>
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
            style={{ transform: [{ rotate: `${bearing}deg` }] }}
          />
          <Text>Bearing: {bearing.toFixed(1)}°</Text>
          <Text style={{ textAlign: 'center' }}>Direction</Text>
        </View>
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