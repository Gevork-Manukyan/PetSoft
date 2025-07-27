import "server-only";

import { auth } from "@/lib/auth-no-edge";
import { redirect } from "next/navigation";
import { Pet, User } from "@prisma/client";
import prisma from "./db";

/**
 * Ensures the user is authenticated. If not, redirects to /login.
 * Returns the session if authenticated.
 */
export async function requireUserSession() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session;
}

export async function getUserByEmail(email: User["email"]) {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function getPetByPetId(petId: Pet["id"]) {
  return await prisma.pet.findUnique({
    where: {
      id: petId,
    },
    select: {
      userId: true,
    },
  });
}

export async function getPetsByUserId(userId: User["id"]) {
  return await prisma.pet.findMany({
    where: {
      userId,
    },
  });
}
