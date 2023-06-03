
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


exports.postStreamingServices = async (req, res) => {
  console.log('in backend update streaming');
  // console.log(req.user.email);
  console.log(req.body);
  const stream = {};

  for (let i = 0; i < req.body.length; i++) {
    stream[req.body[i]] = true;
  }

  const update = `UPDATE person set streamingServices = $1`+
  `WHERE Person."data" ->>'email' = $2`;

  const updateQuery = {
    text: update,
    values: [stream, req.user.email],
  };
  const {rows} = await pool.query(updateQuery);

  return res.status(200).json(rows);
};

exports.getStreamingServices = async (req, res) => {
  console.log('get streaming services');
  // console.log(req.user.email);

  const update = `SELECT streamingServices from Person WHERE `+
  `data->>'email' = $1`;

  const getQuery = {
    text: update,
    values: [req.user.email],
  };
  const {rows} = await pool.query(getQuery);
  console.log(rows);
  return res.status(200).json(rows);
};
