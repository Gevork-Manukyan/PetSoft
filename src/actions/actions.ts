"use server";

import { PetFormFields } from "@/lib/types";
import prisma from "../lib/db";
import { revalidatePath } from "next/cache";

export async function addPet(formData: FormData) {
  try {
    await prisma.pet.create({
      data: {
        name: formData.get(PetFormFields.NAME) as string,
        ownerName: formData.get(PetFormFields.OWNER) as string,
        imageURL:
          (formData.get(PetFormFields.URL) as string) ||
          "https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png",
        age: Number(formData.get(PetFormFields.AGE) as string),
        notes: formData.get(PetFormFields.NOTES) as string,
      },
    });
  } catch (error) {
    return {
      message: "Could not add pet",
    }
  }

  revalidatePath("/app", "layout");
}

export async function editPet(petId: string, formData: FormData) {
  try {
    await prisma.pet.update({
      where: { id: petId },
      data: {
        name: formData.get(PetFormFields.NAME) as string,
        ownerName: formData.get(PetFormFields.OWNER) as string,
        imageURL:
          (formData.get(PetFormFields.URL) as string) ||
          "https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png",
        age: Number(formData.get(PetFormFields.AGE) as string),
        notes: formData.get(PetFormFields.NOTES) as string,
      },
    })
  } catch {
    return {
      message: "Could not edit pet",
    }
  }

  revalidatePath("/app", "layout");
}

export async function deletePet(petId: string) {
  try {
    await prisma.pet.delete({
      where: { id: petId },
    })
  } catch {
    return {
      message: "Could not delete pet",
    }
  }

  revalidatePath("/app", "layout");
}