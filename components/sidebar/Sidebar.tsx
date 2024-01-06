import React from "react";
import getCurrentUser from "@/lib/actions/getCurrentUser";
import DesktopSidebar from "./DesktopSidebar";
import MobileFooter from "./MobileFooter";

export default async function Sidebar() {
  const currentUser = await getCurrentUser();

  return (
    <div className="h-full">
      <DesktopSidebar currentUser={currentUser!} />
      <MobileFooter />
    </div>
  );
}
