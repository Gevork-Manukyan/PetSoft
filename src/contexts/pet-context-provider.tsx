"use client";

import { Pet } from "@/lib/types";
import { createContext, useState } from "react";

export type PetContextType = {
    pets: Pet[];
    selectedPetId: string | null;
    handleSelectPetId: (petId: string) => void;
    selectedPet: Pet | null;
    guests: number;
    handleCheckoutPet: (petId: string) => void;
    handleAddPet: (pet: Omit<Pet, "id">) => void;
    handleEditPet: (pet: Pet) => void;
}

export const PetContext = createContext<PetContextType | null>(null);

export default function PetContextProvider({ children, pets }: { children: React.ReactNode, pets: Pet[] }) {
    const [petsState, setPetsState] = useState<Pet[]>(pets);
    const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
    const selectedPet = petsState.find((pet) => pet.id === selectedPetId) || null;
    const guests = petsState.length;

    const handleAddPet = (pet: Omit<Pet, "id">) => {
        setPetsState(prev => [...prev, { ...pet, id: crypto.randomUUID() }]);
    }

    const handleEditPet = (newPetData: Pet) => {
        setPetsState(prev => prev.map((pet) => pet.id === newPetData.id ? newPetData : pet));
    }

    const handleSelectPetId = (petId: string) => {
        setSelectedPetId(petId);
    }

    const handleCheckoutPet = (petId: string) => {
        setPetsState(prev => prev.filter((pet) => pet.id !== petId));
        setSelectedPetId(null);
    }
    
    return (
        <PetContext.Provider value={{ pets: petsState, selectedPetId, handleSelectPetId, selectedPet, guests, handleCheckoutPet, handleAddPet, handleEditPet }}>
            {children}
        </PetContext.Provider>
    )
}