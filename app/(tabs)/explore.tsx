import Participant from '@/app/participant';
import { StyleSheet, View } from 'react-native';
export default function TabTwoScreen() {

  return (
    <View style= {styles.container}>

      <Participant/>

    </View>
 
  );
}

const styles = StyleSheet.create({
   container: {
      padding: 20,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
