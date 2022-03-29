CREATE DATABASE budgetWiseDb;

CREATE TABLE movement (
    movement_id SERIAL PRIMARY KEY,
    amount REAL NOT NULL,
    concept VARCHAR(255) NOT NULL,
    dateM DATE NOT NULL,
    typeM CHAR NOT NULL
);