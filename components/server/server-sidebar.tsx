import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Channel, ChannelType, Server } from "@prisma/client";
import { redirect } from "next/navigation";
import ServerHeader from "./server-header";
import { Separator } from "@/components/ui/separator";

interface ServerSidebarProps {
  serverId: string;
}

const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  if (!server) {
    return redirect("/");
  }

  const textChannels: Channel[] = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const audioChannels: Channel[] = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannels: Channel[] = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );

  // Remove ourselves from the list
  const members = server?.members.filter(
    (member) => member.profileId !== profile.id
  );

  const role = server?.members.find((member) => member.profileId === profile.id)
    ?.role;
  
  /* To Change */

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#f2f3f5]">
      <ServerHeader server={server} role={role} />
      <div className="gap-2 flex flex-col justify-center items-center">
        <span className="text-orange-300">Text channels</span>
        {textChannels?.map((channel) => (
          <div key={channel.id}>{channel.name}</div>
        ))}
      </div>
      <Separator />
      <div className="gap-2 flex flex-col justify-center items-center">
        <span className="text-orange-300">Audio channels</span>
        {audioChannels?.map((channel) => (
          <div key={channel.id}>{channel.name}</div>
        ))}
      </div>
      <Separator />
      <div className="gap-2 flex flex-col justify-center items-center">
        <span className="text-orange-300">Video channels</span>
        {videoChannels?.map((channel) => (
          <div key={channel.id}>{channel.name}</div>
        ))}
      </div>
    </div>
  );
};

export default ServerSidebar;
