import getCurrentUser from "@/libs/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function POST(request: Request) {
  try {
    // Get current user information
    const currentUser = await getCurrentUser();

    // Get data from the API request and extract the name and image
    const requestData = await request.json();
    const { name, image } = requestData;

    // Check if the user is authenticated
    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Update the database with the new name and image
    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        image, // Shorthand property notation
        name,
      },
    });

    // Return the updated user as JSON response
    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error("Error in POST request:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
