
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Tabs } from "expo-router";
export default function TabLayout() {

  return(

    // <Slot/>

      <Tabs screenOptions={{headerShown: false}} >
      <Tabs.Screen name="index" options={{title : 'Home'}}/>
      <Tabs.Screen name="explore" options={{title: 'Participant',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
          <Tabs.Screen name="profile" options={{title : 'Account'}}/>
          <Tabs.Screen name="Setting"  options={{title : 'Setting'}} />
      </Tabs>


  );

}