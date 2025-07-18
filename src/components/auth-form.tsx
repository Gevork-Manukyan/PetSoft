import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type AuthFormProps = {
    type: "login" | "signup";
}

export default function AuthForm({ type }: AuthFormProps) {
    return (
        <form>
            <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Email" />
            </div>

            <div className="mb-4 mt-2 space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Password" />
            </div>

            <Button type="submit">{type === "login" ? "Log In" : "Sign Up"}</Button>
        </form>
    )
}