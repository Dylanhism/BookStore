/*This file drops if already present and reconstructs the whole database with tables*/
DROP DATABASE bookstore;
CREATE DATABASE bookstore;
CREATE TABLE Publisher (
    publisher_name varchar(50) NOT NULL,
    email_address varchar(50) NOT NULL,
    address varchar(50) NOT NULL,
    phone_num bigint NOT NULL,
    bank_account varchar(30) NOT NULL,
    PRIMARY KEY (publisher_name)
);
CREATE TABLE Book (
    ISBN char(13) NOT NULL,
    genre varchar(25) NOT NULL,
    price decimal(4, 2) NOT NULL,
    name varchar(50) NOT NULL,
    num_pages int NOT NULL,
    quantity int NOT NULL DEFAULT 0,
    publisher_name varchar(50) NOT NULL,
    PRIMARY KEY (ISBN),
    FOREIGN KEY (publisher_name) REFERENCES Publisher(publisher_name)
);
CREATE TABLE Author (
    author_ID int NOT NULL AUTO_INCREMENT,
    author_name varchar(30),
    PRIMARY KEY (author_ID)
);
CREATE TABLE Written_by ( /*Connecting table for book and author*/
    ISBN char(13) NOT NULL,
    author_ID int NOT NULL,
    PRIMARY KEY (ISBN, author_ID),
    FOREIGN KEY (ISBN) REFERENCES Book(ISBN),
    FOREIGN KEY (author_ID) REFERENCES Author(author_ID)
);
CREATE TABLE Owner (
    username varchar(25) NOT NULL,
    password varchar(25) NOT NULL,
    PRIMARY KEY (username)
);
CREATE TABLE User (
    username varchar(25) NOT NULL,
    password varchar(25) NOT NULL,
    user_name varchar(30) NOT NULL,
    email varchar(50) NOT NULL UNIQUE,
    phone_num bigint,
    PRIMARY KEY (username)
);
CREATE TABLE Orders (
    order_ID int NOT NULL AUTO_INCREMENT,
    order_status varchar(15) NOT NULL,
    order_location varchar(50) NOT NULL,
    shipping_addr varchar(50) NOT NULL,
    username varchar(15) NOT NULL,
    PRIMARY KEY (order_ID),
    FOREIGN KEY (username) REFERENCES User(username)
);
CREATE TABLE Order_contains ( /*Connecting table for order and book*/
    order_ID int NOT NULL,
    ISBN char(13) NOT NULL,
    quantity int NOT NULL,
    PRIMARY KEY (order_ID, ISBN),
    FOREIGN KEY (order_ID) REFERENCES Orders(order_ID),
    FOREIGN KEY (ISBN) REFERENCES Book(ISBN)
);