"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FullMessageType } from "@/types";
import useConversation from "@/app/hooks/useConversation";

import MessageBox from "./MessageBox";
import { pusherClient } from "@/libs/pusher";
import { find } from "lodash";

interface BodyProps {
  initialMessages: FullMessageType[];
}
const Body: React.FC<BodyProps> = ({ initialMessages }) => {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { conversationId } = useConversation();

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    //subscribe to the channel conversationId
    pusherClient.subscribe(conversationId);

    //scroll down to the latest message
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (message: FullMessageType) => {
      //alert everyone that you have seen the new message
      axios.post(`/api/conversations/${conversationId}/seen`);

      setMessages((current) => {
        //check if the new message comming in is already in the array of the current message
        if (find(current, { id: message.id })) {
          return current;
        }

        // else, add the new message to the end of the current message list
        return [...current, message];
      });

      // scroll down again to the latest message
      bottomRef?.current?.scrollIntoView();
    };

    // Add the newMessage to the message list if it's still not in the list
    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage.id === newMessage.id) {
            return newMessage;
          }
          return currentMessage;
        })
      );
    };

    // bind the userClient to listen to an event "messages:new", and "messages:update" from the server
    pusherClient.bind("messages:new", messageHandler);
    pusherClient.bind("message:update", updateMessageHandler);

    //unsubscribe and unbind everytime you unmount to avoid an overflow
    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", messageHandler);
      pusherClient.unbind("message:update", updateMessageHandler);
    };
  }, [conversationId]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, i) => (
        <MessageBox
          isLast={i === messages.length - 1}
          key={message.id}
          data={message}
        />
      ))}
      <div ref={bottomRef} className="pt-24" />
    </div>
  );
};

export default Body;
