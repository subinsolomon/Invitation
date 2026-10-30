CREATE TABLE "feedback" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "foodRating" INTEGER NOT NULL,
    "invitationCardRating" INTEGER NOT NULL,
    "applicationRating" INTEGER NOT NULL,
    "serviceRating" INTEGER NOT NULL,
    "photographyRating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);