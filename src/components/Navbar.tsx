import React, { useState, useRef, useEffect } from "react";
import '../styles/components/navbar.css';
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setActivePage } from "../store/slices/activePageSlice";
import { logout } from "../store/slices/authenticationSlice";
import Cookies from "js-cookie";

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const activePage = useAppSelector(state => state.activePage);
  const { isAuthenticated, user } = useAppSelector((state) => state.authentication);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleNav = (pageName: string) => {
    dispatch(setActivePage({ key: "In", value: false }));
    dispatch(setActivePage({ key: "Name", value: pageName }));

    setTimeout(() => {
      dispatch(setActivePage({ key: "In", value: true }));
    }, 500);
  };

  const handleLogout = () => {
    Cookies.remove('spotify_user');
    Cookies.remove('spotify_access_token');
    dispatch(logout());
  };

  const avatarUrl = user?.images?.[0]?.url;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getGreeting = () => {
    const timestamp = new Date();  
    const hour = timestamp.getHours(); 

    switch (true) {
        case (hour >= 5 && hour < 12):
            return "Good Morning";
        case (hour >= 12 && hour < 17):
            return "Good Afternoon";
        case (hour >= 17 && hour < 21):
            return "Good Evening";
        default:
            return "Good Night";
    }
};

  return (
    <div className='app-flex app-row app-jc-between app-bg-black navbar app-p1'>
      <div className='app-flex app-col app-jc-start app-font-primary app-jc-center logo'>
        Setlistify
      </div>

      {isAuthenticated ? (
        <div className='app-flex app-row app-ai-center app-jc-end' ref={dropdownRef}>
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt="User avatar"
              className="navbar-avatar"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                objectFit: 'cover',
                cursor: 'pointer',
              }}
              onClick={() => setDropdownOpen(prev => !prev)}
            />
          )}

          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '60px',
                right: '1rem',
                background: 'white',
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                zIndex: 100,
              }}
            >
              <div className="app-v-m1">{getGreeting()}, {user?.display_name}</div>
              <button
                onClick={handleLogout}
                className="app-button logout-button app-font-white"
                style={{ width: '100%' }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          className='app-flex app-col app-ai-end app-jc-center app-button app-bg-white'
          onClick={() =>
            activePage.Name !== 'Auth' ? handleNav("Auth") : handleNav("Search")
          }
        >
          {activePage.Name !== 'Auth' ? 'Login' : 'Back to Search'}
        </div>
      )}
    </div>
  );
};

export default Navbar;
