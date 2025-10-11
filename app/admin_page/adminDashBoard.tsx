//Admin MapView Screen (frontend)

// Show all participants (single + team leaders) on a map. fetching 
//Events, participants both signle and multiple.

//function delete, and edit 

// Add filtering by event / team.

//temporaly cm out
// const [role, setRole] = useState('');
// const [leaderEmail, setLeaderEmail] = useState('');
//const [eventTitle, setEventTitle] = useState('');
// const [userId, setuserId] = useState('');
// const [leaderName, setLeaderName] = useState('');


// useEffect(()=> {
//     //load from the other tables and controller
//     const loadUserInfo = async () => {
//         //user info from 
//         // const name = await AsyncStorage.getItem('userName');
//         // // const email = await AsyncStorage.getItem('userEmail');
//         // //const role = await AsyncStorage.getItem('userRole');
//         // const userId = await AsyncStorage.getItem('userId');

//         // //Event title from EventCreation.tsx, 
//         // const eventTitle = await AsyncStorage.getItem('event_title');

//         // if (name) setLeaderName(name);
//         // // if(email) setLeaderEmail(email);
//         // // if(role) setRole(role);
//         // //if(eventTitle) setEventTitle(eventTitle);
//         // // if(userId) setuserId(userId);
//     if (eventId) seteventId(eventId);
//     };
//     loadUserInfo();
// }, []);
// const [teams, setTeams] = useState<Team[]>([]);
// const [event, setEvent] = useState <Event []>([]);

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BASE_URL } from './newfileloader';

type Event = {
  id: number;
  event_title: string;
  description: string;
  event_date: string;
  creator_name?: string;
  event_code: string;
  registrations: SingleParticipant[];
  team_registrations: Team[];
};


//single players
type SingleParticipant = {
  id: number;
  participant_name: string;
  email: string;
  role?: string | null;
};


// multi players
type Team = {
  id: number;
  team_name: string;
  members : Members[];
};

type Members = {
  id?: number;
  member_name: string;
  member_email: string;
  role?: string | null;
};


export default function AdminTableView() {

  const [loading, setLoading] = useState(false);
const [overview, setOverview] = useState<Event[]>([]);
const [leaderName, setLeaderName] = useState('');

useEffect(() => {

  const loadUserInfo = async() =>{
  const name = await AsyncStorage.getItem('userName');
   if (name) setLeaderName(name);
  }
loadUserInfo();

}, [] );

    const fetchOverView = async() =>{
      const token = await AsyncStorage.getItem("authToken");
      if(!token) return;

      try{
        setLoading(true);

        const res = await fetch(
          `${BASE_URL}/admin/overview`, 
          {
            headers: { Authorization: `Bearer ${token}`, 
            Accept: "application/json" },
          });
          
          const data = await res.json();

          console.log("Overview data:", JSON.stringify(data, null, 2));

          if (res.ok) setOverview(data);
          else console.warn("Failed to fetch:", data);

        setLoading(false);
      }catch(err){
        console.error(err, 'fetchOverView failed');
        Alert.alert('Error', 'fetch Error');
      }

    };

    const deleteSingle = async (id: number) => {
      const token = await AsyncStorage.getItem("authToken");
      try{
      setLoading(true);

        const res = await fetch(`${BASE_URL}/registrations/${id}`,{
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });

      const data = await res.json();
      if(res.ok){
        Alert.alert('Success', 'Event deleted successfully');
        // Refresh the list
        fetchOverView();
      }
      else{
         Alert.alert('Failed', data.error || 'Could not delete event');
      }

      setLoading(false);
      }
      catch(err){
        console.error(err);
        Alert.alert('Error', 'Something went wrong');
      }
      setLoading(false);
    }
    
    const deleteTeam = async (id : number ) => {
      const token = await AsyncStorage.getItem("authToken");
      try{
        setLoading(true);
        const res = await fetch(`${BASE_URL}/teams/${id}/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.ok) {
        Alert.alert("Deleted", "Team removed.");
      }
      }
      catch(err){
        console.error(err);
        Alert.alert('Error', 'Something went wrong');
      }
      setLoading(false);
    }

    useEffect(() => {
      fetchOverView();
    }, []);
    

if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

  return (
      <ScrollView>

        <TouchableOpacity style={styles.Button} onPress={fetchOverView}>
            <Text style={styles.ButtonText}>Reload</Text>
        </TouchableOpacity>


{/*Loop throught all events */}
  {overview.map((event) => (

    <View key={event.id} style={styles.eventCard}>
      <Text style={styles.eventTitle}>{event.event_title}</Text>
      <Text> Event Code : {event.event_code}</Text>
      <Text>Created by: {event.creator_name}</Text>

{/* Single lists  */}
      <Text style={styles.sectionTitle}>🏃 Single Participants</Text>
      {event.registrations && event.registrations.length  > 0 ? (
        event.registrations.map((r: any) => (
          <View key= {r.id}> 
            {/* <Text>- {r.participant_name}</Text> */}

      {/* Delete Single Participant  */}
            <View key={r.id} >
              <Text style={styles.eventTitle} >- {r.participant_name}</Text>
                <Text style={styles.eventTitle}>{r.email}</Text>
              <TouchableOpacity style={styles.Button}
                onPress={() => 
                
                Alert.alert('Confirm Delete', 'Are you sure?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'OK', onPress: () => deleteSingle(r.id) },
                ])
              } >
                <Text style={styles.ButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ): (
        <Text>No single registrations.</Text>
      )
    }

{/* 👥 Teams */}
      <Text style={styles.sectionTitle}>👥 Teams</Text>
      {event.team_registrations &&  event.team_registrations.length > 0 ? (
        event.team_registrations.map((t: any) => (
          <View key={t.id}>
            <Text>{t.team_name}</Text>

    {leaderName ? <Text>Leader: {leaderName}</Text> : null}

            {t.members.map((m: any, idx: number) => (
              <Text key={idx}>— {m.member_name} ({m.role})</Text>
            ))}

            {/* Delete Team  */}
              <>
                  <TouchableOpacity style={styles.Button} 
                onPress={() => 
                
                Alert.alert('Confirm Delete', 'Are you sure?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'OK', onPress: () => deleteTeam(t.id) },
                ])
              } >
                      <Text style={styles.ButtonText}>Delete Team</Text>
                  </TouchableOpacity>
              </>
          </View>
        ))
      ) : (
        <Text>No teams registered.</Text>
      )}


    </View>


  ))}
</ScrollView>


      




    )
}

const styles = StyleSheet.create({


sectionTitle:{},
    delete:{},
    card:{},

  Button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
 ButtonText:{
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  eventInfo:{},
  eventCard:{},
  eventTitle:{
    color: '#ff0000ff'
  },

})

{/* SIngle participant  */}
{/* Event outline infoamtion */}
{/* Team participant  */}
{/* <ScrollView>
{events.map((event) => (
  <View style={styles.eventInfo}>
    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>
      {event.event_title}</Text>
          <Text>{event.description}</Text>
          <Text>{new Date(event.event_date).toLocaleString()}</Text>
          <Text>Created by: {event.creator_name}</Text>
          <Text>Event Code {event.event_code}</Text>
  </View>
))}



  <Text style={styles.sectionTitle}>Single Participants</Text>
  {singles.map((participants) => (
    <View key={participants.id} style={styles.card}>
      <Text>🏃 {participants.participant_name}</Text>
      <Text>{participants.email}</Text>
      <TouchableOpacity onPress={() => deleteSingle(participants.id)}>
        <Text style={styles.delete}>Delete</Text>
      </TouchableOpacity>
    </View>
  ))}


  <Text style={styles.sectionTitle}>Teams</Text>
  {teams.map((team) => (
    <View key={team.id} style={styles.card}>
      <Text>👥 {team.team_name}</Text>
      {team.members.map((m, idx) => (
        <Text key={idx}>- {m.member_name} ({m.role})</Text>
      ))}
      <TouchableOpacity onPress={() => deleteTeam(team.id)}>
        <Text style={styles.delete}>Delete Team</Text>
      </TouchableOpacity>
    </View>
  ))}
</ScrollView> */}

