

import React from "react";

import { iconSize_dimension } from "@/constants/dimensions";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";



export default function Header(){

const navigation = useNavigation();
  const router = useRouter();

const handleOpenSettng = () =>{
// navigation.navigate(Setting.tsx)
};

    return (

            <View style = {styles.container}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name={"arrow-back"} color={"#00000"} size = {iconSize_dimension.md} /> {/* from constants*/ }
                </TouchableOpacity>

                <TouchableOpacity onPress={handleOpenSettng}>
                    <Octicons name = {"gear"} color={"#00000"} size = {iconSize_dimension.md} />
                </TouchableOpacity>

            </View>
    );

}


  const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 270,
    paddingHorizontal: 16,
    marginTop: 15,
  },
});

