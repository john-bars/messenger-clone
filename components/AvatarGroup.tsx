"use client";

import React from "react";
import { User } from "@prisma/client";
import Image from "next/image";

interface AvatarGroupProps {
  users?: User[];
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({ users = [] }) => {
  const slicedUsers = users.slice(0, 3); // get the first 3 users

  //   const positionMap = ["top-0 left-3", "bottom-0", "bottom-0 right-0"];

  const positionMap = {
    0: "top-0 left-3",
    1: "bottom-0",
    2: "bottom-0 right-0",
  };

  return (
    <div className="relative h-11 w-11">
      {slicedUsers.map((user, index) => (
        <div
          key={user.id}
          className={`absolute inline-block h-5 w-5 overflow-hidden rounded-full ${
            positionMap[index as keyof typeof positionMap]
          }`}
        >
          <Image
            src={user?.image || "/assets/images/placeholder.jpeg"}
            alt="Avatar"
            fill
          />
        </div>
      ))}
    </div>
  );
};

export default AvatarGroup;
