"use client";

import { addPet, deletePet, editPet } from "@/actions/actions";
import { PetEssentials } from "@/lib/types";
import { Pet } from "@prisma/client";
import { createContext, useOptimistic, useState } from "react";
import { toast } from "sonner";

export type PetContextType = {
  pets: Pet[];
  selectedPetId: Pet["id"] | null;
  selectedPet: Pet | null;
  guests: number;
  handleSelectPetId: (petId: Pet["id"] | null) => void;
  handleAddPet: (pet: PetEssentials) => Promise<void>;
  handleEditPet: (petId: Pet["id"], pet: PetEssentials) => Promise<void>;
  handleCheckoutPet: (petId: Pet["id"]) => Promise<void>;
};

export const PetContext = createContext<PetContextType | null>(null);

export default function PetContextProvider({
  children,
  pets,
}: {
  children: React.ReactNode;
  pets: Pet[];
}) {
  const [optomisticPets, setOptomisticPets] = useOptimistic(
    pets,
    (prev, { action, payload }) => {
      switch (action) {
        case "add":
          return [...prev, { ...payload, id: crypto.randomUUID() }];
        case "edit":
          return prev.map((pet) =>
            pet.id === payload.petId ? { ...pet, ...payload.pet } : pet
          );
        case "delete":
          return prev.filter((pet) => pet.id !== payload);
        default:
          return prev;
      }
    }
  );
  const [selectedPetId, setSelectedPetId] = useState<Pet["id"] | null>(null);
  const selectedPet =
    optomisticPets.find((pet) => pet.id === selectedPetId) || null;
  const guests = optomisticPets.length;

  const handleSelectPetId = (petId: Pet["id"] | null) => {
    setSelectedPetId(petId);
  };

  const handleAddPet = async (pet: PetEssentials) => {
    setOptomisticPets({ action: "add", payload: pet });
    const error = await addPet(pet);
    if (error) {
      toast.warning(error.message);
      return;
    }
  };

  const handleEditPet = async (petId: Pet["id"], pet: PetEssentials) => {
    setOptomisticPets({ action: "edit", payload: { petId, pet } });
    const error = await editPet(petId, pet);
    if (error) {
      toast.warning(error.message);
      return;
    }
  };

  const handleCheckoutPet = async (petId: Pet["id"]) => {
    setOptomisticPets({ action: "delete", payload: petId });
    const error = await deletePet(petId);
    if (error) {
      toast.warning(error.message);
      return;
    }
    handleSelectPetId(null);
  };

  return (
    <PetContext.Provider
      value={{
        pets: optomisticPets,
        selectedPetId,
        selectedPet,
        guests,
        handleSelectPetId,
        handleAddPet,
        handleEditPet,
        handleCheckoutPet,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}
