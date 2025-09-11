



// import AppLayout from '@/layouts/app-layout'; 

import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Participant(){

    const router = useRouter();

    return (

    <View style= {styles.container}> 
        <Text style = {styles.header}>Participant Dashboard Loaded</Text>
            <View style = {styles.buttonContainer}>
                <TouchableOpacity 
                 style={[styles.button, { backgroundColor: '#EF4444' }]} // red
                 onPress={() => router.push('/')}> 

                <Text style={styles.buttonText}>Back to Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                style={[styles.button, { backgroundColor: '#FFC0CB' }]} // blue
                onPress={() => router.push('/Authentication/Login')}>
                <Text style={styles.buttonText}>Participate Regsitration</Text>
                </TouchableOpacity>

                <TouchableOpacity
                style={[styles.button, { backgroundColor: '#3B82F6' }]} // blue
                onPress={() => router.push('/comp/Gyroscope')}>
                <Text style={styles.buttonText}>Participate in competition</Text> 
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, { backgroundColor: '#10B981' }]} // green
                  onPress={() => router.push('/Authentication/registration')}>
                  <Text style={styles.buttonText}>Registration</Text>
                  </TouchableOpacity>

                  
                {/* <TouchableOpacity
                  style={[styles.button, { backgroundColor: '#8B5CF6' }]} // purple
                  onPress={() => router.push('/admin_page/gpx')}
                >
                  <Text style={styles.buttonText}>GPX upload</Text>
                </TouchableOpacity> */}

                <TouchableOpacity
                  style={[styles.button, { backgroundColor: '#8B5CF6' }]} // purple
                  onPress={() => router.push('/admin_page/newfileloader')}
                >
                  <Text style={styles.buttonText}>New File load</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, { backgroundColor: '#8B5CF6' }]} // purple
                  onPress={() => router.push('/comp/WPScreen')}
                >
                  <Text style={styles.buttonText}>Waypoint Screen</Text>
                </TouchableOpacity>

            </View>
    </View>
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
      color: '#1D4ED8', // blue
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