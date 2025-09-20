

import React from "react";

import { iconSize_dimension } from "@/constants/dimensions";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";



export default function Header(){

const navigation = useNavigation();
  const router = useRouter();

const handleOpenSettng=() =>{
// navigation.navigate(Setting.tsx)
};

    const style = StyleSheet.create({
        container: {
    flexDirection: 'row',
 justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16, // add space between icons
    paddingHorizontal: 16,
    marginTop : 15
  },

    });

    return (
      <ScrollView>


            <View style = {style.container}>
                <TouchableOpacity onPress={() => router.push('/')}>
                    <Ionicons name={"arrow-back"} color={"#00000"} size = {iconSize_dimension.md} /> {/* from constants*/ }
                </TouchableOpacity>

                <TouchableOpacity onPress={handleOpenSettng}>
                    <Octicons name = {"gear"} color={"#00000"} size = {iconSize_dimension.md} />
                </TouchableOpacity>

            </View>


      </ScrollView>

    );
}