import { ThemedText } from '@/components/ThemedText';
import * as DocumentPicker from 'expo-document-picker';
import * as Location from 'expo-location';
import { XMLParser } from 'fast-xml-parser';
import React, { useEffect, useState } from 'react';
import { Button, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';


export default function GPXaudience() {

  const [trackPoints, setTrackPoints] = useState<any[]>([]);
  const [waypoints, setWaypoints] = useState<any[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const mapRef = React.useRef(null);
  const [location, setlocation] = useState<Location.LocationObject | null>()
  const [region, setRegion] = useState({
    latitude: 46.928,
    longitude: 17.867,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });


  const pickFile = async () => {
    
    const result = await DocumentPicker.getDocumentAsync(
        { type: 'application/gpx+xml' });
    if (
      result.assets && result.assets.length > 0 &&
      result.assets[0].name.endsWith('.gpx')
    ) {
      const response = await fetch(result.assets[0].uri);
      const gpxText = await response.text();

      const parser = new XMLParser({
        ignoreAttributes: false,
        ignoreDeclaration: true,
        ignorePiTags: true,
      });

      const parsed = parser.parse(gpxText);
      const waypoints = parsed.gpx.wpt || [];
      const trackPoints = parsed.gpx.trk.trkseg.trkpt;

      console.log('Waypoints:', waypoints);
      console.log('Track Points:', trackPoints);
      console.log("The GPX file has been accepted.");
      setTrackPoints(trackPoints);
      setWaypoints(waypoints);
    } else {
       alert('Please select a valid .gpx file');
  }

};

        

      useEffect( () => {
        ( async () => {
            const {status} = await Location.requestForegroundPermissionsAsync();
            if(status !== 'granted'){
              console.warn('Permission to access location was denied');
              return;
            }

            const currentLocation = await Location.getCurrentPositionAsync({});
            setlocation(currentLocation);
          }) ();


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


  return (
    <View style={styles.container}>

      <ThemedText type="subtitle">Audiecen View</ThemedText>

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

  {waypoints.length > 0 &&
      waypoints.map((wpt, index) => (
        <Marker
          key={`wpt-${index}`}
          coordinate={{
            latitude: parseFloat(wpt['@_lat']),
            longitude: parseFloat(wpt['@_lon']),
          }}
          title={wpt.name || `Waypoint ${index + 1}`}
          description={wpt.desc || ''}
          pinColor="blue"
        />
      ))}

    {location && (
      <Marker
      coordinate={{
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }}
      title='You are here'
      pinColor="green"
        />
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
