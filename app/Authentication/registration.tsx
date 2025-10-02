import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { BASE_URL } from '../admin_page/newfileloader';

export default function AuthScreen(){
    const [role, setRole] = useState<'admin' | 'competitor'>('competitor');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const router = useRouter();

const [fetchedUser, setFetchedUser] = useState<{ email?: string; role?: string, name?: string } []>([]);
//export const BASE_URL = ngrok from http8
    const handleregister = async () => {

      //Registration here
      try{

        console.log('Registration is in the process');
        const response = await fetch(`${BASE_URL}/register`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            {
              email,
              password,
              role, //admin or competitor
              name,
            }
          ),
        });

        const data = await response.json();
        if(response.ok){
          console.log('Registration has been succeeded');

        Alert.alert(
          'Registration Successful!',
          'Would you like to go to the login page?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'OK', onPress: () => router.replace('../admin_page/registration') }, // adjust the route as needed
          ]
        );
        
        }else{
          console.log('Failed', data);
        }

      } catch(err){
        console.error("Registration Error:", err);
      }
    };


    //Data fetching here
    const fetchText = async() => {

      // after login or register (backend returns token)
      const token = await AsyncStorage.getItem('token');

        try{
          const response = await fetch (`${BASE_URL}/registered_users`,{
            headers : {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
        });
      const data = await response.json();
          if(response.ok){

          console.log("Fetched user:", data.users);
            setFetchedUser(data.users);
            alert('Fetching successful');

          } else {
            console.warn("Failed to fetch:", data);
          }
        } 
        catch(geterr){
          console.log('The GET mwthod', geterr)
        }
    };


    //De;ete data process
  const handleDelete = async () => {
          console.log('Delete is in the process');

          const token = await AsyncStorage.getItem('token');
      try {
        const response = await fetch(`${BASE_URL}/registered_users`, {
          method: 'DELETE',
          headers:{
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({email, password, role, name}),
        });

        const result = await response.json();

        if (response.ok) {
          console.log('Data deleted successfully!');
          alert('Data deleted successfully!');
        } else {
          console.error('Delete failed:', result);
          alert('Error deleting data');
        }
      } catch (error) {
        console.error('Request failed:', error);
        alert('Failed to connect to server');
      }
};


const TEST = async ()=> {
try {
  console.log("We are connecting");
  const res = await fetch(`${BASE_URL}/ping`);
  const text = await res.text();
      console.log('PING:', text);

} catch (err) {
  console.error(err);
    console.log("FAIL");
}

};

   
      {/* Select role*/}
      return (

<View style={styles.container}>
  <Text style={styles.sectionTitle}>Registration.tsx </Text>
  
  <Text style={styles.sectionTitle}>Select Role:</Text>
  
  <View style={styles.roleContainer}>
    <TouchableOpacity 
      style={styles.roleButton}
      onPress={() => setRole('competitor')}
    >
      <Text style={styles.roleText}>
        {role === 'competitor' ? '🔘' : '⚪'} Competitor
      </Text>
    </TouchableOpacity>

    <TouchableOpacity 
      style={styles.roleButton}
      onPress={() => setRole('admin')}
    >
      <Text style={styles.roleText}>
        {role === 'admin' ? '🔘' : '⚪'} Admin
      </Text>
    </TouchableOpacity>
  </View>

 
    <View style={styles.formContainer}>
      <Text style={styles.label}>Email</Text>
      <TextInput 
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput 
        style={styles.input}
        placeholder="Enter your password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />

      
      <Text style={styles.label}>Name</Text>
      <TextInput 
        style={styles.input}
        placeholder="Enter your Name"
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity style={styles.button} onPress={handleDelete}>
        <Text style={styles.buttonText}>Delete Data </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleregister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>


      <TouchableOpacity style={styles.button} onPress={fetchText}>
        <Text style={styles.buttonText}>Fetch</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={TEST}>
        <Text style={styles.buttonText}>Connection Test</Text>
      </TouchableOpacity>



      
      <View style={styles.result}>


        <Text style={styles.title}>The result Users </Text>

          {fetchedUser.length > 0 ? (
              fetchedUser.map((users, index) => (
                <View key={index} style={styles.userCard}>
                  <Text style={styles.userText}>📧 {users.email}</Text>
                  <Text style={styles.userText}>🎭 {users.role}</Text>
                  <Text style={styles.userText}>N {users.name}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noData}>No data fetched yet</Text>
            )}

      </View>

    </View>

</View>
);
}

const styles = StyleSheet.create({
    container: {
      padding: 20,
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    roleContainer:{
        flexDirection: 'row',
        marginBottom: 25,
    },

    roleButton:{
        marginRight: 20,
    },
    roleText:{
        fontSize: 16,
        color: 'black',
    },

    buttonContainer: {
      flexDirection: 'column',
      gap: 12,
      width: '100%',
      maxWidth: 300,
    },
    formContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },

    label:{
        fontSize: 14,
        marginBottom: 5,
        color: '#555',
    },
    input:{
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        backgroundColor: '#fff',
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

      result: {
        backgroundColor: 'black',
        fontSize: 20,
      },
       title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  userCard: {
    backgroundColor: '#2c2c2e',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },

  userText: {
    fontSize: 16,
    color: '#d1d1d6',
  },
   noData: {
    fontSize: 16,
    color: '#ff453a',
  },


  });