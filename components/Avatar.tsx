"use client";

import Image from "next/image";
import { User } from "@prisma/client";
import useActiveList from "../app/hooks/useActiveList";
import React from "react";

interface AvatarProps {
  user?: User;
}
const Avatar: React.FC<AvatarProps> = ({ user }) => {
  const { members } = useActiveList();
  const isActive = members.indexOf(user?.email!) !== -1; // Check if the user is in the members[]; array indexing starts at 0
  return (
    <div className="relative">
      <div className="relative inline-block h-9 w-9 overflow-hidden rounded-full md:h-11 md:w-11">
        <Image
          src={user?.image || "/assets/images/placeholder.jpeg"}
          alt="Avatar"
          fill
        />
      </div>
      {isActive && (
        <span className="absolute right-0 top-0 block h-2 w-2 rounded-full bg-green-500 ring-white md:h-3 md:w-3" />
      )}
    </div>
  );
};

export default Avatar;
