import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, } from "react-native";


export default function AuthScreen(){
    const [role, setRole] = useState<'admin' | 'competitor'>('competitor');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [eventId, setEventId] = useState('');
    const [step, setStep] = useState<'login' | 'code'>('login');
    const [code, setCode] = useState('');

    const handleLogin = async () => {
        //setStep('code');

        try{
                                  // physical phone or android emulator is different url.
                                  //http://127.0.0.1:8000/api/login laravel
                                  // http://10.0.2.2:8000/api/login React naitve
                                  // http://192.168.1.12:8000/api/login  PC’s local IP address
          const response = await fetch('http://192.168.0.101:8000/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              password,
              event_id: eventId, // if your backend expects this
            }),
          });


          const data = await response.json();

          if (response.ok) {
            const token = data.token;
      

            await AsyncStorage.setItem('authToken', token);
      
            console.log("Login Success:", token);
            setStep('code'); // Move to verification step
          } else {
            console.warn("Login Failed:", data.message || "Invalid credentials");
          }

        }catch(error){
          console.log("Error logging in:", error)
        }
    }
    
    const router = useRouter();

    const handleVerifyCode = () => {
        // Send code + credentials to backend for verification
        if (role === 'admin') {
            router.push('/admin_page/admin'); // Route to admin screen
        } else {
            router.push('/participant'); // Route to participant screen
        }
      };

      {/* Select role*/}
      return (

<View style={styles.container}>
  <Text style={styles.sectionTitle}>Select Role:</Text>
  
  <View style={styles.roleContainer}>
    

    <TouchableOpacity 
      style={styles.roleButton}
      onPress={() => setRole('admin')}
    >
      <Text style={styles.roleText}>
        {role === 'admin' ? '🔘' : '⚪'} Admin
      </Text>
    </TouchableOpacity>
  </View>

  {step === 'login' ? (
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

  

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
      <Text style={styles.sentence}> If you do not have your account</Text>
      <TouchableOpacity style={styles.button_red} onPress={() => router.push('/Authentication/registration')}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <View style={styles.formContainer}>
      <Text style={styles.label}>Verification Code</Text>
      <TextInput 
        style={styles.input}
        placeholder="Enter 6-digit code"
        keyboardType="numeric"
        value={code}
        onChangeText={setCode}
      />

      <TouchableOpacity style={styles.button} onPress={handleVerifyCode}>
        <Text style={styles.buttonText}>Verify Code</Text>
      </TouchableOpacity>
    </View>
  )}
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
      }
  });