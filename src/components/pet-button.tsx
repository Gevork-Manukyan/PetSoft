"use client";

import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import { Dialog, DialogTitle, DialogHeader, DialogContent, DialogTrigger } from "./ui/dialog";
import PetForm from "./pet-form";
import { useState } from "react";

type PetButtonProps = {
    children?: React.ReactNode;
    actionType: "add" | "edit" | "checkout";
    onClick?: () => void;
}

export default function PetButton({ children, actionType, onClick }: PetButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    
    if (actionType === "checkout") {
        return (
            <Button variant="secondary" onClick={onClick}>
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

                <PetForm actionType={actionType} onFormSubmit={() => setIsOpen(false)} />
            </DialogContent>
        </Dialog>
    )
}