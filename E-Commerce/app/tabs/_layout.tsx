import FontAwesome from "@expo/vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Href, Link, router, Tabs, usePathname } from "expo-router";
import { getAuth, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

type TabBarIconProps = {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
};

const TabBarIcon = (props: TabBarIconProps) => <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;

const TabLayout = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const getUserEmail = async () => {
      setLoadingUser(true);
      const email = await AsyncStorage.getItem("userEmail"); 
      setUserEmail(email);
      setLoadingUser(false);
    };
    getUserEmail();
  }, []);

  if (loadingUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Cargando usuario...</Text>
      </View>
    );
  }

  if (!userEmail) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Por favor, inicia sesión</Text>
        <Link href="/" style={styles.link} asChild>
          <Pressable><Text style={styles.linkText}>Ir a inicio</Text></Pressable>
        </Link>
      </View>
    );
  }

  const logout = () => {
    Alert.alert("Cerrar Sesión", "¿Salir de la cuenta?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Cerrar Sesión", onPress: () => {
          const auth = getAuth();
          signOut(auth).then(async () => {
            await AsyncStorage.removeItem("userEmail");
            router.dismissAll();
            router.push("/");
          });
        }},
    ]);
  };

  const goToForm = () => {
    const path = `${pathname}/form` as Href;
    router.push(path);
  };

  const validPathname = () => pathname === "/products" || pathname === "/cart";

  const LogoutButtonLeft = () => (
      <Pressable onPress={logout}>
          {({ pressed }) => (
              <FontAwesome name="sign-out" size={25} color="black" style={{ marginLeft: 15, opacity: pressed ? 0.5 : 1 }} />
          )}
      </Pressable>
  );

  return (
    <Tabs>
      <Tabs.Screen
        name="products"
        options={{
          title: "Tienda",
          headerShown: true, // ESTO MUESTRA "TIENDA"
          headerTitle: "Tienda", 
          tabBarIcon: ({ color }) => <TabBarIcon name="shopping-bag" color={color} />,
          headerLeft: () => <LogoutButtonLeft />,
          headerRight: () => validPathname() && pathname === "/products" && (
              <Pressable onPress={goToForm}>
                {({ pressed }) => (
                  <FontAwesome name="plus-circle" size={25} color="black" style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }} />
                )}
              </Pressable>
            ),
        }}
      />
      
      <Tabs.Screen
        name="cart"
        options={{
          title: "Carrito",
          headerShown: true,
          headerTitle: "Carrito",
          tabBarIcon: ({ color }) => <TabBarIcon name="shopping-cart" color={color} />,
          headerLeft: () => <LogoutButtonLeft />,
          headerRight: () => validPathname() && pathname === "/cart" && (
              <Pressable onPress={goToForm}>
                {({ pressed }) => (
                  <FontAwesome name="plus-circle" size={25} color="black" style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }} />
                )}
              </Pressable>
            ),
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  loading: { fontSize: 20 },
  error: { fontSize: 20, color: "red" },
  link: { marginTop: 15, paddingVertical: 15 },
  linkText: { fontSize: 14, color: "#2e78b7" },
});

export default TabLayout;