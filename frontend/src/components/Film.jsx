import React, {useState} from 'react';
import Movie from './Movie';
import './../styles.css';
import {useParams} from 'react-router';
import {useEffect} from 'react';
// import {Stack, Autocomplete} from '@mui/material';
import Navbar from './Navbar';

const getMovieInfo = (setMovies, movie) => {
  fetch(`${process.env.REACT_APP_BASE_URL}/v0/searchmovie/${movie}`, {
    method: 'GET',
    headers: new Headers({
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

/**
 * @return {void}
 */
export default function Film() {
  const {movie} = useParams();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    getMovieInfo(setMovies, movie);
  }, [movie]);


  return (
    <div>
      <Navbar />
      {movies &&
          movies.map((row) => (
            <Movie key = {row.id} row={row} />
          ))
      }
    </div>
  );
}

