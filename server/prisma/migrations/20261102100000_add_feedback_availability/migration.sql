CREATE TABLE "app_settings" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

INSERT INTO "app_settings" ("key", "value", "updatedAt")
VALUES ('feedback_enabled', 'true', CURRENT_TIMESTAMP);