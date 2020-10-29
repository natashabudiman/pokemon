import * as actions from "stores/actionTypes";

export const startLoading = () => ({
  type: actions.APPLICATION_LOADING_START,
});

export const stopLoading = () => ({
  type: actions.APPLICATION_LOADING_END,
});

export const setBottomNav = (id) => ({
  type: actions.SET_BOTTOM_NAV_ACTIVE,
  id,
});

export function setLoadingState(state) {
  return (dispatch) => {
    if (state) {
      dispatch(startLoading());
    } else {
      dispatch(stopLoading());
    }
  };
}

export function setBottomActiveMenu(id) {
  return (dispatch) => {
    dispatch(setBottomNav(id));
  };
}
