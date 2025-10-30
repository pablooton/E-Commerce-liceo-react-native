import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router } from "expo-router";
import { useForm } from "react-hook-form";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Alert, StyleSheet, Text, View } from "react-native";
import { z } from "zod";
import "@/firebaseConfig";

const formSchema = z.object({
  email: z.string().email("Introduzca un email válido"),
  password: z
    .string()
    .min(6, "Introduzca una contraseña con al menos 6 caracteres"),
});

const LoginScreen = () => {
  const auth = getAuth();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const onSubmit = async (formData: { email: string; password: string }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const { email } = userCredential.user;
      if (email) {
        
        await AsyncStorage.setItem("userEmail", email);
        
        router.push("/tabs/indexProducts");
      }
    } catch (error) {
      Alert.alert(
        "Error al iniciar sesión",
        "Email o contraseña incorrectos"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <FormInput
        control={control}
        name="email"
        autoCapitalize="none"
        inputMode="email"
        placeholder="Introduce tu email"
      />
      <FormInput
        control={control}
        name="password"
        autoCapitalize="none"
        inputMode="text"
        placeholder="Introduce tu contraseña"
        secureTextEntry
      />

      <Link href="/register" style={styles.link}>
        ¿No tienes cuenta? Regístrate aquí
      </Link>

      <Button text="Login" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    backgroundColor: "#4FC3F7",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  link: {
    marginTop: 10,
    color: "blue",
  },
});

export default LoginScreen;