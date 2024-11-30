/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { putData, retrieveData } from "@/funcs/api";
import { Pokemon } from "@/types/Pokemon";
import { Trainer } from "@/types/Trainer";
import PokeCard from "../Cards/PokeCard";

const Home = ({ children }: any) => {
  const navigate = useNavigate();
  const [trainerData, setTrainerData] = useState<Trainer | null>(null);
  const [toCatch, setToCatch] = useState<Pokemon[]>([]);
  const [numToCatch, setNumToCatch] = useState<number[]>([]);
  const [caught, setCaught] = useState<boolean>(false);

  /*SI NO ESTÁS INICIADO SESIÓN, TE MANDA A INICIAR SESIÓN XD */
  useEffect(() => {
    const getData = async () => {
      try {
        const { trainer } = await retrieveData("/trainer");
        const { pokemones_to_catch, lista_pokemon_to_catch } =
          await retrieveData("/capture");

        // Convierte los pokemones a instancias de la clase Pokemon
        const pokemonList = pokemones_to_catch.map(
          (pokemon: Pokemon) => new Pokemon(pokemon)
        );
        setToCatch(pokemonList);
        setNumToCatch(lista_pokemon_to_catch);
        setTrainerData(trainer);
      } catch (error) {
        console.error(error);
        navigate("/login");
      }
    };
    getData();
  }, [navigate]);

  if (!trainerData) {
    return <div>NO ESTÁS INICIADO SESIÓN</div>;
  }
  if (toCatch.length === 0) {
    return <div>No hay pokemones para capturar</div>;
  }

  const handleCatch = async (pokedex_number: number) => {
    try {
      const response = await putData("/capture", {
        pokemon_id: pokedex_number,
        lista_pokemon_to_catch: numToCatch,
      });
      console.log(response);
      setCaught(response.success);
    } catch {
      console.error("Error al capturar el pokemon");
    }
  };

  const { name, pokemon_team } = trainerData;
  console.log(pokemon_team);

  return (
    <div className="space-x-7 justify-evenly">
      <h2>Hola, {name}</h2>
      {caught ? (
        <div>¡Has capturado todos los pokemones!</div>
      ) : (
        <div>¡Ha capturar todos los pokemones!</div>
      )}
      {!caught &&
        toCatch.map((pokemon, index) => {
          return (
            <button
              key={index}
              onClick={(event: any) => {
                event.preventDefault();
                handleCatch(pokemon.pokedex_number);
              }}
            >
              <PokeCard pokemon={pokemon} />
            </button>
          );
        })}

      {children}
    </div>
  );
};

export default Home;
