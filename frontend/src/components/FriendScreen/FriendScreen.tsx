/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { putData, retrieveData } from "@/funcs/api";

const PrimaryButtonStyle =
  "self-end px-6 py-2 bg-slate-800 hover:bg-red-600 focus:bg-red-400 cursor-pointer rounded-md text-white mt-4 transition-colors";

const Friends = () => {
  const navigate = useNavigate();

  const [friendsIds, setFriendsIds] = useState<Array<string>>([]);
  const [id, setId] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const getData = async () => {
      try {
        const { _id, name, friends } = await retrieveData("/trainer");
        setId(_id);
        setUsername(name);
        setFriendsIds(friends);
      } catch (error) {
        console.error(error);
        navigate("/login");
      }
    };
    getData();
  }, [navigate]);

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col items-center justify-center p-4">
      <h2 className="text-center text-xl font-bold mb-4">
        Quieres nuevos amigos {username} ?
      </h2>

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

export default Friends;
