/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { putData, retrieveData } from "@/funcs/api";
import { Pokemon } from "@/types/Pokemon";
import { Vortex } from 'react-loader-spinner';
import PokeCard from "../Cards/PokeCard";

const PrimaryButtonStyle = "self-end px-6 py-2 bg-slate-800 hover:bg-red-600 focus:bg-red-400 cursor-pointer rounded-md text-white mt-4 transition-colors";

const Capture = ({ children }: any) => {
    const navigate = useNavigate();
    const [toCatch, setToCatch] = useState<Pokemon[]>([]);
    const [numToCatch, setNumToCatch] = useState<number[]>([]);
    const [caught, setCaught] = useState<boolean>(false);
    const [isCatching, setIsCatching] = useState<boolean>(false);
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
        return <div className="flex justify-center items-center h-screen"><Vortex
            visible={true}
            height="80"
            width="80"
            ariaLabel="vortex-loading"
            wrapperStyle={{}}
            wrapperClass="vortex-wrapper"
            colors={['red', 'red', 'black', 'black', 'gray', 'gray']}
        /> </div>
    }

    const handleCatch = async (pokemon_id: number) => {
        if (isCatching) return;
        setIsCatching(true);
        try {
            const response = await putData("/capture", {
                pokemon_id,
                lista_pokemon_to_catch: numToCatch,
            });
            setCaught(response.success);
        } catch {
            console.error("Error al capturar el Pokémon");
        } finally {
            setIsCatching(false);
        }
    };

    return (
        <div className="bg-bgCaptureScreen bg-cover min-h-screen flex flex-col items-center justify-center p-4">
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

            {caught && (
                <div className="text-center text-black text-lg mt-4">
                    ¡Has capturado el pokemon!
                </div>
            )}

            {children}

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
