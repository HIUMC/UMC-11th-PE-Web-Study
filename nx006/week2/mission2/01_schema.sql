CREATE DATABASE umc_books_week2 CHARACTER SET utf8mb4;
USE umc_books_week2;

CREATE TABLE users (
  user_id BIGINT NOT NULL AUTO_INCREMENT,
  nickname VARCHAR(30) NOT NULL,
  PRIMARY KEY (user_id)
);

CREATE TABLE category (
  category_id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  PRIMARY KEY (category_id)
);

CREATE TABLE book (
  book_id BIGINT NOT NULL AUTO_INCREMENT,
  category_id BIGINT NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (book_id),
  CONSTRAINT fk_book_category FOREIGN KEY (category_id) REFERENCES category(category_id)
);

CREATE TABLE rental (
  rental_id BIGINT NOT NULL AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  book_id BIGINT NOT NULL,
  rented_at DATETIME NOT NULL,
  due_at DATETIME NOT NULL,
  returned_at DATETIME NULL,
  PRIMARY KEY (rental_id),
  CONSTRAINT fk_rental_user FOREIGN KEY (user_id) REFERENCES users(user_id),
  CONSTRAINT fk_rental_book FOREIGN KEY (book_id) REFERENCES book(book_id)
);

CREATE TABLE tag (
  tag_id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (tag_id)
);

CREATE TABLE book_tag (
  book_id BIGINT NOT NULL,
  tag_id BIGINT NOT NULL,
  PRIMARY KEY (book_id, tag_id),
  CONSTRAINT fk_book_tag_book FOREIGN KEY (book_id) REFERENCES book(book_id),
  CONSTRAINT fk_book_tag_tag FOREIGN KEY (tag_id) REFERENCES tag(tag_id)
);

CREATE TABLE book_like (
  user_id BIGINT NOT NULL,
  book_id BIGINT NOT NULL,
  PRIMARY KEY (user_id, book_id),
  CONSTRAINT fk_book_like_user FOREIGN KEY (user_id) REFERENCES users(user_id),
  CONSTRAINT fk_book_like_book FOREIGN KEY (book_id) REFERENCES book(book_id)
);

CREATE TABLE notification (
  notification_id BIGINT NOT NULL AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  type VARCHAR(30) NOT NULL,
  PRIMARY KEY (notification_id),
  CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);
