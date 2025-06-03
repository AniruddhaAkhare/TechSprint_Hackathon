import * as actionTypes from './types';

export const initialState = {
  create: { isOpen: false },
  update: { isOpen: false },
  read: { isOpen: false },
  recordPayment: { isOpen: false },
  deleteModal: { isOpen: false },
  dataTableList: { isOpen: true },
  last: null,
};

export function contextReducer(state, action) {
  const { keyState = null, type } = action;

  switch (type) {
    case actionTypes.OPEN_MODAL:
      return {
        ...state,
        deleteModal: { isOpen: true },
      };

    case actionTypes.CLOSE_MODAL:
      return {
        ...state,
        deleteModal: { isOpen: false },
      };

    case actionTypes.OPEN_PANEL:
      if (!keyState || !state[keyState]) {
        return state; // Prevent errors if keyState is invalid
      }
      return {
        ...initialState,
        dataTableList: { isOpen: false },
        [keyState]: { isOpen: true },
      };

    case actionTypes.CLOSE_PANEL:
      return { ...initialState };

    default:
      return state;
  }
}
