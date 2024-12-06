/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { putData, retrieveData } from "@/funcs/api";
import { Pokemon } from "@/types/Pokemon";
import PokeCard from "../Cards/PokeCard";

const PrimaryButtonStyle = "self-end px-6 py-2 bg-slate-800 hover:bg-red-600 focus:bg-red-400 cursor-pointer rounded-md text-white mt-4 transition-colors";

const Capture = ({ children }: any) => {
    const navigate = useNavigate();
    const [toCatch, setToCatch] = useState<Pokemon[]>([]);
    const [numToCatch, setNumToCatch] = useState<number[]>([]);
    const [caught, setCaught] = useState<boolean>(false);

    useEffect(() => {
        const getData = async () => {
            try {
                const { pokemones_to_catch, lista_pokemon_to_catch } =
                    await retrieveData("/capture");

                // Convierte los pokemones a instancias de la clase Pokemon
                const pokemonList = pokemones_to_catch.map(
                    (pokemon: Pokemon) => new Pokemon(pokemon)
                );
                setToCatch(pokemonList);
                setNumToCatch(lista_pokemon_to_catch);
            } catch (error) {
                console.error(error);
                navigate("/login");
            }
        };
        getData();
    }, [navigate]);

    if (toCatch.length === 0) {
        return <div>No hay pokemones para capturar</div>;
    }

    const handleCatch = async (pokemon_id: number) => {
        try {
            const response = await putData("/capture", {
                pokemon_id: pokemon_id,
                lista_pokemon_to_catch: numToCatch,
            });
            setCaught(response.success);
        } catch {
            console.error("Error al capturar el pokemon");
        }
    };

    return (
        <div className="bg-slate-100 min-h-screen flex flex-col items-center justify-center p-4">
            <h2 className="text-center text-xl font-bold mb-4">
                Bienvenido a tu Equipo Pokémon
            </h2>
            {/* Contenedor de los Pokémon */}
            <div className="grid grid-items-center sm:grid-cols-2 md:grid-cols-3 lg:grid gap-6 w-full max-w-screen-lg">
                {!caught &&
                    toCatch.map((pokemon, index) => (
                        <button
                            key={index}
                            className="flex justify-center items-center"
                            onClick={(event: any) => {
                                event.preventDefault();
                                handleCatch(pokemon.pokedex_number);
                            }}
                        >
                            <PokeCard pokemon={pokemon} />
                        </button>
                    ))}
            </div>

            {/* Mensaje cuando todos están capturados */}
            {caught && (
                <div className="text-center text-green-600 text-lg mt-4">
                    ¡Has capturado todos los pokemones del día!
                </div>
            )}

            {children}

            {/* Botón para volver al Home */}
            <div className="mt-6">
                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className={PrimaryButtonStyle}
                >
                    Home
                </button>
            </div>
        </div>
    );

};

export default Capture;
