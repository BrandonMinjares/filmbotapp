import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ReactStars from 'react-rating-stars-component';
import {useState} from 'react';
// https://www.npmjs.com/package/react-rating-stars-component

import {useEffect} from 'react';
import SingleReview from './SingleReview';
import {Grid} from '@mui/material';
// import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
const baseUrl = process.env.REACT_APP_BASE_URL;

const fetchCredits = (movieID, setCredits) => {
  const item = localStorage.getItem('user');
  if (!item) {
    return;
  }

  const user = JSON.parse(item);
  const bearerToken = user ? user.accessToken : '';
  fetch(`${baseUrl}/v0/movies/credits/${movieID}`, {
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
  fetch(`${baseUrl}/v0/reviews/${movieID}`, {
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

// Saving movieID to watch history
const saveToWatchHistory = (movieID) => {
  const item = localStorage.getItem('user');
  if (!item) {
    return;
  }
  const user = JSON.parse(item);
  const bearerToken = user ? user.accessToken : '';
  fetch(`${baseUrl}/v0/movies/watchlist/${movieID}`, {
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


/**
 * @param {object} props
 * @return {void}
 */
export default function Movie(props) {
  const [value, setValue] = useState(0);
  const [reviews, setReview] = useState(null);
  const [credits, setCredits] = useState(null);

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

    fetch(`${baseUrl}/v0/reviews`, {
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

  const fourthExample = {
    size: 20,
    value: 0,
    onChange: (newValue) => {
      setValue(newValue);
    },
  };

  useEffect(() => {
    fetchReviews(props.row.id, setReview);
    fetchCredits(props.row.id, setCredits);
    // nothing in array, it will only run once
  }, [props.row.id]);

  return (
    <div className='movie-page'>
      <div className= 'backdrop-container'>
        <img src={backdrop} alt='backdrop' className='backdrop-image'/>
        <div className='title'>{props.row.original_title}
          {' (' + (releaseYear) + ')'}</div>
      </div>
      <Box sx={{flexGrow: 1}}>
        <Grid container spacing={2} className='movie-grid'>
          <Grid item xs={3} s={4}>
            <div className='float-image'>
              <img className = 'movieImage' src = {poster} alt = 'img'/>
            </div>
          </Grid>
          <Grid item xs={6} s={7}>
            <div className='float-description'>
              <h3>Storyline</h3>
              <div className='overview'>{props.row.overview}</div>
              {credits &&
          credits.map((row) => (
            <div key = {row} className='castandcrew'>
              <div>Director: {row.director}</div>
              <div>Cast: {row.actor1}, {row.actor2}, {row.actor3}</div>
            </div>
          ))
              }
              <div className='watchButtonContainer'>
                <button id={props.row.id} className = 'watchButton'
                  onClick={() => saveToWatchHistory(props.row.id)}
                >Save to watch list</button>
              </div>
              <div className='review-container'>
                {reviews &&
          reviews.map((row) => (
            <SingleReview key = {row.moviereviewid} row={row}
              movieid = {props.row.id} reviewid={row.moviereviewid}/>
          ))
                }
              </div>
            </div>

          </Grid>
          <Grid item xs={3} s={3}>
            <Box className='review-form'
              component="form" onSubmit={handleSubmit}
              noValidate>
              <h5>Rating</h5>
              <ReactStars name='stars' id = 'stars' {...fourthExample} />
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
        </Grid>
      </Box>
    </div>
  );
};
