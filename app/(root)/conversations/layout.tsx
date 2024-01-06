import Sidebar from "@/components/sidebar/Sidebar";
import getConversations from "@/lib/actions/getConversations";
import getUsers from "@/lib/actions/getUsers";
import React from "react";
import ConversationList from "./components/ConversationList";

const ConversationsLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const conversations = await getConversations();
  const users = await getUsers();
  return (
    <div className="flex h-screen">
      <Sidebar />
      <ConversationList initialItems={conversations} users={users} />
      {children}
    </div>
  );
};

export default ConversationsLayout;
