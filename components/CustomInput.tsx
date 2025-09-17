

// Icon import 

import { Colors } from "@/constants/Colors";
import { fontSize, iconSize_dimension, spacing } from "@/constants/dimensions";
import { StyleSheet, Text, TextInput, View } from "react-native";
//icon
import { Ionicons } from "@expo/vector-icons";

export default function CustomInput(){

    return (

        <View style = {styles.container}>
            <Text style = {styles.inputLabel}>Your Email</Text>
            <View style = {styles.inputFieldContainer}>
                <TextInput  style={styles.textInput}
                    placeholder="Enter your email"
                    keyboardType="email-address"/>
                <Ionicons name = {"mail-outline"} size={iconSize_dimension.md} 
                color={Colors.textPrimary.gray}  
                style = {styles.icon}
                /> {/* Imported from Colors.ts */}

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
container : {},
inputLabel:{
    fontFamily:'Poppins-SemiBold', 
    fontSize: fontSize.md, 
    color : Colors.textPrimary.gray,
},

inputFieldContainer:{
    borderWidth : 1, 
    borderColor : "#9BA1A6",
    borderRadius: 12, 
    flexDirection: "row",
    alignItems : "center",
},
icon:{
    marginHorizontal : spacing.sm,
},
textInput : {
     flex: 1,
    fontSize: 16,
    paddingVertical: 0, // removes default padding on Android
    marginLeft: 8, // space after the icon
},

});
