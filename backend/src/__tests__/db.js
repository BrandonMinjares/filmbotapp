//* **************************************
// DO NOT MODIFY THIS FILE
//* **************************************

const fs = require('fs');
const {Pool} = require('pg');

require('dotenv').config();

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
});

const run = async (file) => {
  const content = fs.readFileSync(file, 'utf8');
  const statements = content.split(/\r?\n/);
  for (statement of statements) {
    await pool.query(statement);
  }
};

exports.reset = async () => {
  await run('sql/schema.sql');
  await run('sql/data.sql');
  await run('sql/indexes.sql');
};
