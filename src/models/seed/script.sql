CREATE DATABASE prga;
\c prga
CREATE TABLE Users(
    email varchar(30),
    funtoken real
);

CREATE TABLE Games(
    id SERIAL PRIMARY KEY,
    typology varchar(5), 
    info text,
    playerA varchar(30),
    playerB varchar(30), 
    statePlayerA text,
    statePlayerB text
);

INSERT INTO Users (email, funtoken) VALUES ('user1@genericmail.com', 17.5), ('user2@genericmail.com', 12.5), ('user3@genericmail.com', 0), ('admin@genericmail.com', 0);


