CREATE TABLE users (
 -- SERIAL makes the ID auto-increment (1, 2, 3...) automatically
 id SERIAL PRIMARY KEY,
 -- VARCHAR(50) limits the text to 50 characters for efficiency
 username VARCHAR(50) NOT NULL,
 -- UNIQUE ensures no two users have the same email address
 email VARCHAR(255) UNIQUE NOT NULL,
 -- TEXT has no character limit, perfect for encrypted passwords
 password_hash TEXT NOT NULL,
 -- TIMESTAMP records exactly when the user joined
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  author_id INT REFERENCES users(id) ON DELETE CASCADE,
);

-- Final check of the relationship:
-- Users Table: [id: 1, username: "Alice"]
-- Posts Table: [id: 101, title: "My Day", author_id: 1]
-- The database now knows Alice wrote "My Day" because 1 matches 1.