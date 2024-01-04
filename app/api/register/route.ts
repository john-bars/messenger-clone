import bcrypt from "bcrypt";
import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

const validateInputs = (email: string, name: string, password: string) => {
  if (!email || !name || !password) {
    throw new Error("Missing required information");
  }
};

const hashPassword = async (password: string) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Internal Error");
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { email, name, password } = body;

    validateInputs(email, name, password);

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: { email, name, hashedPassword },
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Registration error:", error.message);
    return new NextResponse("Registration Failed: " + error.message, {
      status: 500,
    });
  }
};
