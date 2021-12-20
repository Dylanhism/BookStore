SELECT ISBN, name FROM Book WHERE ISBN LIKE ?; /*Look up books by ISBN*/
SELECT ISBN, name FROM Book WHERE name LIKE ?; /*Look up books by name*/
SELECT ISBN, name FROM Book WHERE genre LIKE ?; /*Look up books by genre*/
SELECT B.ISBN, B.name FROM Book B JOIN (Author A NATURAL JOIN Written_by W) ON B.ISBN=W.ISBN WHERE A.author_name LIKE ?; /*Show all book with specific author*/
SELECT * FROM Book B JOIN (Author A NATURAL JOIN Written_by W) ON B.ISBN=W.ISBN WHERE B.ISBN=?; /*Show all book data with specific ISBN*/
SELECT ISBN, name, price FROM Book WHERE ISBN IN (?); /*For viewing cart items*/
SELECT username FROM User WHERE username=? AND password=?; /*Get the username if username and password match for logins*/
SELECT username FROM Owner WHERE username=? AND password=?; /*The same with owner accounts*/