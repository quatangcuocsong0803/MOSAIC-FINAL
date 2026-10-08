"use client";
import { useEffect, useState } from "react";
import {
  getDiscoverUsers,
  type DiscoverUserItem,
} from "@/app/actions/discover";
import UserCard from "@/app/discover/UserCard";
export default function FriendsList() {
  const [users, setUsers] = useState<DiscoverUserItem[]>([]),
    [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    getDiscoverUsers({ tab: "friends" })
      .then((r) => {
        if (active) {
          if (r.success) setUsers(r.users);
          else setError(r.error || "Chưa tải được bạn bè.");
        }
      })
      .catch(() => {
        if (active) setError("Chưa tải được bạn bè.");
      });
    return () => {
      active = false;
    };
  }, []);
  return (
    <section className="mx-auto my-8 w-full max-w-5xl px-4">
      <h2 className="font-serif text-2xl text-[#5C4326]">Bạn bè</h2>
      {error && <p role="alert">{error}</p>}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((u) => (
          <UserCard
            key={u.id}
            user={u}
            onStatusChange={(id, status) => {
              if (status !== "FRIENDS")
                setUsers((old) => old.filter((u) => u.id !== id));
            }}
          />
        ))}
      </div>
      <a
        href="/discover?tab=friends"
        className="mt-4 inline-block text-[#8B6B4A]"
      >
        Xem tất cả bạn bè trên Discover →
      </a>
    </section>
  );
}
