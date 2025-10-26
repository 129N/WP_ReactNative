
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BASE_URL } from './newfileloader';

export default function adm_Datalist() {



  type UserItem = {
    email?: string;
    role?: string;
  };
    const [fectchedUsers, setFetchedUser] = useState< UserItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<{email:string; role:string}[]>([]);

    const fetchList = async() => {

        const token = await AsyncStorage.getItem('authToken');

        if(!token) {
             alert('No token found. Please log in again.');
            return;
        }
        try{

            const res = await fetch(`${BASE_URL}/registered_users`,{
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept:'application/json',
                },
            });

            const data = await res.json();

            if(res.ok){
                console.log("Fetched user:", data.users);
                setFetchedUser(data.users);
                alert('Fetching successful');
            } else{
                console.warn("Failed to fetch:", data);
            }


        }
        catch(GETERR){
            console.log('The GET mwthod', GETERR)
        } finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchList();
    }, []);


    //
    const rendereItem = ({item, index} : {item : {email: string, role: string
    }, index: number}) => (
        <View key={index} style={styles.participants}>
            <Text style={styles.userText}>📧 {item.email}</Text>
            <Text style={styles.userText}>🎭 {item.role}</Text>
        </View>
    );


  return (


        <View style = {styles.styleContainer}>
            
            <Text style={styles.sectionTitle}>Datalist.tsx </Text>

                <TouchableOpacity style={styles.button} onPress={fetchList}>
                    <Text style={styles.buttonText}>Fetch</Text>
                </TouchableOpacity>


              {loading ? (
                  <Text>Loading...</Text>
              ) : (

                  <FlatList
                      data = {fectchedUsers}
                      renderItem= {({ item, index }) => (
                        <View style={styles.participants}>
                          <Text style={styles.userText}>📧 {item.email}</Text>
                          <Text style={styles.userText}>🎭 {item.role}</Text>
                        </View>
                      )}
                      keyExtractor={(item, index) => index.toString()}
                  />  

              )}

                  
        </View>

  );
};


const styles = StyleSheet.create({
  styleContainer : {
    padding: 20,
    flex: 1,
  },
  sectionTitle:{
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  participants:{
    backgroundColor: '#2c2c2e',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  noData: {
    fontSize: 16,
    color: '#ff453a',
  },
  userText:{
    fontSize: 16,
    color: '#d1d1d6',
  },
  result:{
    backgroundColor: 'black',
    fontSize: 20,
  },
    button: {
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


