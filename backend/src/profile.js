
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


exports.getProfileInfo = async (req, res) => {
  console.log('test');
  const select = `SELECT data FROM Person WHERE userid = $1`;
  const query = {
    text: select,
    values: [req.user.userid],
  };

  const {rows} = await pool.query(query);
  if (rows.length == 0) {
    return res.status(401).send('Error');
  }

  const data = (rows[0].data);
  console.log(data);
  return res.status(200).json(data);
};

exports.updateProfileInfo = async (req, res) => {
  console.log(req.user.userid);
  const updateEmailQuery =
  `UPDATE person SET data = data || '{"email":"${req.body.email}", `+
  `"name": {"first": "${req.body.name.first}", `+
  `"last": "${req.body.name.last}"}}' WHERE userid = $1` +
  ` AND NOT EXISTS (SELECT 1 FROM person `+
  `WHERE data->>'email' = '${req.body.email}')`;

  const update = {
    text: updateEmailQuery,
    values: [req.user.userid],
  };

  await pool.query(update, (err, res) => {
    if (err) {
      console.error(err);
      return;
    }

    if (res.rowCount == 0) {
      console.log('Email taken');
    }
    console.log(`${res.rowCount} rows updated`);
  });

  return res.status(200).json('good');
};
