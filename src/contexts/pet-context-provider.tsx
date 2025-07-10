"use client";

import { Pet } from "@/lib/types";
import { createContext, useState } from "react";

export type PetContextType = {
    pets: Pet[];
    selectedPetId: number | null;
}

export const PetContext = createContext<PetContextType | null>(null);

export default function PetContextProvider({ children, pets }: { children: React.ReactNode, pets: Pet[] }) {
    const [petsState, setPetsState] = useState<Pet[]>(pets);
    const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
    
    return (
        <PetContext.Provider value={{ pets: petsState, selectedPetId }}>
            {children}
        </PetContext.Provider>
    )
}