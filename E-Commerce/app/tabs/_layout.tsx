import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

const TabLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="indexProducts"
        options={{
          title: "Tienda",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="shopping-bag" color={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;