
DROP TABLE IF EXISTS users;

CREATE TABLE users
(
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT Not NULL,
    password TEXT NOT NULL
);

DROP TABLE IF EXISTS LeaderBoard;

CREATE TABLE LeaderBoard
(
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT Not NULL,
    Score TEXT Not Null
);
