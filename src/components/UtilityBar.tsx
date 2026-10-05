"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useUser } from "@clerk/nextjs";

import {
  deleteNotification,
  getNotifications,
  getUtilityCounts,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/app/actions/notifications";
import {
  respondFriendRequest,
} from "@/app/actions/discover";

import styles from "./Navbar.module.css";

type NotificationItem = {
  id: string;
  type: string;
  title: string;
  body: string | null;
  href: string | null;
  entityType: string | null;
  entityId: string | null;
  isRead: boolean;
  createdAt: string;

  actor: {
    id: string;
    username: string | null;
    avatarUrl: string | null;
  } | null;
};

function BellIcon() {
  return (
    <svg
      className={styles.utilityIcon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9a6 6 0 1 0-12 0v.75a8.967 8.967 0 0 1-2.312 6.022 23.848 23.848 0 0 0 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
      />
    </svg>
  );
}

function MessagesIcon() {
  return (
    <svg
      className={styles.utilityIcon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm3.75 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm3.75 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 12c0 4.142-4.03 7.5-9 7.5a10.4 10.4 0 0 1-3.172-.487L3 21l1.987-4.139A6.89 6.89 0 0 1 3 12c0-4.142 4.03-7.5 9-7.5s9 3.358 9 7.5Z"
      />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg
      className={styles.utilityIcon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.592c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.197.72.258 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.244c.275.476.173 1.08-.246 1.438l-.99.842c-.29.247-.434.62-.427 1 .002.084.002.168 0 .252-.007.38.137.753.427 1l.99.842c.419.358.521.962.246 1.438l-1.296 2.244a1.125 1.125 0 0 1-1.37.49l-1.217-.456c-.355-.134-.75-.073-1.075.124a8.15 8.15 0 0 1-.22.127c-.332.184-.582.496-.645.87l-.213 1.281c-.09.542-.56.94-1.11.94h-2.592c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.645-.87a8.13 8.13 0 0 1-.22-.127c-.325-.197-.72-.258-1.075-.124l-1.217.456a1.125 1.125 0 0 1-1.37-.49L3.562 15.44a1.125 1.125 0 0 1 .246-1.438l.99-.842c.29-.247.434-.62.427-1a6.79 6.79 0 0 1 0-.252c.007-.38-.137-.753-.427-1l-.99-.842a1.125 1.125 0 0 1-.246-1.438L4.858 6.38a1.125 1.125 0 0 1 1.37-.49l1.217.456c.355.134.75.073 1.075-.124.072-.044.146-.086.22-.127.332-.184.582-.496.645-.87l.213-1.281Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </svg>
  );
}

function formatBadge(count: number) {
  if (count > 99) return "99+";
  return String(count);
}

function formatRelativeTime(value: string) {
  const date = new Date(value);
  const diff =
    Date.now() - date.getTime();

  if (diff < 60_000) {
    return "Vừa xong";
  }

  const minutes =
    Math.floor(diff / 60_000);

  if (minutes < 60) {
    return `${minutes} phút`;
  }

  const hours =
    Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} giờ`;
  }

  const days =
    Math.floor(hours / 24);

  if (days < 7) {
    return `${days} ngày`;
  }

  return date.toLocaleDateString(
    "vi-VN",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  );
}

export default function UtilityBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isSignedIn } = useUser();

  const dropdownRef =
    useRef<HTMLDivElement>(null);

  const panelRef = useRef<HTMLDivElement>(null);
  const [popupPosition, setPopupPosition] = useState({ top:40, left:12, width:370 });

  const [notificationOpen, setNotificationOpen] =
    useState(false);

  const [notificationLoading, setNotificationLoading] =
    useState(false);

  const [friendActionId, setFriendActionId] =
    useState<string | null>(null);

  const [
    unreadNotifications,
    setUnreadNotifications,
  ] = useState(0);

  const [
    unreadMessages,
    setUnreadMessages,
  ] = useState(0);

  const [notifications, setNotifications] =
    useState<NotificationItem[]>([]);

  useLayoutEffect(() => {
    if (!notificationOpen) return;
    const position = () => {
      const button = dropdownRef.current?.querySelector('button');
      if (!button) return;
      const rect = button.getBoundingClientRect();
      const width = Math.min(370, window.innerWidth - 24);
      const top = Math.max(8, Math.min(rect.bottom + 8, window.innerHeight - 120));
      setPopupPosition({ top, left: Math.max(12, Math.min(rect.right - width, window.innerWidth - width - 12)), width });
    };
    position();
    window.addEventListener('resize',position);
    window.addEventListener('scroll',position,true);
    return () => { window.removeEventListener('resize',position); window.removeEventListener('scroll',position,true); };
  }, [notificationOpen]);

  const loadCounts =
    useCallback(async () => {
      if (!isSignedIn) {
        setUnreadNotifications(0);
        setUnreadMessages(0);
        return;
      }

      const result =
        await getUtilityCounts();

      if (result.success) {
        setUnreadNotifications(
          result.unreadNotifications,
        );

        setUnreadMessages(
          result.unreadMessages,
        );
      }
    }, [isSignedIn]);

  const loadNotifications =
    useCallback(async () => {
      if (!isSignedIn) {
        return;
      }

      setNotificationLoading(true);

      try {
      const result =
        await getNotifications();

      if (result.success) {
        setNotifications(
          result.notifications as NotificationItem[],
        );

        setUnreadNotifications(
          result.unreadCount,
        );
      }

      } catch (error) { console.error("Không thể tải thông báo:", error); } finally { setNotificationLoading(false); }
    }, [isSignedIn]);

  useEffect(() => {
    if (!isSignedIn) {
      return;
    }

    void loadCounts();

    const interval =
      window.setInterval(() => {
        void loadCounts();

        if (notificationOpen) {
          void loadNotifications();
        }
      }, 20_000);

    return () =>
      window.clearInterval(interval);
  }, [
    isSignedIn,
    pathname,
    notificationOpen,
    loadCounts,
    loadNotifications,
  ]);

  useEffect(() => {
    if (!notificationOpen) {
      return;
    }

    const handleOutside = (
      event: MouseEvent,
    ) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node,
        ) &&
        !panelRef.current?.contains(event.target as Node)
      ) {
        setNotificationOpen(false);
      }
    };

    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        setNotificationOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutside,
    );

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutside,
      );

      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [notificationOpen]);

  if (!isSignedIn) {
    return null;
  }

  const handleBellClick = async () => {
    const nextOpen =
      !notificationOpen;

    setNotificationOpen(nextOpen);

    if (nextOpen) {
      await loadNotifications();
    }
  };

  const handleNotificationClick =
    async (
      notification: NotificationItem,
    ) => {
      if (!notification.isRead) {
        await markNotificationRead(
          notification.id,
        );

        setNotifications(
          (current) =>
            current.map((item) =>
              item.id ===
              notification.id
                ? {
                    ...item,
                    isRead: true,
                  }
                : item,
            ),
        );

        setUnreadNotifications(
          (current) =>
            Math.max(0, current - 1),
        );
      }

      setNotificationOpen(false);

      if (notification.href) {
        window.dispatchEvent(new Event("mosaic:navigation-start"));
        router.push(
          notification.href,
        );
      }
    };

  const handleMarkAllRead =
    async () => {
      const result =
        await markAllNotificationsRead();

      if (!result.success) {
        return;
      }

      setNotifications(
        (current) =>
          current.map((item) => ({
            ...item,
            isRead: true,
          })),
      );

      setUnreadNotifications(0);
    };

  const handleDelete =
    async (
      notification: NotificationItem,
    ) => {
      const result =
        await deleteNotification(
          notification.id,
        );

      if (!result.success) {
        return;
      }

      setNotifications(
        (current) =>
          current.filter(
            (item) =>
              item.id !==
              notification.id,
          ),
      );

      if (!notification.isRead) {
        setUnreadNotifications(
          (current) =>
            Math.max(
              0,
              current - 1,
            ),
        );
      }
    };

  const handleFriendRequest =
    async (
      notification: NotificationItem,
      accept: boolean,
    ) => {
      if (!notification.actor) {
        return;
      }

      setFriendActionId(
        notification.id,
      );

      const result =
        await respondFriendRequest(
          notification.actor.id,
          accept,
        );

      setFriendActionId(null);

      if (!result.success) {
        return;
      }

      await Promise.all([
        loadNotifications(),
        loadCounts(),
      ]);

      router.refresh();
    };

  return (
    <div className={styles.utilityBar}>
      <div
        className={
          styles.utilityBarInner
        }
      >
        <div
          className={
            styles.utilityActions
          }
          aria-label="Account shortcuts"
        >
          <div
            ref={dropdownRef}
            className={
              styles.utilityItemWrap
            }
          >
            <button
              type="button"
              className={`${styles.utilityIconButton} ${
                notificationOpen
                  ? styles.utilityIconActive
                  : ""
              }`}
              aria-label="Thông báo"
              aria-haspopup="true"
              aria-expanded={
                notificationOpen
              }
              title="Thông báo"
              onClick={
                handleBellClick
              }
            >
              <BellIcon />

              {unreadNotifications >
                0 && (
                <span
                  className={
                    styles.utilityBadge
                  }
                >
                  {formatBadge(
                    unreadNotifications,
                  )}
                </span>
              )}
            </button>

            {notificationOpen && createPortal(
              <div
                ref={panelRef}
                style={{ position:"fixed", ...popupPosition, right:"auto", maxHeight:`calc(100dvh - ${popupPosition.top + 12}px)` }}
                className={
                  styles.notificationDropdown
                }
              >
                <div
                  className={
                    styles.notificationHeader
                  }
                >
                  <div>
                    <h2>
                      Thông báo
                    </h2>

                    <p>
                      {unreadNotifications >
                      0
                        ? `${unreadNotifications} chưa đọc`
                        : "Bạn đã xem hết"}
                    </p>
                  </div>

                  {unreadNotifications >
                    0 && (
                    <button
                      type="button"
                      onClick={
                        handleMarkAllRead
                      }
                    >
                      Đánh dấu đã đọc
                    </button>
                  )}
                </div>

                <div
                  className={
                    styles.notificationList
                  }
                >
                  {notificationLoading ? (
                    <div
                      className={
                        styles.notificationEmpty
                      }
                    >
                      Đang tải…
                    </div>
                  ) : notifications.length ===
                    0 ? (
                    <div
                      className={
                        styles.notificationEmpty
                      }
                    >
                      <span>🔔</span>

                      <strong>
                        Chưa có thông báo
                      </strong>

                      <p>
                        Hoạt động mới trên
                        MOSAIC sẽ xuất
                        hiện ở đây.
                      </p>
                    </div>
                  ) : (
                    notifications.map(
                      (
                        notification,
                      ) => {
                        const actorName =
                          notification
                            .actor
                            ?.username ||
                          "M";

                        const actorLetter =
                          (
                            actorName[0] ||
                            "M"
                          ).toUpperCase();

                        const isFriendRequest =
                          notification.type ===
                            "FRIEND_REQUEST" &&
                          notification.actor;

                        return (
                          <div
                            key={
                              notification.id
                            }
                            className={`${styles.notificationItem} ${
                              !notification.isRead
                                ? styles.notificationUnread
                                : ""
                            }`}
                          >
                            <button
                              type="button"
                              className={
                                styles.notificationMain
                              }
                              onClick={() =>
                                void handleNotificationClick(
                                  notification,
                                )
                              }
                            >
                              <span
                                className={
                                  styles.notificationAvatar
                                }
                              >
                                {notification
                                  .actor
                                  ?.avatarUrl ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={
                                      notification
                                        .actor
                                        .avatarUrl
                                    }
                                    alt=""
                                  />
                                ) : (
                                  actorLetter
                                )}
                              </span>

                              <span
                                className={
                                  styles.notificationCopy
                                }
                              >
                                <strong>
                                  {
                                    notification.title
                                  }
                                </strong>

                                {notification.body && (
                                  <span>
                                    {
                                      notification.body
                                    }
                                  </span>
                                )}

                                <small>
                                  {formatRelativeTime(
                                    notification.createdAt,
                                  )}
                                </small>
                              </span>

                              {!notification.isRead && (
                                <span
                                  className={
                                    styles.notificationUnreadDot
                                  }
                                  aria-label="Chưa đọc"
                                />
                              )}
                            </button>

                            {isFriendRequest && (
                              <div
                                className={
                                  styles.notificationFriendActions
                                }
                              >
                                <button
                                  type="button"
                                  disabled={
                                    friendActionId ===
                                    notification.id
                                  }
                                  className={
                                    styles.notificationAccept
                                  }
                                  onClick={() =>
                                    void handleFriendRequest(
                                      notification,
                                      true,
                                    )
                                  }
                                >
                                  Chấp nhận
                                </button>

                                <button
                                  type="button"
                                  disabled={
                                    friendActionId ===
                                    notification.id
                                  }
                                  className={
                                    styles.notificationReject
                                  }
                                  onClick={() =>
                                    void handleFriendRequest(
                                      notification,
                                      false,
                                    )
                                  }
                                >
                                  Xóa
                                </button>
                              </div>
                            )}

                            <button
                              type="button"
                              aria-label="Xóa thông báo"
                              title="Xóa thông báo"
                              className={
                                styles.notificationDelete
                              }
                              onClick={() =>
                                void handleDelete(
                                  notification,
                                )
                              }
                            >
                              ×
                            </button>
                          </div>
                        );
                      },
                    )
                  )}
                </div>
              </div>, document.body
            )}
          </div>

          <Link
            href="/messages"
            className={`${styles.utilityIconButton} ${
              pathname.startsWith(
                "/messages",
              )
                ? styles.utilityIconActive
                : ""
            }`}
            aria-label="Tin nhắn"
            title="Tin nhắn"
          >
            <MessagesIcon />

            {unreadMessages > 0 && (
              <span
                className={
                  styles.utilityBadge
                }
              >
                {formatBadge(
                  unreadMessages,
                )}
              </span>
            )}
          </Link>

          <Link href="/settings" className={styles.utilityIconButton} aria-label="Cài đặt" title="Cài đặt"><SettingsIcon /></Link>
        </div>
      </div>
    </div>
  );
}
