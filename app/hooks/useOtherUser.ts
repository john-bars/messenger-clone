import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { FullConversationType } from "../../types";
import { User } from "@prisma/client";

const useOtherUser = (
  conversation:
    | FullConversationType
    | {
        users: User[];
      }
) => {
  const session = useSession();

  const otherUser = useMemo(() => {
    const currentUserEmail = session?.data?.user?.email; // the email of the current user
    const otherUser = conversation.users.filter(
      (user) => user.email !== currentUserEmail //return users that are not equal to the currentUser
    );

    return otherUser[0]; //get the first otther user
  }, [session?.data?.user?.email, conversation.users]);

  return otherUser;
};

export default useOtherUser;
