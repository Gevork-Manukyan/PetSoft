"use server";

import prisma from "../lib/db";
import { revalidatePath } from "next/cache";
import { petFormSchema, petIdSchema } from "@/lib/zod-schemas";
import { auth, signIn, signOut } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function LogIn(formData: FormData) {
  await signIn("credentials", formData);
  redirect("/app/dashboard");
}

export async function SignUp(formData: FormData) {
  const hashedPassword = await bcrypt.hash(formData.get("password") as string, 10);

  await prisma.user.create({
    data: {
      email: formData.get("email") as string,
      hashedPassword,
    }
  });

  await LogIn(formData);
}

export async function SignOut() {
  await signOut({
    redirectTo: "/",
  });
}

export async function addPet(petData: unknown) {

  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  
  const validatedPet = petFormSchema.safeParse(petData);
  if (!validatedPet.success) {
    return {
      message: "Invalid pet data",
    };
  }

  try {
    await prisma.pet.create({
      data: {
        ...validatedPet.data,
        User: {
          connect: {
            id: session?.user?.id,
          }
        }
      },
    });
  } catch (error) {
    return {
      message: "Could not add pet",
    };
  }

  revalidatePath("/app", "layout");
}

export async function editPet(petId: unknown, petData: unknown) {
  const validatedPetId = petIdSchema.safeParse(petId);
  const validatedPet = petFormSchema.safeParse(petData);

  if (!validatedPetId.success || !validatedPet.success) {
    return {
      message: "Invalid pet data",
    };
  }

  try {
    await prisma.pet.update({
      where: { id: validatedPetId.data },
      data: validatedPet.data,
    });
  } catch {
    return {
      message: "Could not edit pet",
    };
  }

  revalidatePath("/app", "layout");
}

export async function deletePet(petId: unknown) {

  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const validatedPetId = petIdSchema.safeParse(petId);
  if (!validatedPetId.success) {
    return {
      message: "Invalid pet ID",
    };
  }

  const pet = await prisma.pet.findUnique({
    where: {
      id: validatedPetId.data,
    }, 
    select: {
      userId: true,
    },
  });

  if (!pet) {
    return {
      message: "Pet not found",
    };
  }

  if (pet.userId !== session?.user?.id) {
    return {
      message: "You are not authorized to delete this pet",
    };
  }

  try {
    await prisma.pet.delete({
      where: { id: validatedPetId.data },
    });
  } catch {
    return {
      message: "Could not delete pet",
    };
  }

  revalidatePath("/app", "layout");
}
