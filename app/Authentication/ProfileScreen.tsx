
import Header from '@/components/Header';
import { Colors } from '@/constants/Colors';
import { fontSize, iconSize_dimension, spacing } from '@/constants/dimensions';

import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// Icon import 
import { Entypo, Feather, MaterialIcons } from '@expo/vector-icons';

//import Custom
import CustomInput from '@/components/CustomInput';
// Icon
import { Ionicons } from '@expo/vector-icons';


export default function ProfileScreen() {
    

    return (
      <ScrollView 
      style={styles.container}
      contentContainerStyle= { {paddingBottom:2 * spacing.md}}>
         <Header/>
            <View style = {styles.container} >
                
                <View style = {styles.ProfileImageContainer}>
                    <Image source={require("@/assets/images/Fugen.png")} style = {styles.ProfileImage}/>
                </View>

                <TouchableOpacity style = {styles.editIconCOntainer}>
                    <Feather name = {"edit-3"} size={iconSize_dimension.md} color={Colors.iconPrimary.iconwhite}/>
                </TouchableOpacity>

            </View>

            <View style = {styles.nameRolecontainer}>
                <Text style = {styles.name}> Name </Text>
                <Text style = {styles.role}> Role </Text>
            </View>

            <View style = {styles.InputFieldContainer}>

                <CustomInput 
                    label='Your Email' 
                    placeholder ='Enter Your email'
                    icon={<Ionicons name = {"mail-outline"} size={iconSize_dimension.md} 
                    color={Colors.textPrimary.gray}  
                    style = {styles.icon}/>} />
                    
                <CustomInput 
                    label='Your Phone number' 
                    placeholder ='Enter Your Phone'
                    icon={<Entypo name = {"phone"} size={iconSize_dimension.md} 
                    color={Colors.textPrimary.gray}  
                    style = {styles.icon}/>} />


                <CustomInput 
                    label='Website' 
                    placeholder ='WWW.XXX.COM'
                    />

                    <CustomInput 
                    label='Password' 
                    placeholder ='*********'
                    icon={
                    <MaterialIcons name = {"password"} size={iconSize_dimension.md} 
                    color={Colors.textPrimary.gray}  
                    style = {styles.icon}
                    
                    />} 
                    type='password'
                    />

                    <TouchableOpacity style = {styles.logoutButton}>
                        <Text style={styles.logoutText}>Logout </Text>
                    </TouchableOpacity>

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
        }
    })

