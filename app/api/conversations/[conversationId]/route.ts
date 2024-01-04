// DELETE conversation route

import prisma from "@/libs/prismadb";
import getCurrentUser from "@/libs/actions/getCurrentUser";
import { NextResponse } from "next/server";
import { pusherServer } from "@/libs/pusher";

interface IParams {
  conversationId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams } // must be the second parameter
) {
  try {
    const currentUser = await getCurrentUser();
    const { conversationId } = params; //extract the conversationId

    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });

    if (!existingConversation) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const deletedConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,

        //to make sure that only the part of the group can delete it.
        userIds: {
          hasSome: [currentUser.id],
        },
      },
    });

    // Handles realtime update for Deleting the '/[conversationId]' route.
    existingConversation.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(
          user.email,
          "conversation:remove",
          existingConversation
        );
      }
    });

    return NextResponse.json(deletedConversation);
  } catch (error: any) {
    console.log(error, "ERROR_CONVERSATION_DELETE");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
