

/**
 * @return {void}
 */

/*
export default function AllMovies() {
  const [service, setService] = useState([]);
  useEffect(() => {
    const item = localStorage.getItem('user');
    if (!item) {
      return;
    }
    const user = JSON.parse(item);
    const bearerToken = user ? user.accessToken : '';
    fetch('http://localhost:3010/v0/streamingServices', {
      method: 'GET',
      headers: new Headers({
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      }),
    })
      .then((res) => {
        if (!res.ok) throw res;
        setService(res);
        return res.json();
      })
      .then((json) => {
        console.log(json);
        console.log('test');
      })
      .catch((error) => {
        console.log(error);
        // setError(`${error.status} - ${error.statusText}`);
      });
  }, []);
  return (
    <h1>All Movies</h1>
  );
}

*/
