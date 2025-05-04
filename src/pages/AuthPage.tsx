import React from "react";
import '../styles/pages/auth-page.css';
import logo from '../assets/images/spotify-logo.png';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = window.location.origin;
const AUTH_ENDPOINT = import.meta.env.VITE_SPOTIFY_AUTH_ENDPOINT;
const RESPONSE_TYPE = import.meta.env.VITE_SPOTIFY_RESPONSE_TYPE;
const SCOPES = [
  'user-read-private',
  'user-read-email'
];

const AuthPage: React.FC = () => {

  const handleLogin = () => {
    const scopes = SCOPES.join('%20');
    window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${scopes}`;
  };

  return (
    <div className='app-flex app-col app-jc-center app-ai-center auth-page'>
      <div className="app-flex app-col app-jc-between app-ai-center inner-auth app-bg-white app-p2">
        <img src={logo} width="50%" className="app-v-m1" />
        <button onClick={handleLogin} className="app-button app-bg-black app-font-white">
          Login with Spotify
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
