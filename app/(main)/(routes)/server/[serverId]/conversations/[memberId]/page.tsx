import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface ConversationIdPageProps {
  params: {
    memberId: string; // member id of the guy we are goint to chat with
    serverId: string;
  };
}

export default async function ConversationIdPage({
  params,
}: ConversationIdPageProps) {
  const profile = await currentProfile();

  if (!profile) {
    return auth().redirectToSignIn();
  }

  const currentMember = await prisma.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) {
    return redirect("/");
  }

  const conversation = await getOrCreateConversation(
    currentMember.id,
    params.memberId
  );

  if (!conversation) {
    return redirect(`/server/${params.serverId}`);
  }

  const { memberOne, memberTwo } = conversation;

  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        type="conversation"
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        serverId={params.serverId}
      />
      <ChatMessages
        name={otherMember.profile.name}
        member={currentMember}
        chatId={conversation.id}
        apiUrl="/api/direct-messages"
        socketUrl="/api/socket/direct-messages"
        socketQuery={{
          conversationId: conversation.id,
        }}
        paramKey="conversationId"
        paramValue={conversation.id}
        type="conversation"
      />
      <ChatInput
        apiUrl="/api/socket/direct-messages"
        query={{
          conversationId: conversation.id,
        }}
        name={otherMember.profile.name}
        type="conversation"
      />
    </div>
  );
}
