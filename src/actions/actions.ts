"use server";

import { PetEssentials } from "@/lib/types";
import prisma from "../lib/db";
import { revalidatePath } from "next/cache";
import { Pet } from "@prisma/client";

export async function addPet(petData: PetEssentials) {
  try {
    await prisma.pet.create({
      data: petData,
    });
  } catch (error) {
    return {
      message: "Could not add pet",
    };
  }

  revalidatePath("/app", "layout");
}

export async function editPet(petId: Pet["id"], petData: PetEssentials) {
  try {
    await prisma.pet.update({
      where: { id: petId },
      data: petData,
    });
  } catch {
    return {
      message: "Could not edit pet",
    };
  }

  revalidatePath("/app", "layout");
}

export async function deletePet(petId: Pet["id"]) {
  try {
    await prisma.pet.delete({
      where: { id: petId },
    });
  } catch {
    return {
      message: "Could not delete pet",
    };
  }

  revalidatePath("/app", "layout");
}
