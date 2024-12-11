import React, { useEffect, useState } from "react";
import { PrimaryButtonStyle } from "../LoginScreen/classnameStyles";
import { putData, retrieveData } from "@/funcs/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Pokemon } from "@/types/Pokemon";

interface TradeRequestRowProps {
  req_id: string;
  pokemon_traded: number;
  pokemon_received: number;
}

const TradeRequestRow: React.FC<TradeRequestRowProps> = ({
  req_id,
  pokemon_traded,
  pokemon_received,
}) => {
  const [error, setError] = useState<string | null>(null);

  const [myPokemon, setMyPokemon] = useState<Pokemon | null>();
  const [otherPokemon, setOtherPokemon] = useState<Pokemon | null>(null);

  useEffect(() => {
    const getPokemon = async () => {
      try {
        const response = await retrieveData(`/pokemon/${pokemon_traded}`);
        const response2 = await retrieveData(`/pokemon/${pokemon_received}`);
        setMyPokemon(new Pokemon(response));
        setOtherPokemon(new Pokemon(response2));
      } catch (e) {
        setError("Error fetching Pokemon");
        console.error(e);
      }
    };
    getPokemon();
  }, [pokemon_received, pokemon_traded]);

  // Handle accept trade request
  const handleAccept = async () => {
    try {
      const response = await putData("/trades/confirm", { trade_id: req_id });
      console.log(response);
    } catch (e) {
      console.error("Error accepting trade request:", e);
      setError("No se pudo aceptar la solicitud de intercambio.");
    }
  };

  const handleDeny = async () => {
    try {
      const response = await putData("/trades/deny", { trade_id: req_id });
      console.log(response);
      if (response.success) {
        toast.success("You've denied a Trade Request.");
      } else {
        toast.error("Failed to deny the Trade Request.");
      }
    } catch (e) {
      console.error("Error denying trade request:", e);
      setError("No se pudo rechazar la solicitud de intercambio.");
      toast.error("An error occurred while denying the Trade Request.");
    }
  };

  return (
    <div className="flex flex-col w-full bg-slate-800 p-4 items-center justify-between rounded-lg shadow-md">
      {/* Display traded Pokémon */}
      <div className="flex items-center space-x-3 mb-2">
        <img
          src={myPokemon?.image}
          alt={myPokemon?.name}
          className="w-12 h-12 object-cover rounded-full"
        />
        <span className="text-xs text-gray-400">{"<-"} </span>
        <span className="text-sm font-medium text-white">
          {myPokemon?.name || "Cargando..."}
        </span>
      </div>

      {/* Display received Pokémon */}
      <div className="flex items-center space-x-3 mb-4">
        <img
          src={otherPokemon?.image}
          alt={otherPokemon?.name}
          className="w-12 h-12 object-cover rounded-full"
        />
        <span className="text-xs text-gray-400">{"->"} </span>
        <span className="text-sm font-medium text-white">
          {otherPokemon?.name || "Cargando..."}
        </span>
      </div>

      {/* Error message */}
      {error && <span className="text-red-500 text-xs mb-2">{error}</span>}

      {/* Action buttons */}
      <div className="flex space-x-3">
        <button
          onClick={handleAccept}
          className={`${PrimaryButtonStyle} bg-white !text-black px-4 py-2 text-sm`}
        >
          Accept
        </button>
        <button
          onClick={handleDeny}
          className={`${PrimaryButtonStyle} !bg-black hover:!bg-red-700 px-4 py-2 text-sm`}
        >
          Deny
        </button>
      </div>

      {/* Toast notifications */}
      <ToastContainer position="top-center" draggable theme="colored" />
    </div>
  );
};

export default TradeRequestRow;
