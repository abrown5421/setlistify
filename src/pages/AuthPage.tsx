import React from "react";
import '../styles/pages/auth-page.css';
import logo from '../../public/assets/images/spotify-logo.png';
import { useAppSelector } from "../store/hooks";
import pkceChallenge from "pkce-challenge";

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = window.location.origin;
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const SCOPES = [
  'user-read-private',
  'user-read-email'
];

const AuthPage: React.FC = () => {
  const viewport = useAppSelector(state => state.viewport);

  const handleLogin = async () => {
    const { code_challenge, code_verifier } = await pkceChallenge();
  
    localStorage.setItem('pkce_code_verifier', code_verifier);
  
    const scopes = SCOPES.join('%20');
    const authUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&code_challenge_method=S256&code_challenge=${code_challenge}&scope=${scopes}`;
  
    window.location.href = authUrl;
  };

  return (
    <div className='app-flex app-col app-jc-center app-ai-center auth-page'>
      <div className="app-flex app-col app-jc-between app-ai-center inner-auth app-bg-white app-p2">
        <img src={logo} width={viewport.type === 'mobile' ? "90%" : "50%"} className="app-v-m1" />
        <button onClick={handleLogin} className="app-button app-bg-black app-font-white">
          Login with Spotify
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
