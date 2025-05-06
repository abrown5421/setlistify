import { useEffect } from "react";
import Navbar from "./components/Navbar";
import AnimatedContainer from "./containers/AnimatedContainer";
import SearchPage from "./pages/SearchPage";
import AuthPage from "./pages/AuthPage";
import { useAppSelector, useAppDispatch } from "./store/hooks";
import { setUser, setToken } from "./store/slices/authenticationSlice";
import Cookies from "js-cookie";
import axios from "axios";
import ViewportTracker from './providers/ViewportProvider';  
import ResultsPage from "./pages/ResultsPage";
import Modal from "./components/Modal";

function App() {
  const dispatch = useAppDispatch();
  const activePage = useAppSelector((state) => state.activePage);
  const notification = useAppSelector((state) => state.notification);
  const modal = useAppSelector((state) => state.modal);

  useEffect(() => {
    const storedUser = Cookies.get('spotify_user');
    const storedToken = Cookies.get('spotify_access_token');

    if (storedUser && storedToken) {
      try {
        dispatch(setUser(JSON.parse(storedUser)));
        dispatch(setToken(storedToken));
      } catch (error) {
        console.error("Failed to parse user data from cookie:", error);
      }
    }
  }, [dispatch]);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');

    const fetchUserProfile = async (token: string) => {
      try {
        const response = await axios.get('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(setUser(response.data));
        Cookies.set('spotify_user', JSON.stringify(response.data), { expires: 7 });
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    const exchangeCodeForToken = async (authCode: string) => {
      const verifier = localStorage.getItem('pkce_code_verifier');
      if (!verifier) return console.error("Missing PKCE verifier.");

      try {
        const body = new URLSearchParams({
          client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
          grant_type: 'authorization_code',
          code: authCode,
          redirect_uri: window.location.origin,
          code_verifier: verifier,
        });

        const response = await axios.post('https://accounts.spotify.com/api/token', body.toString(), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });

        const { access_token, expires_in, refresh_token } = response.data;
        const expiresAt = Date.now() + expires_in * 1000;
        const cookieExpiryDays = expires_in / 86400; 

        Cookies.set('spotify_access_token', access_token, { expires: cookieExpiryDays });
        Cookies.set('spotify_token_expires_at', expiresAt.toString(), { expires: cookieExpiryDays });
        if (refresh_token) Cookies.set('spotify_refresh_token', refresh_token, { expires: 7 });

        dispatch(setToken(access_token));
        fetchUserProfile(access_token);

        window.history.replaceState({}, document.title, '/');
      } catch (error) {
        console.error("Token exchange failed:", error);
      }
    };

    const refreshAccessToken = async () => {
      const refresh_token = Cookies.get('spotify_refresh_token');
      if (!refresh_token) return;

      try {
        const body = new URLSearchParams({
          client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
          grant_type: 'refresh_token',
          refresh_token,
        });

        const response = await axios.post('https://accounts.spotify.com/api/token', body.toString(), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });

        const { access_token, expires_in } = response.data;
        const expiresAt = Date.now() + expires_in * 1000;
        const cookieExpiryDays = expires_in / 86400; 

        Cookies.set('spotify_access_token', access_token, { expires: cookieExpiryDays });
        Cookies.set('spotify_token_expires_at', expiresAt.toString(), { expires: cookieExpiryDays });

        dispatch(setToken(access_token));
      } catch (error) {
        console.error("Token refresh failed:", error);
      }
    };

    if (code) {
      exchangeCodeForToken(code);
    } else {
      const storedToken = Cookies.get('spotify_access_token');
      const tokenExpiresAt = Cookies.get('spotify_token_expires_at');

      if (storedToken && tokenExpiresAt) {
        if (parseInt(tokenExpiresAt) > Date.now()) {
          dispatch(setToken(storedToken));
          const storedUser = Cookies.get('spotify_user');
          if (storedUser) {
            dispatch(setUser(JSON.parse(storedUser)));
          } else {
            fetchUserProfile(storedToken);
          }
        } else {
          refreshAccessToken(); 
        }
      } else {
        Cookies.remove('spotify_access_token');
        Cookies.remove('spotify_token_expires_at');
        Cookies.remove('spotify_user');
      }
    }
  }, [dispatch]);

  return (
    <ViewportTracker>
      <div className="app-flex app-col app-bg-black app-relative">
        <Navbar />
        <AnimatedContainer entry="animate__fadeInUpBig" exit="animate__fadeOutDownBig" isEntering={activePage.In && activePage.Name === 'Auth'}>
          <AuthPage />
        </AnimatedContainer>
        <AnimatedContainer isEntering={activePage.In && activePage.Name === 'Search'}>
          <SearchPage />
        </AnimatedContainer>
        <AnimatedContainer isEntering={activePage.In && activePage.Name === 'Results'}>
          <ResultsPage />
        </AnimatedContainer>
        <AnimatedContainer entry="animate__fadeInRight" exit="animate__fadeOutRight" isEntering={notification.open}>
          <div className={notification.severity === 'error' ? "notification notif-error app-absolute" : "notification notif-success app-absolute"}>
            {notification.message}
          </div>
        </AnimatedContainer>
        <Modal>
          {modal.modalContent}
        </Modal>
      </div>
    </ViewportTracker>
  );
}

export default App;
