export enum RecordingStates {
  Idle = "Idle",
  Recording = "Recording",
  Paused = "Paused",
  Finished = "Finished"
}

type Position = {
    latitude: number;
    longitude: number;
    accuracy: number | null;
};

import * as FS from "expo-file-system/legacy";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import getDistance from "geolib/es/getPreciseDistance";
import { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { BASE_URL } from "./newfileloader";

    const LOCATION_TASK = "ROUTE_RECORDING_TASK";
    const bar = "  // ---------------------------";

//File save method //LEARN
    // const FS: any = FileSystem;
    // const saveGPXToFile = async(gpxString: string) =>{
    //     const fileUri = FS.cacheDirectory + "route.gpx";
    // await FS.writeAsStringAsync(fileUri, gpxString);
    // return fileUri;
    // };


    const router = useRouter();

const VRouteRecording = () => {

// 🟢 STATE MACHINE STATE
    const [recordingState, setRecordingState] = useState<RecordingStates>(RecordingStates.Idle);

// Data States 
    const [trackPoints, setTrackPoints] = useState<any[]>([]);
    const [waypoints, setWaypoints] = useState<any[]>([]);
    const [lastLocation, setLastLocation] = useState<any>(null);

 // 🟢 REF FOR GPS SUBSCRIPTION
    const gpsWatcherRef = useRef<Location.LocationSubscription | null>(null);
    const [currentPosition, setCurrentPosition] = useState<Position| null>(null);

// Generate GPX
const [generatedGPX, setGeneratedGPX] = useState<string | null>(null);
const [generatedFileUri, setGeneratedFileUri] = useState<string | null>(null);
const [fileId, setFileId] = useState<number | null>(null);
const [GpxReady, setGpxReady] = useState(false);
const [FileID, setUploadedFileId] = useState();

// Ture False appear button
    const [active, setActive] = useState(false);

    useEffect(()=>{
        return () => {stopGpsWatcher();};
    }, []);

// ---------------------------
// STATE MACHINE FUNCTIONS
// ---------------------------

  const startRecoding = async() =>{

    if(recordingState !== RecordingStates.Idle) return;

    console.log("▶️ START RECORDING");

    const {status} = await Location.requestForegroundPermissionsAsync();
    if(status!== "granted"){
        Alert.alert("Permission denied", "GPS access is required.");
        return;
    }

    setTrackPoints([]); // clean the previous data
    setWaypoints([]);
    setRecordingState(RecordingStates.Recording);

    startGPSWatcher();
  };

  const pauseRecording = async() => {
    if(recordingState !== RecordingStates.Recording) return;

    console.log("⏸ PAUSE RECORDING");

    setRecordingState(RecordingStates.Paused);
  };

  const ResumeRecordings = () => {
    if(recordingState !== RecordingStates.Paused) return;
    console.log("▶️ RESUME RECORDING");

    setRecordingState(RecordingStates.Recording);
  }

  const finishRecording = async() => {
    console.log("🛑 FINISH RECORDING");
     setRecordingState(RecordingStates.Finished);

    stopGpsWatcher();

    Alert.alert("Recording finished", "You can now export a GPX file.");
    setActive(true);
  };

//Stop GPS 
  const stopGpsWatcher = async() => {
    console.log("🛑 Stop GPS watcher");
    if(gpsWatcherRef.current){
        gpsWatcherRef.current?.remove();
        gpsWatcherRef.current = null;
    }
  };

// add waypoints manually
    const addWaypoint = async() => {
        if(!currentPosition){ // currentPosition, setCurrentPosition come from the trackpoint.
            console.log("❌ Cannot add waypoint — no GPS fix");
            return;
        }

        const newWaypoint = {
            lat: currentPosition.latitude,
            lon: currentPosition.longitude,
            time: new Date().toISOString(),
            name: `WP ${waypoints.length + 1}`
        };
         
        setWaypoints(prev => [...prev, newWaypoint]);
        console.log("📍 Waypoint added:", newWaypoint);
    };

// ---------------------------
// GPS record start
// ---------------------------
  const startGPSWatcher = async() => {

    console.log(`${bar} \n 📡 Starting GPS watcher... \n ${bar}`);
    
    gpsWatcherRef.current = await Location.watchPositionAsync(
        {
            accuracy: Location.Accuracy.High,
            timeInterval: 3000,
            distanceInterval: 0,
        }, 
        (location) => {

// SAFETY CHECK — Ignore inaccurate GPS data
        if (!location || !location.coords) {
            console.log("⚠️ GPS unavailable or malformed location");
            return;
        };
        const coords = location.coords;

    if (!coords.latitude || !coords.longitude) {
        console.log("⚠️ Invalid GPS coordinates");
        return;
    }

    if (coords.accuracy != null && coords.accuracy > 20) {
        console.log("⚠️ Bad accuracy → ignoring point:", coords.accuracy);
        return;
    }
            setLastLocation(coords);
// Store GPS accuracy for debugging
                console.log(`GPS → lat:${coords.latitude}, lon:${coords.longitude}, acc:${coords.accuracy}m` );

            if (recordingState !== RecordingStates.Recording) return;

             if (!coords.accuracy || coords.accuracy > 20) {
                    console.log("⚠️ Bad accuracy → ignoring point:", coords.accuracy);
                    return;
            }

             if (trackPoints.length > 0) {
                const prev = trackPoints[trackPoints.length - 1];

                const dist = getDistance(
                    { latitude: coords.latitude, longitude: coords.longitude },
                    { latitude: prev.latitude, longitude: prev.longitude }
                );

                if (dist > 50) { /* ignore jump > 50m */ }
            }
//speed
            const speed = coords.speed && coords.speed > 0 ? coords.speed : 0; // m/s 
            const speedKmh = speed * 3.6;

// save trackpoint
            const newPoint = {
                latitude: coords.latitude,
                longitude: coords.longitude,
                accuracy: coords.accuracy,
                speed: speedKmh.toFixed(1),
                time: new Date().toISOString(),
            };

            console.log("📍 Saved Trackpoint:", newPoint);
            setTrackPoints((prev) => [...prev, newPoint]);

            setCurrentPosition({
                latitude: coords.latitude,
                longitude: coords.longitude,
                accuracy: coords.accuracy ?? null,
            });

            }
        );
    };

//     const saveGPXToFile = async(gpxString: string): Promise<string> =>{
//        // Use documentDirectory to ensure iOS supports it
//         const dir = await Directory.documentDirectory();
//     const file = dir.file("route.gpx"); // create file path
//  await file.write(gpxString, { encoding: "utf8" });

 
//       // const fileUri = FS.cacheDirectory + "route.gpx";
//       // await FS.writeAsStringAsync(fileUri, gpxString);
//       // setGeneratedFileUri(fileUri);
//       // console.log("📁 GPX saved locally:", fileUri);

//       //  return fileUri;

//         await file.write(gpxString, { encoding: "utf8" });

//       console.log("📁 GPX saved to:", file.uri);
//     return file.uri;
//     };


const saveGPXToFile = async (gpxString: string): Promise<string> => {
  try {
    const fileUri = FS.documentDirectory + "route.gpx";

    await FS.writeAsStringAsync(fileUri, gpxString, {
      encoding: FS.EncodingType.UTF8,
    });

    console.log("📁 GPX saved locally:", fileUri);
    return fileUri;

  } catch (err) {
    console.error("❌ Error saving GPX:", err);
    throw err;
  }
};


    const generateGPX = async ():Promise<string> =>{
        try{
            console.log("📄 Generating GPX...");
            const gpxHeader = `<?xml version="1.0" encoding="UTF-8"?>
            <gpx version="1.1" creator="WaypointTracker" xmlns="http://www.topografix.com/GPX/1/1">`;

// waypoints format
            const wpts = waypoints.map(w => 
            `<wpt lat="${w.lat}" lon="${w.lon}">
                <name>${w.name}</name>
                <time>${w.time}</time>
            </wpt>`).join("\n");

// trackpoints format
            const trkpts = trackPoints.map(tp => 
            `<trkpt lat="${tp.latitude}" lon="${tp.longitude}">
              <time>${tp.time}</time>
              </trkpt>`
            ).join("\n");

            const gpx = `
                    ${gpxHeader}
                    ${wpts}
                    <trk>
                    <name>Recorded Route</name>
                    <trkseg>
                    ${trkpts}
                    </trkseg>
                    </trk>
            </gpx>`.trim();

                // Save to state for later upload
                setGeneratedGPX(gpx);
                setGpxReady(true);

                Alert.alert("GPX Generation OK");
     
            return gpx;
        }
        catch(err){
            console.error("GPX generation error:", err);
            Alert.alert("Error", "Failed to generate GPX.");
            throw err;  // 👈 IMPORTANT LEARN
        }
    
    };


  const uploadRecordedGPX = async() =>{ //TODO add the fileID 
    try{
    if (!generatedGPX) {
        Alert.alert("Error", "No GPX file.");
        return;
    }

    const fileUri = await saveGPXToFile(generatedGPX);
    setGeneratedFileUri(fileUri);

    console.log("⬆️ Uploading GPX:", fileUri);

        const form = new FormData();
        // Add the META DATA file id and Route name
        if (fileId) form.append("file_id", String(fileId)); //update existing
        form.append("route_name", "Recorded Route " + Date.now());
        form.append("gpx_file",{
            uri: fileUri,
            name: "recorded_route.gpx",
            type: "application/gpx+xml",
        } as any); //FIXED or as unknown as Blob //LEARN

        const res = await fetch(`${BASE_URL}/ADM_GPX_UPLOAD`, {
            method: "POST",
            body: form,
            headers: {"Content-Type": "multipart/form-data"},
        });

          const json = await res.json();
          console.log("GPX Upload Result:", json);

        if (!res.ok) {
          Alert.alert("Upload Failed", json.error || "Unknown error");
          return;
        }

        // Store the ID for editing in React-Web later
        setUploadedFileId(json.file_id);
          setFileId(json.file_id);

          Alert.alert(
            "GPX upload complete",
            `Route: ${json.route_name ?? "Unnamed"}\nfile_id: ${json.file_id}`
          );
    
//Optional
          setTrackPoints([]);
          setWaypoints([]);
          setCurrentPosition(null);
          setRecordingState(RecordingStates.Idle);
   setGpxReady(false);

    }
    catch(err){
        console.error("Upload failed:", err);
        Alert.alert("Catch Error");
    }
  };


  // ---------------------------
  // RENDER
  // ---------------------------
   return (
    <View style={styles.container}>

      <Text style={styles.title}>Route Recording</Text>
      <Text style={styles.state}>State: {recordingState}</Text>

{/* Idle mode  */}
      {recordingState === RecordingStates.Idle && (
        <TouchableOpacity style={styles.btnStart} onPress={startRecoding}>
          <Text style={styles.btnText}>Start Recording</Text>
        </TouchableOpacity>
      )}

{/* Recording mode  */}
      {recordingState === RecordingStates.Recording && (
        <>
              {lastLocation && (
                <Text style={{ textAlign: "center", marginBottom: 10 }}>
                    📡 Accuracy: {lastLocation.accuracy?.toFixed(1)}m  
                    🚀 Speed: {(lastLocation.speed * 3.6 || 0).toFixed(1)} km/h
                </Text>
            )}
    {/* Button Section */}
          <TouchableOpacity style={styles.btnPause} onPress={pauseRecording}>
            <Text style={styles.btnText}>Pause</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={addWaypoint}>
            <Text style={styles.btnText}>Add Waypoint</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnStop} onPress={finishRecording}>
            <Text style={styles.btnText}>Finish</Text>
          </TouchableOpacity>
        </>
      )}

{/* Puased mode  */}
      {recordingState === RecordingStates.Paused && (
        <>
          <TouchableOpacity style={styles.btnResume} onPress={ResumeRecordings}>
            <Text style={styles.btnText}>Resume</Text>
          </TouchableOpacity>
    {/* Add Waypoint Section */}
          <TouchableOpacity style={styles.btnWaypoint} onPress={() => {
            if (!lastLocation) return;
            setWaypoints((prev) => [...prev, {
              latitude: lastLocation.latitude,
              longitude: lastLocation.longitude,
              name: "Manual Waypoint",
              time: new Date().toISOString(),
            }]);
          }}>
            <Text style={styles.btnText}>Add Waypoint</Text>
          </TouchableOpacity>

    {/* Finish Section */}
          <TouchableOpacity style={styles.btnStop} onPress={finishRecording}>
            <Text style={styles.btnText}>Finish</Text>
          </TouchableOpacity>
        </>
      )}

{/* Finish mode  */}
      {recordingState === RecordingStates.Finished && (
        <View>
          <Text>Trackpoints collected: {trackPoints.length}</Text>
          <Text>Waypoints collected: {waypoints.length}</Text>

    {/* Generate GPX */}
      <TouchableOpacity style={styles.btnGenerate} onPress={generateGPX}>
        <Text style={styles.btnText}>Generate GPX</Text>
      </TouchableOpacity>

    {/* Reset GPX */}
      <TouchableOpacity style={styles.btnStart} onPress={() => {
        setRecordingState(RecordingStates.Idle); // <-- OK only for reset
        setTrackPoints([]);
        setWaypoints([]);
        setCurrentPosition(null);
      }}>
        <Text style={styles.btnReset}>Reset</Text>
      </TouchableOpacity>

       {GpxReady && ( 
        <TouchableOpacity style={styles.btnUpload} onPress={uploadRecordedGPX}>
          <Text style={styles.btnText}>Upload</Text>
        </TouchableOpacity>
      )}

      {GpxReady && ( 
       <TouchableOpacity
        style={styles.btnStart}
        onPress={() => router.push("/admin_page/Admin_Map/GpxFileList")}
        >
        <Text style={styles.btnText}>View GPX Files</Text>
        </TouchableOpacity>

      )}

      {FileID && (
        <Text style={{ marginTop: 10 }}>
          Last uploaded GPX file_id: {fileId}
        </Text>
      )}

        </View>
      )}

    </View>
  );
  
}

// ---------------------------
// STYLE
// ---------------------------

const styles = StyleSheet.create({
 container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  state: { fontSize: 18, textAlign: "center", marginBottom: 20 },

  btnStart: { padding: 15, backgroundColor: "#22c55e", marginVertical: 10, borderRadius: 8 },
  btnPause: { padding: 15, backgroundColor: "#facc15", marginVertical: 10, borderRadius: 8 },
  btnResume: { padding: 15, backgroundColor: "#3b82f6", marginVertical: 10, borderRadius: 8 },
  btnWaypoint: { padding: 15, backgroundColor: "#6366f1", marginVertical: 10, borderRadius: 8 },
  btnStop: { padding: 15, backgroundColor: "#dc2626", marginVertical: 10, borderRadius: 8 },
  btnUpload: { padding: 15, backgroundColor: "#000cf4ff", marginVertical: 10, borderRadius: 8 },
  btnGenerate:{ padding: 15, backgroundColor: "#00a3f4ff", marginVertical: 10, borderRadius: 8 },
  btnReset: { padding: 15, backgroundColor: "#ffffffff", marginVertical: 10, borderRadius: 8 },
  btnText: { textAlign: "center", color: "white", fontWeight: "bold" }
});

export default VRouteRecording;




