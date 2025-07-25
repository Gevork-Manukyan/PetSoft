"use client";
import { LogIn, SignUp } from "@/actions/actions";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import AuthFormBtn from "./auth-form-btn";
import { useFormState } from "react-dom";

type AuthFormProps = {
    type: "login" | "signup";
}

export default function AuthForm({ type }: AuthFormProps) {
    const [signUpError, dispatchSignUp] = useFormState(SignUp, null);
    const [loginError, dispatchLogin] = useFormState(LogIn, null);

    return (
        <form action={type === "login" ? dispatchLogin : dispatchSignUp}>
            <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="Email" required maxLength={100} />
            </div>

            <div className="mb-4 mt-2 space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" placeholder="Password" required maxLength={100} />
            </div>

            <AuthFormBtn type={type} />
            {signUpError?.message && <p className="text-red-500">{signUpError.message}</p>}
            {loginError?.message && <p className="text-red-500">{loginError.message}</p>}
        </form>
    )
}