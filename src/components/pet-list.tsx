"use client";

import { usePetContext, useSearchContext } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useMemo } from "react";

export default function PetList() {
  const {
    pets,
    selectedPetId,
    handleSelectPetId,
  } = usePetContext();

  const { search } = useSearchContext();

  const filteredPets = useMemo(() => pets.filter((pet) => pet.name.toLowerCase().includes(search.toLowerCase())), [pets, search]);

  return (
    <ul className="bg-white border-b border-light">
      {filteredPets.map((pet) => (
        <li key={pet.id}>
          <button
            onClick={() => handleSelectPetId(pet.id)}
            className={cn(
              "flex items-center h-[70px] w-full cursor-pointer px-5 text-base gap-3 hover:bg-[#eff1f2] focus:bg-[#eff1f2] transition",
              {
                "bg-[#eff1f2]": selectedPetId === pet.id,
              }
            )}
          >
            <Image
              src={pet.imageURL}
              alt={pet.name}
              width={45}
              height={45}
              className="w-[45px] h-[45px] rounded-full object-cover"
            />
            <p className="font-semibold">{pet.name}</p>
          </button>
        </li>
      ))}
    </ul>
  );
}
