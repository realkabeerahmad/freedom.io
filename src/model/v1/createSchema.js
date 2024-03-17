const db = require("../../config/db");
const pgp = require("pg-promise")();

const createRoleTable = require("./role");
const createRoleTaskTable = require("./roletask");
const createTaskTable = require("./task");
const createUserTable = require("./user");
const createUserSessionTable = require("./userSession");

// Run the SQL queries to create the tables
async function createSchema() {
  try {
    await db.none(createRoleTable);
    await db.none(createUserTable);
    await db.none(createTaskTable);
    await db.none(createRoleTaskTable);
    await db.none(createUserSessionTable);
    console.log("Schema created successfully");
  } catch (error) {
    console.error("Error creating schema:", error);
  } finally {
    pgp.end();
  }
}

createSchema();
