import { Pet as PrismaPet } from "@prisma/client";

export type PetEssentials = Omit<PrismaPet, "id" | "createdAt" | "updatedAt" | "userId">;

export enum PetFormFields {
  NAME = "name",
  OWNER = "ownerName",
  URL = "imageUrl",
  AGE = "age",
  NOTES = "notes",
}
