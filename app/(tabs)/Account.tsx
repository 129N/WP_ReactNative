import { SafeAreaView } from "react-native-safe-area-context";
import ProfileScreen from "../Authentication/ProfileScreen";
export default function Account_profile() {

  return(

    // <Slot/>
<SafeAreaView style={{ flex: 1 }} >
     <ProfileScreen></ProfileScreen>
</SafeAreaView> 

//<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
//<ProfileScreen></ProfileScreen>
//</KeyboardAvoidingView> 


  );

}
  //