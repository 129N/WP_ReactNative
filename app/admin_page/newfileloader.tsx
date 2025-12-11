import { ThemedText } from '@/components/ThemedText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import { XMLParser } from 'fast-xml-parser';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

type Waypoint = {
  name: string;
  latitude: number;
  longitude: number;
}
type RawTrackPoint  = {
  '@_lat': string;
  '@_lon': string;
  ele?: { '#text': string};
};

type TrackPoint = {
  latitude: number;
  longitude: number;
  elevation?: number;
};

//export const BASE_URL = 'http://192.168.0.103:8001/api';
//the URL is made throught the ngrok function 'https://abc123.ngrok.io/api';
export const BASE_URL = 'https://f036bc02211b.ngrok-free.app/api';

const GPXLoader = () => {

  const [coordinates, setCoordinates] = useState<{ latitude: number, longitude: number } | null>(null);
  const [trackPoints, setTrackPoints] = useState<TrackPoint []>([]);
  const [rawTrackPoints, setRawTrackPoints] = useState<RawTrackPoint[]>([]);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [fileUri, setFileUri] = useState<string | null>(null);

  // Function to pick and parse the GPX file
  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/gpx+xml' });

      // Check if a valid GPX file was selected
      if (
        result.assets && result.assets.length > 0 && 
        result.assets[0].name.endsWith('.gpx')
      ) 
      {
        const fileUri = result.assets[0].uri;
        setFileUri(fileUri); // Save it to state

        console.log('File URI:', fileUri);


        const gpxText = await fetch(fileUri).then(res => res.text());


       // Parse the GPX content
       const parser = new XMLParser({
        ignoreAttributes: false,
        ignoreDeclaration: true,
        ignorePiTags: true,
      });

      const parsedData = parser.parse(gpxText);

      // Extract waypoints and use the first one as the center point
      //const waypoints = parsedData?.gpx?.wpt || [];

      // Waypoints
      const rawWaypoints = parsedData?.gpx?.wpt || [];
      const parsedWaypoints: Waypoint[] = rawWaypoints.map((wpt: any) => ({
        name: wpt.name?.['#text'] || 'Unnamed',
        latitude: parseFloat(wpt['@_lat']),
        longitude: parseFloat(wpt['@_lon']),
      }));
      setWaypoints(parsedWaypoints);


      //const trackPoints = parsedData?.gpx?.trk?.trkseg?.trkpt.ele? || [];

      const trkseg = parsedData?.gpx?.trk?.trkseg;
      const allTrackPointsRaw = Array.isArray(trkseg)
      ? trkseg.flatMap((seg: any) => seg.trkpt || [])
      : (trkseg?.trkpt || []);

      const parsedTrackPoints: TrackPoint[] = (allTrackPointsRaw || []).map((wpt: RawTrackPoint) => ({
        latitude: parseFloat(wpt['@_lat']),
        longitude: parseFloat(wpt['@_lon']),
        elevation: wpt.ele ? parseFloat(wpt.ele['#text']) : undefined,
      }));

      setTrackPoints(parsedTrackPoints);
    setRawTrackPoints(allTrackPointsRaw); 



        if (parsedWaypoints.length > 0) {
          const firstWaypoint = parsedWaypoints[0];
      
          setCoordinates({ latitude: firstWaypoint.latitude, longitude: firstWaypoint.longitude });
          alert('FE: The waypoint uploaded successfully!');
        } else {
          alert('No waypoints found in the GPX file.');
        }
      } 

    } catch (error) {
      console.error('Error picking file:', error);
      alert('Error picking the file. Please try again.');
    }
  };




   //  const gpxText = await fetch(fileUri).then(res => res.text());

        //   const parser = new XMLParser({
        //               ignoreAttributes: false,
        //               ignoreDeclaration: true,
        //               ignorePiTags: true,
        //           });

        // const parsedData = parser.parse(gpxText);

        // const waypoints = parsedData?.gpx?.wpt || [];

        // if (!waypoints.length) {
        //             alert('No waypoints found in the GPX file.');
        //             return;
        //         }

  const BEPass = async () => {
    try{

      console.log('Preparing upload...');

        if (!fileUri) {
          alert('No file selected.');
          return;
        }

        const fileName = fileUri.split('/').pop() || 'upload.gpx';

       
        const formData = new FormData();
          formData.append('gpx_file', {
            uri: fileUri,
            name: fileName,
            type: 'application/gpx+xml',
          } as any);

//Token for auth:sanctum
// get token from storage
          const token = await AsyncStorage.getItem('token');

          const response = await fetch(`${BASE_URL}/gpx-upload`, {
              method: 'POST',
              body: formData,
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
              },
          
            });
    
          const result = await response.json();
          console.log('Upload success:', result);
          console.log('result keys:', Object.keys(result));
          console.log('trackpoints sample:', result.trackpoints?.slice?.(0, 3));
          alert('File uploaded to backend successfully!');
        
    }
    
    catch(jsonErr){
      console.error('Upload error:', jsonErr);
      alert('Server did not return valid JSON. Check Laravel logs.');
    }
  };


const handleDelete = async () => {
          console.log('Delete is in the process');

  try {

//Token for auth:sanctum
// get token from storage
    const token = await AsyncStorage.getItem('token');

    const response = await fetch(`${BASE_URL}/delete`, {
      method: 'POST',
      headers:{
        Authorization: `Bearer ${token}`, // add token
      },
    });

    const result = await response.json();

    if (response.ok) {
      console.log('Data deleted successfully!');
      alert('Data deleted successfully!');
    } else {
      console.error('Delete failed:', result);
      alert('Error deleting data');
    }
  } catch (error) {
    console.error('Request failed:', error);
    alert('Failed to connect to server');
  }
};

  // ---------------------------
  // RENDER
  // ---------------------------

  return (


    <View style={styles.container}>
    
      <ThemedText type="subtitle">NEWfileloader</ThemedText>
      <Button title="Load GPX File" onPress={pickFile} />



      <TouchableOpacity style={styles.button} onPress={handleDelete}>
        <Text style={styles.buttonText}>Delete Data </Text>
      </TouchableOpacity>
    
    

      {/* Render the MapView only if coordinates are available */}
      {coordinates ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Button title="Upload to BE " onPress={BEPass} />

           {/* Render Polyline for the track points */}
           <Polyline
            coordinates={trackPoints.map((pt) => ({
              latitude: pt.latitude,
              longitude: pt.longitude,
            }))}
            strokeColor="#FF0000"  // Set the color of the polyline
            strokeWidth={3}  // Set the width of the polyline
          />

              {waypoints.map((wpt, index) => (
                <Marker
                  key={index}
                   coordinate={{ latitude: wpt.latitude, longitude: wpt.longitude }}
                    title={wpt.name}
                  pinColor="blue"
                />
              ))}

        </MapView>

      ) : (
        <ThemedText type="title">No GPX file loaded yet.</ThemedText>
      )}




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
  button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
      },
      buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
      },

});

export default GPXLoader;
