CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  book_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  author TEXT,
  favourite BOOLEAN DEFAULT false
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  book_id TEXT NOT NULL,
  review TEXT,
  review_date DATE,
  rating INTEGER,
  CONSTRAINT fk_book
    FOREIGN KEY(book_id) REFERENCES books(book_id),
  CONSTRAINT one_review_per_book
    UNIQUE(book_id)
);

-- Sample data
INSERT INTO books (book_id, title, author, favourite) VALUES
  ('1', 'The Great Gatsby', 'F. Scott Fitzgerald', false),
  ('2', '1984', 'George Orwell', true),
  ('3', 'To Kill a Mockingbird', 'Harper Lee', false);

INSERT INTO reviews (book_id, review, review_date, rating) VALUES
  ('1', 'A beautifully written tale of the American dream.', '2026-05-01', 5),
  ('2', 'A chilling dystopia with timeless political insight.', '2026-04-20', 4),
  ('3', 'A powerful courtroom drama and moral portrait.', '2026-05-10', 5);
