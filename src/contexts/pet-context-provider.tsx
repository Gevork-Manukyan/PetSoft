"use client";

import { Pet } from "@/lib/types";
import { createContext, useState } from "react";

export type PetContextType = {
    pets: Pet[];
    selectedPetId: string | null;
    handleSelectPet: (petId: string) => void;
}

export const PetContext = createContext<PetContextType | null>(null);

export default function PetContextProvider({ children, pets }: { children: React.ReactNode, pets: Pet[] }) {
    const [petsState, setPetsState] = useState<Pet[]>(pets);
    const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

    const handleSelectPet = (petId: string) => {
        setSelectedPetId(petId);
    }
    
    return (
        <PetContext.Provider value={{ pets: petsState, selectedPetId, handleSelectPet }}>
            {children}
        </PetContext.Provider>
    )
}