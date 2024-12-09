import React, { useEffect, useState } from "react";
import { PrimaryButtonStyle } from "../LoginScreen/classnameStyles";
import { putData, retrieveData } from "@/funcs/api";
import { Trainer } from "@/types/Trainer";

interface FriendRowRequestProps {
    friend_id: string;
    index: number;
}

const FriendRowRequest: React.FC<FriendRowRequestProps> = ({ friend_id, index }) => {
    const [friend, setFriend] = useState<Trainer | undefined>();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

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

    const handleAccept = async () => {
        try {
            const response = await putData(`/trainer/accept_friend_request`, { index: index });
            console.log(response);
            setSuccess(response.success);
        } catch (e) {
            console.error("Error accepting friend request:", e);
            setError("No se pudo aceptar la solicitud de amistad.");
        }
    }

    return (
        !success ? <div className="flex-col w-full bg-slate-800 p-2 items-center justify-between rounded-lg shadow-md">
            <div className="flex items-center space-x-3">
                <img
                    src="https://i.redd.it/c8z5m7o3osk81.jpg"
                    alt={friend?.name || "Entrenador"}
                    className="w-10 h-10 object-cover rounded-full mb-2"
                />
                <span className="text-sm font-medium text-white">
                    {friend?.name || "Cargando..."}
                </span>
            </div>
            {error ? (
                <span className="text-red-500 text-xs">{error}</span>
            ) : (
                <div className="flex space-x-2">
                    <button
                        onClick={handleAccept}
                        className={`${PrimaryButtonStyle} bg-white !text-black px-3 py-1 text-sm`}>
                        Accept
                    </button>
                    <button className={`${PrimaryButtonStyle} bg-red-600 hover:bg-red-700 px-3 py-1 text-sm`}>
                        x
                    </button>
                </div>
            )}
        </div> : null
    );
};

export default FriendRowRequest;
