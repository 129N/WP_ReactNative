//Database table

// the only new database pieces you still need are:

// event_registrations(for multiple participants)
// team_registrations (for teams)
// team_members (members within a teams)

// If Single:
// Show the existing form (event, group, etc.)

// If Team:
// Show form fields:

// Team Name 🏷️
// Leader Name (auto-filled from logged-in user)
// Leader Email (auto-filled from user info)
// Members → dynamic list of inputs
// Name
// Email
// Role (optional)
// “+ Add Member” button

// On Submit:
// POST /team-registrations → create the team record.
// POST /team-members → add each member under that team.


import CustomInput from '@/components/CustomInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BASE_URL } from '../admin_page/newfileloader';

type Event = {
  id: number;
  event_title: string;
  description: string;
  event_date: string;
  creator_name: string;
  event_code: string;
};

export default function event_registrations()  {

// toggle 
const [mode, setMode] = useState<'single' | 'team'>('single');
const [eventId, seteventId] = useState('');
const [teamName, setTeamName] = useState(''); 
const [members, setMembers] = useState([{name:'', email:'', role:''}]);
const [team_code, setteam_code] = useState('');
const [leaderName, setLeaderName] = useState('');
const [leaderEmail, setLeaderEmail] = useState('');

//loadl user info const 
const [role, setRole] = useState('');
const [eventTitle, setEventTitle] = useState('');
const [userId, setuserId] = useState('');

//load from EventCreation.tsx

const [loadCreation, setLoadCreation] = useState<Event[]>([]);


useEffect(()=> {
    //load from the other tables and controller
    const loadUserInfo = async () => {
        //user info from 
        const name = await AsyncStorage.getItem('userName');
        const email = await AsyncStorage.getItem('userEmail');
        const role = await AsyncStorage.getItem('userRole');
        const userId = await AsyncStorage.getItem('userId');

        //Event title from EventCreation.tsx, 
        const eventTitle = await AsyncStorage.getItem('event_title');

        if (name) setLeaderName(name);
        if(email) setLeaderEmail(email);
        if(role) setRole(role);
        if(eventTitle) setEventTitle(eventTitle);
        if(userId) setuserId(userId);
    if (eventId) seteventId(eventId);
    };
    loadUserInfo();
}, []);

//function to/add remove 
const addMember = () => setMembers([...members, {name: '', email : '', role : '' }]);

const removemember = (index: number) => {
    const newMembers = [...members];
    newMembers.splice(index, 1);
    setMembers(newMembers);
};


const handleRegsiteration = async () => {

    try{
        const token = await AsyncStorage.getItem('authToken');
        if (!token) return Alert.alert('Please log in first');

            if (!eventId) return Alert.alert('Please select or enter an event first');

        if(mode === 'single'){
            //POST/event_registrations

            //Controller name is EventRegistration,php 
           const res =  await fetch(`${BASE_URL}/events/${eventId}/register`, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                }, 
                body: JSON.stringify({
                    //event_id: eventId,
                    user_id: parseInt(userId, 10),
                    group_name: 'solo',
                }),
            });

            
            const data = await res.json();
            if(res.ok){

             alert(`${leaderName} has been registered` );
            }else{
                console.error("REG Failed:", data);
                alert("Registration failed.");
            }

        }
        // if the registration is multiple
        else{

            const team_Res = await fetch
            (`${BASE_URL}/teams`, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                }, 
                body:JSON.stringify({
                    event_id: eventId,
                    team_name: teamName,
                    members: members.map((m) => ({
                        member_name : m.name,
                        member_email:m.email,
                        role: m.role,
                        })),
                    }),
                }
            );

            const data = await team_Res.json();
            if(team_Res.ok){

             alert(`${leaderName} has been registered ` );
            }else{
                console.error("REG Failed:", data);
                alert("Registration failed.");
            }
        };


    }
    catch(err){
        console.error("Error ", err);
    }


};

    return (

        <ScrollView style={styles.container}>
    
            <Text style = {styles.title}> Event Registration.tsx in comp</Text>


            {/* Toggle  */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10 }}>
 
                <TouchableOpacity  onPress={() => setMode('single')}>
                    <Text style={[styles.toggleText, mode === 'single' && styles.activeToggle]}> Single</Text>
                </TouchableOpacity>

                <TouchableOpacity  onPress={() => setMode('team')}>
                    <Text style={[styles.toggleText, mode === 'team' && styles.activeToggle]}> Team</Text>
                </TouchableOpacity>
            </View>

            {/* loaded from the the table */}


            {loadCreation.map((ld) => {
                return(               
                    
                <View>
                    <Text>Title: {ld.event_title} </Text>
                    <Text>Register to {ld.event_code} </Text>
                </View>

            );

            })}

    

            <Text> Enter 1 in Event ID</Text>

            <CustomInput label="Event ID" placeholder="Enter event ID" value={eventId} onChangeText={seteventId} />
            <CustomInput label='Leader Name' placeholder='' value={leaderName} editable={false}/>
            <CustomInput label="Leader Email" placeholder="" value={leaderEmail} editable={false} />


            {/* team or single */}

            {mode === 'team' && (
                <>
                    <CustomInput label="Team Name" placeholder="Enter team name" 
                    value={teamName} onChangeText={setTeamName} />

                    <Text style={styles.memberHeader}>Team Members</Text>

                    {/* member registration area */}

                    {members.map((member, index) => (

                        <View key = {index} style= {styles.memberBox}> 
                            <CustomInput
                                label={`Member ${index + 1} Name`}
                                placeholder="Enter name"
                                value={member.name}
                                onChangeText={(text) => {
                                const updated = [...members];
                                updated[index].name = text;
                                setMembers(updated);
                                }}
                            />
                            <CustomInput
                                label={`Member ${index + 1} Email`}
                                placeholder="Enter email"
                                value={member.email}
                                onChangeText={(text) => {
                                const updated = [...members];
                                updated[index].email = text;
                                setMembers(updated);
                                }}
                            />
                            <CustomInput
                                label={`Role (optional)`}
                                placeholder="Runner, Support..."
                                value={member.role}
                                onChangeText={(text) => {
                                const updated = [...members];
                                updated[index].role = text;
                                setMembers(updated);
                                }}
                            />
                        
                    <TouchableOpacity onPress={() => removemember(index)}>
                        <Text style={styles.removeBtn}> Remove</Text>
                    </TouchableOpacity>


                        </View>
                    ))}
                

                {/* Add member button */}
                    <TouchableOpacity onPress={addMember}>
                        <Text style={styles.addBtn}>Add Member</Text>
                    </TouchableOpacity>
                </>
            )}


        {/* submit button */}
            <TouchableOpacity style={styles.submitBtn} onPress={handleRegsiteration}>
                <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
        </ScrollView>

    )
}


const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  toggleContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 15 },
  toggleText: { fontSize: 16, marginHorizontal: 20, color: '#999' },
  activeToggle: { color: '#007AFF', fontWeight: 'bold' },
  memberHeader: { marginTop: 20, fontSize: 18, fontWeight: '600' },
  memberBox: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginVertical: 8, borderRadius: 8 },
  removeBtn: { color: 'red', textAlign: 'right' },
  addBtn: { color: '#007AFF', textAlign: 'center', marginVertical: 10 },
  submitBtn: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, marginTop: 20 },
  submitText: { color: 'white', textAlign: 'center', fontSize: 16 },
});