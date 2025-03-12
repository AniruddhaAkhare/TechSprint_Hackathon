import * as actionTypes from './types';

const contextActions = (dispatch) => {
  return {
    modal: {
      open: () => {
        dispatch({ type: actionTypes.OPEN_MODAL });
      },
      close: () => {
        dispatch({ type: actionTypes.CLOSE_MODAL });
      },
    },
    panel: {
      open: (panelType) => {
        dispatch({ type: actionTypes.OPEN_PANEL, panelType });
      },
      close: () => {
        dispatch({ type: actionTypes.CLOSE_PANEL });
      },
    },
  };
};

export default contextActions;
