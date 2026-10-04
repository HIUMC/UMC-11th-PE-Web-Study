ALTER TABLE book
    ADD CONSTRAINT uk_book_title UNIQUE (title);
