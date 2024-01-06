"use client";

import useConversation from "@/app/hooks/useConversation";
import EmptyState from "@/components/EmptyState";

const Home = () => {
  const { isOpen } = useConversation();
  return (
    <div className={`h-full lg:block lg:flex-1 ${isOpen ? "block" : "hidden"}`}>
      <EmptyState />
    </div>
  );
};

export default Home;
