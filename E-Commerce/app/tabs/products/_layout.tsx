import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, Stack } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth';
import React from 'react';
import { Alert, Pressable } from 'react-native';

const logout = () => {
    Alert.alert("Close session", "Close session?", [
      { text: "Cancel", style: "cancel" },
      { text: "Close session", onPress: () => {
          const auth = getAuth();
          signOut(auth).then(async () => {
            await AsyncStorage.removeItem("userEmail");
            router.dismissAll();
            router.push("/");
          });
        }},
    ]);
  };
 const LogoutButtonLeft = () => (
      <Pressable onPress={logout}>
          {({ pressed }) => (
              <FontAwesome name="sign-out" size={25} color="black" style={{ marginLeft: 15, opacity: pressed ? 0.5 : 1 }} />
          )}
      </Pressable>
  );
export default function ProductsStack() {
  return (
    <Stack>
      <Stack.Screen
        name="indexProducts"
        options={{
          headerShown: false, 
        }}
      />
      <Stack.Screen
        name="details" 
        options={{
          headerTitle: 'Detalles del Producto',
          headerBackTitle: '', 
          headerShown:true,
          headerRight: () => <LogoutButtonLeft />,
        }}
      />
    </Stack>
  );
}