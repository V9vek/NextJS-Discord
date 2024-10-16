import { currentProfile } from "@/lib/current-profile";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
}

export default async function InviteCodePage({ params }: InviteCodePageProps) {
  const profile = await currentProfile();

  if (!profile) {
    return auth().redirectToSignIn();
  }

  if (!params.inviteCode) {
    return redirect("/");
  }

  const alreadyInServer = await prisma.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (alreadyInServer) {
    return redirect(`/server/${alreadyInServer.id}`);
  }

  const server = await prisma.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  });

  if (server) {
    return redirect(`/server/${server.id}`);
  }

  return null;
}
