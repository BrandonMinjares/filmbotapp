import {Box, Button, Container, Grid, TextField} from '@mui/material';
import React, {useEffect, useState} from 'react';
import Navbar from './Navbar';
import {createTheme, ThemeProvider} from '@mui/material/styles';

const theme = createTheme();

const getUserInfo = (setUserInfo) => {
  const item = localStorage.getItem('user');
  if (!item) {
    return;
  }
  const user = JSON.parse(item);
  const bearerToken = user ? user.accessToken : '';
  fetch(`https://filmbot.io/filmbotapp-backend/v0/profile`, {
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
      setUserInfo(json);
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
export default function Profile() {
  const [userInfo, setUserInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newData = {
      name: {
        first: formData.get('firstName'),
        last: formData.get('lastName'),
      },
      email: formData.get('email'),
    };
    setUserInfo(newData);


    const item = localStorage.getItem('user');
    if (!item) {
      return;
    }
    const user = JSON.parse(item);
    const bearerToken = user ? user.accessToken : '';
    fetch(`https://filmbot.io/filmbotapp-backend/v0/profile`, {
      method: 'PUT',
      body: JSON.stringify(newData),
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
      // setError('');
        setUserInfo(json);
      })
      .catch((error) => {
        console.log(error);
      // setMail([]);
      // setError(`${error.status} - ${error.statusText}`);
      });

    setIsEditing(false);
  };

  const deleteAccount = () => {
    const item = localStorage.getItem('user');
    if (!item) {
      return;
    }
    const user = JSON.parse(item);
    const bearerToken = user ? user.accessToken : '';
    fetch(`https://filmbot.io/filmbotapp-backend/v0/deleteAccount`, {
      method: 'DELETE',
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
      // setError('');
        localStorage.removeItem('user');

        window.location.href =
      `${process.env.LOCAL_HOST_SERVER}/#/login`;
        // setUserInfo(json);
      })
      .catch((error) => {
        console.log(error);
      // setMail([]);
      // setError(`${error.status} - ${error.statusText}`);
      });
  };

  useEffect(() => {
    getUserInfo(setUserInfo);
  }, []);
  return (
    <div>
      <Navbar/>
      <ThemeProvider theme={theme}>

        <Container component="main" maxWidth="lg">
          <Box
            sx={{
              marginTop: 6,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <h2>Account Settings</h2>
            {userInfo &&
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
            <Grid container spacing={2}>
              <TextField
                margin="normal"
                id="firstName"
                name="firstName"
                label="First Name"
                fullWidth
                defaultValue={userInfo.name.first}
                disabled={!isEditing}/>

              <TextField
                margin="normal"
                id="lastName"
                name="lastName"
                label="Last Name"
                fullWidth
                defaultValue={userInfo.name.last}
                disabled={!isEditing}/>

              <TextField
                margin="normal"
                id="email"
                name="email"
                label="Email"
                fullWidth
                defaultValue={userInfo.email}
                disabled={!isEditing}/>
              <Grid item md={12}>
                <Grid item md={6}>
                  <Button variant="contained" color="primary"
                    onClick={handleEditClick}>Edit</Button>

                  {isEditing && (
                    <Button type="submit" color="success"
                      variant="contained">Save</Button>
                  )}
                </Grid>
                <Grid item md={12}>
                  <Button onClick={deleteAccount} color="error"
                    variant="contained">
            Delete Account
                  </Button>
                </Grid>
              </Grid>
            </Grid>

          </Box>
            }
          </Box>
          <Box>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
};

