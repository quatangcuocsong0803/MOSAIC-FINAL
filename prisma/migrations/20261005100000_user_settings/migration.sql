CREATE TABLE "UserSettings" (
  "userId" TEXT NOT NULL,
  "notificationFriends" BOOLEAN NOT NULL DEFAULT true,
  "notificationComments" BOOLEAN NOT NULL DEFAULT true,
  "notificationReactions" BOOLEAN NOT NULL DEFAULT true,
  "notificationReviews" BOOLEAN NOT NULL DEFAULT true,
  "reducedMotion" BOOLEAN NOT NULL DEFAULT false,
  "showDecorations" BOOLEAN NOT NULL DEFAULT true,
  "textSize" TEXT NOT NULL DEFAULT 'NORMAL',
  "revision" INTEGER NOT NULL DEFAULT 0,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("userId"),
  CONSTRAINT "UserSettings_textSize_check" CHECK ("textSize" IN ('NORMAL', 'LARGE')),
  CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
