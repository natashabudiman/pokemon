import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_POKEAPI_URL;

export default axios;
