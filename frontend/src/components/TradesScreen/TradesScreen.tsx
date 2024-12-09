import React, { useEffect, useState } from "react";
import { PrimaryButtonStyle } from "../LoginScreen/classnameStyles";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { putData, retrieveData } from "@/funcs/api";
import { Vortex } from 'react-loader-spinner';
import { Pokemon } from "@/types/Pokemon";

const TradesScreen = () => {
    const [searchParams] = useSearchParams();
    const friendId = searchParams.get("friend_id");
    const navigate = useNavigate();
    const [friendTeam, setfriendTeam] = useState<number[] | null>(null)
    const [team, setTeam] = useState<number[] | null>(null)
    const [ownPokemon, setOwnPokemon] = useState<Pokemon[] | null>(null)
    const [theyPokemon, setTheyPokemon] = useState<Pokemon[] | null>(null)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    useEffect(() => {
        const getData = async () => {
            try {
                const getFriendTeam = await retrieveData(`/trainer/${friendId}`)
                const getTeam = await retrieveData("/trainer")
                setfriendTeam(getFriendTeam.trainer.pokemon_team)
                setTeam(getTeam.trainer.pokemon_team)
            } catch (ex) {

            }

        }
        getData();
    }, [])


    useEffect(() => {
        const getData = async () => {
            try {
                const getFriendTeam = await retrieveData("/pokemon/get", { pokemon_list: friendTeam })
                const pokemonsFriend = getFriendTeam.map((pokemon: any) => new Pokemon(pokemon));
                setTheyPokemon(pokemonsFriend)
                const getTeam = await retrieveData("/pokemon/get", { pokemon_list: team })
                const pokemons = getTeam.map((pokemon: any) => new Pokemon(pokemon));
                setOwnPokemon(pokemons)

            } catch (ex) {
                console.log(ex)
            }
        }
        if (team && friendTeam) {
            getData();
        }


    }, [team, friendTeam])

    if (!ownPokemon || !theyPokemon) {
        return (
            <div className="flex justify-center items-center h-screen br">
                <Vortex
                    visible={true}
                    height="80"
                    width="80"
                    ariaLabel="vortex-loading"
                    wrapperStyle={{}}
                    wrapperClass="vortex-wrapper"
                    colors={['red', 'red', 'black', 'black', 'gray', 'gray']}
                />
            </div>
        )
    }

    return (
        <div className="bg-bgTradeScreen bg-cover min-h-screen flex flex-col p-6 text-white">
            {/* Friends Button (top-left) */}
            <div className="absolute top-0 left-2 mt-6 m-2">
                <button
                    type="button"
                    onClick={() => navigate("/FriendScreen")}
                    className={`${PrimaryButtonStyle} h-fit !bg-black`}
                >
                    Friends
                </button>
            </div>

            {/* Trade Section */}
            <div className="flex flex-col items-center justify-center space-y-10">
                {/* Trade Options */}
                <div className="flex items-center space-x-8">
                    {/* Pokemon to Trade */}
                    <div className=" bg-black flex flex-col items-center p-4 rounded-lg w-64">
                        <h2 className="text-xl font-bold mb-4">Pokemon to Trade</h2>
                        <select className="w-full p-2 text-black rounded-md">
                            {ownPokemon.map((pokemon) => (
                                <option key={pokemon.pokedex_number} value={pokemon.name}>
                                    {pokemon.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="text-4xl font-bold">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/32/32161.png"
                            alt="icon"
                            className="w-28 h-28 inline-block"
                        />
                    </div>

                    {/* Pokemon to Receive */}
                    <div className="bg-black flex flex-col items-center p-4 rounded-lg w-64">
                        <h2 className="text-xl font-bold mb-4">Pokemon to Receive</h2>
                        <select className="w-full p-2 text-black rounded-md">
                            {theyPokemon.map((pokemon) => (
                                <option key={pokemon.pokedex_number} value={pokemon.name}>
                                    {pokemon.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                {/* Make Trade Button */}
                <button
                    type="button"
                    onClick={() => navigate("/FriendScreen")}
                    className={`${PrimaryButtonStyle} h-fit !bg-black`}
                >
                    Make Trade
                </button>
            </div>


            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full bg-gray-800 text-white shadow-lg transform transition-transform ${isSidebarOpen ? "translate-x-0" : "translate-x-full"} w-64`}
            >
                <button
                    className="absolute top-4 right-4 bg-red-600 hover:bg-red-800 text-white rounded-full w-8 h-8 flex items-center justify-center"
                    onClick={toggleSidebar}
                    aria-label="Cerrar menú lateral"
                >
                    &times;
                </button>

                <div className="p-4 text-xl font-bold border-b border-gray-700">
                    Requests
                </div>

                <nav className="p-4">
                    <ul>
                        Request
                    </ul>
                </nav>
            </div>
        </div >
    );
};

export default TradesScreen;