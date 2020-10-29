import * as actions from "../actionTypes";
import axios from "../../plugins/axios";
import { startLoading, stopLoading } from "stores/Application/actions";

export const setPokemonList = (list, total) => ({
  type: actions.POKEMON_LIST_SUCCESS,
  list,
  total,
});

export const setPokemon = (data) => ({
  type: actions.POKEMON_GET_SUCCESS,
  data,
});

export const setActionSuccess = (message) => ({
  type: actions.POKEMON_ACTION_SUCCESS,
  message,
});

export const setMyPokemonList = (list, owned, message) => ({
  type: actions.POKEMON_SET_MY_LIST,
  list,
  owned,
  message,
});

export const setErrorMessage = (error) => ({
  type: actions.POKEMON_ERROR,
  error,
});

export const clearData = () => ({
  type: actions.POKEMON_CLEAR_DATA,
});

export const clearState = () => ({
  type: actions.POKEMON_CLEAR_STATE,
});

export function getPokemonList(limit, offset) {
  return (dispatch, getState) => {
    dispatch(startLoading());
    dispatch(clearData());
    return new Promise((resolve, reject) => {
      let url = "/pokemon?limit=" + limit + "&offset=" + offset;
      axios.get(url).then(
        (response) => {
          let list = response.data.results;
          if (offset > 0) {
            let current = getState().Pokemon.list;
            list = [...current, ...response.data.results];
          }
          dispatch(setPokemonList(list, response.data.count));
          dispatch(stopLoading());
          resolve(response.data);
        },
        (error) => {
          dispatch(setErrorMessage(error.toString()));
          dispatch(stopLoading());
          reject(error);
        }
      );
    });
  };
}

export function getPokemon(id) {
  return (dispatch) => {
    dispatch(startLoading());
    return new Promise((resolve, reject) => {
      let url = "/pokemon/" + id;

      axios.get(url).then(
        (response) => {
          dispatch(setPokemon(response.data));
          dispatch(stopLoading());
          resolve(response.data);
        },
        (error) => {
          dispatch(setErrorMessage(error.toString()));
          dispatch(stopLoading());
          reject(error);
        }
      );
    });
  };
}

export function updateMyPokemonList(list, owned, message) {
  return (dispatch) => {
    dispatch(setMyPokemonList(list, owned, message));
  };
}
