import { ThemeProvider } from '@emotion/react';
import { Box, Button, Grid, createTheme } from '@mui/material'
import React from 'react'


const theme = createTheme({
    palette: {
      primary: {
        // Purple and green play nicely together.
        main: '#0081ff',
      },
      secondary: {
        // This is green.A700 as hex.
        main: '#f3ffff',
      },
    },
  });
  

export default function SignOnSignUp() {
  return (
    <ThemeProvider theme={theme}>
        <Box>
            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Button 
                    color="primary" variant="contained"
                    onClick={() => window.location.href='#/login'}>Log In</Button>
                </Grid>
                <Grid item sm={6}>
                    <Button 
                    color="secondary" variant="contained"
                    onClick={() => window.location.href='#/register'}>Sign Up</Button>
                </Grid>
            </Grid>
        </Box>
    </ThemeProvider>
  )
}
