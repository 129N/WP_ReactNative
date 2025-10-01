import CustomInput from '@/components/CustomInput';
import { Colors } from '@/constants/Colors';
import { iconSize_dimension, spacing } from '@/constants/dimensions';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BASE_URL } from './newfileloader';


export default function  EventCreation () {

  const [eventTitle, setEventTitle] = useState('');
  const [description, setDescription] = useState('');
  const [adminID, setAdminID] = useState('');
  const [adminName, setAdminName] = useState(''); // event_creatorName in Laravel
  const [role, setRole] = useState('');
  //date handling 
  const [eventDate, setEventDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

    //AsynchStorage from User_react 
    useEffect(() => {

        const loadUserInfo = async () =>{
            const role = await AsyncStorage.getItem('userRole');
            const id = await AsyncStorage.getItem('userId');
            const loadedName = await AsyncStorage.getItem('name');

          if (role) setRole(role);
          if (id) setAdminID(id);
          if (loadedName) setAdminName(loadedName);
        };
        loadUserInfo();
    }, []);


  const handleCreateEvent = async() => {
    const token = await AsyncStorage.getItem('authToken');

    try{
      if(!token){
        console.log("Not token");
        Alert.alert("Not logged in");
        return;
      }
      
      console.log("Creation in progress :", adminName);

      const response = await fetch(`${BASE_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept : 'application/json', 
          Authorization: `Bearer ${token}`, 
        }, 
        body: JSON.stringify({
          event_title: eventTitle,
          description,
          event_date: eventDate.toISOString(), // formatted
        }),
      });

      // put them into data var 
      const data = await response.json();
      if (response.ok) {
          console.log( "Event has been created", data);
          alert("Event created successfully!");
      } else {
        console.error("Failed:", data);
        alert("Event creation failed.");
      }

    }catch(Error){
      console.log(Error);
      Alert.alert("An error occurred. Please try again later.");
    }

  };


    return (
      <ScrollView  
      style={styles.container}
      contentContainerStyle= { {paddingBottom:2 * spacing.md}} >
        <View style={styles.ViewContainer}>
          <Text> EventCreation.tsx</Text>
          <Text> Event Creation Page </Text>
          {/* import from ProfileScreen role?  */}
          <Text>You logged in as {adminName} </Text>

        </View>

        <View>
          {/* TextInput Section */}

          <CustomInput 
              label='EventTitle' 
              placeholder ='Enter here'
              icon={<FontAwesome5 name = {"battle-net"} size={iconSize_dimension.lg} 
              color={Colors.textPrimary.gray}  
              style = {styles.icon}/>} 
              value = {eventTitle}
              onChangeText={setEventTitle}
          />

          <CustomInput
              label='Description' 
              placeholder ='Explain the competiton'
              icon={<MaterialIcons name = {"description"} size={iconSize_dimension.lg} 
              color={Colors.textPrimary.gray}  
              style = {styles.icon}/>} 
              value = {description}
              onChangeText={setDescription}                  
          />

          <TouchableOpacity onPress={() => setShowPicker(true)}>
            <Text>{eventDate.toDateString()}Date Fetch</Text>
          </TouchableOpacity>


          {showPicker && (
            <DateTimePicker
              value={eventDate}
              mode='date'
              display='default'
              onChange={
                (event,selectedDate) => {
                  setShowPicker(false);
                  if(selectedDate) setEventDate(selectedDate);
                }
              }
            />
          )}

          <TouchableOpacity style={styles.button} onPress={handleCreateEvent}>
            <Text style={styles.buttonText}>Create Event</Text>
          </TouchableOpacity>


        </View>
      </ScrollView>
    
    )
}

const styles = StyleSheet.create({

  ViewContainer:{
      padding: 20,
      flex: 1,
      backgroundColor: '#f5f5f5',
  },   
  container:{
        flex : 1,
        padding: spacing.md,
  },

  icon:{
    marginHorizontal : spacing.sm,
  },
  button:{
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },    
  buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
      },
});



