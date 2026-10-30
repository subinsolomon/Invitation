CREATE TABLE "new_feedback" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "foodRating" INTEGER NOT NULL,
    "venueAmbienceRating" INTEGER NOT NULL,
    "photographyRating" INTEGER NOT NULL,
    "musicEntertainmentRating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO "new_feedback" ("id", "foodRating", "venueAmbienceRating", "photographyRating", "musicEntertainmentRating", "comment", "createdAt")
SELECT "id", "foodRating", "invitationCardRating", "photographyRating", "serviceRating", "comment", "createdAt"
FROM "feedback";

DROP TABLE "feedback";
ALTER TABLE "new_feedback" RENAME TO "feedback";