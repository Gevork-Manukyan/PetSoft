"use client";

import { SignOut } from "@/actions/actions";
import { Button } from "./ui/button";

export default function SignOutBtn() {
    return (
        <Button onClick={async () => await SignOut()}>Sign Out</Button>
    )
}