const createPostTable = `
    CREATE TABLE posts (
        sr_no SERIAL PRIMARY KEY,
        caption VARCHAR(1200) NOT NULL,
        user_id VARCHAR(50) NOT NULL REFERENCES users(user_id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;
const createReactTable = `
    CREATE TABLE posts (
        sr_no SERIAL PRIMARY KEY,
        reaction CHAR(1) CHECK(reaction IN (L,F,S,H,W)),
        user_id VARCHAR(50) NOT NULL REFERENCES users(user_id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;

// L - LIKE
// F - LOL
// S - SAD
// H - LOVE
// W - WOW

module.exports = createPostTable;
