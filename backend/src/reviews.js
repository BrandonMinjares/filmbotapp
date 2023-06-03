
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

exports.postReview = async (req, res) => {
  const select = `SELECT * FROM REVIEW WHERE review.movieid = $1 `+
  `AND review.userid = $2`;

  const selectQuery = {
    text: select,
    values: [req.body.movieid, req.user.userid],
  };

  const selectrows = await pool.query(selectQuery);
  if (selectrows.rows.length > 0) {
    return res.status(200).json('already reviewed');
  }

  const date = new Date();

  const movieInfo = {
    rating: req.body.rating,
    review: req.body.review,
    movie: req.body.movie,
    sent: date.toISOString(),
    likes: 0,
  };

  const insert = `INSERT INTO Review (data, movieid, userID) VALUES`+
  `($1, $2, $3) RETURNING *`;

  const query = {
    text: insert,
    values: [movieInfo, req.body.movieid, req.user.userid],
  };

  const {rows} = await pool.query(query);
  console.log(rows);
  if (rows.length != 1) {
    return res.status(200).json('Did not post review');
  }

  if (movieInfo.rating >= 4) {
    const recommend =
    `UPDATE Person SET recommendList = array_append(recommendList, $1) `+
    ` WHERE userid = $2`;

    const query2 = {
      text: recommend,
      values: [req.body.rating, req.user.userid],
    };

    const result = await pool.query(query2);
    console.log(result);
  }

  return res.status(200).json('good');
};

exports.getReview = async (req, res) => {
  const select = `SELECT Review.moviereviewid, Review.data, Review.created_at`+
  ` , Person."data" ->'name' AS name, Person."data" ->'sent' AS time,`+
  `Person.userID FROM ` +
  `REVIEW INNER JOIN Person ON REVIEW.userID = PERSON.userID`+
  ` WHERE movieid = $1 limit 5`;

  const query = {
    text: select,
    values: [req.params.movieID],
  };
  const {rows} = await pool.query(query);

  for (const row of rows) {
    // console.log(row.data.sent);
    const event = new Date(row.data.sent);
    row.data.sent = event.toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles'});
  }
  return res.status(200).json(rows);
};

exports.deleteReview = async (req, res) => {
  const select = `DELETE from review WHERE `+
  `review.userid = $1 and review.moviereviewid = $2`;

  const query = {
    text: select,
    values: [req.user.userid,
      req.params.movieID],
  };

  const {rows} = await pool.query(query);
  console.log(rows);

  return res.status(200).json('good');
};
