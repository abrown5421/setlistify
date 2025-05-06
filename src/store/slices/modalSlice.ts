import { createSlice } from '@reduxjs/toolkit';
import { ModalState } from '../../types/globalTypes';

const initialState: ModalState = {
  isOpen: false,
  modalContent: null,
};

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
      openModal: (state) => {
        state.isOpen = true;
      },
      closeModal: (state) => {
        state.isOpen = false;
        state.modalContent = null; 
      },
      setModalContent: (state, action) => {
        state.modalContent = action.payload;
      },
    },
  });

export const { openModal, closeModal, setModalContent } = modalSlice.actions;
export default modalSlice.reducer;
