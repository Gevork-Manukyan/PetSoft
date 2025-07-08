"use client"

import Link from "next/link";
import Logo from "./logo";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
    {
        label: "Dashboard",
        path: "/app/dashboard"
    },
    {
        label: "Account",
        path: "/app/account"
    },
]

export default function AppHeader() {
    const pathname = usePathname();
    
    return (
        <header className="flex items-center justify-between border-b border-white/10 py-2">
            <Logo />

            <nav>
                <ul className="flex gap-2 text-xs">
                    {links.map((link) => (
                        <li key={link.path}>
                            <Link href={link.path} className={cn("text-white/70 rounded-sm px-2 py-1 hover:text-white focus:text-white transition", 
                            {
                                "bg-black/10 text-white": pathname === link.path
                            })}>{link.label}</Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    )
}