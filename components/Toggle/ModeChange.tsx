
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-iconify';

export const ModeChange = ({ 
  darkMode, 
  setDarkMode 
}: { 
  darkMode: boolean; 
  setDarkMode: (mode: boolean) => void 
}) => {
  return (
    <View style={styles.iconButtons}>
      <TouchableOpacity
        onPress={() => setDarkMode(!darkMode)}
        style={[styles.modeToggle, darkMode ? styles.dark : styles.light]}
        accessibilityLabel={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        <Icon 
          icon={darkMode ? "ri:sun-fill" : "ri:moon-line"} 
          size={30} // react-native-iconify may use "size" instead of width/height
          color={darkMode ? "#FFFFFF" : "#000000"}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  iconButtons: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeToggle: {
    padding: 10,
    borderRadius: 50,
  },
  dark: {
    backgroundColor: '#333',
  },
  light: {
    backgroundColor: '#EEE',
  },
});

export default ModeChange;






// import Icon from 'react-native-iconify';
// export const ModeChange = ({ 
//   darkMode, 
//   setDarkMode 
// }: { 
//   darkMode: boolean; 
//   setDarkMode: (mode: boolean) => void 
// }) => {
//   return (
//     <div className="Icon_buttons">
//       <button 
//         onClick={() => setDarkMode(!darkMode)}
//         className={`mode-toggle ${darkMode ? 'dark' : 'light'}`}
//         aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
//       >
//         <Icon 
//           icon={darkMode ? "ri:sun-fill" : "ri:moon-line"} 
//           width="30" 
//           height="30"
//         />
//       </button>
//     </div>
//   );
// };

// export default ModeChange;