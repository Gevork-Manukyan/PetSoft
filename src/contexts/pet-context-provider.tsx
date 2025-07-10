"use client";

import { Pet } from "@/lib/types";
import { createContext, useState } from "react";

export type PetContextType = {
    pets: Pet[];
    selectedPetId: string | null;
    handleSelectPetId: (petId: string) => void;
    selectedPet: Pet | null;
    guests: number;
}

export const PetContext = createContext<PetContextType | null>(null);

export default function PetContextProvider({ children, pets }: { children: React.ReactNode, pets: Pet[] }) {
    const [petsState, setPetsState] = useState<Pet[]>(pets);
    const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
    const selectedPet = petsState.find((pet) => pet.id === selectedPetId) || null;
    const guests = petsState.length;

    const handleSelectPetId = (petId: string) => {
        setSelectedPetId(petId);
    }
    
    return (
        <PetContext.Provider value={{ pets: petsState, selectedPetId, handleSelectPetId, selectedPet, guests }}>
            {children}
        </PetContext.Provider>
    )
}