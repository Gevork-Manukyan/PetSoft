import { z } from "zod";
import { PetFormFields } from "./types";
import { DEFAULT_PET_IMAGE_URL } from "./constants";

// NOTE: Any form of transforming the data won't work on the client if you are using getValues() and not onSubmit()
export const petFormSchema = z.object({
    [PetFormFields.NAME]: z.string().trim().min(1, { message: "Name is required" }).max(100, { message: "Name must be less than 100 characters" }),
    [PetFormFields.OWNER]: z.string().trim().min(1, { message: "Owner is required" }).max(100, { message: "Owner must be less than 100 characters" }),
    [PetFormFields.URL]: z.union([z.literal(""), z.string().trim().url({ message: "Invalid image URL" })]),
    [PetFormFields.AGE]: z.coerce.number().int().positive().max(100, { message: "Age must be less than 100" }),
    [PetFormFields.NOTES]: z.union([z.literal(""), z.string().trim().max(1000, { message: "Notes must be less than 1000 characters" })]),
}).transform((data) => {
    return {
        ...data,
        imageUrl: data[PetFormFields.URL] || DEFAULT_PET_IMAGE_URL,
    }
})
export type PetFormSchema = z.infer<typeof petFormSchema>;

export const petIdSchema = z.string().uuid({ message: "Invalid pet ID" });