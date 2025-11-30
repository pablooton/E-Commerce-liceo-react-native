import { Stack } from "expo-router";

import CartProvider from "./contexts/CartContext";

const RootLayout = () => {
  return (
    <CartProvider>
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ headerShown: false }} 
        />
        
        <Stack.Screen 
          name="register" 
          options={{ 
            title: "Crear Cuenta",
            headerShown: true, 
            headerBackTitle: "Volver" 
          }} 
        />
        <Stack.Screen 
          name="tabs" 
          options={{ headerShown: false }} 
        />
        
      </Stack>
    </CartProvider>
  );
};

export default RootLayout;