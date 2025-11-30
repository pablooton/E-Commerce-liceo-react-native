import { Stack } from 'expo-router';
import React from 'react';


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
        }}
      />
    </Stack>
  );
}