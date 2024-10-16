import { currentProfile } from "@/lib/current-profile";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    if (!params.serverId) {
      return new NextResponse("Server Id Missing", { status: 400 });
    }

    const data = await req.json();

    const server = await prisma.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id, // admin only
      },
      data: {
        name: data.name,
        imageUrl: data.imageUrl,
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.error("[SERVER_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
