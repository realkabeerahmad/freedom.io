const createMessageTable = `
    CREATE TABLE posts (
        sr_no SERIAL PRIMARY KEY,
        message VARCHAR(1200) NOT NULL,
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

module.exports = createMessageTable;
