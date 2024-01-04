import { Channel, Members } from "pusher-js";
import useActiveList from "./useActiveList";
import { useEffect, useState } from "react";
import { pusherClient } from "../../libs/pusher";

const useActiveChannel = () => {
  const { set, add, remove } = useActiveList();
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

  useEffect(() => {
    let channel = activeChannel;

    if (!channel) {
      channel = pusherClient.subscribe("presence-messenger");
      setActiveChannel(channel);
    }

    // get the initial active members in real time
    channel.bind("pusher:subscription_succeeded", (members: Members) => {
      const initialMembers: string[] = [];

      members.each((member: Record<string, any>) =>
        initialMembers.push(member.id)
      );

      set(initialMembers);
    });

    // add an active user to the active memberes[] in real time
    channel.bind("pusher:member_added", (member: Record<string, any>) => {
      add(member.id);
    });

    // remove the user/s to the active members[] if it's not active
    channel.bind("pusher:member_removed", (member: Record<string, any>) => {
      remove(member.id);
    });

    return () => {
      if (activeChannel) {
        pusherClient.unsubscribe("presence-messenger");
        setActiveChannel(null);
      }
    };
  }, [activeChannel, set, add, remove]);
};

export default useActiveChannel;
