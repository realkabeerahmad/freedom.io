const db = require("../config/db");
const pgp = require("pg-promise")();

// Define the SQL queries to create the schema
const createDB = `
 CREATE DB mlp01
`;

const createRoleTable = `
    CREATE TABLE roles (
        role_id VARCHAR(255) NOT NULL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        precidence INT NOT NULL,
        ordr INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;

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
        role_id VARCHAR(255) REFERENCES roles(role_id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;

// const createTaskTable = `
//     CREATE TABLE tasks (
//         id SERIAL PRIMARY KEY,
//         task_id VARCHAR(255) NOT NULL,
//         allow BOOLEAN DEFAULT FALSE,
//         read BOOLEAN DEFAULT FALSE,
//         delete BOOLEAN DEFAULT FALSE,
//         edit BOOLEAN DEFAULT FALSE,
//         update BOOLEAN DEFAULT FALSE
//     )
// `;

// const createRoleTaskTable = `
//     CREATE TABLE role_tasks (
//         id SERIAL PRIMARY KEY,
//         role_id INT REFERENCES roles(id),
//         task_id INT REFERENCES tasks(id),
//         allow BOOLEAN DEFAULT FALSE,
//         read BOOLEAN DEFAULT FALSE,
//         delete BOOLEAN DEFAULT FALSE,
//         edit BOOLEAN DEFAULT FALSE,
//         update BOOLEAN DEFAULT FALSE
//     )
// `;

// Run the SQL queries to create the tables
async function createSchema() {
  try {
    await db.none(createDB);
    await db.none(createRoleTable);
    await db.none(createUserTable);
    await db.none(createTaskTable);
    await db.none(createRoleTaskTable);
    console.log("Schema created successfully");
  } catch (error) {
    console.error("Error creating schema:", error);
  } finally {
    pgp.end();
  }
}

// Call the function to create the schema
// createSchema();
