import React, {useEffect, useState} from 'react';
import Navbar from './Navbar';
import {Grid, IconButton, Typography} from '@mui/material';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import BookmarkBorderTwoToneIcon from
  '@mui/icons-material/BookmarkBorderTwoTone';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CardActionArea from '@mui/material/CardActionArea';

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

const getWatchHistory = (setWatchHistory) => {
  const item = localStorage.getItem('user');
  if (!item) {
    return;
  }
  const user = JSON.parse(item);
  const bearerToken = user ? user.accessToken : '';
  fetch(`http://localhost:3010/v0/movies/watchlist`, {
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
    .then((res) => {
      setWatchHistory(res);
    })
    .catch((error) => {
      console.log(error);
      // setMail([]);
      // setError(`${error.status} - ${error.statusText}`);
    });
};

const getNowPlayingTMDB = (setNowPlayingTMDB) => {
  const item = localStorage.getItem('user');
  if (!item) {
    return;
  }
  const user = JSON.parse(item);
  const bearerToken = user ? user.accessToken : '';
  fetch(`http://localhost:3010/v0/movies/getNowPlayingTMDB`, {
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
    .then((res) => {
      setNowPlayingTMDB(res);
    })
    .catch((error) => {
      console.log(error);
      // setMail([]);
      // setError(`${error.status} - ${error.statusText}`);
    });
};

const getTopRatedMovies = (setTopRatedMovies) => {
  const item = localStorage.getItem('user');
  if (!item) {
    return;
  }
  const user = JSON.parse(item);
  const bearerToken = user ? user.accessToken : '';
  fetch(`http://localhost:3010/v0/movies/getTopRatedTMDB`, {
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
    .then((res) => {
      setTopRatedMovies(res);
    })
    .catch((error) => {
      console.log(error);
      // setMail([]);
      // setError(`${error.status} - ${error.statusText}`);
    });
};

const getRecommendations = (setRecommendations) => {
  const item = localStorage.getItem('user');
  if (!item) {
    return;
  }
  const user = JSON.parse(item);
  const bearerToken = user ? user.accessToken : '';
  fetch(`http://localhost:3010/v0/movies/getTMDBRecomendations`, {
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
    .then((res) => {
      setRecommendations(res);
    })
    .catch((error) => {
      console.log(error);
      // setMail([]);
      // setError(`${error.status} - ${error.statusText}`);
    });
};
/**
 * @return {void}
 */
export default function Dashboard() {
  const [watchHistory, setWatchHistory] = useState([]);
  const [nowPlayingTMDB, setNowPlayingTMDB] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);


  useEffect(() => {
    getWatchHistory(setWatchHistory);
    getRecommendations(setRecommendations);
    getTopRatedMovies(setTopRatedMovies);
    getNowPlayingTMDB(setNowPlayingTMDB);
    // nothing in array, it will only run once
  }, [setWatchHistory, setRecommendations, setTopRatedMovies]);
  // console.log(watchHistory);
  return (
    <div>
      <Navbar />
      <Typography textAlign={'center'} fontSize={32} padding={2}>
        Search For Movies. Make Reviews. Get Recommendations</Typography>
      {watchHistory.length > 0 ?
        <h2 className='movieListType'>Watch List</h2> : <h2> </h2>}
      <Grid
        container
        spacing={2}
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
        padding={2}
      >
        {watchHistory.length > 0 &&
          watchHistory.map((row) => (
            <Grid item key = {row.id} className='moviePoster'>
              <Card
                style={styles.card}
                sx={{'maxWidth': 220, 'maxHeight': 360, ':hover': {
                  boxShadow: 20,
                }}}>
                <CardActionArea
                  href={`#/movie/${row.original_title}`}>
                  <CardMedia
                    style={styles.media}
                    component="img"
                    image={`https://image.tmdb.org/t/p/original${row.poster_path}`}
                    alt={`${row.original_title} Poster`}>
                  </CardMedia>
                </CardActionArea>
              </Card>
            </Grid>
          ))
        }
      </Grid>

      {topRatedMovies.length > 0 ?
        <h2 className='movieListType'>Weekly Top Rated Movies</h2> : <h2> </h2>}
      <Grid
        container
        spacing={2}
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
        padding={2}
      >
        {topRatedMovies.length > 0 &&
          topRatedMovies.map((row) => (
            <Grid item key = {row.id} className='moviePoster'>
              <Card
                style={styles.card}
                sx={{'maxWidth': 220, 'maxHeight': 360, ':hover': {
                  boxShadow: 20,
                }}}>
                <CardActionArea
                  href={`#/movie/${row.original_title}`}>
                  <CardMedia
                    style={styles.media}
                    component="img"
                    image={`https://image.tmdb.org/t/p/original${row.poster_path}`}
                    alt={`${row.original_title} Poster`}>
                  </CardMedia>
                  {/*

                  <Tooltip title="Watch Later" placement="bottom-end">
                    <IconButton style={styles.overlay1} className='icons'>
                      <BookmarkBorderTwoToneIcon/>
                    </IconButton>
                  </Tooltip>
                                    */}
                </CardActionArea>
              </Card>
            </Grid>
          ))
        }
      </Grid>


      {nowPlayingTMDB.length > 0 ?
        <h2 className='movieListType'>Now Playing in Theatres</h2> : <h2> </h2>}
      <Grid
        container
        spacing={2}
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
        padding={2}
      >
        {nowPlayingTMDB.length > 0 &&
          nowPlayingTMDB.map((row) => (
            <Grid item key = {row.id} className='moviePoster'>
              <Card
                style={styles.card}
                sx={{'maxWidth': 220, 'maxHeight': 360, ':hover': {
                  boxShadow: 20,
                }}}>
                <CardActionArea
                  href={`#/movie/${row.original_title}`}>
                  <CardMedia
                    style={styles.media}
                    component="img"
                    image={`https://image.tmdb.org/t/p/original${row.poster_path}`}
                    alt={`${row.original_title} Poster`}>
                  </CardMedia>
                </CardActionArea>
              </Card>
            </Grid>
          ))
        }
      </Grid>


      {recommendations.length < 0 ?
        <h2 className='movieListType'>Recommendations</h2> : <h2> </h2>}
      <Grid
        container
        spacing={2}
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
        padding={2}
      >
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
                <IconButton style={styles.overlay1} className='icons'>
                  <BookmarkBorderTwoToneIcon/>
                </IconButton>
                <IconButton
                  style={styles.overlay2}
                  className='icons'
                  href={`#/movie/${row.original_title}`}>
                  <InfoOutlinedIcon/>
                </IconButton>
              </Card>
            </Grid>
          ))
        }
      </Grid>
    </div>
  );
}
