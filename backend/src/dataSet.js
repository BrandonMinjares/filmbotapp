const {Pool} = require('pg');
const Json2csvParser = require('json2csv').Parser;
const fs = require('fs');

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

// open the PostgreSQL connection
pool.connect((err, client, done) => {
  if (err) throw err;

  client.query('SELECT data, userid FROM moviereview', (err, res) => {
    done();

    if (err) {
      console.log(err.stack);
    } else {
      const jsonData = JSON.parse(JSON.stringify(res.rows));
      console.log('jsonData', jsonData);

      const json2csvParser = new Json2csvParser({header: true});
      const csv = json2csvParser.parse(jsonData);
      fs.writeFile('reviews.csv', csv, function(error) {
        if (error) throw error;
        console.log('Write to reviews.csv successfully!');
      });
    }
  });
});
