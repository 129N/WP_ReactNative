import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
//Icon 
import { iconSize_dimension } from '@/constants/dimensions';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

export default function Responsive() {
const [navMenuOpen, setnavMenuOpen] = useState(false);
const [anchorElUser, setAnchorElUser] = useState(false);

const handleCloseNavBar = () => setnavMenuOpen(false);
  const handleOpenNavMenu = () => setnavMenuOpen(true);

  return (
    <View style={styles.Container} >

  {/* Right icon */}
      <TouchableOpacity onPress={ handleOpenNavMenu }>
        <Ionicons name={"list-sharp"} color={"#00000"} size = {iconSize_dimension.md} />
      </TouchableOpacity>

        <Text style={styles.title}>My App</Text>

  {/* Left icon */}
      <TouchableOpacity>
        <Ionicons name={"person-circle-outline"} color={"#00000"} size = {iconSize_dimension.md} />
      </TouchableOpacity>


  {/* Modal for menu */}
      {/* <Modal visible={navMenuOpen} transparent animationType="fade">
        <TouchableOpacity style={styles.overlay} onPress={handleCloseNavBar}>
          <View style={styles.menu}>
            {pages.map((p, i) => (
              <TouchableOpacity key={i} onPress={() => console.log('Pressed', p)}>
                <Text style={styles.menuItem}>{p}</Text>
              </TouchableOpacity>
            ))}
            {settings.map((s, i) => (
              <TouchableOpacity key={i} onPress={() => console.log('Pressed', s)}>
                <Text style={styles.menuItem}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity> 
      </Modal> */}
    </View>

  );
}


const styles = StyleSheet.create({
  Container:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10, // add space between icons
    paddingHorizontal: 16,
    marginTop : 16
  },
  title :{ color: 'white', fontSize: 18, fontWeight: 'bold'},

});


