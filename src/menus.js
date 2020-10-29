import React from "react";
import { List, Person } from "@material-ui/icons";

var menus = [
  {
    id: 1,
    path: "/home/pokemon",
    name: "pokemonList",
    icon: <List />,
  },
  {
    id: 2,
    path: "/home/my-pokemon",
    name: "myPokemonList",
    icon: <Person />,
  },
];
export default menus;
