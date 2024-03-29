import React from 'react';

/**
 * Simple component with no state.
 *
 * @param {function} setDummy set the dummy state
 */
function getDummy(setDummy) {
  fetch(`${process.env.LOCAL_HOST_SERVER}/v0/dummy`)
    .then((response) => {
      if (!response.ok) {
        throw response;
      }
      return response.json();
    })
    .then((json) => {
      setDummy(json.message);
    })
    .catch((error) => {
      setDummy(`ERROR: ${error.toString()}`);
    });
}

/**
 * Simple component with one state variable.
 *
 * @return {object} JSX
 */
function Dummy() {
  const [dummy, setDummy] = React.useState('Click the button!');
  return (
    <div>
      <h3>
        Click button to connect to the Backend dummy endpoint</h3>
      <button
        aria-label='get dummy'
        onClick={(event) => {
          getDummy(setDummy);
        }}
      >
        Get Dummy
      </button>
      <p/>
      <h3
        aria-label='dummy message'
      >
        {dummy}
      </h3>
    </div>
  );
}

export default Dummy;
