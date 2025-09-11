import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function EventForm() {
  const [eventId, setEventId] = useState('');
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gpxFile, setGpxFile] = useState(null);

  const pickGpxFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
    if (!result.canceled) {
      setGpxFile(result.assets[0]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Event ID</Text>
      <TextInput style={styles.input} value={eventId} onChangeText={setEventId} placeholder="Enter or auto-generate" />

      <Text style={styles.label}>Event Name</Text>
      <TextInput style={styles.input} value={eventName} onChangeText={setEventName} placeholder="e.g. Trail Marathon" />

      <Text style={styles.label}>Description</Text>
      <TextInput style={styles.input} multiline value={description} onChangeText={setDescription} placeholder="Short description" />

      <Text style={styles.label}>Event Date</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <Text style={styles.input}>{eventDate.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={eventDate}
          mode="date"
          display="default"
          onChange={(e, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setEventDate(selectedDate);
          }}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={pickGpxFile}>
        <Text style={styles.buttonText}>{gpxFile ? gpxFile.name : 'Upload GPX File'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#10B981' }]}>
        <Text style={styles.buttonText}>Submit Event</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontSize: 16, marginBottom: 5, color:'white' },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 10,
    marginBottom: 15, borderRadius: 5,
  },
  button: {
    padding: 15, backgroundColor: '#007AFF',
    borderRadius: 8, alignItems: 'center', marginTop: 10,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
});
