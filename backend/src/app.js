const express = require('express');
const cors = require('cors');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');

const dummy = require('./dummy');
const auth = require('./auth');
const streamingServices = require('./streamingServices');
const movies = require('./movies');
const reviews = require('./reviews');
const profile = require('./profile');
const notifications = require('./notifications');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const apiSpec = path.join(__dirname, '../api/openapi.yaml');

const apidoc = yaml.load(fs.readFileSync(apiSpec, 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apidoc));
app.use(
  OpenApiValidator.middleware({
    apiSpec: apiSpec,
    validateRequests: true,
    validateResponses: true,
  }),
);

app.get('/v0/dummy', dummy.get);
// Your routes go here
app.post('/v0/login', auth.login);
app.post('/register', auth.register);

app.delete('/v0/deleteAccount', auth.check,
  auth.deleteAccount);

app.post('/v0/streamingServices', auth.check,
  streamingServices.postStreamingServices);

app.get('/v0/streamingServices', auth.check,
  streamingServices.getStreamingServices);

app.get('/v0/searchmovie/:movie', auth.check,
  movies.getMovieInfo);

app.get('/v0/searchmovies/:movie', auth.check,
  movies.getAllMovieInfo);

app.post('/v0/reviews', auth.check,
  reviews.postReview);

app.get('/v0/reviews/:movieID', auth.check,
  reviews.getReview);

app.delete('/v0/reviews/:movieID', auth.check,
  reviews.deleteReview);

app.post('/v0/movies/watchlist/:movieID', auth.check,
  movies.addToWatchList);

app.get('/v0/movies/getTopRatedTMDB', auth.check,
  movies.getTopRatedTMDB);

app.get('/v0/movies/getNowPlayingTMDB', auth.check,
  movies.getNowPlayingTMDB);

app.get('/v0/movies/watchlist', auth.check,
  movies.getMoviesFromWatchList);

app.get('/v0/movies/getWatchListIds/:movieID', auth.check,
  movies.getWatchListIds);

app.put('/v0/movies/removeFromWatchList/:movieID', auth.check,
  movies.removeFromWatchList);

app.get('/v0/movies/recommendations', auth.check,
  movies.getRecommendations);

app.get('/v0/movies/getRecommendationsBasedOffMovie/:movieID', auth.check,
  movies.getRecommendationsBasedOffMovie);

app.get('/v0/movies/credits/:movieID', auth.check,
  movies.getCredits);


app.post('/v0/likeMovie/:movieID', auth.check,
  movies.likeMovie);

app.get('/v0/profile', auth.check,
  profile.getProfileInfo);

app.put('/v0/profile', auth.check,
  profile.updateProfileInfo);

app.get('/v0/movies/getTopRatedMovies', auth.check,
  movies.getTopRatedMovies);

app.get('/v0/movies/getTMDBRecomendations', auth.check,
  movies.getTMDBRecomendations);

app.get('/v0/notifications', auth.check,
  notifications.getNotifications);

app.use((err, req, res, next) => {
  res.status(err.status).json({
    message: err.message,
    errors: err.errors,
    status: err.status,
  });
});

module.exports = app;
