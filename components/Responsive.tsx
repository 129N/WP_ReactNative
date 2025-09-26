import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
//Icon 
import { iconSize_dimension } from '@/constants/dimensions';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

export default function Responsive() {
const [navMenuOpen, setnavMenuOpen] = useState(false);
const [userIconOpen, setUserIconOpen] = useState(false);

//boolean for close the Modal
const handleCloseNavBar = () => setnavMenuOpen(false);
const handleCloseUserIcon = () => setUserIconOpen(false);

  // Open the icon's property 
  const handleOpenNavMenu = () => setnavMenuOpen(true);
  const handleOpenSettng = () => setUserIconOpen(true);

  return (
    <View style={styles.Container} >

  {/* Right icon */}
      <TouchableOpacity onPress={ handleOpenNavMenu }>
        <Ionicons name={"list-sharp"} color={"#00000"} size = {iconSize_dimension.md} />
      </TouchableOpacity>

        <Text style={styles.title}>My App</Text>

  {/* Left icon */}
      <TouchableOpacity onPress={handleOpenSettng}>
        <Ionicons name={"person-circle-outline"} color={"#00000"} size = {iconSize_dimension.md} />
      </TouchableOpacity>


  {/* Modal for Left menu */}
      < Modal visible={navMenuOpen} transparent animationType="fade">
        <TouchableOpacity style={styles.overlay} onPress={handleCloseNavBar}>
                                        {/* () => setnavMenuOpen(false) */}
          <View style={styles.menu}>
            {pages.map((p, i) => (
              <TouchableOpacity key={i} onPress={() => console.log('Pressed', p)}>
                <Text style={styles.menuItem}>{p}</Text>
              </TouchableOpacity>
            ))}
            
          </View>
        </TouchableOpacity> 
      </Modal> 


      <Modal visible={userIconOpen} transparent animationType='fade'>
        <TouchableOpacity style={styles.overlay} onPress={handleCloseUserIcon}> 
                                          {/* () => setUserIconOpen(false) */}
          <View style={styles.menu}>
            {settings.map((s, i) => (
              <TouchableOpacity key={i} onPress={() => console.log('Pressed', s)}>
                <Text style={styles.menuItem}>{s}</Text>
              </TouchableOpacity>
            ))}

          </View>
        </TouchableOpacity>

      </Modal>


    </View>

  );
}


const styles = StyleSheet.create({
  Container:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 100, // add space between icons
    paddingHorizontal: 16,
    marginTop : 16
  },
  title :{ color: 'white', fontSize: 18, fontWeight: 'bold'},
 overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    width: 200,
  },
  menuItem: {
    fontSize: 16,
    paddingVertical: 10,
  },
});


