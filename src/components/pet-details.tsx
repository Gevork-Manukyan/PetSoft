"use client";

import { usePetContext } from "@/lib/hooks";
import { Pet } from "@/lib/types";
import Image from "next/image";
import PetButton from "./pet-button";
import { deletePet } from "@/actions/actions";
import { useTransition } from "react";

export default function PetDetails() {
    const { selectedPet } = usePetContext();
    if (!selectedPet) return <EmptyView />;

    return (
        <section className="flex flex-col h-full w-full">
            <TopBar pet={selectedPet} />
            <OtherInfo pet={selectedPet} />
            <Notes pet={selectedPet} />
        </section>
    )
}

function TopBar({ pet }: { pet: Pet }) {
    const { handleSelectPetId } = usePetContext();
    const [isPending, startTransition] = useTransition();

    const checkoutPet = async () => {
        startTransition(async () => {
            await deletePet(pet.id);
            handleSelectPetId(null);
        });
    }
    
    return (
        <div className="flex items-center bg-white px-8 py-5 border-b border-light">
            <Image
                src={pet.imageURL}
                alt={pet.name}
                width={75}
                height={75}
                className="w-[75px] h-[75px] rounded-full object-cover"
            />

            <h2 className="text-3xl font-semibold leading-7 ml-5">{pet.name}</h2>

            <div className="ml-auto space-x-2">
                <PetButton actionType="edit">
                    Edit
                </PetButton>

                <PetButton actionType="checkout" onClick={checkoutPet} disabled={isPending}>
                    Checkout
                </PetButton>
            </div>
        </div>
    )
}

function OtherInfo({ pet }: { pet: Pet }) {
    return (
        <div className="flex items-center justify-between px-5 py-10">
            <div>
                <h3 className="text-[13px] font-medium uppercase text-zinc-700">Owner name</h3>
                <p className="mt-1 text-lg text-zinc-800">{pet.ownerName}</p>
            </div>

            <div>
                <h3 className="text-[13px] font-medium uppercase text-zinc-700">Age</h3>
                <p className="mt-1 text-lg text-zinc-800">{pet.age}</p>
            </div>
        </div>
    )
}

function Notes({ pet }: { pet: Pet }) {
    return (
        <section className="flex-1 bg-white px-7 py-5 rounded-md mb-9 mx-8 border border-light">
            {pet.notes}
        </section>
    )
}

function EmptyView() {
    return (
        <div className="flex items-center justify-center h-full w-full">
            <p className="text-2xl font-medium">No pet selected</p>
        </div>
    )
}