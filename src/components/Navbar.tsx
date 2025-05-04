import React from "react";
import '../styles/components/navbar.css';
import { useAppDispatch } from "../store/hooks";
import { setActivePage } from "../store/slices/activePageSlice";

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleNav = (pageName: string) => {
    dispatch(setActivePage({ key: "In", value: false }));
    dispatch(setActivePage({ key: "Name", value: pageName }));

    setTimeout(() => {
      dispatch(setActivePage({ key: "In", value: true }));
    }, 500);
  }

  return (
    <div className='app-flex app-row app-jc-between navbar app-p1'>
        <div className='app-flex app-col app-jc-start app-font-primary app-jc-center logo'>
            Setlistify
        </div>
        <div className='app-flex app-col app-ai-end app-jc-center app-button app-bg-white' onClick={() => handleNav("Auth")}>
            login button
        </div>
    </div>
  )
};

export default Navbar;
