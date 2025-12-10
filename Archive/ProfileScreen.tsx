
import Header from '@/components/Header';
import { Colors } from '@/constants/Colors';
import { fontSize, iconSize_dimension, spacing } from '@/constants/dimensions';

import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// Icon import 
import { Feather, MaterialIcons } from '@expo/vector-icons';

//import Custom
import CustomInput from '@/components/CustomInput';
// Icon
import { BASE_URL } from '@/app/admin_page/newfileloader';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';


export default function ProfileScreen() {

    //user property 
    const [role, setRole] = useState<'admin' | 'competitor'>('competitor');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //Login property 
    const [isLoggedin, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState ('');
    const [userRole, setUserRole] = useState('');
    const [userName, setUserName] = useState('');

    const router = useRouter();

    //AsynchStorage
    useEffect(() => {

        const loadUserInfo = async () =>{
            const token = await AsyncStorage.getItem('authToken');
            const email = await AsyncStorage.getItem('userEmail');
            const role = await AsyncStorage.getItem('userRole');
            const name = await AsyncStorage.getItem('name');
            setIsLoggedIn(!!token);
            setUserEmail(email || '');
            setUserRole(role || '');
            setUserName(name || '' );
        };
        loadUserInfo();
    }, []);


//handles Login System 
    const handleLogin = async () => {
        //setStep('code');
      try{
            if (!role) {
              console.warn("Role is not defined");
              alert("Please select a role");
              return;
            }

      console.log("Login payload:", email, password);


            // goes to AuthController.php
          const response = await fetch(`${BASE_URL}/login_react`,{
             method: 'POST',
             headers: {
              'Content-Type': 'application/json',
            'Accept': 'application/json',
            },
            body: JSON.stringify({
                email,  // email input value
                password,  // password input value
            }),

          });

          const data = await response.json();

          if (response.ok) {

            const token = data.token;
            const roleFromApi = data.user.role;
            const userName = data.user.name;
            const email = data.user.email;
   
         
             if (!token) {
                console.warn("Token not returned by API");
                alert("Login failed. Token not received.");
                return;
            }
            
            await AsyncStorage.setItem('userEmail', email);
            await AsyncStorage.setItem('authToken', token);
            await AsyncStorage.setItem('userRole', roleFromApi);
            await AsyncStorage.setItem('name', userName);

            alert('Logged in as ' + roleFromApi);
            console.log("Login Success:", token);

                if (roleFromApi === 'admin') { // role is also ok.
                router.push('../admin_page/admin'); // Route to admin screen
                } else {
                    router.push('../'); // Route to participant screen
                }

          } else {
            console.warn("Login Failed:", data.message || "Invalid credentials");
             alert(data.message || "Login failed. Please check your credentials.");
          }

        }
          catch(error){
            console.log("Error logging in:", error);
              alert("An error occurred. Please try again later.");
          }
      };



// handles Logout System
    const handleLogout = async () => {
        try{
               //await AsyncStorage.clear();
            const token = await AsyncStorage.getItem('authToken');
          
        await AsyncStorage.removeItem('userEmail');
            if(!token){
                Alert.alert('You are already logged out.');
                return;
            }

            //call backend (Laravel)
             const response = await fetch(`${BASE_URL}/logout`,{
                         method: 'POST',
                         headers: {
                            Authorization : `Bearer ${token}`, // It is needed to authenticate btw the server and the client.
                            Accept: 'application/json',
                        },
            });

            if(response.ok){
                // await AsyncStorage.removeItem('authToken');
                // await AsyncStorage.removeItem('userRole');
                // await AsyncStorage.removeItem('userEmail');
                // await AsyncStorage.removeItem('name');

      await AsyncStorage.multiRemove(['authToken', 'userRole', 'userId', 'userName']);

                // await AsyncStorage.clear();

                setIsLoggedIn(false);
                Alert.alert('Logged out !');
                router.replace('../Setting');
            } else{
                console.log("Token : " + response); // the [Object object] had shown mismatch of token. 
                Alert.alert('Logout failed. please try again');
            }
        }
        catch(error){
            console.log(error);
            Alert.alert("Error logging out");
        }
    };

    return (
      <ScrollView 
            style={styles.container}
            contentContainerStyle= { {paddingBottom:2 * spacing.md}}>

         <Header/>

            <View style = {styles.container} >
                
                <View style = {styles.ProfileImageContainer}>
                    { isLoggedin ? 
                        (
                        <Image style = {styles.ProfileImage} source={require("@/assets/images/Fugen.png")} />
                        ):
                        <Ionicons name={"person-circle"} color={"#00000"} size = {iconSize_dimension.lg * 5} /> 
                    } 
                </View>

                <TouchableOpacity style = {styles.editIconCOntainer}>
                    <Feather name = {"edit-3"} size={iconSize_dimension.md} color={Colors.iconPrimary.iconwhite}/>
                </TouchableOpacity>

            </View>

            <View style = {styles.nameRolecontainer}>

                <Text style = {styles.name}>  Role : {isLoggedin ? userEmail : "Email"} </Text>
                <Text style = {styles.role}> Account : {isLoggedin ? userRole : "Not Logged In"} </Text>
                    <Text style = {styles.name}> Name  : {isLoggedin ? userName : "Guest"} </Text>
                
            </View>

            <View style = {styles.InputFieldContainer}>

                {!isLoggedin ? (
                    <>
                    {/* show only if not logged in */}

                        <CustomInput 
                            label='Your Email' 
                            placeholder ='Enter Your email'
                            icon={<Ionicons name = {"mail-outline"} size={iconSize_dimension.md} 
                            color={Colors.textPrimary.gray}  
                            style = {styles.icon}/>} 
                            value = {email}
                            onChangeText={setEmail}
                            
                            />
                            
                        {/* <CustomInput 
                            label='Your Phone number' 
                            placeholder ='Enter Your Phone'
                            icon={<Entypo name = {"phone"} size={iconSize_dimension.md} 
                            color={Colors.textPrimary.gray}  
                            style = {styles.icon}/>} /> */}

                            <CustomInput 
                            label='Password' 
                            placeholder ='*********'
                            icon={
                            <MaterialIcons name = {"password"} size={iconSize_dimension.md} 
                            color={Colors.textPrimary.gray}  
                            style = {styles.icon}
                            
                            />} 
                            type='password'
                            value = {password}
                            onChangeText={setPassword}
                            />

                            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                                <Text style={styles.buttonText}>Next</Text>
                            </TouchableOpacity>

                    </>
                ) : (
                    <>
                    {/* show when logging in */}
                        <TouchableOpacity style = {styles.logoutButton} onPress={handleLogout}>
                            <Text style={styles.logoutText}>Logout </Text>
                        </TouchableOpacity>
                    </>
                )}

            </View>

      </ScrollView>

    );

}
    const styles = StyleSheet.create({
    container:{
        flex : 1,
        padding: spacing.md,
        },

        ProfileImageContainer : {
            justifyContent : "center",
            alignItems : "center",
            marginTop : spacing.lg,
        },
        ProfileImage : {
            height : 140, 
            width : 140,
        },
        editIconCOntainer:{
            height : 40,
            width : 40,
            backgroundColor: Colors.orange.background, 
            borderRadius : 15, 
            justifyContent : "center", 
            alignItems : "center",
            marginTop: -20,
            marginLeft: 210,
        },
        nameRolecontainer:{
            alignItems : "center",
            marginVertical : spacing.lg,
        },

        name : {

        }, 
        role:{},

        InputFieldContainer :{

        },

        icon:{
            marginHorizontal : spacing.sm,
            },

        logoutButton:{
            borderWidth: 1,
            borderColor: Colors.orange.background,
            padding:spacing.md,
            alignItems: "center", 
            justifyContent: "center", 
            borderRadius: 10
        },
        logoutText:{
            fontSize: fontSize.md,
            color: Colors.orange.background,
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

    })

