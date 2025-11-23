import { Stack, router } from 'expo-router';
import { Pressable, Alert } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { getAuth, signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';

const LogoutButton = () => {
    const logout = () => {
        Alert.alert("Cerrar Sesión", "¿Estás seguro de que quieres cerrar la sesión?", [
          { text: "Cancelar", style: "cancel" },
          { text: "Cerrar Sesión", onPress: () => {
              const auth = getAuth();
              signOut(auth).then(async () => {
                await AsyncStorage.removeItem("userEmail");
                router.dismissAll();
                router.push("/");
              }).catch(() => Alert.alert("Error al cerrar sesión"));
            }},
        ]);
    };

    return (
        <Pressable onPress={logout}>
            {({ pressed }) => (
                <FontAwesome name="sign-out" size={25} color="black" style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }} />
            )}
        </Pressable>
    );
};

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
          headerRight: () => <LogoutButton />, 
        }}
      />
    </Stack>
  );
}