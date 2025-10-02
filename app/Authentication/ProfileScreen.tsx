
import Header from '@/components/Header';
import { Colors } from '@/constants/Colors';
import { fontSize, iconSize_dimension, spacing } from '@/constants/dimensions';

import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// Icon import 
import { Feather, MaterialIcons } from '@expo/vector-icons';

//import Custom
import CustomInput from '@/components/CustomInput';
// Icon
import { useAuth } from '@/app/Authentication/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { BASE_URL } from '../admin_page/newfileloader';


export default function ProfileScreen() {

    const {user, logout, isLoggedIn, login, userRole, authToken} = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    useEffect(() => {
  if (isLoggedIn && user) {
        Alert.alert("Welcome back", user.name);
    }
    }, [isLoggedIn, user]);


     
    if(isLoggedIn){
        console.log("Welcome back", user?.name);
        // Alert.alert("Welcome back", user?.name);
    }

    const handleLogin = async() => {
        try{
            const response = await fetch(`${BASE_URL}/login_react`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Accept: "application/json" },
                    body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if(response.ok){
                const token = data.token;
                const roleFromApi = data.user.role;
                const userData = {
                id: data.user.id,
                name: data.user.name,
                email: data.user.email,
                role: data.user.role,
                };

                await login(token, roleFromApi, userData);

                Alert.alert("Success", `Logged in as ${roleFromApi}`);
                if (roleFromApi === "admin") router.push("../admin_page/admin");
            }else{
                Alert.alert("Login failed", data.error || "Invalid credentials");
            }

        }
        catch(err){
            console.error(err);
            Alert.alert("Error", "Something went wrong");
        }
    };
    
    const handleLogout = async() => {
        try{

            const token = authToken;

            const response = await fetch(`${BASE_URL}/logout` ,{
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,  
                    Accept: 'application/json',
                },
            });

            if(response.ok){

                await logout();
                Alert.alert("Logged out successfully");
                router.replace("../Setting"); // or wherever you want to go

            }else {
                const data = await response.json();
                console.warn("Logout failed:", data);
                Alert.alert("Logout failed", data.error || "Please try again");
            }
           

        }
        catch(err){
            console.error("Error logging out:", err);
            Alert.alert("Error", "Something went wrong");
        }
    }


    return (
      <ScrollView 
            style={styles.container} contentContainerStyle= { {paddingBottom:2 * spacing.md}}>

         <Header/>
                <View style = {styles.ProfileImageContainer}>
                    { isLoggedIn ? 
                        (
                        <Image style = {styles.ProfileImage} source={require("@/assets/images/Fugen.png")} />
                        ):
                        <Ionicons name={"person-circle"} color={"#00000"} size = {iconSize_dimension.lg * 5} /> 
                    } 
                </View>

                <TouchableOpacity style = {styles.editIconCOntainer}>
                    <Feather name = {"edit-3"} size={iconSize_dimension.md} color={Colors.iconPrimary.iconwhite}/>
                </TouchableOpacity>

            <View style = {styles.nameRolecontainer}>

                <Text style = {styles.name}>  Role : {isLoggedIn && user ?  user.email : "Email"} </Text>
                <Text style = {styles.role}> Account : {isLoggedIn ? userRole : "Not Logged In"} </Text>
                <Text style = {styles.name}> Name  : {isLoggedIn && user ?  user.name : "Guest"} </Text>
                
            </View>

            <View style = {styles.InputFieldContainer}>

                {!isLoggedIn ? (
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
                                <Text style={styles.buttonText}>Login</Text>
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

