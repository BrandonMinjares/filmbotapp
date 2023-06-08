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

app.get('/dummy', dummy.get);
// Your routes go here
app.post('/login', auth.login);
app.post('/register', auth.register);

app.delete('/deleteAccount', auth.check,
  auth.deleteAccount);

app.post('/streamingServices', auth.check,
  streamingServices.postStreamingServices);

app.get('/streamingServices', auth.check,
  streamingServices.getStreamingServices);

app.get('/searchmovie/:movie', auth.check,
  movies.getMovieInfo);

app.get('/searchmovies/:movie', auth.check,
  movies.getAllMovieInfo);

app.post('/reviews', auth.check,
  reviews.postReview);

app.get('/reviews/:movieID', auth.check,
  reviews.getReview);

app.delete('/reviews/:movieID', auth.check,
  reviews.deleteReview);

app.post('/movies/watchlist/:movieID', auth.check,
  movies.addToWatchList);

app.get('/movies/getTopRatedTMDB', auth.check,
  movies.getTopRatedTMDB);

app.get('/movies/getNowPlayingTMDB', auth.check,
  movies.getNowPlayingTMDB);

app.get('/movies/watchlist', auth.check,
  movies.getMoviesFromWatchList);

app.get('/movies/getWatchListIds/:movieID', auth.check,
  movies.getWatchListIds);

app.put('/movies/removeFromWatchList/:movieID', auth.check,
  movies.removeFromWatchList);

app.get('/movies/recommendations', auth.check,
  movies.getRecommendations);

app.get('/movies/getRecommendationsBasedOffMovie/:movieID', auth.check,
  movies.getRecommendationsBasedOffMovie);

app.get('/movies/credits/:movieID', auth.check,
  movies.getCredits);


app.post('/likeMovie/:movieID', auth.check,
  movies.likeMovie);

app.get('/profile', auth.check,
  profile.getProfileInfo);

app.put('/profile', auth.check,
  profile.updateProfileInfo);

app.get('/movies/getTopRatedMovies', auth.check,
  movies.getTopRatedMovies);

app.get('/movies/getTMDBRecomendations', auth.check,
  movies.getTMDBRecomendations);

app.get('/notifications', auth.check,
  notifications.getNotifications);

app.use((err, req, res, next) => {
  res.status(err.status).json({
    message: err.message,
    errors: err.errors,
    status: err.status,
  });
});

module.exports = app;
