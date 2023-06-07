const fetch = require('node-fetch');
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

exports.getMovieInfo = async (req, res) => {
  const movieInfo = await fetch('https://api.themoviedb.org/3/search/movie?' +
  `api_key=${process.env.TMDB_API_KEY}`+
  `&query=${req.params.movie}&page=1`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const arr = [data.results[0]];
      return arr;
    });

  return res.status(200).json(movieInfo);
};

exports.getAllMovieInfo = async (req, res) => {
  const movieInfo = await fetch('https://api.themoviedb.org/3/search/movie?' +
  `api_key=${process.env.TMDB_API_KEY}`+
  `&query=${req.params.movie}&page=1`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const arr = data.results;
      return arr;
    });

  return res.status(200).json(movieInfo);
};

exports.addToWatchList = async (req, res) => {
  const movieInfo = await fetch('https://api.themoviedb.org/3/movie/' +
  `${req.params.movieID}?api_key=${process.env.TMDB_API_KEY}`+
  `&language=en-US`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const arr = data;
      return arr;
    });

  if (movieInfo.success === false) {
    return res.status(200).json('no movie exists');
  }


  // Add movieID to user's watch list if it isn't in it already
  const update = 'UPDATE person ' +
  `SET watchList = array_append(watchList, $1) ` +
  'WHERE userid = $2 ' +
  'AND NOT EXISTS ( ' +
  'SELECT 1 FROM unnest(watchList) WHERE unnest = $1) ' +
  'RETURNING watchList';

  const query = {
    text: update,
    values: [req.params.movieID, req.user.userid],
  };

  const {rows} = await pool.query(query);

  if (rows.length !== 1) {
    return res.status(200).json('bad');
  }
  return res.status(200).json('good');
};

exports.getMoviesFromWatchList = async (req, res) => {
  const select = 'select watchList from person WHERE '+
  `userid = $1`;

  const query = {
    text: select,
    values: [req.user.userid],
  };

  const {rows} = await pool.query(query);
  const watchListArr = [];

  if (typeof(rows[0].watchlist) === null) {
    return res.status(200).json(watchListArr);
  }

  for (const movie of rows[0].watchlist) {
    const movieInfo = await fetch('https://api.themoviedb.org/3/movie/' +
    `${movie}?api_key=${process.env.TMDB_API_KEY}`+
    `&language=en-US`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return data;
      });
    // console.log(movieInfo);
    watchListArr.push(
      {'poster_path': movieInfo.poster_path,
        'id': movieInfo.id,
        'original_title': movieInfo.original_title,
      });
  }

  return res.status(200).json(watchListArr);
};

// 1 page returns 21 results
exports.getRecommendationsBasedOffMovie = async (req, res) => {
  const url = `https://api.themoviedb.org/3/movie/${req.params.movieID}/recommendations?language=en-US&page=1`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwY2ZkZmFhY2MyMTBhNDliMWQyNDJmYjAwNDc2MGUzZSIsInN1YiI6IjY0MmI0ZTVhYzBhMzA4MDBiNDNiZDg4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.QUzBOBha7CKE3eOFe2iZVJrVz6NJv-r-PC_YhcnMNzc'
    }
  };

  fetch(url, options)
    .then(res => res.json())
    .then(json => console.log(json.results))
    .catch(err => console.error('error:' + err));
  return res.status(200).json('good');
}

exports.getRecommendations = async (req, res) => {
  const select = 'select recommendList from person WHERE '+
  `userid = $1`;

  const query = {
    text: select,
    values: [req.user.userid],
  };

  const {rows} = await pool.query(query);
  const watchListArr = [];
  if (rows[0].recommendList === null) {
    return res.status(200).json(watchListArr);
  }
  const recs = rows[0].recommendlist;

  for (const movie of recs) {
    const movieInfo = await fetch('https://api.themoviedb.org/3/movie/' +
    `${movie}?api_key=${process.env.TMDB_API_KEY}`+
    `&language=en-US`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return data;
      });
    // console.log(movieInfo);
    if (movieInfo.poster_path) {
      console.log(movieInfo.poster_path);
      watchListArr.push(
        {'poster_path': movieInfo.poster_path,
          'id': movieInfo.id,
          'original_title': movieInfo.original_title,
        });
    }
  }

  return res.status(200).json(watchListArr);
};

exports.getCredits = async (req, res) => {
  const creditsInfo = await fetch(`https://api.themoviedb.org/3/movie/${req.params.movieID}` +
  `/credits?api_key=${process.env.TMDB_API_KEY}&language=en-US`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data;
    });

  // Top 3 cast members will be top 3 leads in film
  const actor1 = creditsInfo.cast[0].name;
  const actor2 = creditsInfo.cast[1].name;
  const actor3 = creditsInfo.cast[2].name;
  let director = '';

  // Get director info
  for (const c of creditsInfo.crew) {
    if (c.job === 'Director') {
      director = c.name;
    }
  }

  const credits = {
    'actor1': actor1,
    'actor2': actor2,
    'actor3': actor3,
    'director': director,
  };

  // console.log(creditsInfo.cast);
  return res.status(200).json([credits]);
};

exports.likeMovie = async (req, res) => {
  return res.status(200).json('good');
};

exports.getTopRatedTMDB = async (req, res) => {
  const url = 'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1';
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwY2ZkZmFhY2MyMTBhNDliMWQyNDJmYjAwNDc2MGUzZSIsInN1YiI6IjY0MmI0ZTVhYzBhMzA4MDBiNDNiZDg4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.QUzBOBha7CKE3eOFe2iZVJrVz6NJv-r-PC_YhcnMNzc'
    }
  };
  
  const response = await fetch(url, options)
  const data = await response.json();
  return res.status(200).json(data.results);
}

exports.getNowPlayingTMDB = async (req, res) => {
  const url = 'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1';
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwY2ZkZmFhY2MyMTBhNDliMWQyNDJmYjAwNDc2MGUzZSIsInN1YiI6IjY0MmI0ZTVhYzBhMzA4MDBiNDNiZDg4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.QUzBOBha7CKE3eOFe2iZVJrVz6NJv-r-PC_YhcnMNzc'
    }
  };
  
  const response = await fetch(url, options)
  const data = await response.json();
  return res.status(200).json(data.results);
}

exports.getTopRatedMovies = async (req, res) => {
  const select =
  `SELECT distinct movieid, AVG(cast("data" ->> 'rating' AS INTEGER)) `+
  `as AVG_RATING from review WHERE REVIEW.created_at >= CURRENT_DATE - `+
  `INTERVAL '7 days' group by review.movieid order by ` +
  `AVG_RATING DESC limit 10`;
  const query = {
    text: select,
    values: [],
  };
  // https://api.themoviedb.org/3/movie/{movie_id}?api_key=<<api_key>>&language=en-US
  const {rows} = await pool.query(query);

  const topRated = [];
  for (const movie of rows) {
    const movieInfo = await fetch('https://api.themoviedb.org/3/movie/' +
    `${movie.movieid}?api_key=${process.env.TMDB_API_KEY}`+
    `&language=en-US`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return data;
      });
    topRated.push(
      {'poster_path': movieInfo.poster_path,
        'id': movieInfo.id,
        'original_title': movieInfo.original_title,
        // 'ratings': movie.avg_rating.substring(0, 3),
      });
  }

  return res.status(200).json(topRated);
};

exports.getTMDBRecomendations = async (req, res) => {
  const select = 'select recommendList from person WHERE '+
  `userid = $1`;

  const query = {
    text: select,
    values: [req.user.userid],
  };

  const {rows} = await pool.query(query);
  const movieID = rows[0].recommendlist[0];


  const movies = await fetch(`https://api.themoviedb.org/3/movie/${movieID}` +
  `/recommendations?api_key=${process.env.TMDB_API_KEY}&language=en-US`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data;
    });

  // console.log(movies);

  return res.status(200).json(movies.results);
};

exports.getWatchListIds = async (req, res) => {
  const select = 'select watchList from person WHERE '+
  `userid = $1`;

  const query = {
    text: select,
    values: [req.user.userid],
  };

  const {rows} = await pool.query(query);
  console.log(rows[0].watchlist);
  return res.status(200).json(rows[0].watchlist);

}