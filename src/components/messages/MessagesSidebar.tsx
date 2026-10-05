"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { getConversations } from "@/app/actions/chat";

type ConversationItem = {
  id: string;
  updatedAt: Date | string;
  unreadCount: number;

  otherUser: {
    id: string;
    username: string | null;
    avatarUrl: string | null;
  };

  lastMessage: {
    id: string;
    senderId: string;
    content: string;
    createdAt: Date | string;
    readAt: Date | string | null;
  } | null;
};

interface MessagesSidebarProps {
  conversations: ConversationItem[];
  activeConversationId?: string;
}

function formatTime(
  value: Date | string,
) {
  const date = new Date(value);
  const today = new Date();

  const sameDay =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() ===
      today.getFullYear();

  if (sameDay) {
    return date.toLocaleTimeString(
      "vi-VN",
      {
        hour: "2-digit",
        minute: "2-digit",
      },
    );
  }

  return date.toLocaleDateString(
    "vi-VN",
    {
      day: "2-digit",
      month: "2-digit",
    },
  );
}

export default function MessagesSidebar({
  conversations,
  activeConversationId,
}: MessagesSidebarProps) {
  const [query, setQuery] =
    useState("");

  const [items, setItems] =
    useState<ConversationItem[]>(
      conversations,
    );

  useEffect(() => {
    setItems(conversations);
  }, [conversations]);

  // Messenger-like:
  // refresh preview + unread mà không reload page.
  useEffect(() => {
    let active = true;

    const refresh =
      async () => {
        const result =
          await getConversations();

        if (
          active &&
          result.success
        ) {
          setItems(
            result.conversations as ConversationItem[],
          );
        }
      };

    const interval =
      window.setInterval(
        () => {
          void refresh();
        },
        8000,
      );

    return () => {
      active = false;
      window.clearInterval(
        interval,
      );
    };
  }, []);

  const filtered =
    useMemo(() => {
      const normalized =
        query
          .trim()
          .toLowerCase();

      if (!normalized) {
        return items;
      }

      return items.filter(
        (conversation) => {
          const name =
            conversation
              .otherUser
              .username ||
            `Thành viên #${conversation.otherUser.id.slice(-4)}`;

          return name
            .toLowerCase()
            .includes(
              normalized,
            );
        },
      );
    }, [items, query]);

  return (
    <aside className="flex h-full min-h-0 flex-col border-r border-[#E2D4B7] bg-[#FCFBF8]">
      <div className="border-b border-[#E2D4B7] px-5 py-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A89F91]">
          MOSAIC
        </p>

        <h1 className="mt-1 font-serif text-2xl font-bold text-[#5C4326]">
          Tin nhắn
        </h1>

        <div className="relative mt-4">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A89F91]"
            aria-hidden="true"
          >
            <circle
              cx="11"
              cy="11"
              r="7"
            />
            <path d="m20 20-3.2-3.2" />
          </svg>

          <input
            type="search"
            value={query}
            onChange={(event) =>
              setQuery(
                event.target.value,
              )
            }
            placeholder="Tìm cuộc trò chuyện..."
            className="w-full rounded-full border border-[#E2D4B7] bg-white py-2.5 pl-9 pr-4 text-sm text-[#5C4326] outline-none transition focus:border-[#8B6B4A]/60 focus:ring-2 focus:ring-[#B89B68]/10"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm text-[#9A8468]">
              {items.length === 0
                ? "Chưa có cuộc trò chuyện nào."
                : "Không tìm thấy cuộc trò chuyện."}
            </p>

            {items.length === 0 && (
              <Link
                href="/discover"
                className="mt-3 inline-block text-xs font-semibold text-[#8B6B4A] hover:text-[#5C4326]"
              >
                Tìm bạn trên Discover →
              </Link>
            )}
          </div>
        ) : (
          filtered.map(
            (conversation) => {
              const user =
                conversation.otherUser;

              const displayName =
                user.username ||
                `Thành viên #${user.id.slice(-4)}`;

              const letter =
                (
                  displayName
                    .trim()[0] ||
                  "M"
                ).toUpperCase();

              const active =
                activeConversationId ===
                conversation.id;

              // Conversation đang mở được xem là đã đọc về mặt UI.
              const unread =
                conversation.unreadCount >
                  0 &&
                !active;

              return (
                <Link
                  key={
                    conversation.id
                  }
                  href={`/messages/${conversation.id}`}
                  className={`relative flex gap-3 border-b border-[#E2D4B7]/55 px-4 py-3.5 transition ${
                    active
                      ? "bg-[#EFE7D8]"
                      : unread
                        ? "bg-white hover:bg-[#F7F2E9]"
                        : "hover:bg-[#F5F0E7]"
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-[#8B6B4A]/25 bg-white font-serif font-bold text-[#8B6B4A]">
                      {user.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={
                            user.avatarUrl
                          }
                          alt={
                            displayName
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        letter
                      )}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <strong
                        className={`truncate text-sm text-[#5C4326] ${
                          unread
                            ? "font-extrabold"
                            : "font-semibold"
                        }`}
                      >
                        {
                          displayName
                        }
                      </strong>

                      <span
                        className={`shrink-0 text-[10px] ${
                          unread
                            ? "font-bold text-[#8B6B4A]"
                            : "text-[#A89F91]"
                        }`}
                      >
                        {formatTime(
                          conversation.updatedAt,
                        )}
                      </span>
                    </div>

                    <div className="mt-1 flex items-center gap-2">
                      <p
                        className={`min-w-0 flex-1 truncate text-xs leading-5 ${
                          unread
                            ? "font-bold text-[#5C4326]"
                            : "font-normal text-[#8B7355]"
                        }`}
                      >
                        {conversation
                          .lastMessage
                          ?.content ||
                          "Bắt đầu cuộc trò chuyện"}
                      </p>

                      {unread && (
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#D83B3B] shadow-[0_0_0_2px_rgba(216,59,59,0.10)]"
                          aria-label={`${conversation.unreadCount} tin nhắn chưa đọc`}
                        />
                      )}
                    </div>
                  </div>
                </Link>
              );
            },
          )
        )}
      </div>
    </aside>
  );
}
