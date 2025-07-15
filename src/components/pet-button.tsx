"use client";

import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import { Dialog, DialogTitle, DialogHeader, DialogContent, DialogTrigger } from "./ui/dialog";
import PetForm from "./pet-form";
import { useState } from "react";
import { flushSync } from "react-dom";

type PetButtonProps = {
    actionType: "add" | "edit" | "checkout";
    children?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
}

export default function PetButton({ children, actionType, onClick, disabled }: PetButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    
    if (actionType === "checkout") {
        return (
            <Button variant="secondary" onClick={onClick} disabled={disabled}>
                {children}
            </Button>
        )
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {actionType === "add" ? (
                    <Button size="icon">
                        <PlusIcon className="w-6 h-6" />
                    </Button>
                ) : (
                    <Button variant="secondary">
                        {children}
                    </Button>
                )}
            </DialogTrigger>
            
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{actionType === "add" ? "Add a new pet" : "Edit pet"}</DialogTitle>
                </DialogHeader>

                <PetForm actionType={actionType} onFormSubmit={() => {
                    flushSync(() => {
                        setIsOpen(false)
                    })
                }} />
            </DialogContent>
        </Dialog>
    )
}