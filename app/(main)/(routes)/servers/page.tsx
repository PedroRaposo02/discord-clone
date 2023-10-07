import { redirect } from "next/navigation";

import { initialProfile } from "@/lib/initial-profile";
import { db } from "@/lib/db";
import { InitialModal } from "@/components/modals/initial-modal";

export default async () => {
  const profile = await initialProfile();
  const myServer = await db.server.findFirst({
    where: {
      profileId: profile.id,
    },
  });

  if (myServer) {
    return redirect(`/servers/${myServer.id}`);
  }

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return <InitialModal />;
};