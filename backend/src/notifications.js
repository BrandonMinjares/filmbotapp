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


exports.getNotifications = async (req, res) => {
  const select = `SELECT * from Notifications WHERE userID = $1 `+
  `AND read = false`;
  const query = {
    text: select,
    values: [req.user.userid],
  };
  const {rows} = await pool.query(query);
  for (row of rows) {
    delete row.userid;
    delete row.created_at;
  }
  return res.status(200).json(rows);
};
