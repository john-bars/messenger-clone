import prisma from "@/lib/prismadb";

const getMessages = async (conversationId: string) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
      include: {
        sender: true,
        seen: true,
      },
      orderBy: {
        createdAt: "asc", // to show the latest messages at the top
      },
    });

    return messages;
  } catch (error: any) {
    return [];
  }
};

export default getMessages;
