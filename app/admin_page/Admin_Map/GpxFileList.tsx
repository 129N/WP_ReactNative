import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BASE_URL } from '../newfileloader';


type GpxFile = {
  id: number;
  route_name: string;
  uploaded_by?: number | null;
  event_id?: number | null;
  file_path?: string | null;
  created_at?: string;
  updated_at?: string;
};

export default function GpXFileList(){
      const [files, setFiles] = useState<GpxFile[]>([]);

  const loadFiles = async () => {
    try {
      const res = await fetch(`${BASE_URL}/ADM_GPX_LIST`);
      const json = await res.json();
      setFiles(json);
    } catch (err) {
      console.error(err);
      Alert.alert("Error loading GPX list");
    }
  };

  const deleteFile = async (file_id: number) => {
    Alert.alert(
      "Delete?",
      `GPX file #${file_id}`,
      [
        { text: "Cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const res = await fetch(`${BASE_URL}/ADM_GPX_DELETE/${file_id}`, {
              method: "DELETE",
            });

            if (res.ok) {
              Alert.alert("Deleted");
              loadFiles(); // refresh
            } else {
              Alert.alert("Delete failed");
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    loadFiles();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>📁 GPX File List</Text>

      <FlatList
        data={files}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 15,
              borderWidth: 1,
              marginBottom: 10,
              borderRadius: 10
            }}
          >
            <Text>File ID: {item.id}</Text>
            <Text>Name: {item.route_name}</Text>
            <Text>Created: {item.created_at}</Text>

            <TouchableOpacity
              style={{
                backgroundColor: "red",
                padding: 10,
                marginTop: 10,
                borderRadius: 8
              }}
              onPress={() => deleteFile(item.id)}
            >
              <Text style={{ color: "white", textAlign: "center" }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}


const styles = StyleSheet.create({

    TITLE:{
        backgroundColor: 'gray',
    },
    container: {
        padding: 20,
        flex: 1,
        outlineColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',

      },
      header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#008000', // blue
        marginBottom: 20,
        
      },
      buttonContainer: {
        flexDirection: 'column',
        gap: 15,
      },
      button:{
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,

      },
      buttonText:{
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
      }
    });