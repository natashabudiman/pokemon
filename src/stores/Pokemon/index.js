import * as actions from "stores/actionTypes";

const initState = {
  list: [],
  total: 0,
  data: null,
  ownedList: [],
  owned: null,
  isSuccess: true,
  errMessage: null,
  message: null,
};

const stateIndex = (state = initState, action) => {
  switch (action.type) {
    case actions.POKEMON_LIST_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        list: action.list,
        total: action.total,
        message: null,
        errMessage: null,
      };
    case actions.POKEMON_GET_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        data: action.data,
        errMessage: null,
      };
    case actions.POKEMON_SET_MY_LIST:
      return {
        ...state,
        isSuccess: true,
        ownedList: action.list,
        owned: action.owned,
        message: action.message,
        errMessage: null,
      };
    case actions.POKEMON_ACTION_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        message: action.message,
        errMessage: null,
      };
    case actions.POKEMON_ERROR:
      return {
        ...state,
        isSuccess: false,
        message: null,
        errMessage: action.error,
      };
    case actions.POKEMON_CLEAR_DATA:
      return {
        ...state,
        errMessage: null,
        message: null,
        data: null,
      };
    case actions.POKEMON_CLEAR_STATE:
      return initState;
    default:
      return state;
  }
};
export default stateIndex;
