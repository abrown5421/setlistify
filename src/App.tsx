import { useEffect } from "react";
import Navbar from "./components/Navbar";
import AnimatedContainer from "./containers/AnimatedContainer";
import SearchPage from "./pages/SearchPage";
import AuthPage from "./pages/AuthPage";
import { useAppSelector, useAppDispatch } from "./store/hooks";
import { setUser, setToken } from "./store/slices/authenticationSlice";
import Cookies from "js-cookie";
import axios from "axios";

function App() {
  const dispatch = useAppDispatch();
  const activePage = useAppSelector((state) => state.activePage);
  const authentication = useAppSelector((state) => state.authentication);

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
    console.log(authentication);
  }, [authentication]);

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
      Cookies.set('spotify_access_token', accessToken, { expires: 7 });
      dispatch(setToken(accessToken));
      fetchUserProfile(accessToken);
      window.location.hash = '';
    } else {
      const storedToken = Cookies.get('spotify_access_token');
      const storedUser = Cookies.get('spotify_user');

      if (storedToken) {
        dispatch(setToken(storedToken));
        if (storedUser) {
          try {
            dispatch(setUser(JSON.parse(storedUser)));
          } catch {
            console.warn("Failed to parse stored user data");
          }
        } else {
          fetchUserProfile(storedToken);
        }
      }
    }
  }, [dispatch]);

  return (
    <div className="app-flex app-col app-h-vw-100 app-bg-black">
      <Navbar />
      <AnimatedContainer entry="animate__fadeInUpBig" exit="animate__fadeOutDownBig" isEntering={activePage.In && activePage.Name === 'Auth'}>
        <AuthPage />
      </AnimatedContainer>
      <AnimatedContainer isEntering={activePage.In && activePage.Name === 'Search'}>
        <SearchPage />
      </AnimatedContainer>
    </div>
  );
}

export default App;
