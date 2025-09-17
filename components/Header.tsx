

import React from "react";

import { iconSize_dimension } from "@/constants/dimensions";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";



export default function Header(){


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
                <TouchableOpacity>
                    <Ionicons name={"arrow-back"} color={"#00000"} size = {iconSize_dimension.md} /> {/* from constants*/ }
                </TouchableOpacity>

                <TouchableOpacity>
                    <Octicons name = {"gear"} color={"#00000"} size = {iconSize_dimension.md} />
                </TouchableOpacity>

            </View>


      </ScrollView>

    );
}