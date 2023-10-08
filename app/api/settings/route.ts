import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const data = await request.json(); // get the data past in the api request
    const { name, image } = data; // extract the the name and image from the data object

    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Update the database with the new name and image
    const updateUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        image, // could be image: image,
        name, // could be name: name
      },
    });

    return NextResponse.json(updateUser);
  } catch (error: any) {
    console.log(error, "ERROR_SETTINGS");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
