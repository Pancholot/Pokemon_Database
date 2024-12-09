import React, { useEffect, useState } from "react";
import { PrimaryButtonStyle } from "../LoginScreen/classnameStyles";
import { retrieveData } from "@/funcs/api";
import { Trainer } from "@/types/Trainer";
import { useNavigate } from "react-router";

interface FriendRowProps {
    friend_id: string;
}

const FriendRow: React.FC<FriendRowProps> = ({ friend_id }) => {
    const [friend, setFriend] = useState<Trainer | undefined>();
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate()

    useEffect(() => {
        const getFriend = async () => {
            try {
                const { trainer } = await retrieveData(`/trainer/${friend_id}`);
                setFriend(trainer);
                setError(null);
            } catch (e) {
                console.error("Error fetching friend data:", e);
                setError("No se pudo cargar la información del amigo.");
            }
        };
        getFriend();
    }, [friend_id]);

    return (
        <div className="shadow-lg flex md:w-[60%] bg-slate-800 h-24 justify-between items-center px-12 rounded-lg">
            <div className="flex items-center space-x-4">
                <img
                    src="https://i.redd.it/c8z5m7o3osk81.jpg"
                    alt={friend?.name || "Entrenador"}
                    className="w-12 h-12 object-cover rounded-full"
                />
                <span className="text-lg font-medium text-white">
                    {friend?.name || "Cargando..."}
                </span>
            </div>
            {error ? (
                <span className="text-red-500 text-sm">{error}</span>
            ) : (
                <button className={`${PrimaryButtonStyle} h-fit bg-white !text-black`}
                    onClick={() => {
                        navigate(`/tradescreen?friend_id=${friend_id}`)
                    }}
                >
                    Trade
                </button>
            )}
        </div>
    );
};

export default FriendRow;
