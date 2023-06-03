const {Pool} = require('pg');

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

const selectDummy = async () => {
  const select = 'SELECT * FROM dummy';
  const query = {
    text: select,
    values: [],
  };
  const {rows} = await pool.query(query);
  return rows[0].created;
};

exports.get = async (req, res) => {
  res.status(200).json({message:
    `Hello  @ ${new Date().toString()} ` +
    `[ Database created ${await selectDummy()} ]`});
};
