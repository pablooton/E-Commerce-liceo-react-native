import "@/firebaseConfig";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useForm } from "react-hook-form";
import { z } from "zod";





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
        signInWithEmailAndPassword(auth,formData.email,formData.password).then(c(userCredentials))
    }
}