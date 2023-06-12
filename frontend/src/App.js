import React from 'react';
import {Route, HashRouter, Routes} from 'react-router-dom';
import './styles.css';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import StreamingServices from './components/StreamingServices';
import InitialMoviePreferences from './components/InitialMoviePreferences';
import PrivateRoute from './components/PrivateRoute';
import Film from './components/Film';
import Settings from './components/Settings';
import WrongPage from './components/WrongPage';
/**
 * Simple component with no state.
 *
 * @return {object} JSX
 */
function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/dashboard" element={
          <Dashboard/>
        }/>

        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/logout" element={<Login/>}/>

        <Route path="/movie/:movie" element={
          <Film/>
        }/>

        <Route path="/profile" element={
          <PrivateRoute><Profile/></PrivateRoute>
        }/>
        <Route path="/settings" element={
          <PrivateRoute><Settings/></PrivateRoute>
        }/>

        <Route path="/onboarding/streamingservices" element={
          <PrivateRoute><StreamingServices/></PrivateRoute>
        }/>

        <Route path="/onboarding/initialmoviepreferences" element={
          <PrivateRoute><InitialMoviePreferences/></PrivateRoute>
        }/>

        <Route path="/" element={
          <Dashboard/>
        }/>


        <Route path="*" element={
          <PrivateRoute><WrongPage/></PrivateRoute>
        }/>
      </Routes>
    </HashRouter>
  );
}
export default App;
