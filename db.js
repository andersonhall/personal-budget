const { Pool } = require("pg");

const db = new Pool({
  user: "postgres",
  host: "localhost",
  database: "budget",
  password: "postgres",
  port: 5432,
});

module.exports = db;
