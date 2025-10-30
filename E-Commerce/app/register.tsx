import Button from "@/components/Button";
import FormDatePicker from "@/components/DateTimePicker";
import FormInput from "@/components/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router } from "expo-router";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { useForm } from "react-hook-form";
import { Alert, StyleSheet, Text, View, ScrollView } from "react-native";
import { z } from "zod";


const formSchema = z.object({
  name: z.string().min(1, "Please enter your name"),
  last_name: z.string().min(1, "Please enter your last name"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  birth_date: z.string().min(1, "Please enter your birthdate"),
});

const RegisterScreen = () => {
  const auth = getAuth();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPassword: "",
      birth_date: "",
    },
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const onSubmit = async (formData: any) => {
    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const { email } = userCredential.user;
      if (email) {
        await AsyncStorage.setItem("userEmail", email);
        router.push("/");
      }
    } catch (error) {
      Alert.alert("Error creating account");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register</Text>

      <FormInput control={control} name="name" placeholder="Enter your name" />
      <FormInput control={control} name="last_name" placeholder="Enter your last name" />
      <FormInput
        control={control}
        name="email"
        autoCapitalize="none"
        inputMode="email"
        placeholder="Enter your email address"
      />
      <FormInput
        control={control}
        name="password"
        secureTextEntry
        placeholder="Enter your password"
      />
      <FormInput
        control={control}
        name="confirmPassword"
        secureTextEntry
        placeholder="Confirm your password"
      />
      <FormDatePicker
        control={control}
        name="birth_date"
        placeholder="Enter your birthdate"
      />

      <Link href="/" style={styles.link}>
        Already have an account? Login here
      </Link>
      <Button text="Register" onPress={handleSubmit(onSubmit)} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 20,
    backgroundColor: "#4FC3F7",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  link: {
    color: "blue",
    marginTop: 10,
  },
});

export default RegisterScreen;