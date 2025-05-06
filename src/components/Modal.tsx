import React, { ReactNode, useEffect, useState } from 'react';
import { closeModal } from '../store/slices/modalSlice';
import '../styles/components/modal.css';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import AnimatedContainer from '../containers/AnimatedContainer';

interface ModalProps {
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.modal.isOpen);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!visible && !isOpen) return null;

  return (
    <div
      className={`modal-overlay ${isOpen ? 'open' : ''}`}
      onClick={() => dispatch(closeModal())}
    >
        <AnimatedContainer className="app-w-percent-100 app-flex app-jc-center" entry="animate__fadeInUpBig" exit="animate__fadeOutDownBig" isEntering={isOpen}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={() => dispatch(closeModal())}>
                &times;
                </button>
                <div className="modal-content">{children}</div>
            </div>
        </AnimatedContainer>
    </div>
  );
};

export default Modal;
