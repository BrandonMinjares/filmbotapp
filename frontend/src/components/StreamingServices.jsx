import React, {useState} from 'react';
import Button from '@mui/material/Button';
import {useNavigate} from 'react-router-dom';

/*
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {useNavigate} from 'react-router-dom';

*/


const setStreamingServices = (services) => {
  console.log('In set Streaming services function');
  console.log(services);

  // User clicked save but didn't change anything
  if (services.length === 0) return;
  const item = localStorage.getItem('user');
  if (!item) {
    return;
  }
  const user = JSON.parse(item);
  const bearerToken = user ? user.accessToken : '';
  fetch('http://localhost:3010/v0/streamingServices', {
    method: 'POST',
    body: JSON.stringify(services),
    headers: new Headers({
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/json',
    }),
  })
    .then((response) => {
      console.log('test');
      if (!response.ok) {
        console.log('notok');
        throw response;
      }
      return response.json();
    })
    .then((json) => {
      console.log('should redire');
      window.location.href =
      'http://localhost:3000/#/onboarding/initialmoviepreferences';
      console.log(json);
      // setError('');
    })
    .catch((error) => {
      // setMail([]);
      // setError(`${error.status} - ${error.statusText}`);
    });
};

/**
 * @return {void}
 */
export default function StreamingServices() {
  const navigate = useNavigate();

  // Need to account for user clicking and unclicking multiple times
  const [service, setService] = useState([]);

  const removeElement = (index) => {
    if (service.includes(index)) {
      const num = service.indexOf(index);
      service.splice(num, 1);
      setService([...service]);
      console.log('already in');
    } else {
      console.log('not in');
      setService([...service, index]);
    }
  };
  console.log(service);


  return (
    <div>
      <Button onClick={() => navigate('/initialmoviepreferences')}>Skip</Button>
      <h3>Streaming Services</h3>
      <Button onClick={() => removeElement('HBO Max')}>HBO Max</Button>
      <Button onClick={() => removeElement('Netflix')}>Netflix</Button>
      <Button onClick={() => removeElement('Disney')}>Disney</Button>
      <Button onClick={() => removeElement('Hulu')}>Hulu</Button>
      <Button onClick={() => setStreamingServices(service)}>Save</Button>
    </div>
  );
}
