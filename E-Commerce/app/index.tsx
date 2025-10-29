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
    email: z.string().email("Introduzca un email valido"),
    password: z.string().min(6,"Introduzca una contraseña con al menos 6 carácteres")
})
const LoginScreen =() => {

    const auth = getAuth();

    const{control, handleSubmit} = useForm({
        defaultValues: {
            email:"",
            password:"",
        },
        resolver:zodResolver(formSchema),
        mode:"onBlur",
        reValidateMode:"onBlur",

    });

    const onSubmit = async (formData :{email: string,password: string}) =>{
        signInWithEmailAndPassword(auth,formData.email,formData.password)
        
    }
     return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <FormInput
        control={control}
        name="email"
        autoCapitalize="none"
        autoCompleteType="email"
        inputMode="email"
        placeholder="Enter your email address"
      />
      <FormInput
        control={control}
        name="password"
        autoCapitalize="none"
        inputMode="text"
        placeholder="Enter your password"
        secureTextEntry
      />
     <Link href="/register" style={styles.link}>Don't have an account? Register here</Link>
      <Button text="Login" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};


const styles = StyleSheet.create({
    container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap:20,
    backgroundColor: "#4FC3F7",
  },
  link: {
    marginTop:10,
    color:"blue",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color:"white",
  },


});


export default LoginScreen;

