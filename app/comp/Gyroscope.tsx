
import getGPXProcessor from '@/assets/GPXFILE/GPXprocessor';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Gyroscope, Magnetometer } from 'expo-sensors';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import getBearing from './GPXfunction';

export default function GyroscopeComponent(){
    const [data, setData] = useState({x:0, y:0, z:0});

      const [heading, setHeading] = useState(0);

      const rotation = useRef(new Animated.Value(0)).current;

    const [currentLocation, setCurrentlocation] 
        = useState({  latitude: 0, longitude: 0 });

    const [nextWaypoint, setnextWaypoint] = useState({ latitude: 46.937432, longitude: 17.899315 })
    const [waypointBearing, setWaypointBearing] = useState<number | null>(null);
    const [relativeAngle, setRelativeAngle] = useState<number | null>(null);
    const [waypoints, setWaypoints] = useState<any[]>([]);
    const [trackPoints, setTrackPoints] = useState<any[]>([]);
    
    // const relativeAngle = (waypointBearing - heading + 360) % 360;


        // Calculate heading from magnetometer data
        const calculateHeading = (data: { x: number; y: number; z: number }) => {
        let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
        angle = angle >= 0 ? angle : angle + 360;
        return angle;
        };

        const processedGPX = async() => {
            const data = await getGPXProcessor();
            if (data) {
              setWaypoints(data.waypoints);
              setTrackPoints(data.trackPoints);
              if (data.trackPoints.length > 0) {
                setnextWaypoint(data.trackPoints[0]); // Start with the first waypoint
              }
            }
        };


    useEffect( () => {

        const subscription = Gyroscope.addListener(GyroscopeData => {
            setData(GyroscopeData);
        });

        const subscription_Gyro2 = Magnetometer.addListener((data) => {
            const angle = calculateHeading(data);
            setHeading(Math.round(angle));

            // Animate rotation
        Animated.timing(rotation, {
            toValue: angle, // Set the rotation value to the calculated angle
            duration: 50, // You can adjust this duration based on the responsiveness you want
            useNativeDriver: true,
        }).start();
        });


        // WHne the GPX file is loaded this function initiates 
        if(
            currentLocation &&
            nextWaypoint &&
            currentLocation.latitude &&
            currentLocation.longitude &&
            nextWaypoint.latitude &&
            nextWaypoint.longitude

        ){
                //import the bearing 
                const waypointBearing = getBearing(
                    currentLocation.latitude,
                    currentLocation.longitude,
                    nextWaypoint.latitude,
                    nextWaypoint.longitude
                );
                setWaypointBearing(waypointBearing);
                setRelativeAngle((waypointBearing - heading + 360) % 360);
        }


    return () => {
            subscription.remove();
            subscription_Gyro2.remove();
        };

        //


    }, [currentLocation, nextWaypoint, heading]);


    const rotateInterpolate = rotation.interpolate({
        inputRange: [0, 360],
        outputRange: ['0deg', '360deg'],
      });


    return (
   


        <View style={styles.container}> 
            <Text style = {styles.title}> Competitor ID number</Text>

            <Button title="Load GPX File" onPress={processedGPX} />

        {/* gyro rotation arrow  */}

            {/* <CompassArrow/> */}

             <View style={[styles.container, { backgroundColor: 'lightgray' }]}>
                  <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
                    <MaterialCommunityIcons name="arrow-up-bold" size={100} color="black" />
                  </Animated.View>
                  <Text style={styles.text}>Heading: {heading}°</Text>
            </View>

        
        {/* Waypoint Arrow */}

        {/* <View style={styles.arrowContainer}>
            <MaterialCommunityIcons name="arrow-up-bold" size={100} color={"#000"}/>
            <Text style={styles.text}>Waypoint: 3 | Angle: 45°</Text>
        </View> */}



        {/* Test Cordinator*/}
            <Text style={styles.text}>
                Gyroscope - X: {data.x.toFixed(2)} | Y: {data.y.toFixed(2)} | Z: {data.z.toFixed(2)}
            </Text>

            
      

        {/* Speed, Distance, ETA */}
      <View style={styles.statusBox}>
        {/* GPX Based angle*/}

        {relativeAngle !== null && (
                        <> <Text style={styles.text}> The GPX file has been loaded</Text>
                            <Animated.View
                            style={{
                                transform: [{ rotate: `${relativeAngle}deg` }],
                            }}
                            >
                            <MaterialCommunityIcons name="arrow-up-bold" size={100} color="blue" />
                            </Animated.View>
                            <Text style={styles.text}>Next waypoint: {relativeAngle.toFixed(0)}°</Text>
                        </>
                    )}

        {/* <Text style={styles.statusText}>
            <MaterialCommunityIcons name="speedometer" size={20} color="orange" /> Speed: 12 km/h
        </Text>
        <Text style={styles.statusText}>
            <MaterialCommunityIcons name="map-marker-distance" size={20} color="green" /> Distance Left: 14 km
        </Text>
        <Text style={styles.statusText}>
            <MaterialCommunityIcons name="clock-outline" size={20} color="green" /> ETA: 14 min
        </Text> */}
      </View>


         {/* Emergency Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#DC2626' }]}>
          <MaterialCommunityIcons name="alert-circle-outline" size={20} color="white" />
          <Text style={styles.buttonText}>HELP</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#6B7280' }]}>
          <MaterialCommunityIcons name="exit-run" size={20} color="white" />
          <Text style={styles.buttonText}>Surrender</Text>
        </TouchableOpacity>
      </View>


    </View>
                

    ); 


}

const styles = StyleSheet.create({
    container:{ padding: 20, alignItems: 'center', justifyContent: 'center', flex: 1},
    text:{ fontSize:20, marginTop: 20},
    title:{fontSize: 24, fontWeight: 'bold', 
        color: '#3B82F6', marginVertical: 20 },
    arrowContainer: { alignItems: 'center', marginBottom: 30 },
    statusBox: {
        padding: 20,
        borderRadius: 10,
        width: '100%',
        backgroundColor: '#E5E7EB',
        marginBottom: 30,
    },  
    statusText: { fontSize: 16, marginBottom: 10, color: '#111' },
    buttonRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
    button: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 8 },
    buttonText: { color: 'white', marginLeft: 8, fontWeight: 'bold' },

});