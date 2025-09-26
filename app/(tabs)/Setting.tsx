import { ScrollView, StyleSheet, Text } from 'react-native';

export default function Setting() {
    

    return (
      <ScrollView>


        <Text>logout page</Text>
        
      </ScrollView>

    );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    color: '#FFFFFF'
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  container: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
