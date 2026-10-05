"use client";

import Link from "next/link";
import {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  getConversation,
  sendMessage,
} from "@/app/actions/chat";

type ChatMessage = {
  id: string;
  senderId: string;
  content: string;
  createdAt: Date | string;
  readAt: Date | string | null;
};

interface ChatWindowProps {
  conversationId: string;

  currentUserId: string;

  otherUser: {
    id: string;
    username: string | null;
    avatarUrl: string | null;
  };

  initialMessages: ChatMessage[];
}

function formatMessageTime(
  value: Date | string,
) {
  return new Date(value).toLocaleTimeString(
    "vi-VN",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  );
}

export default function ChatWindow({
  conversationId,
  currentUserId,
  otherUser,
  initialMessages,
}: ChatWindowProps) {
  const [messages, setMessages] =
    useState<ChatMessage[]>(initialMessages);

  const [content, setContent] =
    useState("");

  const [sending, setSending] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const bottomRef =
    useRef<HTMLDivElement>(null);

  const displayName =
    otherUser.username ||
    `Thành viên #${otherUser.id.slice(-4)}`;

  const avatarLetter =
    (displayName.trim()[0] || "M").toUpperCase();

  const scrollToBottom =
    useCallback((behavior: ScrollBehavior = "smooth") => {
      bottomRef.current?.scrollIntoView({
        behavior,
        block: "end",
      });
    }, []);

  useEffect(() => {
    scrollToBottom("auto");
  }, [scrollToBottom]);

  useEffect(() => {
    scrollToBottom("smooth");
  }, [messages.length, scrollToBottom]);

  // Poll nhẹ để nhận tin mới mà không cần reload.
  useEffect(() => {
    let active = true;

    const refresh = async () => {
      const result =
        await getConversation(
          conversationId,
        );

      if (
        !active ||
        !result.success
      ) {
        return;
      }

      setMessages(
        result.conversation.messages,
      );
    };

    const interval =
      window.setInterval(
        () => {
          void refresh();
        },
        5000,
      );

    return () => {
      active = false;
      window.clearInterval(
        interval,
      );
    };
  }, [conversationId]);

  const handleSubmit =
    async (
      event: FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      const trimmed =
        content.trim();

      if (
        !trimmed ||
        sending
      ) {
        return;
      }

      setSending(true);
      setError(null);

      const result =
        await sendMessage(
          conversationId,
          trimmed,
        );

      if (
        result.success
      ) {
        setMessages(
          (current) => [
            ...current,
            result.message,
          ],
        );

        setContent("");
      } else {
        if (
          result.reason ===
          "NOT_FRIENDS"
        ) {
          setError(
            "Hai bạn hiện không còn là bạn bè nên không thể tiếp tục nhắn tin.",
          );
        } else if (
          result.reason ===
          "MESSAGE_TOO_LONG"
        ) {
          setError(
            "Tin nhắn tối đa 2000 ký tự.",
          );
        } else {
          setError(
            "Không thể gửi tin nhắn lúc này.",
          );
        }
      }

      setSending(false);
    };

  return (
    <section className="flex h-full min-h-0 flex-col bg-[#FBFAF7]">
      {/* Header */}
      <header className="flex h-[74px] shrink-0 items-center justify-between border-b border-[#E2D4B7] bg-white px-5 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/messages"
            className="mr-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#8B7355] hover:bg-[#F4EFE6] md:hidden"
            aria-label="Quay lại tin nhắn"
          >
            ←
          </Link>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#8B6B4A]/25 bg-[#FCFBF8] font-serif font-bold text-[#8B6B4A]">
            {otherUser.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={otherUser.avatarUrl}
                alt={displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              avatarLetter
            )}
          </div>

          <div className="min-w-0">
            <h2 className="truncate font-serif text-lg font-bold text-[#5C4326]">
              {displayName}
            </h2>

            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#A89F91]">
              Bạn bè trên MOSAIC
            </p>
          </div>
        </div>

        <Link
          href={`/profile/${otherUser.id}`}
          className="hidden rounded-full border border-[#E2D4B7] px-3.5 py-2 text-xs font-semibold text-[#8B6B4A] transition hover:border-[#8B6B4A]/50 hover:bg-[#FCFBF8] sm:inline-flex"
        >
          Xem hồ sơ
        </Link>
      </header>

      {/* Messages */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-8">
        {messages.length === 0 ? (
          <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-[#E2D4B7] bg-white font-serif text-2xl font-bold text-[#8B6B4A] shadow-sm">
              {otherUser.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={otherUser.avatarUrl}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                avatarLetter
              )}
            </div>

            <h3 className="mt-4 font-serif text-xl font-bold text-[#5C4326]">
              {displayName}
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-[#8B7355]">
              Hai bạn đã kết nối. Hãy bắt đầu cuộc trò chuyện đầu tiên ✨
            </p>
          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-2">
            {messages.map(
              (
                message,
                index,
              ) => {
                const mine =
                  message.senderId ===
                  currentUserId;

                const previous =
                  messages[
                    index - 1
                  ];

                const sameSender =
                  previous?.senderId ===
                  message.senderId;

                return (
                  <div
                    key={
                      message.id
                    }
                    className={`flex ${
                      mine
                        ? "justify-end"
                        : "justify-start"
                    } ${
                      sameSender
                        ? "mt-0"
                        : "mt-3"
                    }`}
                  >
                    <div
                      className={`group min-w-0 max-w-[85%] md:max-w-[68%] ${
                        mine
                          ? "items-end"
                          : "items-start"
                      } flex flex-col`}
                    >
                      <div
                        className={`rounded-2xl px-4 py-2.5 text-sm leading-6 shadow-sm ${
                          mine
                            ? "rounded-br-md bg-[#8B6B4A] text-white"
                            : "rounded-bl-md border border-[#E2D4B7] bg-white text-[#5C4326]"
                        }`}
                      >
                        <p className="whitespace-pre-wrap [overflow-wrap:anywhere]">
                          {
                            message.content
                          }
                        </p>
                      </div>

                      <div
                        className={`mt-1 flex items-center gap-2 px-1 text-[9px] text-[#A89F91] ${
                          mine
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <span>
                          {formatMessageTime(
                            message.createdAt,
                          )}
                        </span>

                        {mine &&
                          message.readAt && (
                            <span>
                              Đã xem
                            </span>
                          )}
                      </div>
                    </div>
                  </div>
                );
              },
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Composer */}
      <footer className="mosaic-chat-composer shrink-0 border-t border-[#E2D4B7] bg-white px-4 py-3 md:px-6">
        {error && (
          <p className="mx-auto mb-2 max-w-3xl text-xs font-medium text-rose-600">
            {error}
          </p>
        )}

        <form
          onSubmit={
            handleSubmit
          }
          className="mx-auto flex max-w-3xl items-end gap-2"
        >
          <div className="flex min-h-[44px] min-w-0 flex-1 items-center rounded-2xl border border-[#E2D4B7] bg-[#FAF8F5] px-4 transition focus-within:border-[#8B6B4A]/55 focus-within:bg-white">
            <textarea
              value={content}
              onChange={(
                event,
              ) =>
                setContent(
                  event.target
                    .value,
                )
              }
              onKeyDown={(
                event,
              ) => {
                if (
                  !event.nativeEvent.isComposing &&
                  event.key ===
                    "Enter" &&
                  !event.shiftKey
                ) {
                  event.preventDefault();

                  event.currentTarget
                    .form?.requestSubmit();
                }
              }}
              placeholder={`Nhắn tin cho ${displayName}...`}
              rows={1}
              maxLength={2000}
              disabled={sending}
              className="max-h-32 min-h-[24px] w-full resize-none bg-transparent py-2.5 text-sm leading-6 text-[#5C4326] outline-none placeholder:text-[#B0A18F]"
            />
          </div>

          <button
            type="submit"
            disabled={
              sending ||
              !content.trim()
            }
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#8B6B4A] text-white shadow-sm transition hover:bg-[#6B5A46] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Gửi tin nhắn"
          >
            {sending ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.7}
                className="h-[18px] w-[18px]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4 4 16 8-16 8 3-8-3-8Z"
                />
                <path
                  strokeLinecap="round"
                  d="M7 12h13"
                />
              </svg>
            )}
          </button>
        </form>

        <p className="mx-auto mt-1.5 max-w-3xl px-2 text-[9px] text-[#B0A18F]">
          Enter để gửi · Shift + Enter để xuống dòng
        </p>
      </footer>
    </section>
  );
}
