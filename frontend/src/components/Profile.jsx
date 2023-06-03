import React, {useEffect} from 'react';
import Navbar from './Navbar';
import {Avatar, Box, Container} from '@mui/material';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import avatar from '../images/blankprofileimage.png';

const theme = createTheme();
/**
 * @return {void}
 */
export default function Settings() {
  useEffect(() => {
    console.log('user');
  }, []);
  return (
    <div>
      <Navbar />
      <ThemeProvider theme={theme}>

        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Avatar alt="Remy Sharp" src={avatar}
              sx={{width: 250, height: 250}}
            />
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
};

