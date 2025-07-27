"use server";

import prisma from "../lib/db";
import { revalidatePath } from "next/cache";
import { authSchema, petFormSchema, petIdSchema } from "@/lib/zod-schemas";
import { signIn, signOut } from "@/lib/auth-no-edge";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { getPetByPetId, requireUserSession } from "@/lib/server-utils";
import { Prisma } from "@prisma/client";
import { AuthError } from "next-auth";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function LogIn(prevState: unknown, formData: unknown) {
  if (!(formData instanceof FormData)) {
    return {
      message: "Invalid form data",
    };
  }

  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            message: "Invalid email or password",
          };
        default:
          return {
            message: "Something went wrong",
          };
      }
    }

    throw error; // nextjs redirects throws (redirect is called by signIn) error so we need to rethrow it
  }
}

export async function SignUp(prevState: unknown, formData: unknown) {
  if (!(formData instanceof FormData)) {
    return {
      message: "Invalid form data",
    };
  }

  const validatedFormDataObj = authSchema.safeParse(formData);
  if (!validatedFormDataObj.success) {
    return {
      message: "Invalid form data",
    };
  }

  const { email, password } = validatedFormDataObj.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        email,
        hashedPassword,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          message: "User already exists",
        };
      }
    }

    return {
      message: "Could not create user",
    };
  }

  try {
    await signIn("credentials", formData);
  } catch (error) {
    return {
      message: "Invalid email or password",
    };
  }

  redirect("/app/dashboard");
}

export async function SignOut() {
  await signOut({
    redirectTo: "/",
  });
}

export async function addPet(petData: unknown) {
  const session = await requireUserSession();

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
            id: session.user.id,
          },
        },
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
  const session = await requireUserSession();

  const validatedPetId = petIdSchema.safeParse(petId);
  const validatedPet = petFormSchema.safeParse(petData);

  if (!validatedPetId.success || !validatedPet.success) {
    return {
      message: "Invalid pet data",
    };
  }

  const pet = await getPetByPetId(validatedPetId.data);

  if (!pet) {
    return {
      message: "Pet not found",
    };
  }

  if (pet.userId !== session.user.id) {
    return {
      message: "You are not authorized to edit this pet",
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
  const session = await requireUserSession();

  const validatedPetId = petIdSchema.safeParse(petId);
  if (!validatedPetId.success) {
    return {
      message: "Invalid pet ID",
    };
  }

  const pet = await getPetByPetId(validatedPetId.data);

  if (!pet) {
    return {
      message: "Pet not found",
    };
  }

  if (pet.userId !== session.user.id) {
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

export async function createCheckoutSession() {
  const session = await requireUserSession();

  const checkoutSession = await stripe.checkout.sessions.create({
    customer_email: session.user.email,
    line_items: [
      {
        price: "price_1RorKSRJxnnYYnaoP6MK0VqY",
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.CANONICAL_URL}/payment?success=true`,
    cancel_url: `${process.env.CANONICAL_URL}/payment?cancelled=true`,
  });

  redirect(checkoutSession.url);
}
