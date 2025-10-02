import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function admin_panel(){
      const router = useRouter();

  return(  
  
  
  <View style= {styles.container} >
    <View style={styles.TITLE} >

 
        <ThemedText type="title">adm_panel.tsx</ThemedText>
        
    </View>
    <Text style = {styles.header}> Admin Dash Board</Text>

    
            <View style= {styles.buttonContainer}> 
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#EF4444' }]} // red
                    onPress={() => router.push('../')}>
                    <Text style={styles.buttonText}>Back to Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#3B82F6' }]} // blue
                    onPress={() => router.push('../admin_page/newfileloader')}> {/* upload GPX  GPX_Processor */}
                    <Text style={styles.buttonText}>Upload GPX File</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#10B981' }]} // green
                    onPress={() => router.push('../admin_page/Manage_Event')}
                >
                    <Text style={styles.buttonText}>Manage Events(event table creatin)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#fbff00ff' }]} // green
                    onPress={() => router.push('../admin_page/adm_Datalist')}
                >
                    <Text style={styles.buttonText}>Participant LIst</Text>
                </TouchableOpacity>

                 <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#2bac31ff' }]} // green
                    onPress={() => router.push('/../components/EventTableLists')}
                >
                    <Text style={styles.buttonText}>Event Lists</Text>
                </TouchableOpacity>



              
                
            </View>
       


    </View>);

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