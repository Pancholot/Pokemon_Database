import { useEffect } from "react";
import {
  PokeCardStyle,
  PokeCardTitleStyle,
  PokeCardImageStyle,
  PokeCardImageInnerStyle,
  PokeCardStatementStyle,
  PokeCardCenterStyle,
} from "./classNameStyleCard";

import { Pokemon } from "@/types/Pokemon";
const PokeCard = function ({ pokemon }: { pokemon: Pokemon }) {
  const { pokedex_number, name, image, classification, attack } = pokemon;

  useEffect(() => {
    console.log(image)
  }, [])

  return pokemon ? (
    <div className={PokeCardStyle}>
      <h1 className={PokeCardTitleStyle}>
        Pokedex Number: {pokedex_number} - {name}
      </h1>
      <h3 className={PokeCardStatementStyle}>
        Classification: {classification}
      </h3>
      <h3 className={PokeCardStatementStyle}>Attack: {attack}</h3>
      <div className={PokeCardCenterStyle}>
        <div className={PokeCardImageStyle}>
          <img
            className={PokeCardImageInnerStyle}
            width="100px"
            height="100px"
            src={image}
          />
        </div>
      </div>
      <div></div>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default PokeCard;
