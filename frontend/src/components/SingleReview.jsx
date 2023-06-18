import ReactStars from 'react-rating-stars-component';

import React from 'react';
import './../styles.css';

import DeleteIcon from '@mui/icons-material/Delete';
import {IconButton} from '@mui/material';

/*
  const deleteReview = () => {
    const item = localStorage.getItem('user');
    if (!item) {
      return;
    }
    const user = JSON.parse(item);
    const bearerToken = user ? user.accessToken : '';
    fetch(`https://filmbot.io/filmbotapp-backend/v0/reviews/${props.reviewid}`, {
      method: 'DELETE',
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
      .catch((error) => {
        console.log(error);
        // setMail([]);
        // setError(`${error.status} - ${error.statusText}`);
      });
  };
  */

/**
 * @param {object} props
 * @return {void}
 */
export default function SingleReview(props) {
  const item = localStorage.getItem('user');
  if (!item) {
    return;
  }

  const user = JSON.parse(item);
  const userid = user.userid;
  const fourthExample = {
    value: props.row.data.rating,
    size: 18,
    color2: '#ffd700',
    edit: false,
  };
  return (
    <div className = 'review' key = {props.row.reviewid}
      row={props.row.reviewid}>
      <div>
        <ReactStars className='stars'
          {...fourthExample} />
        <div><h5>Reviewed by: {props.row.name.first}
          {' ' + props.row.name.last}
        </h5></div>
        <p>{props.row.data.review}</p>
        {/*
        {userid === props.row.userid ? (
          <div>
            <IconButton sx={{p: 1}}>
              <DeleteIcon onClick={deleteReview}
              />
            </IconButton>
          </div>
        ): ''}
        */}
      </div>
    </div>

  );
}
