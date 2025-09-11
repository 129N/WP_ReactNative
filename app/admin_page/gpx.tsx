import { ThemedText } from '@/components/ThemedText';
import * as DocumentPicker from 'expo-document-picker';
import { XMLParser } from 'fast-xml-parser';
import React, { useEffect, useState } from 'react';
import { Button, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import getBearing from '../comp/GPXfunction';
export default function GpxLoader() {

  const [trackPoints, setTrackPoints] = useState<any[]>([]);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
  const mapRef = React.useRef(null);

  const [region, setRegion] = useState({
    latitude: 46.928,
    longitude: 17.867,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  type Waypoint = {
    name: string;
    latitude: number;
    longitude: number;
  }
  type Position = {
    latitude: number;
    longitude: number;
  };

  const pickFile = async () => {
    
    const result = await DocumentPicker.getDocumentAsync(
        { type: 'application/gpx+xml' });


    if (
      result.assets && result.assets.length > 0 &&
      result.assets[0].name.endsWith('.gpx'))
      {

        const fileUri = result.assets[0].uri;
     

        const formData = new FormData();
        formData.append('gpx_file', {
          uri: fileUri,
          type: 'application/gpx+xml',
          name: result.assets[0].name,
        } as any);

        try {
          const response = await fetch('http://192.168.0.101:8000/api/upload-gpx',{
            method: 'POST',
            body: formData,
          });
          // Now send this data to the server
          //http://127.0.0.1:8000/api/upload-gpx
          //http://192.168.0.101:8000/api/upload-gpx
          //http://192.168.0.101:8000/api/upload-gpx


          const gpxText = await response.text();

          if (response.ok){
            alert('GPX file uploaded successfully');
          } else {
            alert('Error uploading GPX file');
          }


          const parser = new XMLParser({
            ignoreAttributes: false,
            ignoreDeclaration: true,
            ignorePiTags: true,
          });
    
          const parsed = parser.parse(gpxText);
          // const waypoints = parsed.gpx.wpt;
          const parsedWaypoints = parsed.gpx.wpt;
          const trackPoints = parsed.gpx.trk.trkseg.trkpt;
    
          //console.log('Waypoints:', waypoints);
          console.log('Track Points:', trackPoints);
          console.log('Waypoints:',  parsedWaypoints);
          console.log("The GPX file has been accepted.");
          setTrackPoints(trackPoints);
          setWaypoints(parsedWaypoints);

          
        } catch(err){
          alert('Upload failed. Please check the file and server.');
        }
  
    } else {
       alert('The file uploading canceled');
  }

};

   //calculate bearing to the next waypoint 
   const calculateBearingToNextWaypoint = () => {
    if(currentPosition && waypoints.length > 0){
      const nextWaypoint = waypoints[1];
      if (nextWaypoint) {
        // const bearing = getBearing(
        //   { latitude: currentPosition.latitude, longitude: currentPosition.longitude },
        //   { latitude: parseFloat(nextWaypoint['@_lat']), longitude: parseFloat(nextWaypoint['@_lon']) }
        // );

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


  useEffect(() => {
        if (trackPoints.length > 0 ) {
          const first = trackPoints[0];
          setRegion({
            latitude: parseFloat(first['@_lat']),
            longitude: parseFloat(first['@_lon']),
             latitudeDelta: 0.05,
            longitudeDelta: 0.05,

          });
        }
      }, [trackPoints, mapReady]);


       // Update current position on map (simulate or get real position here)
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


  return (
    <View style={styles.container}>

      <ThemedText type="subtitle">Here is the place to upload the GPX File</ThemedText>
      <Button title="Load GPX File" onPress={pickFile} />
      
<MapView
        ref={mapRef}
        style={{ width: Dimensions.get('window').width, height: 400 }}
        initialRegion={region}
        onMapReady={() => setMapReady(true)}
      >

        {trackPoints.length > 0 && (
          <Polyline
            coordinates={trackPoints.map((pt) => ({
              latitude: parseFloat(pt['@_lat']),
              longitude: parseFloat(pt['@_lon']),
            }))}
            strokeColor="#FF0000"
            strokeWidth={3}
          />
        )}

        {currentPosition && (
          <Marker coordinate={currentPosition} title="Current Position">
            {/* You can replace with an arrow icon */}
            <View style={{ width: 20, height: 20, backgroundColor: 'blue' }} />
          </Marker>
        )}
</MapView>


      <ScrollView style={styles.dataContainer}>
        {trackPoints?.map((point, index) => (
          <Text key={index} style = {{color: 'white'}}>
            Lat: {point['@_lat']} | Lon: {point['@_lon']}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create(
    {
        container: {
            padding: 20,
            flex: 1,
            outlineColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
    
          }, 
          dataContainer: {
            marginTop: 20,
            width: '100%',
            paddingHorizontal: 10,
            flex: 1,
          },
    });
