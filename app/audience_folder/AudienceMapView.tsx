
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import type { TrackPoint, Waypoint } from "./AudienceEventScreen";

interface Props {
  waypoints: Waypoint[];
  trackpoints: TrackPoint[];
}

const AudienceMapView: React.FC<Props> = ({ waypoints, trackpoints }) => {

const hasRoute = waypoints.length > 0 && trackpoints.length > 0;

  const initialRegion = useMemo(() => {
    if (hasRoute) {
      const first = trackpoints[0];
      return {
        latitude: first.lat,
        longitude: first.lon,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };
    } else {
      // fallback default center (same as web)
      return {
        latitude: 46.83,
        longitude: 17.7,
        latitudeDelta: 0.2,
        longitudeDelta: 0.2,
      };
    }
  }, [hasRoute, trackpoints]);

  const polylineCoords = useMemo(
    () =>
      trackpoints.map((tp) => ({
        latitude: tp.lat,
        longitude: tp.lon,
      })),
    [trackpoints]
  );

// RENDERING ZONE
    return(
         <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
      >
        {/* Route polyline */}
        {hasRoute && (
          <Polyline
            coordinates={polylineCoords}
            strokeWidth={3}
            // strokeColor can be omitted, RN will pick default if not set
          />
        )}

        {/* Waypoint markers */}
        {waypoints.map((wp) => (
          <Marker
            key={wp.id}
            coordinate={{ latitude: wp.lat, longitude: wp.lon }}
            title={wp.name ?? "Waypoint"}
          />
        ))}

        {/* Fallback marker when no route */}
        {!hasRoute && (
          <Marker
            coordinate={{ latitude: 46.83, longitude: 17.7 }}
            title="Default center"
          />
        )}
      </MapView>
    </View>
    );
}

export default AudienceMapView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});