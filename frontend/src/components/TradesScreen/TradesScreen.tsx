import { useEffect, useState } from "react";
import { PrimaryButtonStyle } from "../LoginScreen/classnameStyles";
import { useNavigate, useSearchParams } from "react-router";
import { postData, retrieveData } from "@/funcs/api";
import { Vortex } from "react-loader-spinner";
import { Pokemon } from "@/types/Pokemon";
import TradeRequestRow from "./TradeRequestRow";
import { TradeRequest } from "@/types/TradeRequest";
import { useSocket } from "@/context/SocketContext";

const TradesScreen = () => {
  const [searchParams] = useSearchParams();
  const friendId = searchParams.get("friend_id");
  const navigate = useNavigate();
  const socket = useSocket();

  const [friendTeam, setFriendTeam] = useState<number[] | null>(null);
  const [team, setTeam] = useState<number[] | null>(null);
  const [ownPokemon, setOwnPokemon] = useState<Pokemon[] | null>(null);
  const [theirPokemon, setTheirPokemon] = useState<Pokemon[] | null>(null);
  const [myPokemon, setMyPokemon] = useState<Pokemon | null>(null);
  const [otherPokemon, setOtherPokemon] = useState<Pokemon | null>(null);
  const [requests, setRequests] = useState<TradeRequest[]>([]);
  const [isSidebarTradesOpen, setIsSidebarTradesOpen] = useState(false);
  const [trainer_id, setTrainer_id] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const getFriendTeam = await retrieveData(`/trainer/${friendId}`);
        const getTeam = await retrieveData("/trainer");
        setFriendTeam(getFriendTeam.trainer.pokemon_team);
        setTeam(getTeam.trainer.pokemon_team);
        setTrainer_id(getTeam.trainer._id);
      } catch (ex) {
        console.error("Error fetching teams:", ex);
      }
    };
    getData();
  }, [friendId]);

  useEffect(() => {
    const getReal = async () => {
      try {
        const getFriendTeam = await retrieveData("/pokemon/get", {
          pokemon_list: friendTeam,
        });
        const pokemonsFriend = getFriendTeam.map(
          (pokemon: unknown) => new Pokemon(pokemon)
        );
        setTheirPokemon(pokemonsFriend);

        const getTeam = await retrieveData("/pokemon/get", {
          pokemon_list: team,
        });
        const pokemons = getTeam.map(
          (pokemon: unknown) => new Pokemon(pokemon)
        );
        setOwnPokemon(pokemons);
      } catch (ex) {
        console.error("Error fetching Pokemon details:", ex);
      }
    };

    if (team && friendTeam) {
      getReal();
    }
  }, [team, friendTeam]);

  useEffect(() => {
    const getData = async () => {
      try {
        const { trades } = await retrieveData(`/trades/${friendId}`);
        setRequests(trades);
      } catch (error) {
        console.error("Error fetching trades:", error);
      }
    };
    getData();
  }, [friendId]);

  useEffect(() => {
    if (!socket || !trainer_id) return;

    const handleTradeRequest = (data: {
      _id: string;
      request: TradeRequest;
    }) => {
      if (data._id === trainer_id) {
        setRequests((prevState) => [...prevState, data.request]);
      }
    };

    const handleTradeDenied = (data: { _id: string }) => {
      const requestsUpdated = requests.filter((r) => r._id !== data._id);
      setRequests(requestsUpdated);
    };

    socket.on("trade_request", handleTradeRequest);
    socket.on("trade_request_denied", handleTradeDenied);

    return () => {
      socket.off("trade_request", handleTradeRequest);
      socket.off("trade_request_denied", handleTradeDenied);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, trainer_id]);

  if (!ownPokemon || !theirPokemon) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Vortex
          visible={true}
          height="80"
          width="80"
          ariaLabel="vortex-loading"
          wrapperStyle={{}}
          wrapperClass="vortex-wrapper"
          colors={["red", "red", "black", "black", "gray", "gray"]}
        />
      </div>
    );
  }

  const handleSelectMyPokemon = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const state = event.target.value;
    const pk = ownPokemon.find((pokemon) => pokemon.name === state);
    setMyPokemon(pk || null);
  };

  const handleSelectOtherPokemon = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const state = event.target.value;
    const pk = theirPokemon.find((pokemon) => pokemon.name === state);
    setOtherPokemon(pk || null);
  };

  const toggleSidebarTrade = () => setIsSidebarTradesOpen(!isSidebarTradesOpen);

  const handleTrade = async () => {
    if (!myPokemon || !otherPokemon) {
      alert("Please select Pokémon for both trade and receive");
      return;
    }

    try {
      setIsLoading(true);

      const response = await postData("/trades/make", {
        friend_id: friendId,
        pkm_traded: myPokemon.pokedex_number,
        pkm_received: otherPokemon.pokedex_number,
      });

      if (response.success) {
        alert("Trade successful requested!");

        setMyPokemon(null);
        setOtherPokemon(null);
      } else {
        alert(response.message || "Trade failed. Please try again.");
      }
    } catch (error) {
      console.error("Trade error:", error);
      alert("An error occurred while processing the trade.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-bgTradeScreen bg-cover min-h-screen">
      {/* Trade Requests Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full bg-gray-800 text-white shadow-lg transform transition-transform ${
          isSidebarTradesOpen ? "translate-x-0" : "translate-x-full"
        } w-64 z-50`}
        style={{ top: 0 }}
      >
        <button
          className="absolute top-4 right-4 bg-red-600 hover:bg-red-800 text-white rounded-full w-8 h-8 flex items-center justify-center"
          onClick={toggleSidebarTrade}
          aria-label="Close sidebar"
        >
          &times;
        </button>

        <div className="p-4 text-xl font-bold border-b border-gray-700">
          Trade Requests
        </div>

        <nav className="p-4">
          <ul>
            {requests.map((req, key) => (
              <TradeRequestRow
                key={key}
                req_id={req._id}
                pokemon_traded={req.pkm_traded}
                pokemon_received={req.pkm_received}
              />
            ))}
          </ul>
        </nav>
      </div>

      {/* Navigation Buttons */}
      <button
        type="button"
        onClick={() => navigate("/FriendScreen")}
        className={`${PrimaryButtonStyle} absolute h-fit mt-10 m-4`}
      >
        Friends
      </button>

      <div className="flex flex-col text-white p-3 rounded-lg text-center absolute top-0 right-0 m-6 mb-2">
        <button onClick={toggleSidebarTrade} className={PrimaryButtonStyle}>
          {requests.length > 0 && (
            <Vortex
              visible={true}
              height="20"
              width="20"
              ariaLabel="vortex-loading"
              wrapperStyle={{}}
              wrapperClass="vortex-wrapper"
              colors={["red", "red", "black", "black", "gray", "gray"]}
            />
          )}
          Trade Requests
        </button>
      </div>

      {/* Trade Section */}
      <div className="text-white min-h-screen flex flex-col">
        <div className="flex flex-col items-center h-screen justify-center space-y-10">
          {/* Trade Options */}
          <div className="flex items-center space-x-8">
            {/* Pokemon to Trade */}
            <div>
              <div className="bg-black flex flex-col items-center p-4 rounded-lg w-64">
                <h2 className="text-xl font-bold mb-4">Pokemon to Trade</h2>
                <select
                  value={myPokemon?.name || ""}
                  className="w-full p-2 text-black rounded-md"
                  onChange={handleSelectMyPokemon}
                >
                  <option value="" disabled>
                    Select a Pokémon
                  </option>
                  {ownPokemon.map((pokemon) => (
                    <option key={pokemon.pokedex_number} value={pokemon.name}>
                      {pokemon.name}
                    </option>
                  ))}
                </select>
                {myPokemon && (
                  <img
                    src={myPokemon.image}
                    alt={myPokemon.name}
                    className="mt-4 max-h-48"
                  />
                )}
              </div>
            </div>

            {/* Trade Arrow */}
            <div className="text-4xl font-bold">
              <img
                src="https://cdn-icons-png.flaticon.com/512/32/32161.png"
                alt="Trade icon"
                className="w-28 h-28 inline-block"
              />
            </div>

            {/* Pokemon to Receive */}
            <div className="bg-black flex flex-col items-center p-4 rounded-lg w-64">
              <h2 className="text-xl font-bold mb-4">Pokemon to Receive</h2>
              <select
                value={otherPokemon?.name || ""}
                className="w-full p-2 text-black rounded-md"
                onChange={handleSelectOtherPokemon}
              >
                <option value="" disabled>
                  Select a Pokémon
                </option>
                {theirPokemon.map((pokemon) => (
                  <option key={pokemon.pokedex_number} value={pokemon.name}>
                    {pokemon.name}
                  </option>
                ))}
              </select>
              {otherPokemon && (
                <img
                  src={otherPokemon.image}
                  alt={otherPokemon.name}
                  className="mt-4 max-h-48"
                />
              )}
            </div>
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-center items-center">
              <Vortex
                visible={true}
                height="40"
                width="40"
                ariaLabel="vortex-loading"
                wrapperStyle={{}}
                wrapperClass="vortex-wrapper"
                colors={["red", "red", "black", "black", "gray", "gray"]}
              />
            </div>
          )}

          {/* Make Trade Button */}
          <button
            type="button"
            onClick={handleTrade}
            className={`${PrimaryButtonStyle} h-fit !bg-black`}
            disabled={!myPokemon || !otherPokemon || isLoading}
          >
            Make Trade
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradesScreen;
