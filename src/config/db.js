// src/db.js
const pgp = require("pg-promise")();

const db = pgp({
  user: "postgres",
  password: "pgadmin",
  host: "localhost",
  port: 5432,
  database: "mlp01",
});

module.exports = db;
