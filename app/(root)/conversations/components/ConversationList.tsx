"use client";

import React, { useEffect, useMemo, useState } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";

// import { Conversation } from "@prisma/client";
import { FullConversationType } from "@/types";
import { useRouter } from "next/navigation";
import useConversation from "@/app/hooks/useConversation";
import ConversationBox from "./ConversationBox";
import GroupChatModal from "./GroupChatModal";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/lib/pusher";
import { find } from "lodash";

interface ConversationListProps {
  // initialItems: Conversation[];
  initialItems: FullConversationType[];
  users: User[]; // use the users array for the members list
}

const ConversationList: React.FC<ConversationListProps> = ({
  initialItems,
  users,
}) => {
  const session = useSession();
  const [items, setItems] = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { isOpen, conversationId } = useConversation();

  // get the email of the user in session
  const pusherKey = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  useEffect(() => {
    if (!pusherKey) {
      return;
    }

    // subscribe to the email of the user in session
    pusherClient.subscribe(pusherKey);

    // Handles realtime update in creating new conversation in the conversation lists.
    // Check if the new conversation already exist; add it to the existing conversation list if not.
    const newHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        if (find(current, { id: conversation.id })) {
          return current;
        }

        return [conversation, ...current];
      });
    };

    // Handles realtime update for updating the conversation message.
    // show the new message to its corresponding conversation id in the list
    const updateHandler = (conversation: FullConversationType) => {
      setItems((current) =>
        current.map((existingConversation) => {
          if (existingConversation.id === conversation.id) {
            return { ...existingConversation, messages: conversation.messages };
          }

          return existingConversation;
        })
      );
    };

    // Realtime update in removing a conversation
    // Render the conversations not matching the id of the one you've deleted
    const removeHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        return [...current.filter((convo) => convo.id !== conversation.id)];
      });

      if (conversationId === conversation.id) {
        router.push("/conversations");
      }
    };

    // bind the userClient to listen to an event "conversation:new", "conversation:update", and "conversation:remove" from the server
    pusherClient.bind("conversation:new", newHandler);
    pusherClient.bind("conversation:update", updateHandler);
    pusherClient.bind("conversation:remove", removeHandler);

    // unsubscribe and unbind upon unmount to avoid an overflow
    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("conversation:new", newHandler);
      pusherClient.unbind("conversation:update", updateHandler);
      pusherClient.unbind("conversation:remove", removeHandler);
    };
  }, [pusherKey, conversationId, router]);

  return (
    <>
      <GroupChatModal
        users={users} // pass the users array (User[]) as an attribute
        isOpen={isModalOpen} // open once isModal is true
        onClose={() => setIsModalOpen(false)}
      />
      <aside
        className={`overflow-y-auto border-r border-gray-200 pb-20 lg:block lg:w-80 lg:bg-slate-400 lg:pb-0
       ${isOpen ? "hidden" : "block w-full"}`}
      >
        <div className="mt-8 flex flex-col gap-3 px-5">
          <div className="flex items-center justify-between">
            <div className="py-4 text-2xl font-bold text-neutral-800 dark:text-slate-100">
              Messages
            </div>
            <div
              onClick={() => setIsModalOpen(true)} // This opens the GroupChatModal once clicked
              className="cursor-pointer rounded-full bg-gray-100 p-2 text-gray-600 transition hover:opacity-75"
            >
              <MdOutlineGroupAdd size={20} />
            </div>
          </div>

          {items.map((item) => (
            <ConversationBox // show the conversation
              key={item.id}
              data={item}
              selected={conversationId === item.id}
            />
          ))}
        </div>
      </aside>
    </>
  );
};

export default ConversationList;
