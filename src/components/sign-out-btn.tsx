"use client";

import { SignOut } from "@/actions/actions";
import { Button } from "./ui/button";
import { useTransition } from "react";

export default function SignOutBtn() {
    const [isPending, startTransition] = useTransition();
    return (
        <Button onClick={() => startTransition(async () => await SignOut())} disabled={isPending}>
            {isPending ? "Signing Out..." : "Sign Out"}
        </Button>
    )
}