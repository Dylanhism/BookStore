DROP DATABASE (bookstore);

CREATE DATABASE (bookstore);

CREATE TABLE Book (
    ISBN char(13) NOT NULL,
    genre varchar(15) NOT NULL,
    price decimal(3, 2) NOT NULL,
    name varchar(50) NOT NULL,
    num_pages int NOT NULL,
    quantity int NOT NULL DEFAULT 0,
    publisher_name NOT NULL,
    PRIMARY KEY (ISBN),
    FOREIGN KEY (publisher_name) REFERENCES Publisher(publisher_name)
);

CREATE TABLE Publisher (
    publisher_name varchar(30) NOT NULL,
    email_address varchar(30) NOT NULL,
    address varchar(50) NOT NULL,
    phone_num int NOT NULL,
    bank_account varchar(30) NOT NULL,
    PRIMARY KEY (publisher_name)
);

CREATE TABLE Author (
    author_ID int NOT NULL AUTO_INCREMENT,
    name varchar(30),
    PRIMARY KEY (author_ID)
);

CREATE TABLE Written_by (
    ISBN char(13) NOT NULL,
    author_ID int NOT NULL,
    PRIMARY KEY (ISBN, author_ID),
    FOREIGN KEY Book(ISBN),
    FOREIGN KEY Author(author_ID)
);

CREATE TABLE Owner (
    username varchar(15) NOT NULL,
    password varchar(15) NOT NULL,
    PRIMARY KEY (username)
);

CREATE TABLE User (
    username varchar(15) NOT NULL,
    password varchar(15) NOT NULL,
    name varchar(30) NOT NULL,
    email varchar(30) NOT NULL UNIQUE,
    phone_num int,
    PRIMARY KEY (username)
);

CREATE TABLE Order (
    order_ID int NOT NULL AUTO_INCREMENT,
    status varchar(15) NOT NULL,
    location varchar(30) NOT NULL,
    username varchar(15) NOT NULL,
    PRIMARY KEY (order_ID),
    FOREIGN KEY User(username)
);

CREATE TABLE Order_contains (
    order_ID int NOT NULL,
    ISBN char(13) NOT NULL,
    PRIMARY KEY (order_ID, ISBN),
    FOREIGN KEY Order(order_ID),
    FOREIGN KEY Book(ISBN)
);


