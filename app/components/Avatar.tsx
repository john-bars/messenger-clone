"use client";

import Image from "next/image";
import { User } from "@prisma/client";
import useActiveList from "../hooks/useActiveList";

interface AvatarProps {
  user?: User;
}
const Avatar: React.FC<AvatarProps> = ({ user }) => {
  const { members } = useActiveList();
  const isActive = members.indexOf(user?.email!) !== -1; // Check if the user is in the members[]; array indexing starts at 0
  return (
    <div className="relative">
      <div className="relative inline-block rounded-full overflow-hidden h-9 w-9 md:h-11 md:w-11">
        <Image
          src={user?.image || "/images/placeholder.jpeg"}
          alt="Avatar"
          fill
        />
      </div>
      {isActive && (
        <span className="absolute block rounded-full bg-green-500 ring-white top-0 right-0 h-2 md:h-3 w-2 md:w-3" />
      )}
    </div>
  );
};

export default Avatar;
