import React, { useEffect, useState } from "react";
import { PrimaryButtonStyle } from "../LoginScreen/classnameStyles";
import { retrieveData } from "@/funcs/api";
import { Trainer } from "@/types/Trainer";
import { useNavigate } from "react-router";
import { Vortex } from "react-loader-spinner";

interface FriendRowProps {
    friend_id: string;
    hasPendingTrade: boolean
}

const FriendRow: React.FC<FriendRowProps> = ({ friend_id, hasPendingTrade }) => {
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

    function copyToClipboard() {
        const textToCopy = friend?._id || "Cargando..."
        navigator.clipboard
            .writeText(textToCopy)
            .then(() => {
                alert("Texto copiado al portapapeles")
            })
            .catch((err) => {
                console.error("Error al copiar el texto: ", err);
            });
    };
    return (
        <div className="shadow-lg flex md:w-[60%] bg-slate-800 h-24 justify-between items-center px-12 rounded-lg">
            <div className="flex items-center space-x-4">
                <img
                    src="https://i.redd.it/c8z5m7o3osk81.jpg"
                    alt={friend?.name || "Entrenador"}
                    className="w-12 h-12 object-cover rounded-full"
                />
                <div className="flex flex-col text-lg font-medium text-white">
                    <span>{friend?.name || "Cargando..."}</span>
                    <span className="text-sm font-normal text-gray-300 flex items-center gap-2">
                        ID: {friend?._id || "Cargando..."}
                        <button
                            onClick={() => copyToClipboard()}
                            className="text-white bg-slate-50 hover:bg-red-600 font-bold flex justify-center items-center p-1 rounded-lg shadow-xl hover:shadow-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 max-w-24"
                        >
                            <img
                                src="https://img.icons8.com/material-outlined/24/copy.png"
                                className="h-3 w-3"
                                alt="Copiar"
                            />
                        </button>
                    </span>
                </div>

            </div>

            {error ? (
                <span className="text-red-500 text-sm">{error}</span>
            ) : (

                <button className={`${PrimaryButtonStyle} h-fit bg-white !text-black`}
                    onClick={() => {
                        navigate(`/tradescreen?friend_id=${friend_id}`)
                    }}
                >
                    {hasPendingTrade && <Vortex
                        visible={true}
                        height="30"
                        width="30"
                        ariaLabel="vortex-loading"
                        wrapperStyle={{}}
                        wrapperClass="vortex-wrapper"
                        colors={['red', 'red', 'black', 'black', 'gray', 'gray']}
                    />}
                    Trade
                </button>
            )}
        </div>
    );
};

export default FriendRow;
