import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TheatersOutlinedIcon from '@mui/icons-material/TheatersOutlined';
/*
import NotificationsNoneOutlinedIcon from
  '@mui/icons-material/NotificationsNoneOutlined';
*/
import {useState} from 'react';
import {Autocomplete, Link, Stack, TextField}
  from '@mui/material';
import PropTypes from 'prop-types';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

import avatar from '../images/blankprofileimage.png';
// import {useEffect} from 'react';
const baseUrl = process.env.REACT_APP_BASE_URL;

/**
 * @param {*} props
 * @return {void}
 */
function SimpleDialog(props) {
  const {onClose, selectedValue, open, notification} = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Notifications</DialogTitle>
      <List sx={{pt: 0}}>
        {notification && notification.map((row) => (
          <ListItem disableGutters key={row.notificationid}>
            <ListItemButton onClick={() =>
              handleListItemClick(row.notificationid)} key={row.notificationid}>
              <ListItemText primary={row.content} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}
SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

/*
const getNotifications = (setNotifications) => {
  const item = localStorage.getItem('user');
  const user = JSON.parse(item);
  const bearerToken = user ? user.accessToken : '';

  fetch(`${baseUrl}/v0/notifications`, {
    method: 'GET',
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
      setNotifications(json);
    })
    .catch((err) => {
      console.log(err);
      // setError(`${err.status} - ${err.statusText}`);
    });
};
*/

/**
 * @return {void}
 */
export default function Navbar() {
  // const [notification, setNotifications] = useState(null);
  // const [open, setOpen] = React.useState(false);
  // const [selectedValue, setSelectedValue] = React.useState(emails[1]);
  /*
  const handleClickOpen = () => {
    setOpen(true);
  };
*/
  /*
  const handleClose = (value) => {
    setOpen(false);
    // setSelectedValue(value);
  };
*/
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const [movieSearch, setMovieSearch] = useState([]);

  const item = localStorage.getItem('user');
  const user = JSON.parse(item);
  const bearerToken = user ? user.accessToken : '';

  const handleInputChange = async (event, value) => {
    fetch(`${process.env.REACT_APP_BASE_URL}/v0/searchmovies/${value}`, {
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
        setMovieSearch(res);
      })
      .catch((err) => {
        console.log(err);
        // setError(`${err.status} - ${err.statusText}`);
      });
  };

  const logout = () => {
    localStorage.removeItem('user');
  };
  /*
  useEffect(() => {
    getNotifications(setNotifications);
  }, [setNotifications]);
*/
  return (
    <AppBar position="static" style={{backgroundColor: 'black'}}>
      <Container maxWidth="l">
        <Toolbar disableGutters>
          <TheatersOutlinedIcon
            sx={{display: {xs: 'none', md: 'flex'}, mr: 1}} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: {xs: 'none', md: 'flex'},
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            FILMBOT
          </Typography>
          <TheatersOutlinedIcon
            sx={{display: {xs: 'flex', md: 'none'}, mr: 1}} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: {xs: 'flex', md: 'none'},
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            FILMBOT
          </Typography>
          <Box sx={{flexGrow: 5,
            display: {xs: 'none', md: 'flex'}}}>
            <Stack sx={{width: 700, borderRadius: 2,
              margin: 'auto', backgroundColor: 'white'}}>
              <Autocomplete
                id='movie_search_container'
                options={movieSearch}
                isOptionEqualToValue={(option, value) =>
                  option.original_title === value.original_title
                }
                getOptionLabel={(option) => `${option.original_title}`}
                renderInput={(params) => (
                  <TextField
                    {...params} label="Search for movies" variant="outlined"
                  />
                )}
                onInputChange={handleInputChange}
                noOptionsText={'No movies found'}
                renderOption={(props, movieSearch) => (
                  <Box component='li' {...props} key={movieSearch.id}>
                    <Link href={`#/movie/${movieSearch.original_title}`}
                      color='inherit'
                      underline="hover"
                    >
                      {movieSearch.original_title}
                      {' '}
                ({movieSearch.release_date.substring(0, 4)})
                    </Link>
                  </Box>
                )}
              />
            </Stack>
          </Box>
          <div>
          </div>
          {/*
          }
            <IconButton variant="outlined" onClick={handleClickOpen}>
              <Badge badgeContent={notification && notification.length}
                color="primary">
                <NotificationsNoneOutlinedIcon sx={{color: 'white'}}/>
              </Badge>
            </IconButton>

            <SimpleDialog
              selectedValue={'hi'}
              open={open}
              onClose={handleClose}
              notification={notification}
            />


      */}
          <Box sx={{flexGrow: 0}}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{p: 1}}>
                <Avatar alt="profile image"
                  src={avatar} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{mt: '50px'}}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {/*
              <MenuItem
                onClick={handleCloseUserMenu}
              >
                      <Link href="#/profile" color="inherit" underline="none">
                      <Typography textAlign="center">Profile</Typography>
                    </Link>
              </MenuItem>
                          */}

              <MenuItem
                onClick={handleCloseUserMenu}>
                <Link href="#/settings" color="inherit" underline="none">
                  <Typography textAlign="center">Settings</Typography>
                </Link>
              </MenuItem>
              <MenuItem onClick={() => {
                handleCloseUserMenu();
                logout();
              }}>
                <Link href="#/login" color="inherit" underline="none">
                  <Typography textAlign="center">Logout</Typography>
                </Link>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
