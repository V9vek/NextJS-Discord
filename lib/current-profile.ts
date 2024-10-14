import { auth } from "@clerk/nextjs/server";
import prisma from "./db";

export async function currentProfile() {
  const { userId } = auth();

  if (!userId) return null;

  const profile = await prisma.profile.findUnique({
    where: {
      userId: userId,
    },
  });

  return profile;
}
