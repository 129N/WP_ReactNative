
import Header from '@/components/Header';
import { Colors } from '@/constants/Colors';
import { iconSize_dimension, spacing } from '@/constants/dimensions';

import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// Icon import 
import { Feather } from '@expo/vector-icons';

//import Custom
import CustomInput from '@/components/CustomInput';


export default function ProfileScreen() {
    

    return (
      <ScrollView>
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
                <CustomInput></CustomInput>
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

        }
    })

