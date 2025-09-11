import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const ThemeToggle = ({ darkMode, setDarkMode }: { darkMode: boolean; setDarkMode: (mode: boolean) => void }) => {
  return (
    <TouchableOpacity
      style={[styles.toggle, { backgroundColor: '#1F2937' }]}
      onPress={() => setDarkMode(!darkMode)}
    >
      <Text style={{ color: '#FFFFFF' }}>{darkMode ? 'Light Mode' : 'Dark Mode'}</Text>
    </TouchableOpacity>
  );
};

export const ThemeToggle_second = ({ darkMode, setDarkMode }: { darkMode: boolean; setDarkMode: (mode: boolean) => void }) => {
  return (
    <TouchableOpacity
      style={[styles.toggle, { backgroundColor: '#FFFFFF', borderColor: '#D1D5DB', borderWidth: 1 }]}
      onPress={() => setDarkMode(!darkMode)}
    >
      <Text style={{ color: '#000000' }}>{darkMode ? 'Light Mode' : 'Dark Mode'}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  toggle: {
    padding: 10,
    borderRadius: 6,
    marginHorizontal: 5,
  },
});

export default ThemeToggle;
