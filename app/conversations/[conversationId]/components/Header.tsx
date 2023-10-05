"use client";

import Link from "next/link";

import useOtherUser from "@/app/hooks/useOtherUser";
import { Conversation, User } from "@prisma/client";
import { useMemo } from "react";
import { HiChevronLeft, HiEllipsisHorizontal } from "react-icons/hi2";
import Avatar from "@/app/components/Avatar";

interface HeaderProps {
  conversation: Conversation & {
    users: User[];
  };
}
const Header: React.FC<HeaderProps> = ({ conversation }) => {
  const otherUser = useOtherUser(conversation);

  const statusText = useMemo(() => {
    //return the number of members if it is a group
    if (conversation.isGroup) {
      return `${conversation.users.length} members`;
    }

    return "Active";
  }, [conversation]);

  return (
    <div className="bg-white w-full flex justify-between items-center border-b-[1px] py-3 px-4 lg:px-6  shadow-sm">
      <div className="flex items-center gap-3">
        <Link
          href={"/conversations"}
          className="block lg:hidden text-sky-500 hover:text-sky-600 transition cursor-pointer"
        >
          <HiChevronLeft size={32} />
        </Link>
        <Avatar user={otherUser} />
        <div className="flex flex-col">
          <div>{conversation.name || otherUser.name}</div>
          <div className="text-sm font-light text-neutral-500">
            {statusText}
          </div>
        </div>
      </div>

      <HiEllipsisHorizontal
        size={32}
        onClick={() => {}}
        className="cursor-pointer text-sky-500 hover:text-sky-600 transition"
      />
    </div>
  );
};

export default Header;
