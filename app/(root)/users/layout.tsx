import React from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import getUsers from "@/lib/actions/getUsers";
import UserList from "./components/UserList";

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const users = await getUsers();
  return (
    <div className="flex h-screen">
      <Sidebar />
      <UserList items={users} />
      {children}
    </div>
  );
}
