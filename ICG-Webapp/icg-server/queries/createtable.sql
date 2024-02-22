CREATE TABLE users (
    userid SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    signup_date DATE DEFAULT CURRENT_DATE
);