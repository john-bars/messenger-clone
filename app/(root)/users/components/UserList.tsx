"use client";

import { User } from "@prisma/client";
import UserBox from "./UserBox";
import React from "react";

interface UserListProps {
  items: User[];
}

const UserList: React.FC<UserListProps> = ({ items }) => {
  return (
    // <aside className="fixed inset-y-0 left-0 block w-full overflow-y-auto border-r border-gray-200 pb-20 lg:left-20 lg:block lg:w-80 lg:pb-0 ">
    <aside className="block w-full overflow-y-auto border-r border-gray-200 pb-20 lg:w-80 lg:bg-slate-400 lg:pb-0 ">
      <div className="mt-8 flex flex-col gap-3 px-5">
        <div className="py-4 text-2xl font-bold text-neutral-800 dark:text-slate-100">
          People
        </div>
        {items.map((item) => (
          <UserBox key={item.id} data={item} />
        ))}
      </div>
    </aside>
  );
};

export default UserList;
