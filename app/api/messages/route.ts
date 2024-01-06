import getCurrentUser from "@/lib/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { pusherServer } from "@/lib/pusher";

export async function POST(request: Request) {
  try {
    // Retrieve current user information
    const currentUser = await getCurrentUser();

    // Parse the incoming JSON request body
    const body = await request.json();
    const { message, image, conversationId } = body;

    // Check if the current user is authorized
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Add new message data to the database, including sender and seen information
    const newMessage = await prisma.message.create({
      data: {
        body: message,
        image,
        conversation: {
          connect: {
            id: conversationId,
          },
        },
        sender: {
          connect: {
            id: currentUser.id,
          },
        },
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
      include: {
        seen: true,
        sender: true,
      },
    });

    // Update the conversation with the new message information
    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage.id,
          },
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
          },
        },
      },
    });

    // Handles Realtime Update in Creating new Message
    await pusherServer.trigger(conversationId, "messages:new", newMessage);

    // Get the last message in the updated conversation
    const lastMessage =
      updatedConversation.messages[updatedConversation.messages.length - 1];

    // Handles realtime conversation update for the sidebar
    updatedConversation.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, "conversation:update", {
          id: conversationId,
          messages: [lastMessage],
        });
      }
    });

    // Return the newly created message as a JSON response
    return NextResponse.json(newMessage);
  } catch (error: any) {
    console.error("Error:", error);
    return new NextResponse("InternalError", { status: 500 });
  }
}
