import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from "react-native";

export default function AuthScreen(){
    const [role, setRole] = useState<'admin' | 'competitor'>('competitor');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    //const [eventId, setEventId] = useState('');
    //const [step, setStep] = useState<'login' | 'code'>('login');
    //const [code, setCode] = useState('');
    const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);

  
  const router = useRouter();


    const handleLogin = async () => {
        //setStep('code');

        try{
            if (!role) {
              console.warn("Role is not defined");
              alert("Please select a role");
              return;
            }

                                 
          const response = await fetch('http://192.168.0.101:8001/api/login_react',{
             method: 'POST',
             headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,  // email input value
                password,  // password input value
            }),

          });

          const data = await response.json();

          if (response.ok) {
            const token = data.token;

             if (!token) {
                console.warn("Token not returned by API");
                alert("Login failed. Token not received.");
                return;
            }


            await AsyncStorage.setItem('authToken', token);
            console.log("Login Success:", token);

                if (role === 'admin') {
                router.push('/admin_page/admin'); // Route to admin screen
                } else {
                    router.push('/participant'); // Route to participant screen
                }

          } else {
            console.warn("Login Failed:", data.message || "Invalid credentials");
            
             alert(data.message || "Login failed. Please check your credentials.");
          }

        }catch(error){
          console.log("Error logging in:", error);
            alert("An error occurred. Please try again later.");
        }
    };
    
        const fetchRegisteredUsers = async () => {
            try {
              const response = await fetch('http://192.168.0.101:8001/api/registered_users');
              const data = await response.json();

              if (response.ok) {
                setRegisteredUsers(data.users || data); // adjust based on response structure
              } else {
                console.warn("Failed to fetch users:", data.message);
              }
            } catch (error) {
              console.error("Fetch error:", error);
            }
          };


      return (

<View style={styles.container}>
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


      {/* 
      <Text style={styles.label}>Event ID</Text>
      <TextInput 
        style={styles.input}
        placeholder="Enter event ID"
        value={eventId}
        onChangeText={setEventId}
      /> */}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
      <Text style={styles.sentence}> If you do not have your account</Text>
      <TouchableOpacity style={styles.button_red} onPress={() => router.push('/Authentication/registration')}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

        <TouchableOpacity style={styles.buttonOutline} onPress={fetchRegisteredUsers}>
          <Text style={styles.buttonText}>Show Registered Users</Text>
        </TouchableOpacity>


         <ScrollView style={{ marginTop: 20, maxHeight: 200 }}>
          {registeredUsers.length > 0 ? (
            registeredUsers.map((user, index) => (
              <View key={index} style={styles.userBox}>
                <Text>Email: {user.email}</Text>
                <Text>Password: {user.password}</Text>
              </View>
            ))
          ) : (
            <Text>No users found or not fetched yet.</Text>
          )}
        </ScrollView>










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
      
      button_red: {
        backgroundColor: 'red',
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
      sentence:{
        fontSize: 20,
      },userBox: {
          backgroundColor: '#eaeaea',
          padding: 10,
          borderRadius: 8,
          marginBottom: 10,
        },
        buttonOutline: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  });