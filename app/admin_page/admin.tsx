// import AppLayout from '@/layouts/app-layout'; 

import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Screen from '../comp/ScreenWrapper';

export default function adminDashBoard(){

    const router = useRouter();

    return (
<Screen>
  <View style= {styles.container}> 
        <Text style={styles.header}>Admin.tsx</Text>
            <View style = {styles.buttonContainer}>
                <TouchableOpacity 
                 style={[styles.button, { backgroundColor: '#EF4444' }]} // red
                 onPress={() => router.push('../')}
                > 
                <Text style={styles.buttonText}>Back to Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                style={[styles.button, { backgroundColor: '#3B82F6' }]} // blue
                onPress={() => router.push('../admin_page/EventCreation')}>
                <Text style={styles.buttonText}>Create Event</Text>
                </TouchableOpacity>


                <TouchableOpacity
                style={[styles.button, { backgroundColor: '#FFC0CB' }]} // blue
                onPress={() => router.push('../admin_page/adm_panel')}>
                <Text style={styles.buttonText}>After Create Event(Admin Paenl)</Text>
                </TouchableOpacity>
                
                {/* Create Map, Detail input */}
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: '#10B981' }]} // green
                  onPress={() => router.push('/admin_page/Admin_Map/GpxFileList')}>
                  <Text style={styles.buttonText}>View Files </Text> 
                </TouchableOpacity>


                <TouchableOpacity
                  style={[styles.button, { backgroundColor: '#3B82F6' }]} // blue
                  onPress={() => router.push('../admin_page/newfileloader')}> {/* upload GPX  GPX_Processor */}
                  <Text style={styles.buttonText}>Upload GPX File</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#10B981' }]} // green
                    onPress={() => router.push('/admin_page/adminDashBoard')}>
                    <Text style={styles.buttonText}>Manage Events(event table creation)</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#fbff00ff' }]} // green
                    onPress={() => router.push('../admin_page/adm_Datalist')}>
                    <Text style={styles.buttonText}>Participant LIst</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: '#2bac31ff' }]} // green
                  onPress={() => router.push('/comp/EventLists')}>
                  <Text style={styles.buttonText}>Event Lists</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#bb00ffff' }]} // green
                    onPress={() => router.push('/admin_page/Route_Recording')}>
                    <Text style={styles.buttonText}>Recording</Text>
                </TouchableOpacity>
                
            </View>
    </View>

</Screen>
    
    );
}

const styles = StyleSheet.create({
    container: {
      padding: 20,
      flex: 1,
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
      gap: 12,
      width: '100%',
      maxWidth: 300,
    },
    button: {
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      marginBottom: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });