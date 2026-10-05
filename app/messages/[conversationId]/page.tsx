import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";

import {
  getConversation,
  getConversations,
} from "@/app/actions/chat";
import { prisma } from "@/lib/prisma";

import ChatWindow from "@/src/components/messages/ChatWindow";
import MessagesSidebar from "@/src/components/messages/MessagesSidebar";

interface MessagesConversationPageProps {
  params: Promise<{
    conversationId: string;
  }>;
}

export default async function MessagesConversationPage({
  params,
}: MessagesConversationPageProps) {
  const { conversationId } =
    await params;

  const { userId: clerkUserId } =
    await auth();

  if (!clerkUserId) {
    redirect("/sign-in");
  }

  const [
    inboxResult,
    conversationResult,
    currentUser,
  ] = await Promise.all([
    getConversations(),

    getConversation(
      conversationId,
    ),

    prisma.user.findUnique({
      where: {
        clerkId:
          clerkUserId,
      },

      select: {
        id: true,
      },
    }),
  ]);

  if (!currentUser) {
    redirect("/profile");
  }

  if (
    !conversationResult.success
  ) {
    if (
      conversationResult.reason ===
      "UNAUTHENTICATED"
    ) {
      redirect("/sign-in");
    }

    if (
      conversationResult.reason ===
        "CONVERSATION_NOT_FOUND" ||
      conversationResult.reason ===
        "FORBIDDEN" ||
      conversationResult.reason ===
        "NOT_FRIENDS"
    ) {
      notFound();
    }

    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="rounded-2xl border border-[#E2D4B7] bg-white p-8 text-center">
          <h1 className="font-serif text-2xl font-bold text-[#5C4326]">
            Không thể mở cuộc trò chuyện
          </h1>
        </div>
      </main>
    );
  }

  const conversations =
    inboxResult.success
      ? inboxResult.conversations
      : [];

  const conversation =
    conversationResult.conversation;

  return (
    <main className="mx-auto w-full max-w-[1280px] px-3 py-5 md:px-5 md:py-7">
      <div className="h-[calc(100vh-165px)] min-h-[560px] overflow-hidden rounded-3xl border border-[#E2D4B7] bg-white shadow-[0_16px_45px_rgba(75,55,35,0.08)]">
        <div className="grid h-full grid-cols-1 md:grid-cols-[330px_1fr] lg:grid-cols-[360px_1fr]">
          <div className="hidden min-h-0 md:block">
            <MessagesSidebar
              conversations={
                conversations
              }
              activeConversationId={
                conversation.id
              }
            />
          </div>

          <ChatWindow
            conversationId={
              conversation.id
            }
            currentUserId={
              currentUser.id
            }
            otherUser={
              conversation.otherUser
            }
            initialMessages={
              conversation.messages
            }
          />
        </div>
      </div>
    </main>
  );
}
