import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";

type PetButtonProps = {
    children?: React.ReactNode;
    actionType: "add" | "edit" | "checkout";
}

export default function PetButton({ children, actionType }: PetButtonProps) {
    if (actionType === "add") {
        return (
            <Button size="icon">
                <PlusIcon className="w-6 h-6" />
            </Button>
        )
    }
    
    if (actionType === "edit") {
        return (
            <Button variant="secondary">
                {children}
            </Button>
        )
    }
    
    if (actionType === "checkout") {
        return (
            <Button variant="secondary">
                {children}
            </Button>
        )
    }
}