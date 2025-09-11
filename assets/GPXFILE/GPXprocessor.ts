// File: assets/GPXFILE/GPXprocessor.ts

import * as DocumentPicker from 'expo-document-picker';
import { XMLParser } from 'fast-xml-parser';

export default async function getGPXProcessor(): Promise<{
  waypoints: any[];
  trackPoints: any[];
} | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'application/gpx+xml',
  });

  if (
    result.assets &&
    result.assets.length > 0 &&
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
    const trackPoints = parsed.gpx.trk?.trkseg?.trkpt || [];

    console.log('Waypoints:', waypoints);
    console.log('Track Points:', trackPoints);
    console.log('The GPX file has been accepted.');

    return { waypoints, trackPoints };
  } else {
    alert('Please select a valid .gpx file');
    return null;
  }
}
