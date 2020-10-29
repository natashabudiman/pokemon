import * as actions from "stores/actionTypes";

const initState = {
  isLoading: false,
  activeMenu: 1,
};

const stateIndex = (state = initState, action) => {
  switch (action.type) {
    case actions.APPLICATION_LOADING_START:
      return {
        ...state,
        isLoading: true,
      };
    case actions.APPLICATION_LOADING_END:
      return {
        ...state,
        isLoading: false,
      };
    case actions.SET_BOTTOM_NAV_ACTIVE:
      return {
        ...state,
        activeMenu: action.id,
        isLoading: false,
      };
    default:
      return state;
  }
};
export default stateIndex;
