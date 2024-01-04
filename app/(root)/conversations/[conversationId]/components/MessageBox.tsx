"use client";

import clsx from "clsx";
import { FullMessageType } from "@/types";
import { useSession } from "next-auth/react";
import Avatar from "@/components/Avatar";
import { format } from "date-fns";
import Image from "next/image";
import { useState } from "react";
import ImageModal from "./ImageModal";

interface MessageBoxProps {
  isLast?: boolean;
  data: FullMessageType;
}

const MessageBox: React.FC<MessageBoxProps> = ({ isLast, data }) => {
  const session = useSession();
  const [imageModalOpen, setImageModalOpen] = useState(false);

  //check if the current session user is also the sender through the email
  const isOwn = session?.data?.user?.email === data?.sender?.email;

  // use [] in case data.seen is undefined
  // Create an array of names of user who've seen the message
  const seenList = (data.seen || [])
    .filter((user) => user.email !== data?.sender?.email)
    .map((user) => user.name)
    .join(", ");

  // Create dynamic  CSS classes using clsx()
  const container = clsx("flex gap-3 p-4", isOwn && "justify-end");
  const body = clsx("flex flex-col gap-2", isOwn && "items-end");
  const message = clsx(
    "text-sm w-fit overflow-hidden",
    isOwn ? "bg-sky-500 text-white" : "bg-gray-100",
    data.image ? "rounded-md p-0" : "rounded-full py-2 px-3"
  );
  const avatar = clsx(isOwn && "order-2");

  return (
    <div className={container}>
      <div className={avatar}>
        <Avatar user={data.sender} />
      </div>
      <div className={body}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">{data.sender.name}</div>
          <div className="text-sm text-gray-400">
            {format(new Date(data.createdAt), "HH:mm")}
          </div>
        </div>
        <div className={message}>
          <ImageModal
            src={data.image}
            isOpen={imageModalOpen}
            onClose={() => setImageModalOpen(false)}
          />
          {data.image ? (
            <Image
              onClick={() => setImageModalOpen(true)}
              src={data.image}
              alt="image"
              height={288}
              width={288}
              className="object-cover cursor-pointer hover:scale-110 transition translate"
            />
          ) : (
            <div>{data.body}</div>
          )}
        </div>
        {isLast && isOwn && seenList.length > 0 && (
          <div className="text-xs font-light text-gray-500">{`Seen by ${seenList}`}</div>
        )}
      </div>
    </div>
  );
};

export default MessageBox;
