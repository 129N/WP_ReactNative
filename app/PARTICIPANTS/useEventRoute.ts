import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { Alert } from "react-native";
import { BASE_URL } from "../admin_page/newfileloader";


export const useEventRoute = () => {
    const [routeReady, setRouteReady] = useState(false);
    const [waypoints, setWaypoints] = useState([]);
    const [trackPoints, setTrackPoints] = useState([]);
    const [eventCode, setEventCode] = useState("");
    
    const fetchEventRoute = async(event_code: string) =>{
        console.log("Loading event route....");
    
        try{
            const token = await AsyncStorage.getItem('authToken');
            if (!token) return Alert.alert('Please log in first');
    
            const wpRes = await fetch(`${BASE_URL}/events/${event_code}/waypoints`);
            const tpRes = await fetch(`${BASE_URL}/events/${event_code}/trackpoints`);
    
            if (!wpRes.ok || !tpRes.ok) throw new Error("Failed route fetch");
    
            const wpJSON = await wpRes.json();
            const tpJSON = await tpRes.json();
    
             const parsedWpts = wpJSON.waypoints.map((wp: any) => ({
                latitude: wp.lat,
                longitude: wp.lon,
                name: wp.name || "WP",
            }));
    
            const parsedTrks = tpJSON.trackpoints.map((tp: any) => ({
            latitude: tp.lat,
            longitude: tp.lon,
            }));
    
            setWaypoints(parsedWpts);
            setTrackPoints(parsedTrks);
    
            console.log("Route Loaded for event:", event_code);
            setRouteReady(true);
    
        }
        catch (err) {
        console.error(err);
        alert("Route loading failed");
      }
    };
};