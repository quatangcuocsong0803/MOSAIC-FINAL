import type { Prisma, ProfileVisibility } from "@prisma/client";
import { ZODIAC_SIGNS } from "@/lib/zodiac";
export const PRIVATE_FIELDS = [
  "username",
  "displayName",
  "avatarUrl",
  "dateOfBirth",
  "bio",
  "hobbies",
  "location",
] as const;
export type ProfileField = (typeof PRIVATE_FIELDS)[number];
export type VisibilitySettings = Record<ProfileField, ProfileVisibility>;
export function birthFacts(value: Date | string | null, today = new Date()) {
  if (!value) return { age: null, zodiacSign: null };
  const d = new Date(value);
  if (!Number.isFinite(d.getTime()) || d > today)
    return { age: null, zodiacSign: null };
  const m = d.getUTCMonth() + 1,
    day = d.getUTCDate();
  const boundaries = [20, 19, 21, 20, 21, 21, 23, 23, 23, 23, 22, 22];
  const indices = [10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const index =
    day >= boundaries[m - 1] ? indices[m - 1] : (indices[m - 1] + 11) % 12;
  const age =
    today.getUTCFullYear() -
    d.getUTCFullYear() -
    (today.getUTCMonth() < d.getUTCMonth() ||
    (today.getUTCMonth() === d.getUTCMonth() && today.getUTCDate() < day)
      ? 1
      : 0);
  return { age, zodiacSign: ZODIAC_SIGNS[index] };
}
export function canSee(
  visibility: string | undefined,
  owner: boolean,
  friend: boolean,
) {
  return (
    owner || visibility === "PUBLIC" || (friend && visibility === "FRIENDS")
  );
}
// Call before returning any profile payload to a viewer. Typology identity is public.
export function visibleProfile<
  T extends { dateOfBirth: Date | null; interestCodes: string[] },
>(
  profile: T,
  owner: boolean,
  friend: boolean,
): T & { age: number | null; zodiacSign: string | null } {
  const result = { ...profile, ...birthFacts(profile.dateOfBirth) };
  const record = result as Record<string, unknown>;
  for (const field of PRIVATE_FIELDS) {
    if (!canSee(record[`${field}Visibility`] as string, owner, friend))
      record[field] = null;
    delete record[`${field}Visibility`];
  }
  if (
    !canSee(
      (profile as Record<string, unknown>).hobbiesVisibility as string,
      owner,
      friend,
    )
  )
    record.interestCodes = [];
  if (
    !canSee(
      (profile as Record<string, unknown>).dateOfBirthVisibility as string,
      owner,
      friend,
    )
  ) {
    record.age = null;
    record.zodiacSign = null;
  }
  return result;
}
export function visibleFieldWhere(
  field: ProfileField,
  viewerId: string,
): Prisma.UserWhereInput {
  return {
    OR: [
      { [`${field}Visibility`]: "PUBLIC" },
      {
        [`${field}Visibility`]: "FRIENDS",
        OR: [
          {
            sentRequests: {
              some: { receiverId: viewerId, status: "ACCEPTED" },
            },
          },
          {
            receivedRequests: {
              some: { senderId: viewerId, status: "ACCEPTED" },
            },
          },
        ],
      },
    ],
  };
}
