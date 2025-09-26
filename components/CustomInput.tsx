

// Icon import 

import { Colors } from "@/constants/Colors";
import { fontSize, iconSize_dimension, spacing } from "@/constants/dimensions";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View } from "react-native";
//icon


type CustomInputProps = TextInputProps & {
label: string, 
icon?: React.ReactNode, // any was not allowed
placeholder: string,
type? : string,
};


const CustomInput: React.FC<CustomInputProps> = ({label, icon, placeholder, type, ...rest}) => {

        const [secureTextEntry, setSecureTextEntry] = useState(true)


    return (

        <View style = {styles.container}>
            <Text style = {styles.inputLabel}>{label}</Text>
            <View style = {styles.inputFieldContainer}>

                {icon}
                 {/* <Ionicons name = {"mail-outline"} size={iconSize_dimension.md} 
                color={Colors.textPrimary.gray}  
                style = {styles.icon}/> 
                 */}
                
                {/* Imported from Colors.ts */}
                <TextInput  
                style={styles.textInput}
                placeholder={placeholder}
                placeholderTextColor={Colors.textPrimary.gray}
                secureTextEntry={  type ==="password" && secureTextEntry}
                keyboardType={type === "password" ? "default" : "email-address"} 
                {...rest} 
         />

                    {
                        type ==="password" && (
                            <TouchableOpacity onPress={() => 
                                setSecureTextEntry(!secureTextEntry)}>

                                <Feather 
                                    name={secureTextEntry ? "eye" : "eye-off"} 
                                    size={iconSize_dimension.md} 
                                    color={Colors.textPrimary.gray}  
                                    style = {styles.icon}
                                />
                            </TouchableOpacity>
                        )
                    }
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
container : {
    marginVertical: spacing.md,
},
inputLabel:{
    fontFamily:'Poppins-SemiBold', 
    fontSize: fontSize.md, 
    color : Colors.textPrimary.gray,
    marginVertical: spacing.md,
},

inputFieldContainer:{
    borderWidth : 1, 
    borderColor : "#9BA1A6",
    borderRadius: 12, 
    flexDirection: "row",
    alignItems : "center",
    padding: spacing.sm,
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



export default CustomInput;