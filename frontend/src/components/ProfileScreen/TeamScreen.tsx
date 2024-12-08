import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { retrieveData } from '@/funcs/api';
import { Pokemon } from '@/types/Pokemon';
import { Vortex } from "react-loader-spinner";

const TeamScreen = () => {
    const navigate = useNavigate();

    const [pokemon, setPokemon] = useState<Pokemon | undefined>();
    const [team, setTeam] = useState<number[]>([]);
    const [current, setCurrent] = useState(0);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const getTrainerData = async () => {
            try {
                const { trainer } = await retrieveData("/trainer");

                setTeam(trainer.pokemon_team)
            } catch (error) {
                console.error(error);
                navigate("/login");
            }
        };
        getTrainerData();
    }, [navigate]);


    // Cargar datos del Pokémon actual
    useEffect(() => {
        setIsLoading(true)
        if (!team || team.length === 0) return;
        const getPokemon = async () => {
            try {
                const response = await retrieveData(`/pokemon/${team[current]}`);
                setPokemon(new Pokemon(response));
                setIsLoading(false)
            } catch (error) {
                console.error("Error al cargar el equipo Pokémon:", error);
            }
        };

        getPokemon();
    }, [current, team]);

    // Renderizar cuando no hay datos aún
    if (!team || team.length === 0) return <div>No hay equipo Pokémon disponible.</div>;
    if (!pokemon) return <div>Cargando Pokémon...</div>;

    const handleNext = () => {
        setCurrent((prevState) => {
            if (prevState < team.length) {
                return prevState + 1;
            }
            return prevState;
        });
    }
    const handlePrevious = () => {
        setCurrent((prevState) => {
            if (prevState > 0) {
                return prevState - 1;
            }
            return prevState;
        });
    }



    return (
        <>
            <button
                type="button"
                onClick={() => navigate("/profilescreen")}
                className="absolute top-4 left-4 bg-white text-black py-2 px-4 rounded-lg shadow hover:bg-red-600"
            >
                Profile
            </button>

            <div className="flex bg-bgPokemonTeam bg-cover h-screen items-center justify-center">
                <div className="relative flex flex-col items-center w-[90%] max-w-4xl bg-white p-4 rounded-xl shadow-lg bg-gradient-to-b from-indigo-500 to-cyan-300">
                    {isLoading ? <div className="flex justify-center items-center">
                        <Vortex
                            visible={true}
                            height="80"
                            width="80"
                            ariaLabel="vortex-loading"
                            wrapperStyle={{}}
                            wrapperClass="vortex-wrapper"
                            colors={["cyan", "indigo", "cyan", "indigo", "cyan", "indigo"]}
                        />
                    </div> : <>
                        {/* Pokémon Name */}
                        <h1 className="text-3xl font-bold text-black capitalize mb-4 text-center">
                            {pokemon.name}
                        </h1>

                        {/* Index */}
                        <div className="absolute top-4 left-4 bg-gray-100 p-2 rounded-lg shadow-md">
                            <p className="text-lg font-semibold text-black">
                                Index: <span className="font-bold">{current}</span>
                            </p>
                        </div>

                        {/* Pokedex Number */}
                        <div className="absolute top-4 right-4 bg-gray-100 p-2 rounded-lg shadow-md">
                            <p className="text-lg font-semibold text-black">
                                Pokedex Number: <span className="font-bold">{pokemon.pokedex_number}</span>
                            </p>
                        </div>

                        {/* Pokémon Image */}
                        <div className="relative flex items-center justify-center w-full h-48 bg-gray-100 rounded-lg shadow-md mb-4">
                            <button
                                type="button"
                                disabled={current <= 0}
                                onClick={handlePrevious}
                                className={"absolute left-2 p-3 text-white rounded-2xl shadow focus:outline-none " + (current > 0 ? "hover:bg-gray-800 bg-black " : "bg-red-500")}
                            >
                                ◀
                            </button>
                            <img
                                src={pokemon.image}
                                alt={pokemon.name}
                                className="w-44 h-44 object-contain"
                            />
                            <button
                                disabled={current >= team.length - 1}
                                onClick={handleNext}
                                className={"absolute right-2 p-3 text-white rounded-2xl shadow focus:outline-none " + (current < team.length - 1 ? "hover:bg-gray-800 bg-black " : "bg-red-500")}
                            >
                                ▶
                            </button>
                        </div>

                        {/* Classification */}
                        <div className="text-center bg-gray-100 p-2 rounded-lg shadow-md mb-4 w-full">
                            <p className="text-lg font-semibold text-black">Classification</p>
                            <p className="font-bold">{pokemon.classification}</p>
                        </div>

                        {/*  */}
                        <div className="flex justify-between w-full mb-4">
                            <div className="text-center bg-gray-100 p-2 rounded-lg shadow-md w-1/4">
                                <p className="text-lg font-semibold text-black">Height</p>
                                <p className="font-bold">{pokemon.height_m} m</p>
                            </div>
                            <div className="text-center bg-gray-100 p-2 rounded-lg shadow-md w-1/4">
                                <p className="text-lg font-semibold text-black">Type 1</p>
                                <p className="font-bold">{pokemon.type1}</p>
                            </div>

                        </div>

                        {/* Type 1 and Type 2 */}
                        <div className="flex justify-between w-full">
                            <div className="text-center bg-gray-100 p-2 rounded-lg shadow-md w-1/4">
                                <p className="text-lg font-semibold text-black">Weight</p>
                                <p className="font-bold">{pokemon.weight_kg} kg</p>
                            </div>
                            <div className="text-center bg-gray-100 p-2 rounded-lg shadow-md w-1/4">
                                <p className="text-lg font-semibold text-black">Type 2</p>
                                <p className="font-bold">{pokemon.type2 || "N/A"}</p>
                            </div>
                        </div> </>}
                </div>
            </div>
        </>


    );
};

export default TeamScreen;