import React from 'react';
import './../styles.css';
import ReactStars from 'react-rating-stars-component';
// https://www.npmjs.com/package/react-rating-stars-component


const setMovieRating = (movieRating, movieId) => {
  const item = localStorage.getItem('user');
  if (!item) {
    return;
  }
  const info = {
    movieRating: movieRating,
    movieId: movieId,
  };

  const user = JSON.parse(item);
  const bearerToken = user ? user.accessToken : '';
  fetch(`${process.env.LOCAL_HOST_SERVER}/v0/movies`, {
    method: 'POST',
    body: JSON.stringify(info),
    headers: new Headers({
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/json',
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
      // setError('');
    })
    .catch((error) => {
      console.log(error);
      // setError(`${error.status} - ${error.statusText}`);
    });
};

/**
 * @param {object} props
 * @return {void}
 */
export default function SingleMovie(props) {
  console.log(props.row);
  const poster = `https://image.tmdb.org/t/p/original${props.row.poster_path}`;
  //       {props.row.original_title}

  const fourthExample = {
    size: 30,
    value: 0,
    onChange: (newValue) => {
      // console.log(`Example 4: new value is ${newValue}`);
      setMovieRating(newValue, props.row.id);
    },
  };

  return (
    <div>
      <ReactStars {...fourthExample} />
      <img className ='movieImage' src = {poster} alt = 'img'
      />
    </div>
  );
}

