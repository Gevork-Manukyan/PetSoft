import { PetContext, PetContextType } from "@/contexts/pet-context-provider";
import { useContext } from "react";

export const usePetContext = (): PetContextType => {
    const context = useContext(PetContext);
    if (!context) {
        throw new Error("usePetContext must be used within a PetContextProvider");
    }
    return context;
}