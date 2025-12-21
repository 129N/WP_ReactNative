import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
//Icon 
import { iconSize_dimension } from '@/constants/dimensions';
import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import { useState } from 'react';


export default function Responsive() {
const [navMenuOpen, setnavMenuOpen] = useState(false);
const [userIconOpen, setUserIconOpen] = useState(false);

//boolean for close the Modal
const handleCloseNavBar = () => setnavMenuOpen(false);
const handleCloseUserIcon = () => setUserIconOpen(false);

  // Open the icon's property 
  const handleOpenNavMenu = () => setnavMenuOpen(true);
  const handleOpenSettng = () => setUserIconOpen(true);

  const router = useRouter();

  const pages: {label: string, route: Href}[] = [
  { label: 'Event', route: '/comp/Event_Registration' },
  { label: 'Pricing', route: '/' },
  { label: 'Blog', route: '/' },
  ];

const settings: ({ label: string; route: Href })[] = [
  { label: 'Profile', route: '/Authentication/ProfileScreen' },
  { label: 'Account', route: '/Authentication/registration' },
  { label: 'Dashboard', route: '/' },

];

const handleNavigate = (route: Href) => {
  setnavMenuOpen(false);
  setUserIconOpen(false);
  router.push(route);
};

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
              <TouchableOpacity key={i} onPress={() => handleNavigate(p.route)}>
                <Text style={styles.menuItem}>{p.label}</Text>
              </TouchableOpacity>
            ))}
            
          </View>
        </TouchableOpacity> 
      </Modal> 


      <Modal visible={userIconOpen} transparent animationType='fade'>
        <View style={styles.overlay}>

        {/* button click */}
          <TouchableOpacity  onPress={handleCloseUserIcon}> 
        {/* menu */}
            <View style={styles.menu}>
              {settings.map((s, i) => (
                <TouchableOpacity key={i}   onPress={() => {
            console.log('Pressed', s);

            if ('action' in s && s.action === 'logout') {
              setUserIconOpen(false);
              router.replace('/'); // or '/login'
            } else {
              handleNavigate(s.route);
            }
          }}>
                  <Text style={styles.menuItem}>{s.label}</Text>
                </TouchableOpacity>
              ))}

            </View>
          </TouchableOpacity>
        </View>


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


