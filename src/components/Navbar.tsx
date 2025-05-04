import React from "react";
import '../styles/components/navbar.css';

const Navbar: React.FC = () => {
  return (
    <div className='app-flex app-row app-jc-between app-w-vw-100 navbar'>
        <div className='app-flex app-col app-jc-start app-font-primary app-jc-center logo'>
            Setlistify
        </div>
        <div className='app-flex app-col app-ai-end app-jc-center app-button app-bg-white'>
            login button
        </div>
    </div>
  )
};

export default Navbar;
