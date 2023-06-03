import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SingleMovie from './SingleMovie';
/*
const secrets = require('./../secrets.json');
const list = require('./../movies.json');
*/
import './../styles.css';
import {useNavigate} from 'react-router-dom';

/**
 * Emoji picker example
 *
 * @return {object} JSX
 */
export default function InitialMoviePreferences() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState(null);
  const [movieNumber] = useState(5);

  const handleSubmit = (event) => {
    event.preventDefault();
    const item = localStorage.getItem('user');
    if (!item) {
      return;
    }
    const user = JSON.parse(item);
    const bearerToken = user ? user.accessToken : '';
    const data = new FormData(event.currentTarget);
    const movie = data.get('search');
    fetch(`http://localhost:3010/v0/movies?search=${movie}`, {
      method: 'GET',
      headers: new Headers({
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      }),
    })
      .then((res) => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then((json) => {
        console.log(json);
        setMovies(json);
      })
      .catch((error) => {
        setMovies([]);
        // setError(`${error.status} - ${error.statusText}`);
      });
  };

  useEffect(() => {
    fetch('https://api.themoviedb.org/3/movie/top_rated?' +
      `api_key=${process.env.TMDB_API_KEY}&` +
      'language=en-US&page=1')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setMovies(data);
      });
  }, []);

  return (
    <div>
      <Box component="form" onSubmit={handleSubmit}
        noValidate>
        <TextField
          InputLabelProps={{shrink: false}}
          margin="normal"
          required
          id="search"
          placeholder="Search Movies"
          name="search"
          aria-label='Search'
          sx={{width: {sm: 200, md: 800}, backgroundColor: 'white'}}
        />
        <Button
          type="submit"
          aria-label='Search Movies'
          variant="contained"
          sx={{mt: 3, mb: 2, bgcolor: 'white',
            color: 'black', marginRight: '290px', marginLeft: '20px',
          }}
        >
              Search Movies
        </Button>
      </Box>
      <h2>Rate {movieNumber} movies to help us give you recommendations</h2>
      <div className='movieList'>
        {movies &&
          movies.results.map((row) => (
            <SingleMovie key = {row.id} row={row}/>
          ))
        }
      </div>
      <Button onClick={() => navigate('/allmovies')}>Skip</Button>
    </div>
  );
};
