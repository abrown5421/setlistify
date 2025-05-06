import React, { ReactNode } from 'react';
import { closeDrawer } from '../store/slices/drawerSlice';
import '../styles/components/drawer.css';
import { useAppDispatch, useAppSelector } from '../store/hooks';

interface DrawerProps {
  children: ReactNode;
}

const Drawer: React.FC<DrawerProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.drawer.isOpen);

  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={() => dispatch(closeDrawer())}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <button className="drawer-close" onClick={() => dispatch(closeDrawer())}>
          &times;
        </button>
        <div className="drawer-content">{children}</div>
      </div>
    </div>
  );
};

export default Drawer;
