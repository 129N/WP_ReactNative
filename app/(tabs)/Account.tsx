
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Tabs } from "expo-router";
export default function Account_profile() {

  return(

    // <Slot/>

      <Tabs screenOptions={{headerShown: false}} >
      <Tabs.Screen name="index" options={{title : 'Home'}}/>
      <Tabs.Screen name="explore" options={{title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      </Tabs>
  );

}
  //