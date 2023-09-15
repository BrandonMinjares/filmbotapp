import {Helmet} from 'react-helmet'
import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ReactStars from 'react-rating-stars-component';
import {useState} from 'react';
// https://www.npmjs.com/package/react-rating-stars-component

import {useEffect} from 'react';
import SingleReview from './SingleReview';
import {Card, CardMedia, Grid} from '@mui/material';
// import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
// const baseUrl = process.env.REACT_APP_BASE_URL;


const styles = {
  card: {
    position: 'relative',
  },
  overlay1: {
    position: 'absolute',
    top: '5px',
    right: '5px',
    color: 'white',
    maxWidth: '27px',
    maxHeight: '27px',
    backgroundColor: 'black',
  },
  overlay2: {
    position: 'absolute',
    top: '5px',
    right: '36px',
    color: 'white',
    maxWidth: '27px',
    maxHeight: '27px',
  },
};


const getRecommendations = (movieID, setRecommendations) => {
  console.log(movieID);
  fetch(`${process.env.REACT_APP_BASE_URL}/v0/movies/getRecommendationsBasedOffMovie/${movieID}`, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
  })
    .then((response) => {
      if (!response.ok) {
        console.log('notok');
        throw response;
      }
      return response.json();
    })
    .then((res) => {
      console.log(res);
      setRecommendations(res);
    })
    .catch((error) => {
      console.log(error);
      // setMail([]);
      // setError(`${error.status} - ${error.statusText}`);
    });
};


const fetchCredits = (movieID, setCredits) => {
  fetch(`${process.env.REACT_APP_BASE_URL}/v0/movies/credits/${movieID}`, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
  })
    .then((response) => {
      if (!response.ok) {
        console.log('notok');
        throw response;
      }
      return response.json();
    })
    .then((json) => {
      // setError('');
      setCredits(json);
    })
    .catch((error) => {
      console.log(error);
      // setMail([]);
      // setError(`${error.status} - ${error.statusText}`);
    });
};

const fetchReviews = (movieID, setReview) => {
  const item = localStorage.getItem('user');
  if (!item) {
    return;
  }
  const user = JSON.parse(item);
  const bearerToken = user ? user.accessToken : '';
  fetch(`${process.env.REACT_APP_BASE_URL}/v0/reviews/${movieID}`, {
    method: 'GET',
    headers: new Headers({
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
  })
    .then((response) => {
      if (!response.ok) {
        console.log('notok');
        throw response;
      }
      return response.json();
    })
    .then((json) => {
      // setError('');
      setReview(json);
    })
    .catch((error) => {
      console.log(error);
      // setMail([]);
      // setError(`${error.status} - ${error.statusText}`);
    });
};

const fetchWatchListIds = (movieID, setWatchIds) => {
  const item = localStorage.getItem('user');
  if (!item) {
    return;
  }
  const user = JSON.parse(item);
  const bearerToken = user ? user.accessToken : '';
  fetch(`${process.env.REACT_APP_BASE_URL}/v0/movies/getWatchListIds/${movieID}`, {
    method: 'GET',
    headers: new Headers({
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
  })
    .then((response) => {
      if (!response.ok) {
        console.log('notok');
        throw response;
      }
      return response.json();
    })
    .then((json) => {
      setWatchIds(json);
      console.log(json);
    })
    .catch((error) => {
      console.log(error);
    });
};


/**
 * @param {object} props
 * @return {void}
 */
export default function Movie(props) {
  const [value, setValue] = useState(0);
  const [reviews, setReview] = useState(null);
  const [credits, setCredits] = useState(null);
  const [watchId, setWatchIds] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

// Saving movieID to watch history
const saveToWatchHistory = (movieID) => {
  const item = localStorage.getItem('user');
  if (!item) {
    return;
  }
  const user = JSON.parse(item);
  const bearerToken = user ? user.accessToken : '';
  fetch(`${process.env.REACT_APP_BASE_URL}/v0/movies/watchlist/${movieID}`, {
    method: 'POST',
    headers: new Headers({
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
  })
    .then((response) => {
      if (!response.ok) {
        console.log('notok');
        throw response;
      }
      return response.json();
    })
    .catch((error) => {
      console.log(error);
      // setMail([]);
      // setError(`${error.status} - ${error.statusText}`);
    });
};


  const deleteWatchHistoryId = (movieID) => {
    const item = localStorage.getItem('user');
    if (!item) {
      return;
    }
    const user = JSON.parse(item);
    const bearerToken = user ? user.accessToken : '';
    fetch(`${process.env.REACT_APP_BASE_URL}/v0/movies/removeFromWatchList/${movieID}`, {
      method: 'PUT',
      headers: new Headers({
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    })
      .then((response) => {
        if (!response.ok) {
          console.log('notok');
          throw response;
        }
        return response.json();
      })
      .then((json) => {
        console.log(json);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    if (data.get('review') === '') {
      alert('Must enter movie name');
      return;
    }

    const item = localStorage.getItem('user');
    if (!item) return;

    const user = JSON.parse(item);
    const bearerToken = user ? user.accessToken : '';

    const movieReview = {
      review: data.get('review'),
      rating: value,
      movieid: props.row.id,
      movie: props.row.original_title,
    };

    fetch(`${process.env.REACT_APP_BASE_URL}/v0/reviews`, {
      method: 'POST',
      body: JSON.stringify(movieReview),

      headers: new Headers({
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      }),
    })
      .then((res) => {
        if (!res.ok) throw res;
        fetchReviews(movieReview.movieid, setReview);
        return res.json();
      })
      .catch((err) => {
        console.log(err);
        // setError(`${err.status} - ${err.statusText}`);
      });
  };

  const backdrop = `https://image.tmdb.org/t` +
  `/p/w1280/${props.row.backdrop_path}`;

  const poster = `https://image.tmdb.org/t/p/original${props.row.poster_path}`;
  const releaseYear = (props.row.release_date).substring(0, 4);
  // const backdrop = `https://image.tmdb.org/t/p/original${props.row.backdrop_path}`;

  useEffect(() => {
    fetchReviews(props.row.id, setReview);
    fetchCredits(props.row.id, setCredits);
    fetchWatchListIds(props.row.id, setWatchIds);
    getRecommendations(props.row.id, setRecommendations);
    // nothing in array, it will only run once
  }, [props.row.id]);

  const movieRating = (props.row.vote_average/2);
  const fourthExample = {
    value: movieRating,
    size: 20,
    color2: '#ffd700',
    edit: false,
  };

  const fifthExample = {
    value: 0,
    size: 20,
    color2: '#ffd700',
    onChange: (newValue) => {
      setValue(newValue);
    },
  };
  return (
    <div className='movie-page'>
      <div className= 'backdrop-container'>
        <img src={backdrop} alt='backdrop' className='backdrop-image'/>
        <div className='title'>{props.row.original_title}
          {' (' + (releaseYear) + ')'}</div>
      </div>
      <Box sx={{flexGrow: 1}}>
        <Grid container spacing={2} className='movie-grid'>
          <Grid item xs={3} s={3}>
            <div className='float-image'>
              <img className = 'movieImage' src = {poster} alt = 'img'/>
            </div>
          </Grid>
          <Grid item xs={6} s={6}>
            <div className='float-description'>
            <a className='justWatch' data-original='https://www.justwatch.com' href='https://www.justwatch.com/us'>
                <span className='justWatchSpan'>JustWatch</span>
            </a>
              <div data-jw-widget
                  data-api-key="oIMMGlOY13GzWo8hYPyVWtPAtZCLGrmO" 
                  data-object-type="movie"
                  data-title={props.row.original_title}      
                  data-year={releaseYear}
                  data-theme="light">
                </div>
              <div>
              </div>
              <h2>Storyline</h2>
              <div className='overview'>{props.row.overview}</div>              
              
              {credits &&
          credits.map((row) => (
            <div key = {row} className='castandcrew'>
              <div>Director: {row.director}</div>
              <div>Cast: {row.actor1}, {row.actor2}, {row.actor3}</div>
              <ReactStars className='stars'{...fourthExample} />

            </div>
          ))
              }
              <div className='watchButtonContainer'>
                {watchId === 0 &&
                <button id={props.row.id} className = 'watchButton'
                  onClick={() => saveToWatchHistory(props.row.id)}
                >Save to watch list</button>
              }

        {recommendations.length < 0 &&
          recommendations.map((row) => (
            <Grid item key = {row.id} className='moviePoster'>
              <Card
                style={styles.card}
                sx={{'maxWidth': 220, 'maxHeight': 360, ':hover': {
                  boxShadow: 20,
                }}}>
                <CardMedia
                  style={styles.media}
                  component="img"
                  image={`https://image.tmdb.org/t/p/original${row.poster_path}`}
                  alt={`${row.original_title} Poster`}>
                </CardMedia>
              </Card>
            </Grid>
          ))
        }
              {watchId === 1 &&
                <button id={props.row.id} className = 'watchButton'
                  onClick={() => deleteWatchHistoryId(props.row.id)}
                >Remove from watch list</button>
              }
              </div>
              <div className='review-container'>
                {reviews && reviews.map((row) => (
            <SingleReview key = {row.moviereviewid} row={row}
              movieid = {props.row.id} reviewid={row.moviereviewid}/>))}
              </div>
            </div>
          </Grid>
          <Grid item xs={3} s={3}>
            <Box className='review-form'
              component="form" onSubmit={handleSubmit}
              noValidate>
              <h5>Rating</h5>
              <ReactStars name='stars' id = 'stars' {...fifthExample} />
              <TextField
                fullWidth
                id="review"
                name='review'
                multiline
                rows={10}
                inputProps={{maxLength: 280}}
                placeholder="Post a Review"
              />
              <Button
                type="submit"
                aria-label='Search Movies'
                variant="contained"
                sx={{mt: 3, mb: 2, bgcolor: 'white',
                  color: 'black',
                }}
              >
              Post Review
              </Button>
            </Box>
          </Grid>
                  <Helmet>
        <script async src="https://widget.justwatch.com/justwatch_widget.js"></script>
      </Helmet>
        </Grid>
      </Box>
    </div>
  );
};
