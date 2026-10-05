import {
  auth,
} from "@clerk/nextjs/server";

import {
  redirect,
} from "next/navigation";

import {
  prisma,
} from "@/lib/prisma";

export default async function LatestDiscussionReviewPage() {
  const {
    userId,
  } = await auth();

  if (!userId) {
    redirect(
      "/sign-in",
    );
  }

  const latest =
    await prisma.post.findFirst({
      where: {
        authorId:
          userId,

        moderationVersion: {
          gte: 1,
        },
      },

      orderBy: {
        createdAt:
          "desc",
      },

      select: {
        id: true,
      },
    });

  if (!latest) {
    redirect(
      "/discussion",
    );
  }

  redirect(
    `/discussion/review/${latest.id}`,
  );
}
