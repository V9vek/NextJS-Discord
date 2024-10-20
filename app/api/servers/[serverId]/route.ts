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
        imageUrl: data.imageUrl.url,
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.error("[SERVER_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    const serverId = params.serverId;

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    const server = await prisma.server.delete({
      where: {
        id: serverId,
        profileId: profile.id,
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.error("[SERVER_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
