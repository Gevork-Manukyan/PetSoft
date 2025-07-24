import { LogIn, SignUp } from "@/actions/actions";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type AuthFormProps = {
    type: "login" | "signup";
}

export default function AuthForm({ type }: AuthFormProps) {
    return (
        <form action={type === "login" ? LogIn : SignUp}>
            <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="Email" required maxLength={100} />
            </div>

            <div className="mb-4 mt-2 space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" placeholder="Password" required maxLength={100} />
            </div>

            <Button type="submit">{type === "login" ? "Log In" : "Sign Up"}</Button>
        </form>
    )
}