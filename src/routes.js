import Pokemon from "views/pokemon";
import PokemonDetails from "views/pokemonDetails";
import MyPokemon from "views/myPokemon";

var routes = [
  {
    path: "/pokemon",
    name: "Pokemon",
    component: Pokemon,
    layout: "/home",
  },
  {
    path: "/pokemon-dets",
    name: "Pokemon Details",
    component: PokemonDetails,
    layout: "/home",
  },
  {
    path: "/my-pokemon",
    name: "My Pokemon List",
    component: MyPokemon,
    layout: "/home",
  },
];
export default routes;
