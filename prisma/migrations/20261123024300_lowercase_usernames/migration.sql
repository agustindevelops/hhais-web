-- Usernames are stored lowercase.
UPDATE "User"
SET "username" = lower("username")
WHERE "username" <> lower("username");
