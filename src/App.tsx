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

function App() {
  const dispatch = useAppDispatch();
  const activePage = useAppSelector((state) => state.activePage);
  const notification = useAppSelector((state) => state.notification);

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
    const hash = window.location.hash;
    const accessToken = new URLSearchParams(hash.replace('#', '')).get('access_token');

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

    if (accessToken) {
      const expiresAt = Date.now() + 3600 * 1000;
      Cookies.set('spotify_access_token', accessToken, { expires: 1/24 }); 
      Cookies.set('spotify_token_expires_at', expiresAt.toString(), { expires: 1/24 });
      dispatch(setToken(accessToken));
      fetchUserProfile(accessToken);
      window.location.hash = '';
    } else {
      const storedToken = Cookies.get('spotify_access_token');
      const tokenExpiresAt = Cookies.get('spotify_token_expires_at');

      if (storedToken && tokenExpiresAt && parseInt(tokenExpiresAt) > Date.now()) {
        dispatch(setToken(storedToken));
        const storedUser = Cookies.get('spotify_user');
        if (storedUser) {
          dispatch(setUser(JSON.parse(storedUser)));
        } else {
          fetchUserProfile(storedToken);
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
      </div>
    </ViewportTracker>
  );
}

export default App;
