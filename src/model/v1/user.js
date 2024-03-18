const createUserTable = `
    CREATE TABLE users (
        user_id VARCHAR(50) NOT NULL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        enc_password VARCHAR(1024) NOT NULL,
        firstname VARCHAR(100),
        lastname VARCHAR(100),
        gender CHAR(1) CHECK (gender IN ('M', 'F', 'O')),
        dob DATE,
        phone VARCHAR(15),
        mobile VARCHAR(15) NOT NULL,
        address VARCHAR(255),
        city VARCHAR(255),
        state VARCHAR(255),
        country VARCHAR(255),
        role_id VARCHAR(255) NOT NULL REFERENCES roles(role_id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;

module.exports = createUserTable;
