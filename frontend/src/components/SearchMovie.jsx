import React, {useState} from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Movie from './Movie';
import {Grid} from '@mui/material';
import './../styles.css';
// import {Stack, Autocomplete} from '@mui/material';

/**
 * @return {void}
 */
export default function SearchMovie() {
  const [movies, setMovies] = useState([]);


  const handleSubmit = (event) => {
    event.preventDefault();
    const item = localStorage.getItem('user');
    if (!item) {
      return;
    }

    // const movieInfo = 'https://api.themoviedb.org/3/search/movie?' +
    // 'api_key=d334dbf7dfa49ff0acc99b0ede6f1f19&query=scream';
    const user = JSON.parse(item);
    const bearerToken = user ? user.accessToken : '';
    const data = new FormData(event.currentTarget);
    const movie = data.get('search');


    if (movie === '') {
      alert('Must enter movie name');
      return;
    }

    fetch(`https://filmbot.io/filmbotapp-backend/v0/searchmovie/${movie}`, {
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
      .then((res) => {
        setMovies(res);
      })
      .catch((err) => {
        console.log(err);
        // setError(`${err.status} - ${err.statusText}`);
      });
  };


  return (
    <Grid container={true}>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          InputLabelProps={{shrink: false}}
          margin="normal"
          required
          id="search"
          placeholder="Search Movies"
          name="search"
          aria-label='Search'
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
      {movies &&
          movies.map((row) => (
            <Movie key = {row.id} row={row} />
          ))
      }
    </Grid>
  );
}

