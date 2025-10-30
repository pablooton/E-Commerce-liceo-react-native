import React from "react";
import { ScrollView, StyleSheet, Text, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserWithEmailAndPassword, getAuth, updateProfile } from "firebase/auth";
import { z } from "zod";
import "@/firebaseConfig";

import FormInput from "@/components/FormInput";
import FormDatePicker from "@/components/DateTimePicker";
import Button from "@/components/Button";
import { router } from "expo-router";


const formSchema = z
  .object({
    name: z.string().min(1, "Ingrese su nombre"),
    last_name: z.string().min(1, "Ingrese sus apellidos"),
    email: z.string().email("Ingrese un email válido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string().min(6, "Repita la contraseña"),
    birthDate: z.date({
      required_error: "La fecha de nacimiento es obligatoria",
      invalid_type_error: "Seleccione una fecha válida",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })
  .refine((data) => {
    const today = new Date();
    let age = today.getFullYear() - data.birthDate.getFullYear();
    const m = today.getMonth() - data.birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < data.birthDate.getDate())) age--;
    return age >= 18;
  }, {
    message: "Debes ser mayor de 18 años",
    path: ["birthDate"],
  });


const RegisterScreen = () => {
  const auth = getAuth();

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPassword: "",
      birthDate: undefined, 
    },
    mode: "onBlur",
  });

  
  const onSubmit = async (data: any) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const user = userCredential.user;

      
      await updateProfile(user, { displayName: `${data.name} ${data.last_name}` });

      Alert.alert("Registro exitoso", `Bienvenido, ${data.name}`);
      reset();

      
      router.push("/tabs/indexProducts");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registro</Text>

      <FormInput control={control} name="name" placeholder="Nombre" />
      <FormInput control={control} name="last_name" placeholder="Apellidos" />
      <FormInput control={control} name="email" placeholder="Correo electrónico" inputMode="email" />
      <FormInput control={control} name="password" placeholder="Contraseña" secureTextEntry />
      <FormInput control={control} name="confirmPassword" placeholder="Confirmar contraseña" secureTextEntry />
      <FormDatePicker control={control} name="birthDate" placeholder="Fecha de nacimiento" />

      <Button text="Registrarse" onPress={handleSubmit(onSubmit)} />
    </ScrollView>
  );
};

export default RegisterScreen;


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4FC3F7",
    padding: 20,
    gap: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
});