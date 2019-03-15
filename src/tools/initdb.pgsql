-- Drops guests table
DROP TABLE IF EXISTS guests;

-- Creates guests table
CREATE TABLE IF NOT EXISTS guests (
    id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY
    , user_id varchar(50) NOT NULL
    , name varchar(50) NOT NULL
    , type varchar(50) NOT NULL
    , age smallint NULL
    , major boolean NOT NULL
);