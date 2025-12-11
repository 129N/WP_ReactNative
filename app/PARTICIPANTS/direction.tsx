import AsyncStorage from "@react-native-async-storage/async-storage";
import { JSX, useEffect, useState } from "react";
import type { Position, TrackPoint, Waypoint } from "./ParticipantEvent";

import type { LocationObject } from 'expo-location';
import * as Location from "expo-location";
import type { TaskManagerError } from 'expo-task-manager';
import * as TaskManager from 'expo-task-manager';
import { getDistance } from "geolib";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Line } from "react-native-svg";
import getBearing from "../comp/GPXfunction";



// ---- Background location task (same idea as in Allmighty) ----

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

  const DirectionScreen = () => {
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [trackPoints, setTrackPoints] = useState<TrackPoint[]>([]);
  const [nextIndex, setNextIndex] = useState(0);
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);

  const [bearing, setBearing] = useState(0);
  const [distanceToNext, setDistanceToNext] = useState(0);
  const [eta, setEta] = useState(0);
  const [speed, setSpeed] = useState(10); // Example speed in km/h

  const [visibleTrackPoints, setVisibleTrackPoints] = useState<TrackPoint[]>([]);


  // to keep compatibility with Allmighty variables (even if not heavily used here)
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(
    null
  );
  const [fileUri, setFileUri] = useState<string | null>(null);

 // Small helper like in your notes
  const getNextWaypoint = () => waypoints[nextIndex];

   // === 1) Load route from AsyncStorage (written by ParticipantEvent.tsx) ===
  // route load function 
  useEffect(() => {
    const loadRoute = async () => {
      const wp = await AsyncStorage.getItem("waypoints");
      const tp = await AsyncStorage.getItem("trackpoints");

      if (wp) setWaypoints(JSON.parse(wp));
      if (tp) setTrackPoints(JSON.parse(tp));
    };
    loadRoute();
  }, []);

 // === 2) Start background location tracking (like Allmighty) ===
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

// === 3) Poll lastlocation to update currentPosition (simple version) ===

//INTERVAL 
useEffect(()=> {
  const interval = setInterval(async () =>{
    try {
        const lastLocation = await AsyncStorage.getItem("lastlocation");
        if (!lastLocation) return;

        const parsed = JSON.parse(lastLocation);
        setCurrentPosition({
          latitude: parsed.latitude,
          longitude: parsed.longitude,
        });
      } catch (err) {
        console.error("poll lastlocation error:", err);
      }
    }, 2000);

  return () => clearInterval(interval);
}, []);


// === 4) Visible segment of route near the runner (like your Allmighty logic) ===
useEffect(() => {
  if (!currentPosition || trackPoints.length < 2) return;

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

  const upcoming = trackPoints.slice(nearestIndex, nearestIndex + 5);
  setVisibleTrackPoints(upcoming);
}, [currentPosition, trackPoints]);


// === 5) AUTO ADVANCE & base distance state ===
useEffect(() => {
  if (!currentPosition) return;

  const next = waypoints[nextIndex];
    if (!next) {
        console.log("No more waypoints — route finished.");
        return;
    }

  const dist = getDistance(
    currentPosition,
    { latitude: next.latitude, longitude: next.longitude }
  );

  if (dist < 50) {
    setNextIndex((prev) => prev + 1);
  }

  setDistanceToNext(dist);
}, [currentPosition, nextIndex, waypoints]);

// === 6) ETA based on speed (km/h) and distance (m) ===
//ETA 
useEffect(() => {
  if (speed <= 0 || distanceToNext <= 0) return;
  setEta((distanceToNext / 1000) / speed);
}, [distanceToNext, speed]);

// === 7) Full “position updating” – bearing + distance + ETA + auto-advance ===

useEffect(() => {
  // Must have a current location and at least one next waypoint
  if (!currentPosition || waypoints.length === 0) return;

  const nextWaypoint = waypoints[nextIndex];

  if (!nextWaypoint) {
    console.log("No more waypoints — route finished.");
    return;
  }

  // 1)  Bearing calculation
  const brng = getBearing(
    currentPosition.latitude,
    currentPosition.longitude,
    nextWaypoint.latitude,
    nextWaypoint.longitude
  );
  setBearing(brng);

  // 2) Distance calculation (meters)
  const dist = getDistance(
    {
      latitude: currentPosition.latitude,
      longitude: currentPosition.longitude
    },
    {
      latitude: nextWaypoint.latitude,
      longitude: nextWaypoint.longitude
    }
  );

  setDistanceToNext(dist / 1000); // km

  // 3)  ETA calculation (minutes)
  if (speed > 0) {
    const etaHours = (dist / 1000) / speed;
    setEta(etaHours * 60);
  }

  // 4) Auto-advance to next waypoint
  if (dist < 50) {     // inside 50m radius → reached waypoint
    console.log(`Waypoint #${nextIndex} reached.`);
    setNextIndex(prev => prev + 1);
  }
}, [currentPosition, nextIndex, waypoints, speed]);

 const kakaoetA = Number.isFinite(eta) ? eta.toFixed(2) : "-";
  const distanceKm = Number.isFinite(distanceToNext) ? (distanceToNext / 1000).toFixed(2) : "-";
  const bearingText = Number.isFinite(bearing) ? bearing.toFixed(0) : "--";
 // === Mini track map projection (from Allmighty) ===
  let routeElements = null;
  if (trackPoints.length > 0) {
    const lats = trackPoints.map((tp) => tp.latitude);
    const lons = trackPoints.map((tp) => tp.longitude);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);

    const width = 300;
    const height = 200;
    const padding = 10;

    const latRange = maxLat - minLat || 0.0001;
    const lonRange = maxLon - minLon || 0.0001;

    const project = (lat: number, lon: number) => {
      const x = ((lon - minLon) / lonRange) * (width - 2 * padding) + padding;
      const y =
          ((maxLat - lat) / latRange) * (height - 2 * padding) + padding;
        return { x, y };
      };
    const routeLines: JSX.Element[] = [];
      for (let i = 0; i < trackPoints.length - 1; i++) {
        const p1 = project(trackPoints[i].latitude, trackPoints[i].longitude);
        const p2 = project(trackPoints[i + 1].latitude, trackPoints[i + 1].longitude);
        routeLines.push(
          <Line
            key={`route-${i}`}
            x1={p1.x}
            y1={p1.y}
            x2={p2.x}
            y2={p2.y}
            stroke="#4b5563"
            strokeWidth={2}
          />
        );
      }
    const waypointDots = waypoints.map((wp, idx) => {
        const p = project(wp.latitude, wp.longitude);
        return (
          <Circle key={`wp-${idx}`} cx={p.x} cy={p.y} r={4} fill="#22c55e" />
        );
      });

      const visibleDots = visibleTrackPoints.map((tp, idx) => {
        const p = project(tp.latitude, tp.longitude);
        return (
          <Circle key={`vis-${idx}`} cx={p.x} cy={p.y} r={3} fill="#eab308" />
        );
      });

      let runnerDot: JSX.Element | null = null;
      if (currentPosition) {
        const p = project(currentPosition.latitude, currentPosition.longitude);
        runnerDot = <Circle cx={p.x} cy={p.y} r={5} fill="#ef4444" />;
      }

      routeElements = (
        <Svg width={width} height={height}>
          {routeLines}
          {waypointDots}
          {visibleDots}
          {runnerDot}
        </Svg>
      );

    } 

return (
    <View style={styles.container}>
      <Text style={styles.title}>Direction to Next WP:</Text>

      <Text style={styles.arrowText}>➡️ {bearingText}°</Text>

      <View style={styles.dataContainer}>
        <Text style={styles.infoText}>Distance: {distanceKm} km</Text>
        <Text style={styles.infoText}>ETA: {kakaoetA} min</Text>
      </View>

      <View style={styles.miniMapContainer}>
        <Text style={styles.miniMapTitle}>Route Overview</Text>
        {routeElements ?? (
          <Text style={styles.infoText}>Route not loaded.</Text>
        )}
      </View>
    </View>
  );
    
  };

export default DirectionScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#020617",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#e5e7eb",
    marginBottom: 16,
  },
  arrowText: {
    fontSize: 48,
    fontWeight: "700",
    color: "#f97316",
    marginBottom: 16,
  },
  dataContainer: {
    marginTop: 8,
    width: "100%",
    paddingHorizontal: 10,
  },
  infoText: {
    fontSize: 16,
    color: "#e5e7eb",
    marginBottom: 4,
  },
  miniMapContainer: {
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#020617",
  },
  miniMapTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9ca3af",
    marginBottom: 8,
    textAlign: "center",
  },

});





//INITIAL STATE
// useEffect(() => {
//   updatePosition();
// }, []);

// const updatePosition = () => {
//   setCurrentPosition({
//     latitude: 46.928,
//     longitude: 17.867,
//   });
// };





// bearing calculation
// useEffect(() => {
//   if(!currentPosition || waypoints.length === 0 ) return;
  
//   const next = waypoints[nextIndex];
//   const brng = getBearing(
//     currentPosition.latitude,
//     currentPosition.longitude,
//     next.latitude,
//     next.longitude
//   );

//   setBearing(brng);

// }, [currentPosition, nextIndex, waypoints]);




