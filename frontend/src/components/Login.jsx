import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {Paper} from '@mui/material';

import movieImage from './../images/movieimage.jpg';

const theme = createTheme();

/**
 * @return {void}
 */
export default function SignIn() {
  // const [error, setError] = React.useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const user = {
      email: data.get('email'),
      password: data.get('password'),
    };

    fetch(`http://localhost:3010/v0/login`, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then((json) => {
        localStorage.setItem('user', JSON.stringify(json));

        /*
        const loggedIn = json['firstLoginBoolean'];
        console.log(loggedIn);
        if (loggedIn === 1) {
          window.location.href =
          'http://localhost:3000/#/onboarding/streamingservices';
        } else {
          window.location.href =
          'http://localhost:3000/';
        }
        */
        window.location.href =
          '/#';
      })
      .catch((err) => {
        console.log(err);
        // setError(`${err.status} - ${err.statusText}`);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{height: '100vh'}}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${movieImage})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ?
                t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate
              onSubmit={handleSubmit} sx={{mt: 1}}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                aria-label='Email Address'
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                aria-label='Password'
              />
              <Button
                type="submit"
                aria-label='Log In'
                fullWidth
                variant="contained"
                sx={{mt: 3, mb: 2}}
              >
              Log In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/#/register" variant="body2">
                    {`Don't have an account? Sign Up`}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
